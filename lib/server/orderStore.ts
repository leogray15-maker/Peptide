// ─── Reading and moving orders, server-side ───────────────────────────────
// The bot has no signed-in admin, so it goes through the Admin SDK. Shared by
// the notifier, the webhook and the daily sweep.

import "server-only";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import type { BotOrder } from "@/lib/server/orderMessages";

function tsToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function mapOrder(id: string, d: Record<string, unknown>): BotOrder {
  const rawItems = Array.isArray(d.items)
    ? (d.items as { name?: string; variantLabel?: string; qty?: number }[])
    : [];
  return {
    orderId: (d.orderId as string) ?? id,
    status: (d.status as OrderStatus) ?? "pending_payment",
    totalGBP: typeof d.totalGBP === "number" ? d.totalGBP : 0,
    items: rawItems.map((i) => ({
      name: typeof i.name === "string" ? i.name : "",
      variantLabel: typeof i.variantLabel === "string" ? i.variantLabel : "",
      qty: typeof i.qty === "number" ? i.qty : 0,
    })),
    customerName: (d.customerName as string) ?? "",
    customerEmail: (d.customerEmail as string) ?? "",
    shippingAddress: (d.shippingAddress as string) ?? "",
    paymentMethod: (d.paymentMethod as string) ?? "",
    promoCode: (d.promoCode as string | null) ?? null,
    gifts: Array.isArray(d.gifts) ? (d.gifts as string[]) : [],
    createdAt: tsToDate(d.createdAt),
  };
}

export async function getOrder(orderId: string): Promise<BotOrder | null> {
  const snap = await adminDb().collection("orders").doc(orderId).get();
  return snap.exists ? mapOrder(snap.id, snap.data() as Record<string, unknown>) : null;
}

/** Case-insensitive lookup, because a phone will capitalise a reference. */
export async function findOrder(ref: string): Promise<BotOrder | null> {
  const trimmed = ref.trim();
  if (!trimmed) return null;
  const direct = await getOrder(trimmed);
  if (direct) return direct;
  const upper = trimmed.toUpperCase();
  return upper === trimmed ? null : getOrder(upper);
}

export async function allOrders(): Promise<BotOrder[]> {
  const snap = await adminDb().collection("orders").get();
  return snap.docs
    .map((doc) => mapOrder(doc.id, doc.data() as Record<string, unknown>))
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export function isOpen(order: BotOrder): boolean {
  return order.status !== "completed" && order.status !== "cancelled";
}

export async function setStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<void> {
  if (!ORDER_STATUSES.includes(status)) throw new Error(`Unknown status ${status}`);
  const patch: Record<string, unknown> = { status, updatedAt: FieldValue.serverTimestamp() };
  if (trackingNumber) patch.trackingNumber = trackingNumber;
  await adminDb().collection("orders").doc(orderId).update(patch);
}

/**
 * Claims the right to announce an order, once. Returns false if another
 * request got there first, so a retry or a double-tap can't send twice.
 */
export async function claimAnnouncement(orderId: string): Promise<boolean> {
  const ref = adminDb().collection("orders").doc(orderId);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return false;
    if (snap.get("telegramNotifiedAt")) return false;
    tx.update(ref, { telegramNotifiedAt: FieldValue.serverTimestamp() });
    return true;
  });
}

/** Orders placed recently that were never announced (a browser closed too soon). */
export async function unannouncedSince(cutoff: Date): Promise<BotOrder[]> {
  const snap = await adminDb()
    .collection("orders")
    .where("createdAt", ">=", Timestamp.fromDate(cutoff))
    .get();
  return snap.docs
    .filter((doc) => !doc.get("telegramNotifiedAt"))
    .map((doc) => mapOrder(doc.id, doc.data() as Record<string, unknown>));
}
