"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPromotions, EMPTY_PROMOTIONS, type SocialProofSettings } from "@/lib/db/promotions";
import {
  applyDeals,
  publicDeals,
  findDealByCode,
  NO_DEALS,
  type Deal,
  type DealResult,
} from "@/lib/deals";
import { lineTotal, cartTotal, type CartItem } from "@/contexts/CartContext";

interface DealsCtx {
  /** Every deal the admin has saved, enabled or not. */
  deals: Deal[];
  /** Enabled deals that apply without a code — safe to advertise. */
  activeDeals: Deal[];
  socialProof: SocialProofSettings;
  loading: boolean;
  /** Works out what the live deals are worth for a given basket. */
  evaluate: (items: CartItem[], enteredCode?: string | null) => DealResult;
  /** Looks up a code typed into the checkout discount box. */
  dealForCode: (code: string) => Deal | null;
}

const Ctx = createContext<DealsCtx | null>(null);

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProofSettings>(
    EMPTY_PROMOTIONS.socialProof
  );
  const [loading, setLoading] = useState(true);

  // Load once on mount. A failure here is never fatal: the storefront simply
  // runs with no deals rather than blocking on Firestore.
  useEffect(() => {
    let active = true;
    getPromotions()
      .then((p) => {
        if (!active) return;
        setDeals(p.deals);
        setSocialProof(p.socialProof);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<DealsCtx>(() => {
    return {
      deals,
      activeDeals: publicDeals(deals),
      socialProof,
      loading,
      evaluate: (items, enteredCode) => {
        if (items.length === 0 || deals.length === 0) return NO_DEALS;
        const lines = items.map((i) => ({
          // Unit price actually paid, i.e. after the qty-based bulk discount.
          unitPriceGBP: lineTotal(i) / i.qty,
          qty: i.qty,
        }));
        return applyDeals(lines, cartTotal(items), deals, enteredCode);
      },
      dealForCode: (code) => findDealByCode(deals, code),
    };
  }, [deals, socialProof, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeals(): DealsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDeals must be used inside DealsProvider");
  return ctx;
}
