// ─── /api/leoos-feed ──────────────────────────────────────────────────────
// Read-only snapshot of the storefront (orders, revenue, customers, stock,
// COA state, live deals) for the AI OS to pull. Requires a bearer token; never
// serves data unauthenticated.
//
// Setup (see README → "Feeding the AI OS"):
//   ARCANE_FEED_KEY                shared secret the OS sends as x-arcane-key
//   FIREBASE_SERVICE_ACCOUNT_JSON  service-account JSON for Firestore reads
//   LEOOS_ORIGIN                   optional, the OS origin, for browser calls

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
  const allowed = `${process.env.LEOOS_ALLOWED_ORIGINS ?? ""},${process.env.LEOOS_ORIGIN ?? ""}`
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
    headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, x-arcane-key";
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
  // LEOOS's bridge sends x-arcane-key; anything else can use a bearer token.
  const arcaneKey = request.headers.get("x-arcane-key");
  if (arcaneKey) return arcaneKey.trim();
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();
  // Fallback for clients that can't set headers at all.
  return new URL(request.url).searchParams.get("key")?.trim() ?? "";
}

// ARCANE_FEED_KEY is the name LEOOS documents; LEOOS_FEED_TOKEN is the one this
// repo's README used first. Either works, so a deployment can't be "wrong".
function expectedToken(): string {
  return (process.env.ARCANE_FEED_KEY ?? process.env.LEOOS_FEED_TOKEN ?? "").trim();
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function GET(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"));
  const json = (body: unknown, status: number) =>
    Response.json(body, { status, headers });

  const expected = expectedToken();
  if (!expected) {
    // Fail closed: without a token configured this would be an open revenue feed.
    return json(
      {
        error: "feed_disabled",
        message:
          "ARCANE_FEED_KEY is not set on this deployment, so the feed is switched off. Set it in the environment and send it as the 'x-arcane-key' header (a bearer token also works).",
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
      const rawItems = Array.isArray(d.items)
        ? (d.items as { name?: string; variantLabel?: string; qty?: number }[])
        : [];
      return {
        orderId: (d.orderId as string) ?? doc.id,
        status: (d.status as OrderStatus) ?? "pending_payment",
        totalGBP: typeof d.totalGBP === "number" ? d.totalGBP : 0,
        items: rawItems.map((i) => ({
          name: typeof i.name === "string" ? i.name : "",
          variantLabel: typeof i.variantLabel === "string" ? i.variantLabel : "",
          qty: typeof i.qty === "number" ? i.qty : 0,
        })),
        // Used only to count unique buyers — no customer identity is published,
        // so this stays on the server side of the payload.
        customerKey: (d.userId as string) ?? (d.customerEmail as string) ?? "",
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
