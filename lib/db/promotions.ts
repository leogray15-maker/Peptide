// ─── Promotions settings (admin-editable) ─────────────────────────────────
// The active deals and the social-proof popup settings live in a single
// Firestore document so the admin can run a promotion without a redeploy.
// Unlike settings/payment this document is world-readable (see firestore.rules)
// — signed-out visitors need to see the live deal in the announcement bar.

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { withTimeout } from "@/lib/db/util";
import type { Deal, DealType } from "@/lib/deals";

export interface SocialProofSettings {
  enabled: boolean;
  /** Seconds before the first popup after a page load. */
  initialDelaySec: number;
  /** Random gap between popups, in seconds. */
  minGapSec: number;
  maxGapSec: number;
  /** How long each popup stays on screen, in seconds. */
  visibleSec: number;
}

export interface Promotions {
  deals: Deal[];
  socialProof: SocialProofSettings;
}

export const DEFAULT_SOCIAL_PROOF: SocialProofSettings = {
  enabled: true,
  initialDelaySec: 8,
  minGapSec: 20,
  maxGapSec: 45,
  visibleSec: 6,
};

export const EMPTY_PROMOTIONS: Promotions = {
  deals: [],
  socialProof: DEFAULT_SOCIAL_PROOF,
};

const promotionsRef = () => doc(db, "settings", "promotions");

const DEAL_TYPES: DealType[] = [
  "percent_off",
  "amount_off",
  "bogo",
  "free_gift",
  "free_shipping",
];

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

// Stored deals are user-entered data — normalise every field so a partial or
// hand-edited document can never crash the storefront.
function mapDeal(raw: unknown, index: number): Deal | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const type = DEAL_TYPES.includes(d.type as DealType) ? (d.type as DealType) : null;
  if (!type) return null;
  return {
    id: typeof d.id === "string" && d.id ? d.id : `deal-${index}`,
    type,
    label: typeof d.label === "string" ? d.label : "",
    enabled: d.enabled !== false,
    code: typeof d.code === "string" ? d.code : "",
    minSpendGBP: Math.max(0, num(d.minSpendGBP, 0)),
    percentOff: Math.min(100, Math.max(0, num(d.percentOff, 0))),
    amountOffGBP: Math.max(0, num(d.amountOffGBP, 0)),
    buyQty: Math.max(1, Math.round(num(d.buyQty, 2))),
    getQty: Math.max(1, Math.round(num(d.getQty, 1))),
    giftName: typeof d.giftName === "string" ? d.giftName : "",
  };
}

function mapSocialProof(raw: unknown): SocialProofSettings {
  if (!raw || typeof raw !== "object") return DEFAULT_SOCIAL_PROOF;
  const s = raw as Record<string, unknown>;
  const minGapSec = Math.max(5, num(s.minGapSec, DEFAULT_SOCIAL_PROOF.minGapSec));
  return {
    enabled: s.enabled !== false,
    initialDelaySec: Math.max(0, num(s.initialDelaySec, DEFAULT_SOCIAL_PROOF.initialDelaySec)),
    minGapSec,
    maxGapSec: Math.max(minGapSec, num(s.maxGapSec, DEFAULT_SOCIAL_PROOF.maxGapSec)),
    visibleSec: Math.max(2, num(s.visibleSec, DEFAULT_SOCIAL_PROOF.visibleSec)),
  };
}

export function mapPromotions(data: Record<string, unknown> | undefined): Promotions {
  if (!data) return EMPTY_PROMOTIONS;
  const rawDeals = Array.isArray(data.deals) ? data.deals : [];
  return {
    deals: rawDeals.map(mapDeal).filter((d): d is Deal => d !== null),
    socialProof: mapSocialProof(data.socialProof),
  };
}

export async function getPromotions(): Promise<Promotions> {
  const snap = await withTimeout(getDoc(promotionsRef()), 8000, "Promotions read");
  return snap.exists() ? mapPromotions(snap.data()) : EMPTY_PROMOTIONS;
}

export async function savePromotions(promotions: Promotions): Promise<void> {
  await withTimeout(
    setDoc(promotionsRef(), { ...promotions, updatedAt: serverTimestamp() }),
    8000,
    "Promotions save"
  );
}
