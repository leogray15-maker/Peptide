"use client";
import { useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";

export default function HomeCatalogue({ products }: { products: Product[] }) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        No products to show.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} onQuickView={setQuickView} />
        ))}
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
