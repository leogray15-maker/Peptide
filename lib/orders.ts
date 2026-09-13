// ─── Order shapes ─────────────────────────────────────────────────────────
// Types and status metadata for the `orders` collection. Pure — no Firestore —
// so server routes can use it without pulling in the browser SDK. Reads and
// writes live in lib/db/orders.ts.

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
  promoCode: string | null;
  /** Admin-run deals that applied to this order (see lib/deals.ts). */
  appliedDeals: AppliedOrderDeal[];
  /** Free items owed with this order, e.g. "Bacteriostatic Water 10 ml". */
  gifts: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

// A deal as it applied at the moment of purchase — stored flat so a later
// change to the live deals never rewrites order history.
export interface AppliedOrderDeal {
  label: string;
  amountGBP: number;
}
