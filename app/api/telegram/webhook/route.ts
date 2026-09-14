// ─── /api/telegram/webhook ────────────────────────────────────────────────
// Where Telegram delivers your messages. Two gates, both required: the secret
// token Telegram was registered with, and the chat id. Anything else is
// ignored with a 200 — a refusal would only tell a stranger they found
// something.
//
// Register it once (see README → "The Telegram bot"):
//   https://api.telegram.org/bot<TOKEN>/setWebhook
//     ?url=https://arcanepeptides.vercel.app/api/telegram/webhook
//     &secret_token=<TELEGRAM_WEBHOOK_SECRET>

import { adminDb, AdminNotConfiguredError } from "@/lib/server/firebaseAdmin";
import { mapPromotions } from "@/lib/promotions";
import { dealHeadline } from "@/lib/deals";
import { uniqueProducts } from "@/data/products";
import type { OrderStatus } from "@/lib/orders";
import {
  allOrders,
  findOrder,
  isOpen,
  setStatus,
} from "@/lib/server/orderStore";
import {
  HELP,
  gbp,
  orderDetailMessage,
  queueLine,
  statusLabel,
  type BotOrder,
} from "@/lib/server/orderMessages";
import { esc, isOwner, isTelegramConfigured, sendMessage } from "@/lib/server/telegram";

export const dynamic = "force-dynamic";

// Telegram retries anything that isn't a 2xx, so every path answers 200.
const ok = () => Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });

interface Update {
  message?: { chat?: { id?: unknown }; text?: unknown };
}

const STATUS_COMMANDS: Record<string, OrderStatus> = {
  paid: "paid",
  processing: "processing",
  shipped: "shipped",
  completed: "completed",
  cancel: "cancelled",
};

export async function POST(request: Request) {
  if (!isTelegramConfigured()) return ok();

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!secret || request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return ok();
  }

  let update: Update;
  try {
    update = (await request.json()) as Update;
  } catch {
    return ok();
  }

  const chatId = update.message?.chat?.id;
  const text = typeof update.message?.text === "string" ? update.message.text.trim() : "";
  if (!isOwner(chatId) || !text) return ok();

  try {
    await sendMessage(await reply(text));
  } catch (err) {
    console.error("[telegram] webhook failed", err);
    try {
      await sendMessage(
        err instanceof AdminNotConfiguredError
          ? `Can't reach the shop's data. ${esc(err.message)}`
          : "Something went wrong reading the shop. Try again in a moment."
      );
    } catch {
      /* nothing more to do */
    }
  }
  return ok();
}

async function reply(text: string): Promise<string> {
  // "/shipped@ArcaneBot AP-1 TRACK" → ["shipped", "AP-1", "TRACK"]
  const [rawCommand, ...args] = text.split(/\s+/);
  const command = rawCommand.replace(/^\//, "").split("@")[0].toLowerCase();
  const now = new Date();

  if (command === "start" || command === "help") return HELP;
  if (command === "status") return statusReport(now);
  if (command === "orders") return openQueue(now);
  if (command === "stock") return stockReport();
  if (command === "deals") return dealsReport();

  if (command === "order") {
    const order = await findOrder(args[0] ?? "");
    if (!order) return `No order ${esc(args[0] ?? "")}. <code>/orders</code> lists what's open.`;
    return orderDetailMessage(order, now);
  }

  const status = STATUS_COMMANDS[command];
  if (status) return moveOrder(status, args);

  return `Don't know <code>${esc(command)}</code>.\n\n${HELP}`;
}

async function moveOrder(status: OrderStatus, args: string[]): Promise<string> {
  const ref = args[0] ?? "";
  if (!ref) return `Which order? <code>/${status} AP-…</code>`;

  const order = await findOrder(ref);
  if (!order) return `No order ${esc(ref)}.`;
  if (order.status === status) {
    return `${esc(order.orderId)} is already ${esc(statusLabel(status))}.`;
  }

  const tracking = status === "shipped" ? args.slice(1).join(" ").trim() : "";
  await setStatus(order.orderId, status, tracking || undefined);

  const was = statusLabel(order.status);
  const lines = [
    `✅ <b>${esc(order.orderId)}</b> — ${esc(was)} → ${esc(statusLabel(status))}`,
  ];
  if (tracking) lines.push(`📦 Tracking ${esc(tracking)}`);
  else if (status === "shipped") {
    lines.push("No tracking recorded — send <code>/shipped REF TRACKING</code> to add one.");
  }
  return lines.join("\n");
}

async function statusReport(now: Date): Promise<string> {
  const orders = await allOrders();
  const billable = orders.filter((o) => o.status !== "cancelled");
  const open = orders.filter(isOpen);
  const unpaid = orders.filter((o) => o.status === "pending_payment");

  const since = (days: number) => {
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return billable.filter((o) => o.createdAt && o.createdAt >= cutoff);
  };
  const sum = (list: BotOrder[]) => list.reduce((t, o) => t + o.totalGBP, 0);

  return [
    "<b>Arcane Peptides</b>",
    "",
    `💷 ${gbp(sum(since(1)))} today · ${gbp(sum(since(7)))} this week · ${gbp(sum(since(30)))} in 30 days`,
    `📦 ${open.length} open · ${unpaid.length} awaiting payment`,
    `💰 ${gbp(sum(open))} sitting in open orders`,
    `🧾 ${billable.length} orders all time · ${gbp(sum(billable))}`,
    "",
    "<code>/orders</code> for the queue",
  ].join("\n");
}

async function openQueue(now: Date): Promise<string> {
  const open = (await allOrders()).filter(isOpen);
  if (!open.length) return "Nothing open. The queue is clear.";
  const shown = open.slice(0, 20);
  return [
    `<b>${open.length} open order${open.length === 1 ? "" : "s"}</b>`,
    "",
    ...shown.map((o) => queueLine(o, now)),
    ...(open.length > shown.length ? ["", `…and ${open.length - shown.length} more`] : []),
    "",
    "<code>/order REF</code> for the address",
  ].join("\n");
}

function stockReport(): string {
  const withCoa = uniqueProducts.filter((p) => p.coaAvailable);
  const pending = uniqueProducts.filter((p) => !p.coaAvailable);
  const out = uniqueProducts.filter((p) => !p.variants.some((v) => v.inStock));

  return [
    "<b>The shelf</b>",
    "",
    `🧾 COA published on ${withCoa.length} of ${uniqueProducts.length} (${Math.round(
      (withCoa.length / uniqueProducts.length) * 100
    )}%)`,
    out.length
      ? `⚠️ Out of stock: ${out.map((p) => esc(p.name)).slice(0, 12).join(", ")}`
      : "✅ Nothing out of stock",
    pending.length
      ? `🔬 COA outstanding: ${pending.map((p) => esc(p.name)).slice(0, 12).join(", ")}`
      : "✅ Every compound has a COA",
  ].join("\n");
}

async function dealsReport(): Promise<string> {
  const snap = await adminDb().collection("settings").doc("promotions").get();
  const { deals } = mapPromotions(
    snap.exists ? (snap.data() as Record<string, unknown>) : undefined
  );
  const live = deals.filter((d) => d.enabled);
  if (!live.length) return "No deals running.";
  return [
    `<b>${live.length} deal${live.length === 1 ? "" : "s"} running</b>`,
    "",
    ...live.map((d) => {
      const bits = [esc(dealHeadline(d))];
      if (d.minSpendGBP > 0) bits.push(`over ${gbp(d.minSpendGBP)}`);
      if (d.code.trim()) bits.push(`code ${esc(d.code.trim())}`);
      return `• ${bits.join(" · ")}`;
    }),
  ].join("\n");
}
