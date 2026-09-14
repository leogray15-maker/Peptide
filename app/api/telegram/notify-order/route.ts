// ─── /api/telegram/notify-order ───────────────────────────────────────────
// The checkout pings this the moment an order is saved. It takes no order
// content from the caller — only a reference — and reads the real thing from
// Firestore, so a stranger posting random references sends nothing. The
// announcement is claimed in a transaction, so a retry can't send twice.

import { AdminNotConfiguredError } from "@/lib/server/firebaseAdmin";
import { claimAnnouncement, getOrder } from "@/lib/server/orderStore";
import { newOrderMessage } from "@/lib/server/orderMessages";
import { isTelegramConfigured, sendMessage } from "@/lib/server/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Never hold up the customer's confirmation screen over a notification.
  const ok = () => Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });

  if (!isTelegramConfigured()) return ok();

  let orderId = "";
  try {
    const body = (await request.json()) as { orderId?: unknown };
    orderId = typeof body.orderId === "string" ? body.orderId.trim().slice(0, 64) : "";
  } catch {
    return ok();
  }
  if (!orderId) return ok();

  try {
    const order = await getOrder(orderId);
    // No such order — nothing happened, and nothing is sent.
    if (!order) return ok();
    if (!(await claimAnnouncement(order.orderId))) return ok();
    await sendMessage(newOrderMessage(order));
  } catch (err) {
    if (!(err instanceof AdminNotConfiguredError)) {
      console.error("[telegram] new-order notification failed", err);
    }
  }
  return ok();
}
