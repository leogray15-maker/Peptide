"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ExternalLink } from "lucide-react";
import type { Product } from "@/data/products";
import { Modal } from "@/components/ui/Modal";
import { Badge, PRODUCT_BADGE_MAP } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { format } = useCurrency();
  const [selectedSku, setSelectedSku] = useState<string>(product?.variants[0]?.sku ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const selected = product.variants.find((v) => v.sku === selectedSku) ?? product.variants[0];

  function handleAdd() {
    if (!selected || selected.priceGBP === null || !selected.inStock) return;
    addItem({
      productSlug: product!.slug,
      variantSku: selected.sku,
      name: product!.name,
      variantLabel: selected.size,
      priceGBP: selected.priceGBP,
      qty,
      image: product!.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Modal open={!!product} onClose={onClose} size="lg">
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div
          className="relative aspect-square bg-[var(--surface-2)] flex items-center justify-center"
          style={{ minHeight: 260 }}
        >
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            <svg width="80" height="80" viewBox="0 0 28 28" fill="none" className="opacity-15" aria-hidden>
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
              <circle cx="14" cy="14" r="2.5" fill="var(--accent)" />
            </svg>
          )}
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <p className="label-upper mb-1" style={{ color: "var(--accent)" }}>{product.category}</p>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              {product.name}
            </h3>
            {product.purityMin && (
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                ≥ {product.purityMin}% Purity · HPLC Verified
              </p>
            )}
          </div>

          {product.badges && (
            <div className="flex flex-wrap gap-1">
              {product.badges.map((b) => (
                <Badge key={b} variant={PRODUCT_BADGE_MAP[b] as never}>{b}</Badge>
              ))}
            </div>
          )}

          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {product.description}
          </p>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div>
              <p className="label-upper mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedSku(v.sku)}
                    disabled={!v.inStock}
                    className="px-3 py-1.5 rounded text-xs font-semibold border transition-colors disabled:opacity-40"
                    style={{
                      borderColor: selectedSku === v.sku ? "var(--accent)" : "var(--line-med)",
                      color: selectedSku === v.sku ? "var(--accent)" : "var(--muted)",
                      background: selectedSku === v.sku ? "var(--accent-dim)" : "transparent",
                    }}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price + qty */}
          <div className="flex items-center gap-4">
            <div>
              {selected?.priceGBP !== null && selected?.priceGBP !== undefined ? (
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {format(selected.priceGBP)}
                </span>
              ) : (
                <span style={{ color: "var(--muted)" }}>Price on enquiry</span>
              )}
            </div>

            <div
              className="flex items-center border rounded overflow-hidden"
              style={{ borderColor: "var(--line-med)" }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--muted)" }}
              >
                –
              </button>
              <span className="px-3 py-2 text-sm font-medium min-w-[2.5rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--muted)" }}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={!selected?.inStock || selected?.priceGBP === null}
              className="flex-1"
            >
              <ShoppingCart size={16} />
              {added ? "Added ✓" : "Add to Cart"}
            </Button>
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded font-semibold text-sm border transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
            >
              <ExternalLink size={14} />
              Full Page
            </Link>
          </div>

          <div
            className="p-3 rounded text-xs leading-relaxed"
            style={{ background: "var(--surface-2)", color: "var(--muted)" }}
          >
            ⚗ Research use only. Not for human or veterinary use.
          </div>
        </div>
      </div>
    </Modal>
  );
}
