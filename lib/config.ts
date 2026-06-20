// ─── Site-wide config — edit here, changes propagate everywhere ──────────────

export const SITE_NAME = "Arcane Peptides";
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://arcanepeptides.co.uk";
export const SITE_TAGLINE = "Beyond the Veil of Research";
export const SITE_DESCRIPTION =
  "HPLC-verified research compounds, lyophilised for stability. UK-based. Independent COA on every batch.";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+44000000000";

export const FREE_SHIPPING_THRESHOLD_GBP = 50;

// ─── Admin / CRM access ──────────────────────────────────────────────────────
// Emails listed here get access to the /admin CRM dashboard. Keep this in sync
// with the email(s) hard-coded in firestore.rules (rules cannot read env vars).
// Override/extend via NEXT_PUBLIC_ADMIN_EMAILS (comma-separated).
export const ADMIN_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "leogray15@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Announcement bar messages — rotate client-side
export const ANNOUNCEMENTS = [
  "Free UK delivery on orders over £50",
  "Dispatched next working day (Mon–Fri)",
  "100% HPLC verified — COA on every batch",
  "Use ARCANE10 for 10% off your first order",
  "Independent third-party purity testing on all compounds",
];

// Bulk discount tiers (qty-based, applied per line-item)
export const BULK_TIERS = [
  { minQty: 5,  maxQty: 9,  discountPct: 3 },
  { minQty: 10, maxQty: 15, discountPct: 6 },
  { minQty: 16, maxQty: 20, discountPct: 9 },
  { minQty: 21, maxQty: Infinity, discountPct: 12 },
];

export function getBulkDiscount(qty: number): number {
  const tier = BULK_TIERS.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier?.discountPct ?? 0;
}

// Currency — GBP default; static FX rates (update periodically)
export const CURRENCIES = {
  GBP: { symbol: "£", label: "GBP", rate: 1 },
  EUR: { symbol: "€", label: "EUR", rate: 1.17 },
  USD: { symbol: "$", label: "USD", rate: 1.27 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatPrice(gbp: number, currency: CurrencyCode = "GBP"): string {
  const { symbol, rate } = CURRENCIES[currency];
  const converted = gbp * rate;
  return `${symbol}${converted.toFixed(2)}`;
}
