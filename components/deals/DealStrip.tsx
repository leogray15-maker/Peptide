"use client";
import { Tag } from "lucide-react";
import { useDeals } from "@/contexts/DealsContext";
import { dealHeadline } from "@/lib/deals";
import { useCurrency } from "@/contexts/CurrencyContext";

// Lists the deals currently running, so shoppers see them before they reach the
// order summary. Code-gated deals are deliberately left out — they're only for
// customers who have the code.
export default function DealStrip({ className = "" }: { className?: string }) {
  const { activeDeals } = useDeals();
  const { format } = useCurrency();

  if (activeDeals.length === 0) return null;

  return (
    <div
      className={`p-4 rounded-lg flex flex-col gap-2 ${className}`}
      style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)" }}
    >
      {activeDeals.map((deal) => (
        <div key={deal.id} className="flex items-start gap-2.5">
          <Tag size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--text)" }}>
            {dealHeadline(deal)}
            {deal.minSpendGBP > 0 && (
              <span style={{ color: "var(--muted)" }}>
                {" "}— on orders over {format(deal.minSpendGBP)}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
