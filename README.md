# Arcane Peptides

Production e-commerce site for [arcanepeptides.co.uk](https://arcanepeptides.co.uk) — a UK research-compound supplier.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4**.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties (design tokens in `app/globals.css`) |
| Icons | lucide-react |
| Payments | Bank Transfer + Crypto (abstracted via `lib/checkout.ts`) |
| Data | `data/products.ts` — typed flat file, CMS-ready shape |
| Deployment | Vercel |

---

## Local Setup

```bash
# 1 — clone
git clone https://github.com/your-org/arcane-peptides.git
cd arcane-peptides

# 2 — install
npm install

# 3 — env
cp .env.example .env.local
# fill in the values in .env.local

# 4 — dev server
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Add all env vars from `.env.example` in the Vercel dashboard → Settings → Environment Variables.
4. Deploy — Vercel auto-detects Next.js. No `vercel.json` required.

---

## Adding Products

All catalogue data lives in [`data/products.ts`](data/products.ts). To add a product:

1. Add an entry to the `products` array following the `Product` type.
2. Redeploy to pick up changes in production.

---

## Running a Deal

Deals are set in the CRM — **/admin → Deals** — and go live without a redeploy.

1. Pick a preset (20% off, buy 2 get 1 free, free BAC water, £10 off over £100,
   free UK shipping) or start from **Custom**.
2. Tweak the headline, percentage/amount, minimum spend, and whether it applies
   automatically or only to customers who enter a code.
3. Toggle **Live** on the deals you want running, then **Save Deals**.

Live deals show in the announcement bar, in the cart, and at checkout, and are
recorded on each order (with any free gift) so the parcel gets packed correctly.
The same screen controls the live-activity popups — frequency, how long each one
stays up, and an on/off switch.

Deals live in the Firestore document `settings/promotions`, which is
world-readable so signed-out visitors see the running deal. The rules in
[`firestore.rules`](firestore.rules) must be published for this to work.

---

## Feeding the AI OS

`GET /api/leoos-feed` returns a read-only JSON snapshot of the store for the AI
OS to pull: order counts by status, revenue (all-time, month-to-date, last 30
days, open order value), customer counts, the catalogue with stock and COA
state per line, and the live deals. It carries customer *names* on recent
orders but no emails and no addresses.

Set two environment variables in Vercel:

| Variable | What it is |
|----------|------------|
| `LEOOS_FEED_TOKEN` | Shared secret. Generate with `openssl rand -hex 32`. Until it is set the feed returns 503 — it is never open. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | The service-account JSON from Firebase Console → Project settings → Service accounts → Generate new private key, pasted whole. Server-side reads need it because there is no signed-in admin on an API route. |

Then call it from the OS:

```bash
curl -H "Authorization: Bearer $LEOOS_FEED_TOKEN" \
  https://arcanepeptides.vercel.app/api/leoos-feed
```

Call it from the OS's **server** side (its own route handler or a cron job).
Fetching it straight from the OS's browser code would ship the token in a
public bundle. If you do need a browser call, set `LEOOS_ALLOWED_ORIGINS` to
the OS origin (e.g. `https://leoos-ashen.vercel.app`) — CORS is refused for
everything not on that list — and accept that the token is then public.

Responses are `Cache-Control: no-store`, so poll as often as the OS needs.

---

## Changing Payment Details

Bank and crypto wallet details are environment variables (`NEXT_PUBLIC_BANK_*`, `NEXT_PUBLIC_CRYPTO_*`). Update them in Vercel without a code change.

---

## Design Tokens

All brand colours and typography live in `:root` inside [`app/globals.css`](app/globals.css). To re-theme the site, edit those variables only.

---

## Commit Conventions

`feat:` · `fix:` · `chore:` · `style:` · `docs:` · `refactor:`
