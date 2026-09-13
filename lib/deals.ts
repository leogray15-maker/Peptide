// ─── Deals engine ─────────────────────────────────────────────────────────
// Site-wide promotions the admin turns on from /admin → Deals. Pure logic only
// (no Firestore, no React) so it can be unit-reasoned about and used from both
// the cart and the checkout summary. Storage lives in lib/db/promotions.ts.

export type DealType =
  | "percent_off"    // X% off the order
  | "amount_off"     // £X off the order
  | "bogo"           // buy X get Y free (cheapest qualifying vials free)
  | "free_gift"      // a free item added to the order
  | "free_shipping"; // free UK delivery regardless of the spend threshold

export interface Deal {
  id: string;
  type: DealType;
  /** Customer-facing headline, e.g. "20% off everything". */
  label: string;
  enabled: boolean;
  /** Blank = applies automatically. Otherwise the customer must enter it at checkout. */
  code: string;
  /** 0 = no minimum spend. */
  minSpendGBP: number;
  percentOff: number;   // percent_off
  amountOffGBP: number; // amount_off
  buyQty: number;       // bogo
  getQty: number;       // bogo
  giftName: string;     // free_gift
}

// Every field is always present (never undefined) — Firestore rejects undefined
// values, and it keeps the admin form controlled.
export const EMPTY_DEAL: Omit<Deal, "id"> = {
  type: "percent_off",
  label: "",
  enabled: true,
  code: "",
  minSpendGBP: 0,
  percentOff: 10,
  amountOffGBP: 0,
  buyQty: 2,
  getQty: 1,
  giftName: "",
};

export const DEAL_TYPE_META: Record<DealType, { label: string; hint: string }> = {
  percent_off:   { label: "% off order",     hint: "Takes a percentage off the order total." },
  amount_off:    { label: "£ off order",     hint: "Takes a fixed amount off the order total." },
  bogo:          { label: "Buy X get Y free", hint: "The cheapest qualifying items in each group are free." },
  free_gift:     { label: "Free gift",       hint: "Adds a free item to the order — no money off." },
  free_shipping: { label: "Free shipping",   hint: "Free UK delivery regardless of the spend threshold." },
};

// One-click starting points for the admin. Picking one fills the editor, which
// can then be tweaked (percentage, minimum spend, wording) before saving.
export const DEAL_PRESETS: { key: string; name: string; deal: Omit<Deal, "id"> }[] = [
  {
    key: "20pc",
    name: "20% off everything",
    deal: { ...EMPTY_DEAL, type: "percent_off", percentOff: 20, label: "20% off everything" },
  },
  {
    key: "15pc",
    name: "15% off everything",
    deal: { ...EMPTY_DEAL, type: "percent_off", percentOff: 15, label: "15% off everything" },
  },
  {
    key: "10pc-50",
    name: "10% off orders over £50",
    deal: {
      ...EMPTY_DEAL,
      type: "percent_off",
      percentOff: 10,
      minSpendGBP: 50,
      label: "10% off orders over £50",
    },
  },
  {
    key: "b2g1",
    name: "Buy 2 get 1 free",
    deal: { ...EMPTY_DEAL, type: "bogo", buyQty: 2, getQty: 1, label: "Buy 2 get 1 free" },
  },
  {
    key: "b3g1",
    name: "Buy 3 get 1 free",
    deal: { ...EMPTY_DEAL, type: "bogo", buyQty: 3, getQty: 1, label: "Buy 3 get 1 free" },
  },
  {
    key: "bac",
    name: "Free BAC water with every order",
    deal: {
      ...EMPTY_DEAL,
      type: "free_gift",
      giftName: "Bacteriostatic Water 10 ml",
      label: "Free BAC water with every order",
    },
  },
  {
    key: "bac-75",
    name: "Free BAC water over £75",
    deal: {
      ...EMPTY_DEAL,
      type: "free_gift",
      giftName: "Bacteriostatic Water 10 ml",
      minSpendGBP: 75,
      label: "Free BAC water on orders over £75",
    },
  },
  {
    key: "tenner",
    name: "£10 off orders over £100",
    deal: {
      ...EMPTY_DEAL,
      type: "amount_off",
      amountOffGBP: 10,
      minSpendGBP: 100,
      label: "£10 off orders over £100",
    },
  },
  {
    key: "ship",
    name: "Free UK shipping, no minimum",
    deal: { ...EMPTY_DEAL, type: "free_shipping", label: "Free UK delivery on every order" },
  },
];

// The wording shown to customers. Falls back to a description built from the
// deal itself when the admin saved it without a headline.
export function dealHeadline(deal: Deal): string {
  const label = deal.label.trim();
  if (label) return label;
  switch (deal.type) {
    case "percent_off":   return `${deal.percentOff}% off your order`;
    case "amount_off":    return `£${deal.amountOffGBP.toFixed(2)} off your order`;
    case "bogo":          return `Buy ${deal.buyQty} get ${deal.getQty} free`;
    case "free_gift":     return `Free ${deal.giftName.trim() || "gift"} with your order`;
    case "free_shipping": return "Free UK delivery";
  }
}

// ─── Applying deals to a cart ────────────────────────────────────────────

// The engine works on plain numbers so it stays independent of the cart shape.
export interface DealLine {
  /** Price actually paid per unit (i.e. after any bulk discount). */
  unitPriceGBP: number;
  qty: number;
}

export interface AppliedDeal {
  dealId: string;
  label: string;
  /** Money taken off the order by this deal (0 for gifts / free shipping). */
  amountGBP: number;
  giftName?: string;
  freeShipping?: boolean;
}

export interface DealResult {
  applied: AppliedDeal[];
  discountGBP: number;
  gifts: string[];
  freeShipping: boolean;
}

export const NO_DEALS: DealResult = {
  applied: [],
  discountGBP: 0,
  gifts: [],
  freeShipping: false,
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Value of the free units under a buy-X-get-Y-free deal. Units are pooled
// across the whole cart and sorted most expensive first, so each complete group
// gives away its own cheapest members — the standard high-street behaviour.
export function bogoDiscount(lines: DealLine[], buyQty: number, getQty: number): number {
  if (buyQty < 1 || getQty < 1) return 0;
  const units: number[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.qty; i++) units.push(line.unitPriceGBP);
  }
  units.sort((a, b) => b - a);

  const groupSize = buyQty + getQty;
  let free = 0;
  for (let start = 0; start + groupSize <= units.length; start += groupSize) {
    for (let i = start + buyQty; i < start + groupSize; i++) free += units[i];
  }
  return round2(free);
}

// Is this deal live for the given basket? Code-gated deals need the matching
// code entered at checkout; everything else applies automatically.
export function isDealEligible(deal: Deal, subtotalGBP: number, enteredCode?: string | null): boolean {
  if (!deal.enabled) return false;
  if (subtotalGBP < deal.minSpendGBP) return false;
  if (deal.code.trim()) {
    return deal.code.trim().toUpperCase() === (enteredCode ?? "").trim().toUpperCase();
  }
  return true;
}

/**
 * Applies every eligible deal to a basket.
 *
 * Monetary deals are applied in sequence against the *running* total rather
 * than all against the original subtotal, so stacking several deals can never
 * discount the order below £0.
 */
export function applyDeals(
  lines: DealLine[],
  subtotalGBP: number,
  deals: Deal[],
  enteredCode?: string | null
): DealResult {
  const applied: AppliedDeal[] = [];
  const gifts: string[] = [];
  let freeShipping = false;
  let running = subtotalGBP;

  for (const deal of deals) {
    if (!isDealEligible(deal, subtotalGBP, enteredCode)) continue;

    switch (deal.type) {
      case "percent_off": {
        const amount = round2(running * (deal.percentOff / 100));
        if (amount <= 0) break;
        running = round2(running - amount);
        applied.push({ dealId: deal.id, label: dealHeadline(deal), amountGBP: amount });
        break;
      }
      case "amount_off": {
        const amount = round2(Math.min(deal.amountOffGBP, running));
        if (amount <= 0) break;
        running = round2(running - amount);
        applied.push({ dealId: deal.id, label: dealHeadline(deal), amountGBP: amount });
        break;
      }
      case "bogo": {
        const amount = round2(Math.min(bogoDiscount(lines, deal.buyQty, deal.getQty), running));
        if (amount <= 0) break;
        running = round2(running - amount);
        applied.push({ dealId: deal.id, label: dealHeadline(deal), amountGBP: amount });
        break;
      }
      case "free_gift": {
        const gift = deal.giftName.trim() || deal.label;
        gifts.push(gift);
        applied.push({ dealId: deal.id, label: dealHeadline(deal), amountGBP: 0, giftName: gift });
        break;
      }
      case "free_shipping": {
        freeShipping = true;
        applied.push({ dealId: deal.id, label: dealHeadline(deal), amountGBP: 0, freeShipping: true });
        break;
      }
    }
  }

  return {
    applied,
    discountGBP: round2(subtotalGBP - running),
    gifts,
    freeShipping,
  };
}

// Deals a shopper should be told about before they reach the checkout — i.e.
// everything that isn't hidden behind a code.
export function publicDeals(deals: Deal[]): Deal[] {
  return deals.filter((d) => d.enabled && !d.code.trim());
}

// Finds an enabled deal matching a code typed into the checkout discount box.
export function findDealByCode(deals: Deal[], code: string): Deal | null {
  const target = code.trim().toUpperCase();
  if (!target) return null;
  return deals.find((d) => d.enabled && d.code.trim().toUpperCase() === target) ?? null;
}
