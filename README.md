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

## Changing Payment Details

Bank and crypto wallet details are environment variables (`NEXT_PUBLIC_BANK_*`, `NEXT_PUBLIC_CRYPTO_*`). Update them in Vercel without a code change.

---

## Design Tokens

All brand colours and typography live in `:root` inside [`app/globals.css`](app/globals.css). To re-theme the site, edit those variables only.

---

## Commit Conventions

`feat:` · `fix:` · `chore:` · `style:` · `docs:` · `refactor:`
