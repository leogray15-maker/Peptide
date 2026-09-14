// ─── Telegram (server-only) ───────────────────────────────────────────────
// One bot, one chat: the owner's. Nothing here answers anyone else, and the
// token never leaves the server.

import "server-only";

// Overridable so tests can point the bot at a stand-in and never reach the
// real API; unset everywhere else.
const API = process.env.TELEGRAM_API_BASE?.trim() || "https://api.telegram.org";

export class TelegramNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TelegramNotConfiguredError";
  }
}

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export function telegramConfig(): TelegramConfig {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    throw new TelegramNotConfiguredError(
      "Telegram is not configured. Set TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID."
    );
  }
  return { token, chatId };
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
}

/** Telegram's HTML mode only forgives these three. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendMessage(
  text: string,
  options: { chatId?: string; silent?: boolean } = {}
): Promise<void> {
  const { token, chatId } = telegramConfig();
  const res = await fetch(`${API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: options.chatId ?? chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      disable_notification: options.silent ?? false,
    }),
  });

  if (!res.ok) {
    // Telegram explains itself in the body; the token is never in it.
    const detail = await res.text().catch(() => "");
    throw new Error(`Telegram sendMessage failed (${res.status}) ${detail.slice(0, 300)}`);
  }
}

/** The chat this bot answers. Anything else is ignored, not refused. */
export function isOwner(chatId: unknown): boolean {
  const expected = process.env.TELEGRAM_CHAT_ID?.trim();
  return Boolean(expected) && String(chatId) === expected;
}
