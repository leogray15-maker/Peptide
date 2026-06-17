"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { Badge, PRODUCT_BADGE_MAP } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  compareSelected?: boolean;
  onCompareToggle?: (slug: string) => void;
}

export default function ProductCard({
  product,
  onQuickView,
  compareSelected,
  onCompareToggle,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { format } = useCurrency();
  const [addedSku, setAddedSku] = useState<string | null>(null);

  const inStockVariants = product.variants.filter((v) => v.inStock);
  const cheapestVariant =
    inStockVariants.find((v) => v.priceGBP !== null) ??
    product.variants.find((v) => v.priceGBP !== null);

  const displayPrice = cheapestVariant?.priceGBP ?? null;
  const hasMultipleVariants = product.variants.length > 1;

  function handleQuickAdd() {
    if (!cheapestVariant || cheapestVariant.priceGBP === null) return;
    addItem({
      productSlug: product.slug,
      variantSku: cheapestVariant.sku,
      name: product.name,
      variantLabel: cheapestVariant.size,
      priceGBP: cheapestVariant.priceGBP,
      qty: 1,
      image: product.image,
    });
    setAddedSku(cheapestVariant.sku);
    setTimeout(() => setAddedSku(null), 1800);
  }

  const isAllOutOfStock = product.variants.every((v) => !v.inStock);

  return (
    <article
      className="group relative flex flex-col rounded-lg overflow-hidden transition-all duration-200 hover:border-[var(--line-med)]"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      {/* Compare toggle */}
      {onCompareToggle && (
        <label className="absolute top-3 left-3 z-10 flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!compareSelected}
            onChange={() => onCompareToggle(product.slug)}
            className="accent-[var(--accent)] w-3.5 h-3.5"
          />
          <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>
            Compare
          </span>
        </label>
      )}

      {/* Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {product.badges.map((b) => (
            <Badge key={b} variant={PRODUCT_BADGE_MAP[b] as never}>
              {b}
            </Badge>
          ))}
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[var(--surface-2)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="opacity-20"
            >
              <polygon
                points="14,2 26,8 26,20 14,26 2,20 2,8"
                stroke="var(--accent)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="14" cy="14" r="2.5" fill="var(--accent)" />
            </svg>
          </div>
        )}

        {/* Quick-view overlay */}
        {onQuickView && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold"
              style={{ background: "var(--surface)", color: "var(--text)" }}
            >
              <Eye size={13} /> Quick View
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="label-upper" style={{ color: "var(--accent)" }}>
          {product.category}
        </p>

        <Link
          href={`/product/${product.slug}`}
          className="font-semibold text-sm leading-tight hover:text-[var(--accent)] transition-colors"
          style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}
        >
          {product.name}
        </Link>

        {product.purityMin && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            ≥ {product.purityMin}% Purity · HPLC Verified
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {isAllOutOfStock ? (
              <span className="text-sm" style={{ color: "var(--muted)" }}>Out of stock</span>
            ) : displayPrice !== null ? (
              <div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {hasMultipleVariants ? "from " : ""}
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {format(displayPrice)}
                </span>
              </div>
            ) : (
              <span className="text-sm" style={{ color: "var(--muted)" }}>Price on enquiry</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="Add to wishlist"
              className="p-1.5 rounded transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--muted)" }}
            >
              <Heart size={14} />
            </button>

            {isAllOutOfStock || displayPrice === null ? (
              <Link
                href={`/product/${product.slug}`}
                className="px-3 py-1.5 rounded text-xs font-semibold border transition-colors hover:bg-[var(--surface-2)]"
                style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
              >
                {hasMultipleVariants ? "Select" : "View"}
              </Link>
            ) : hasMultipleVariants ? (
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <ShoppingCart size={13} /> Options
              </Link>
            ) : (
              <Button size="sm" onClick={handleQuickAdd} className="text-xs">
                {addedSku ? (
                  "Added ✓"
                ) : (
                  <>
                    <ShoppingCart size={13} /> Add
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
