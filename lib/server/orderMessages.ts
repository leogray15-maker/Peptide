// ─── What the bot says about an order ─────────────────────────────────────
// Pure formatting — no Firestore, no network — so the wording can be tested.

import { ORDER_STATUS_META, type OrderStatus } from "@/lib/orders";

export interface BotOrderItem {
  name: string;
  variantLabel: string;
  qty: number;
}

export interface BotOrder {
  orderId: string;
  status: OrderStatus;
  totalGBP: number;
  items: BotOrderItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  promoCode: string | null;
  gifts: string[];
  createdAt: Date | null;
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

export function statusLabel(status: OrderStatus): string {
  return ORDER_STATUS_META[status]?.label ?? status;
}

export function payLabel(method: string): string {
  return method.replace(/_/g, " ");
}

/** "3 days ago", "20 minutes ago" — how long an order has been sitting. */
export function ageOf(date: Date | null, now: Date): string {
  if (!date) return "unknown age";
  const mins = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function itemLines(order: BotOrder): string {
  if (!order.items.length) return "  (no items recorded)";
  return order.items
    .map((i) => `  • ${i.qty} × ${esc(i.name)} ${esc(i.variantLabel)}`.trimEnd())
    .join("\n");
}

/** The message that lands when someone checks out. */
export function newOrderMessage(order: BotOrder): string {
  const gifts = order.gifts.length
    ? `\n🎁 Include free: ${order.gifts.map(esc).join(", ")}`
    : "";
  const promo = order.promoCode ? `\n🏷 Code: ${esc(order.promoCode)}` : "";
  return [
    `🧪 <b>New order — ${gbp(order.totalGBP)}</b>`,
    `<code>${esc(order.orderId)}</code>`,
    "",
    itemLines(order),
    `${gifts}${promo}`,
    `👤 ${esc(order.customerName)}`,
    `💳 ${esc(payLabel(order.paymentMethod))} — awaiting payment`,
    "",
    `<code>/order ${esc(order.orderId)}</code> for the address`,
  ]
    .filter((line) => line !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** Everything needed to pack and post the parcel. */
export function orderDetailMessage(order: BotOrder, now: Date): string {
  const lines = [
    `<b>${esc(order.orderId)}</b> — ${gbp(order.totalGBP)}`,
    `${esc(statusLabel(order.status))} · placed ${esc(ageOf(order.createdAt, now))}`,
    "",
    itemLines(order),
  ];
  if (order.gifts.length) lines.push(`🎁 ${order.gifts.map(esc).join(", ")}`);
  lines.push(
    "",
    `👤 ${esc(order.customerName)}`,
    `✉️ ${esc(order.customerEmail)}`,
    `📮 ${esc(order.shippingAddress)}`,
    `💳 ${esc(payLabel(order.paymentMethod))}`
  );
  if (order.promoCode) lines.push(`🏷 ${esc(order.promoCode)}`);
  lines.push(
    "",
    `<code>/paid ${esc(order.orderId)}</code>`,
    `<code>/shipped ${esc(order.orderId)} TRACKING</code>`
  );
  return lines.join("\n");
}

/** One line per order in a queue listing. */
export function queueLine(order: BotOrder, now: Date): string {
  return `<code>${esc(order.orderId)}</code> · ${gbp(order.totalGBP)} · ${esc(
    statusLabel(order.status)
  )} · ${esc(ageOf(order.createdAt, now))}`;
}

export const HELP = [
  "<b>Arcane Peptides</b>",
  "",
  "/status — money, orders, shelf",
  "/orders — everything still open",
  "/order REF — the full order and its address",
  "",
  "/paid REF — payment landed",
  "/processing REF — being packed",
  "/shipped REF TRACKING — out the door",
  "/completed REF · /cancel REF",
  "",
  "/stock — COA cover and anything out of stock",
  "/deals — what is running right now",
].join("\n");
