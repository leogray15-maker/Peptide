// ─── /api/leoos-feed ──────────────────────────────────────────────────────
// Read-only snapshot of the storefront (orders, revenue, customers, stock,
// COA state, live deals) for the AI OS to pull. Requires a bearer token; never
// serves data unauthenticated.
//
// Setup (see README → "Feeding the AI OS"):
//   LEOOS_FEED_TOKEN               shared secret the OS sends
//   FIREBASE_SERVICE_ACCOUNT_JSON  service-account JSON for Firestore reads
//   LEOOS_ALLOWED_ORIGINS          optional, comma-separated, for browser calls

import { Timestamp } from "firebase-admin/firestore";
import { adminDb, AdminNotConfiguredError } from "@/lib/server/firebaseAdmin";
import { buildFeed, type FeedOrder, type FeedUser } from "@/lib/server/feed";
import { mapPromotions } from "@/lib/promotions";
import type { OrderStatus } from "@/lib/orders";

// Reading the request headers already opts this route out of prerendering;
// being explicit keeps it that way if caching defaults change.
export const dynamic = "force-dynamic";

function tsToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = (process.env.LEOOS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const headers: Record<string, string> = {
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
  if (origin && allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
  }
  return headers;
}

// Constant-time-ish comparison so the token can't be guessed a character at a
// time from response timings.
function tokenMatches(given: string, expected: string): boolean {
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function presentedToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();
  // Fallback for clients that can't set headers (e.g. a plain <img>/webhook).
  return new URL(request.url).searchParams.get("key")?.trim() ?? "";
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function GET(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"));
  const json = (body: unknown, status: number) =>
    Response.json(body, { status, headers });

  const expected = process.env.LEOOS_FEED_TOKEN?.trim();
  if (!expected) {
    // Fail closed: without a token configured this would be an open revenue feed.
    return json(
      {
        error: "feed_disabled",
        message:
          "LEOOS_FEED_TOKEN is not set on this deployment, so the feed is switched off. Set it in the environment and send it as 'Authorization: Bearer <token>'.",
      },
      503
    );
  }

  if (!tokenMatches(presentedToken(request), expected)) {
    return json({ error: "unauthorized" }, 401);
  }

  try {
    const db = adminDb();
    const [ordersSnap, usersSnap, promotionsSnap] = await Promise.all([
      db.collection("orders").get(),
      db.collection("users").get(),
      db.collection("settings").doc("promotions").get(),
    ]);

    const orders: FeedOrder[] = ordersSnap.docs.map((doc) => {
      const d = doc.data();
      const items = Array.isArray(d.items) ? (d.items as { qty?: number }[]) : [];
      return {
        orderId: (d.orderId as string) ?? doc.id,
        status: (d.status as OrderStatus) ?? "pending_payment",
        totalGBP: typeof d.totalGBP === "number" ? d.totalGBP : 0,
        itemCount: items.reduce((t, i) => t + (typeof i.qty === "number" ? i.qty : 0), 0),
        // Names only — the OS has no use for emails or shipping addresses.
        customerName: (d.customerName as string) ?? "",
        createdAt: tsToDate(d.createdAt),
      };
    });

    const users: FeedUser[] = usersSnap.docs.map((doc) => ({
      uid: doc.id,
      createdAt: tsToDate(doc.data().createdAt),
    }));

    const { deals } = mapPromotions(
      promotionsSnap.exists ? (promotionsSnap.data() as Record<string, unknown>) : undefined
    );

    return json(buildFeed({ orders, users, deals, now: new Date() }), 200);
  } catch (err) {
    if (err instanceof AdminNotConfiguredError) {
      return json({ error: "not_configured", message: err.message }, 503);
    }
    console.error("[leoos-feed] failed", err);
    return json({ error: "feed_failed", message: "Could not read the storefront data." }, 502);
  }
}
