// ─── LeoOS feed payload ───────────────────────────────────────────────────
// Shapes the storefront's Firestore data into the JSON the AI OS pulls from
// /api/leoos-feed. The top level is the contract LEOOS's bridge reads
// (src/core/bridge.js in the leoos repo): currency, revenue, orderCount,
// pending, customers, stock[] and orders[]. Richer aggregates hang off
// `detail`, which LEOOS ignores.
//
// Kept pure (plain objects in, plain object out) so it can be reasoned about
// and tested without Firestore.

import { uniqueProducts, POPULAR_SLUGS } from "@/data/products";
import { ORDER_STATUSES, ORDER_STATUS_META, type OrderStatus } from "@/lib/orders";
import { dealHeadline, type Deal } from "@/lib/deals";

// Statuses that still need someone to do something.
const OPEN_STATUSES: OrderStatus[] = ["pending_payment", "paid", "processing", "shipped"];
// …and the subset that hasn't been packed yet. LEOOS shows this as
// "N orders waiting to be packed".
const UNPACKED_STATUSES: OrderStatus[] = ["pending_payment", "paid", "processing"];

export interface FeedOrderItem {
  name: string;
  variantLabel: string;
  qty: number;
}

export interface FeedOrder {
  orderId: string;
  status: OrderStatus;
  totalGBP: number;
  items: FeedOrderItem[];
  /** Used for the unique-buyer count only; never published in the payload. */
  customerKey: string;
  createdAt: Date | null;
}

export interface FeedUser {
  uid: string;
  createdAt: Date | null;
}

export interface FeedInput {
  orders: FeedOrder[];
  users: FeedUser[];
  deals: Deal[];
  now: Date;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function startOfMonth(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function itemCount(o: FeedOrder): number {
  return o.items.reduce((t, i) => t + i.qty, 0);
}

// "2× GHK-Cu 50 mg, 1× BPC-157 10 mg" — what's in the box, no customer.
function itemSummary(o: FeedOrder): string {
  return o.items.map((i) => `${i.qty}× ${i.name} ${i.variantLabel}`.trim()).join(", ");
}

export function buildFeed(input: FeedInput) {
  const { orders, users, deals, now } = input;

  const monthStart = startOfMonth(now);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Cancelled orders never count towards money.
  const billable = orders.filter((o) => o.status !== "cancelled");
  const sum = (list: FeedOrder[]) => round2(list.reduce((t, o) => t + o.totalGBP, 0));

  const byStatus = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length])
  ) as Record<OrderStatus, number>;

  const open = orders.filter((o) => OPEN_STATUSES.includes(o.status));
  const unpacked = orders.filter((o) => UNPACKED_STATUSES.includes(o.status));
  const monthOrders = billable.filter((o) => o.createdAt && o.createdAt >= monthStart);
  const last30 = billable.filter((o) => o.createdAt && o.createdAt >= thirtyDaysAgo);

  const newest = orders
    .slice()
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

  // ── The shelf ──
  // Every product that has actually been ordered, plus the curated
  // best-sellers. Sending the whole 60-line catalogue would open a stock line
  // in THE LAB for every compound on a first pull; this keeps it to what
  // moves. To send everything instead, drop the `stocked` filter below.
  const orderedNames = new Set(
    orders.flatMap((o) => o.items.map((i) => i.name.toLowerCase()))
  );
  const stocked = uniqueProducts.filter(
    (p) => orderedNames.has(p.name.toLowerCase()) || POPULAR_SLUGS.includes(p.slug)
  );

  const stock = stocked.map((p) => {
    const live = p.variants.filter((v) => v.inStock);
    const priced = p.variants.filter((v) => v.priceGBP !== null);
    return {
      code: p.name,
      size: (live[0] ?? p.variants[0])?.size ?? "",
      // The shop does not count vials — that's done by hand in THE LAB, so we
      // send no number rather than a zero that would wipe the hand count.
      vials: null,
      batch: "",
      coa: p.coaAvailable ? ("published" as const) : ("pending" as const),
      inStock: live.length > 0,
      fromGBP: priced.length ? Math.min(...priced.map((v) => v.priceGBP as number)) : null,
    };
  });

  const allLines = uniqueProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    variants: p.variants.length,
    variantsInStock: p.variants.filter((v) => v.inStock).length,
    coa: p.coaAvailable ? ("published" as const) : ("pending" as const),
  }));
  const withCoa = allLines.filter((l) => l.coa === "published").length;
  const outOfStock = allLines.filter((l) => l.variantsInStock === 0);

  return {
    // ── The contract LEOOS reads ──
    currency: "GBP" as const,
    revenue: sum(billable),
    orderCount: billable.length,
    pending: unpacked.length,
    customers: users.length,
    stock,
    orders: newest.slice(0, 40).map((o) => ({
      ref: o.orderId,
      items: itemSummary(o),
      stage: o.status,
      total: o.totalGBP,
    })),

    // ── Everything else, for whatever the OS wants next ──
    source: "arcane-peptides",
    version: 2 as const,
    generatedAt: now.toISOString(),
    detail: {
      orders: {
        total: orders.length,
        open: open.length,
        unpacked: unpacked.length,
        byStatus,
        statusLabels: Object.fromEntries(
          ORDER_STATUSES.map((s) => [s, ORDER_STATUS_META[s].label])
        ) as Record<OrderStatus, string>,
        recent: newest.slice(0, 10).map((o) => ({
          ref: o.orderId,
          stage: o.status,
          total: o.totalGBP,
          itemCount: itemCount(o),
          createdAt: o.createdAt ? o.createdAt.toISOString() : null,
        })),
      },
      revenue: {
        allTimeGBP: sum(billable),
        monthToDateGBP: sum(monthOrders),
        last30DaysGBP: sum(last30),
        openOrderValueGBP: sum(open),
        averageOrderGBP: billable.length ? round2(sum(billable) / billable.length) : 0,
      },
      customers: {
        total: users.length,
        newThisMonth: users.filter((u) => u.createdAt && u.createdAt >= monthStart).length,
        ordered: new Set(orders.map((o) => o.customerKey).filter(Boolean)).size,
      },
      catalogue: {
        products: allLines.length,
        variants: allLines.reduce((t, l) => t + l.variants, 0),
        outOfStock: outOfStock.length,
        outOfStockSlugs: outOfStock.map((l) => l.slug),
        coaPublished: withCoa,
        coaCoverage: allLines.length ? round2(withCoa / allLines.length) : 0,
        lines: allLines,
      },
      deals: {
        live: deals
          .filter((d) => d.enabled)
          .map((d) => ({
            id: d.id,
            label: dealHeadline(d),
            type: d.type,
            code: d.code || null,
            minSpendGBP: d.minSpendGBP,
          })),
      },
    },
  };
}

export type Feed = ReturnType<typeof buildFeed>;
