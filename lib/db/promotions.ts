// ─── Promotions settings (admin-editable) ─────────────────────────────────
// Firestore access for the active deals and social-proof popup settings. They
// live in a single document so the admin can run a promotion without a
// redeploy. Unlike settings/payment this document is world-readable (see
// firestore.rules) — signed-out visitors need to see the live deal.
//
// The shape itself (types, defaults, normalisers) lives in lib/promotions.ts
// so server routes can use it without the browser SDK.

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { withTimeout } from "@/lib/db/util";
import { mapPromotions, EMPTY_PROMOTIONS, type Promotions } from "@/lib/promotions";

export {
  DEFAULT_SOCIAL_PROOF,
  EMPTY_PROMOTIONS,
  mapPromotions,
  type Promotions,
  type SocialProofSettings,
} from "@/lib/promotions";

const promotionsRef = () => doc(db, "settings", "promotions");

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
