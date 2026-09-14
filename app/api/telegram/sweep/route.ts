// ─── /api/telegram/sweep ──────────────────────────────────────────────────
// A safety net and a morning briefing in one, run by Vercel Cron.
//
// The instant notification depends on the customer's browser living long
// enough to send it. This sweeps up anything it missed in the last day, then
// sends the day's summary.

import { allOrders, isOpen, unannouncedSince, claimAnnouncement } from "@/lib/server/orderStore";
import { gbp, newOrderMessage, queueLine, type BotOrder } from "@/lib/server/orderMessages";
import { isTelegramConfigured, sendMessage } from "@/lib/server/telegram";

export const dynamic = "force-dynamic";

// Vercel Cron sends the project's CRON_SECRET; a manual run can use the feed
// key. Without either configured the route refuses rather than running open.
function authorised(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const accepted = [process.env.CRON_SECRET, process.env.ARCANE_FEED_KEY]
    .map((v) => v?.trim())
    .filter(Boolean) as string[];
  return accepted.length > 0 && accepted.includes(token);
}

export async function GET(request: Request) {
  if (!authorised(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!isTelegramConfigured()) {
    return Response.json({ error: "telegram_not_configured" }, { status: 503 });
  }

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  let missed = 0;
  try {
    for (const order of await unannouncedSince(dayAgo)) {
      if (!(await claimAnnouncement(order.orderId))) continue;
      await sendMessage(newOrderMessage(order));
      missed++;
    }
    await sendMessage(await digest(now), { silent: true });
  } catch (err) {
    console.error("[telegram] sweep failed", err);
    return Response.json({ error: "sweep_failed" }, { status: 502 });
  }

  return Response.json({ ok: true, missed }, { headers: { "Cache-Control": "no-store" } });
}

async function digest(now: Date): Promise<string> {
  const orders = await allOrders();
  const billable = orders.filter((o) => o.status !== "cancelled");
  const open = orders.filter(isOpen);
  const unpaid = orders.filter((o) => o.status === "pending_payment");
  const sum = (list: BotOrder[]) => list.reduce((t, o) => t + o.totalGBP, 0);
  const yesterday = billable.filter(
    (o) => o.createdAt && o.createdAt >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
  );

  const stale = open
    .filter((o) => o.createdAt && now.getTime() - o.createdAt.getTime() > 3 * 24 * 60 * 60 * 1000)
    .slice(0, 5);

  return [
    "<b>Morning.</b>",
    "",
    `💷 ${gbp(sum(yesterday))} yesterday across ${yesterday.length} order${
      yesterday.length === 1 ? "" : "s"
    }`,
    `📦 ${open.length} open · ${unpaid.length} awaiting payment · ${gbp(sum(open))} tied up`,
    ...(stale.length
      ? ["", `⏳ <b>Sitting more than three days</b>`, ...stale.map((o) => queueLine(o, now))]
      : []),
    "",
    "<code>/orders</code> · <code>/status</code>",
  ].join("\n");
}
