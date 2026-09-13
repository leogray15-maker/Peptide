"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, Star, Eye, X } from "lucide-react";
import { uniqueProducts, POPULAR_SLUGS, type Product, type Variant } from "@/data/products";
import { SHOPPER_NAMES, SHOPPER_CITIES } from "@/data/socialProof";
import { useDeals } from "@/contexts/DealsContext";

type Kind = "checkout" | "order" | "review" | "viewing";

interface ProofEvent {
  id: number;
  kind: Kind;
  message: string;
  meta: string;
}

const DISMISS_KEY = "arcane_social_proof_dismissed";

const KIND_META: Record<Kind, { icon: typeof ShoppingCart; color: string }> = {
  checkout: { icon: ShoppingCart, color: "var(--amber)" },
  order:    { icon: Package,      color: "var(--green)" },
  review:   { icon: Star,         color: "var(--accent)" },
  viewing:  { icon: Eye,          color: "var(--muted)" },
};

// Anything sellable: in stock with a real price.
interface Sellable {
  product: Product;
  variant: Variant;
}

const SELLABLE: Sellable[] = uniqueProducts.flatMap((product) =>
  product.variants
    .filter((v) => v.inStock && v.priceGBP !== null)
    .map((variant) => ({ product, variant }))
);

// Best-sellers appear more often than the long tail, the way real orders do.
const WEIGHTED: Sellable[] = [
  ...SELLABLE,
  ...SELLABLE.filter((s) => POPULAR_SLUGS.includes(s.product.slug)),
  ...SELLABLE.filter((s) => POPULAR_SLUGS.includes(s.product.slug)),
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function describe({ product, variant }: Sellable): string {
  return `${product.name} ${variant.size}`;
}

function buildEvent(id: number): ProofEvent {
  const name = pick(SHOPPER_NAMES);
  const city = pick(SHOPPER_CITIES);
  const first = pick(WEIGHTED);
  const minutes = randomInt(1, 47);
  const ago = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;

  // Weighted towards purchases — that's the signal worth showing.
  const roll = Math.random();

  if (roll < 0.22) {
    return {
      id,
      kind: "checkout",
      message: `${name} from ${city} is at checkout`,
      meta: "Just now",
    };
  }

  if (roll < 0.4) {
    return {
      id,
      kind: "viewing",
      message: `${name} is viewing ${describe(first)}`,
      meta: "Just now",
    };
  }

  if (roll < 0.5) {
    return {
      id,
      kind: "review",
      message: `${name} left a 5★ review on ${first.product.name}`,
      meta: ago,
    };
  }

  // A multi-line order — "X ordered KPV 10 mg and BPC-157 10 mg".
  if (roll < 0.72) {
    let second = pick(WEIGHTED);
    for (let i = 0; i < 5 && second.variant.sku === first.variant.sku; i++) {
      second = pick(WEIGHTED);
    }
    if (second.variant.sku !== first.variant.sku) {
      return {
        id,
        kind: "order",
        message: `${name} ordered ${describe(first)} and ${describe(second)}`,
        meta: `${city} · ${ago}`,
      };
    }
  }

  // A single line, sometimes more than one vial.
  const qty = randomInt(1, 3);
  return {
    id,
    kind: "order",
    message:
      qty > 1
        ? `${name} ordered ${qty} × ${describe(first)}`
        : `${name} ordered ${describe(first)}`,
    meta: `${city} · ${ago}`,
  };
}

export default function SocialProofPopup() {
  const pathname = usePathname();
  const { socialProof } = useDeals();
  const [event, setEvent] = useState<ProofEvent | null>(null);
  // Dismissal lasts for the browsing session only. Read once, on the first
  // render, so no effect has to write state back.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(DISMISS_KEY) !== null;
    } catch {
      // private mode / storage disabled — just keep showing popups
      return false;
    }
  });
  const counter = useRef(0);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setEvent(null);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  }, []);

  const onAdmin = pathname?.startsWith("/admin") ?? false;
  const active = socialProof.enabled && !dismissed && !onAdmin && SELLABLE.length > 0;

  // One self-rescheduling timer chain: show a popup, hide it, wait a random
  // gap, repeat. Everything is cleaned up when the settings or route change.
  useEffect(() => {
    if (!active) return;

    const { initialDelaySec, minGapSec, maxGapSec, visibleSec } = socialProof;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const schedule = (delayMs: number) => {
      showTimer = setTimeout(() => {
        counter.current += 1;
        setEvent(buildEvent(counter.current));
        hideTimer = setTimeout(() => {
          setEvent(null);
          schedule(randomInt(minGapSec, maxGapSec) * 1000);
        }, visibleSec * 1000);
      }, delayMs);
    };

    schedule(initialDelaySec * 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      setEvent(null);
    };
  }, [active, socialProof]);

  if (!active || !event) return null;

  const { icon: Icon, color } = KIND_META[event.kind];

  return (
    <div
      // Keyed on the event so each popup replays the entrance animation.
      key={event.id}
      className="social-proof-pop fixed bottom-6 left-4 sm:left-6 z-40 max-w-[19rem] flex items-start gap-3 p-3 pr-8 rounded-lg shadow-lg"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-med)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
      }}
      role="status"
      aria-live="polite"
    >
      <span
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full"
        style={{ background: "var(--surface-2)", color }}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-xs leading-snug" style={{ color: "var(--text)" }}>
          {event.message}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--subtle)" }}>
          {event.meta} · Verified by Arcane
        </p>
      </div>

      <button
        onClick={dismiss}
        aria-label="Hide activity notifications"
        className="absolute top-2 right-2 p-1 rounded transition-colors hover:bg-[var(--surface-2)]"
        style={{ color: "var(--subtle)" }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
