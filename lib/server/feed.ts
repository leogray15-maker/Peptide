// ─── LeoOS feed payload ───────────────────────────────────────────────────
// Shapes the storefront's Firestore data into the JSON the AI OS pulls from
// /api/leoos-feed. Kept pure (plain objects in, plain object out) so it can be
// reasoned about and tested without Firestore.

import { uniqueProducts } from "@/data/products";
import { ORDER_STATUSES, ORDER_STATUS_META, type OrderStatus } from "@/lib/orders";
import type { Deal } from "@/lib/deals";
import { dealHeadline } from "@/lib/deals";

// Statuses that still need someone to do something.
const OPEN_STATUSES: OrderStatus[] = ["pending_payment", "paid", "processing", "shipped"];

export interface FeedOrder {
  orderId: string;
  status: OrderStatus;
  totalGBP: number;
  itemCount: number;
  customerName: string;
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
  const monthOrders = billable.filter((o) => o.createdAt && o.createdAt >= monthStart);
  const last30 = billable.filter((o) => o.createdAt && o.createdAt >= thirtyDaysAgo);

  // Catalogue snapshot — the OS mirrors stock and COA state per line.
  const lines = uniqueProducts.map((p) => {
    const priced = p.variants.filter((v) => v.priceGBP !== null);
    const inStock = p.variants.filter((v) => v.inStock).length;
    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      variants: p.variants.length,
      variantsInStock: inStock,
      inStock: inStock > 0,
      coa: p.coaAvailable ? ("published" as const) : ("pending" as const),
      fromGBP: priced.length
        ? Math.min(...priced.map((v) => v.priceGBP as number))
        : null,
    };
  });

  const withCoa = lines.filter((l) => l.coa === "published").length;
  const outOfStock = lines.filter((l) => !l.inStock);

  return {
    source: "arcane-peptides",
    version: 1 as const,
    generatedAt: now.toISOString(),

    orders: {
      total: orders.length,
      open: open.length,
      pendingPayment: byStatus.pending_payment,
      completed: byStatus.completed,
      cancelled: byStatus.cancelled,
      byStatus,
      statusLabels: Object.fromEntries(
        ORDER_STATUSES.map((s) => [s, ORDER_STATUS_META[s].label])
      ) as Record<OrderStatus, string>,
      recent: orders
        .slice()
        .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
        .slice(0, 10)
        .map((o) => ({
          orderId: o.orderId,
          status: o.status,
          totalGBP: o.totalGBP,
          itemCount: o.itemCount,
          customerName: o.customerName,
          createdAt: o.createdAt ? o.createdAt.toISOString() : null,
        })),
    },

    revenue: {
      currency: "GBP" as const,
      allTimeGBP: sum(billable),
      monthToDateGBP: sum(monthOrders),
      last30DaysGBP: sum(last30),
      openOrderValueGBP: sum(open),
      averageOrderGBP: billable.length ? round2(sum(billable) / billable.length) : 0,
    },

    customers: {
      total: users.length,
      newThisMonth: users.filter((u) => u.createdAt && u.createdAt >= monthStart).length,
      ordered: new Set(orders.map((o) => o.customerName).filter(Boolean)).size,
    },

    catalogue: {
      products: lines.length,
      variants: lines.reduce((t, l) => t + l.variants, 0),
      outOfStock: outOfStock.length,
      outOfStockSlugs: outOfStock.map((l) => l.slug),
      coaPublished: withCoa,
      coaCoverage: lines.length ? round2(withCoa / lines.length) : 0,
      lines,
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
  };
}

export type Feed = ReturnType<typeof buildFeed>;
