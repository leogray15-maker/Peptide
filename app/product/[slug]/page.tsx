"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductBySlug, getProductsByCategory, type Variant } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { Badge, PRODUCT_BADGE_MAP } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { PriceGate } from "@/components/ui/PriceGate";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { BULK_TIERS, getBulkDiscount } from "@/lib/config";
import ProductCard from "@/components/shop/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const maybeProduct = getProductBySlug(slug);
  if (!maybeProduct) notFound();
  const product = maybeProduct;

  const { addItem } = useCart();
  const { format } = useCurrency();
  const { user } = useAuth();

  const [selectedSku, setSelectedSku] = useState<string>(
    product.variants.find((v) => v.inStock && v.priceGBP !== null)?.sku ??
    product.variants[0]?.sku ?? ""
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const selected: Variant | undefined = product.variants.find((v) => v.sku === selectedSku);
  const discount = getBulkDiscount(qty);
  const basePrice = selected?.priceGBP ?? null;
  const finalPrice = basePrice !== null ? basePrice * (1 - discount / 100) : null;

  // Related products (same category, excluding self)
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  // Images — use placeholder when none supplied
  const images: string[] = product.image ? [product.image] : [];

  function handleAdd() {
    if (!selected || selected.priceGBP === null || !selected.inStock) return;
    addItem({
      productSlug: product.slug,
      variantSku: selected.sku,
      name: product.name,
      variantLabel: selected.size,
      priceGBP: selected.priceGBP * (1 - discount / 100),
      qty,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
        <Link href="/shop" style={{ color: "var(--muted)" }}>Shop</Link>
        <span style={{ color: "var(--subtle)" }}>/</span>
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          style={{ color: "var(--muted)" }}
        >
          {product.category}
        </Link>
        <span style={{ color: "var(--subtle)" }}>/</span>
        <span style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* ── Image gallery ── */}
        <div>
          <div
            className="relative aspect-square rounded-lg overflow-hidden mb-3"
            style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
          >
            {images.length > 0 ? (
              <Image
                src={images[imgIdx]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                  className="opacity-10"
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

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIdx((i) => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImgIdx(i)}
                  className="relative w-16 h-16 rounded overflow-hidden border"
                  style={{ borderColor: i === imgIdx ? "var(--accent)" : "var(--line)" }}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Purchase panel ── */}
        <div className="flex flex-col gap-6">
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <Badge key={b} variant={PRODUCT_BADGE_MAP[b] as never}>{b}</Badge>
              ))}
            </div>
          )}

          <div>
            <p className="label-upper mb-1" style={{ color: "var(--accent)" }}>
              {product.category}
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-syne), sans-serif", letterSpacing: "-0.02em" }}
            >
              {product.name}
            </h1>
            {product.synonyms && product.synonyms.length > 0 && (
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                Also known as: {product.synonyms.join(", ")}
              </p>
            )}
          </div>

          {/* Purity badge */}
          {product.purityMin && (
            <div className="flex items-center gap-2">
              <Badge variant="green">≥ {product.purityMin}% Purity</Badge>
              <Badge variant="accent">HPLC Verified</Badge>
              {product.coaAvailable && (
                <Badge variant="outline">COA Available</Badge>
              )}
            </div>
          )}

          {/* Variant selector */}
          {product.variants.length > 0 && (
            <div>
              <p className="label-upper mb-3">
                Size
                {selected && (
                  <span className="ml-2 normal-case font-normal" style={{ color: "var(--muted)", letterSpacing: 0 }}>
                    — {selected.size}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedSku(v.sku)}
                    disabled={!v.inStock}
                    className="px-4 py-2 rounded text-sm font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: selectedSku === v.sku ? "var(--accent)" : "var(--line-med)",
                      color: selectedSku === v.sku ? "var(--accent)" : "var(--muted)",
                      background: selectedSku === v.sku ? "var(--accent-dim)" : "transparent",
                    }}
                    aria-pressed={selectedSku === v.sku}
                  >
                    {v.size}
                    {!v.inStock && <span className="ml-1 text-[10px]">(OOS)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: selected?.inStock ? "var(--green)" : "var(--red)" }}
            />
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {selected?.inStock ? "In Stock — Dispatched within 24 hours" : "Out of Stock"}
            </span>
          </div>

          {/* Price + quantity */}
          <div>
            {finalPrice !== null ? (
              <PriceGate size="lg">
                <div className="flex items-end gap-3">
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    {format(finalPrice)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span
                        className="text-xl line-through"
                        style={{ color: "var(--muted)" }}
                      >
                        {format(basePrice!)}
                      </span>
                      <Badge variant="green">{discount}% off</Badge>
                    </>
                  )}
                </div>
              </PriceGate>
            ) : (
              <p style={{ color: "var(--muted)" }}>Price on enquiry — contact us</p>
            )}
          </div>

          {/* Qty stepper + add to cart */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center border rounded overflow-hidden"
              style={{ borderColor: "var(--line-med)" }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-3 transition-colors hover:bg-[var(--surface-2)] text-lg"
                style={{ color: "var(--muted)" }}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span
                className="px-4 py-3 font-semibold min-w-[3rem] text-center"
                style={{ color: "var(--text)" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-3 transition-colors hover:bg-[var(--surface-2)] text-lg"
                style={{ color: "var(--muted)" }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {user ? (
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={!selected?.inStock || finalPrice === null}
                className="flex-1"
              >
                <ShoppingCart size={18} />
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </Button>
            ) : (
              <Link
                href="/account"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Sign In to Order
              </Link>
            )}
          </div>

          {/* Bulk discount table */}
          {finalPrice !== null && (
            <PriceGate>
              <div>
                <p className="label-upper mb-3">Volume Discounts</p>
                <Table
                  keyField="minQty"
                  compact
                  columns={[
                    { header: "Qty", accessor: (r) => `${r.minQty}–${r.maxQty === Infinity ? "+" : r.maxQty}` },
                    { header: "Discount", accessor: (r) => `${r.discountPct}%` },
                    {
                      header: "Price/unit",
                      accessor: (r) => format(basePrice! * (1 - r.discountPct / 100)),
                      align: "right",
                    },
                  ]}
                  rows={BULK_TIERS}
                />
              </div>
            </PriceGate>
          )}

          {/* Trust signals */}
          <div
            className="flex flex-col gap-2 p-4 rounded-lg"
            style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-start gap-3">
              <Shield size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Every vial corresponds to an independently verified Certificate of Analysis (COA) on our{" "}
                <Link href="/lab-tests" className="underline" style={{ color: "var(--accent)" }}>
                  Lab Tests portal
                </Link>
                .
              </p>
            </div>
            {product.reconstitutionNote && (
              <div className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">⚗</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {product.reconstitutionNote} ·{" "}
                  <Link href="/peptide-calculator" className="underline" style={{ color: "var(--accent)" }}>
                    Use our reconstitution calculator
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Compound data block ── */}
      <div
        className="rounded-lg p-6 sm:p-8 mb-12"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <p className="label-upper mb-6">Compound Data</p>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
          <DataRow label="Full Name" value={product.name} />
          {product.synonyms && <DataRow label="Synonyms / Also Known As" value={product.synonyms.join(", ")} />}
          {product.molecularFormula && <DataRow label="Molecular Formula" value={product.molecularFormula} />}
          <DataRow label="Presentation" value={product.format} />
          {selected && <DataRow label="Quantity per Vial" value={selected.size} />}
          {product.purityMin && <DataRow label="Min. Purity" value={`≥ ${product.purityMin}%`} />}
          {product.storageNote && <DataRow label="Storage" value={product.storageNote} fullWidth />}
        </div>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
          <p className="label-upper mb-2">Research Context</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {product.description}
          </p>
        </div>

        {/* Per-product RUO notice */}
        <div
          className="mt-6 p-4 rounded-lg text-xs leading-relaxed"
          style={{
            background: "rgba(231,76,60,0.06)",
            border: "1px solid rgba(231,76,60,0.2)",
            color: "var(--muted)",
          }}
        >
          <strong style={{ color: "#E74C3C" }}>RESEARCH USE ONLY.</strong> This product is sold
          strictly for in-vitro laboratory research. Not for human or veterinary use. No medical
          advice is given. Purchaser assumes full responsibility for lawful use.{" "}
          {product.coaAvailable && (
            <Link href="/lab-tests" className="underline" style={{ color: "var(--accent)" }}>
              View Certificate of Analysis →
            </Link>
          )}
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div>
          <p className="label-upper mb-2">Related Compounds</p>
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            You May Also Research
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DataRow({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="label-upper mb-0.5">{label}</p>
      <p className="text-sm" style={{ color: "var(--text)" }}>{value}</p>
    </div>
  );
}
