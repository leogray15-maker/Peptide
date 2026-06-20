// ─── Orders data access ───────────────────────────────────────────────────
// All Firestore reads/writes for the `orders` collection live here so the UI
// never touches Firestore directly.

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CartItem } from "@/contexts/CartContext";
import type { CurrencyCode } from "@/lib/config";
import type { PaymentMethod } from "@/lib/checkout";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  pending_payment: { label: "Pending payment", color: "#F39C12" },
  paid: { label: "Paid", color: "#3498DB" },
  processing: { label: "Processing", color: "#9B59B6" },
  shipped: { label: "Shipped", color: "#1ABC9C" },
  completed: { label: "Completed", color: "#2ECC71" },
  cancelled: { label: "Cancelled", color: "#E74C3C" },
};

// A line item, stored flat on the order so it's independent of the live catalogue.
export interface OrderItem {
  productSlug: string;
  variantSku: string;
  name: string;
  variantLabel: string;
  priceGBP: number;
  qty: number;
}

export interface Order {
  orderId: string; // human-readable ref, also the document id
  userId: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: OrderItem[];
  totalGBP: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const ordersCol = () => collection(db, "orders");

function toOrderItems(items: CartItem[]): OrderItem[] {
  // Strip non-serialisable / catalogue-only fields (e.g. image) down to a
  // stable snapshot of what was actually purchased.
  return items.map((i) => ({
    productSlug: i.productSlug,
    variantSku: i.variantSku,
    name: i.name,
    variantLabel: i.variantLabel,
    priceGBP: i.priceGBP,
    qty: i.qty,
  }));
}

function tsToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

export interface SaveOrderInput {
  orderId: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: CartItem[];
  totalGBP: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
}

// Persist a newly placed order. Best-effort: callers should not block the
// confirmation screen if this throws (e.g. transient network).
export async function saveOrder(input: SaveOrderInput): Promise<void> {
  await setDoc(doc(db, "orders", input.orderId), {
    orderId: input.orderId,
    userId: input.userId,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    shippingAddress: input.shippingAddress,
    items: toOrderItems(input.items),
    totalGBP: input.totalGBP,
    currency: input.currency,
    paymentMethod: input.paymentMethod,
    status: "pending_payment" as OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

function mapOrder(id: string, data: Record<string, unknown>): Order {
  return {
    orderId: (data.orderId as string) ?? id,
    userId: (data.userId as string | null) ?? null,
    customerEmail: (data.customerEmail as string) ?? "",
    customerName: (data.customerName as string) ?? "",
    shippingAddress: (data.shippingAddress as string) ?? "",
    items: (data.items as OrderItem[]) ?? [],
    totalGBP: (data.totalGBP as number) ?? 0,
    currency: (data.currency as CurrencyCode) ?? "GBP",
    paymentMethod: (data.paymentMethod as PaymentMethod) ?? "bank_transfer",
    status: (data.status as OrderStatus) ?? "pending_payment",
    trackingNumber: (data.trackingNumber as string) ?? undefined,
    adminNotes: (data.adminNotes as string) ?? undefined,
    createdAt: tsToDate(data.createdAt),
    updatedAt: tsToDate(data.updatedAt),
  };
}

// Orders for one customer. Sorted client-side to avoid a composite index.
export async function getUserOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(query(ordersCol(), where("userId", "==", userId)));
  const orders = snap.docs.map((d) => mapOrder(d.id, d.data()));
  return orders.sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
  );
}

// All orders, newest first — admin only (enforced by rules).
export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(query(ordersCol(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => mapOrder(d.id, d.data()));
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? mapOrder(snap.id, snap.data()) : null;
}

export async function updateOrder(
  orderId: string,
  patch: Partial<Pick<Order, "status" | "trackingNumber" | "adminNotes">>
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
