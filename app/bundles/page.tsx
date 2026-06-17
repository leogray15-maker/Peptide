import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { uniqueProducts } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Research Bundles & Stacks",
  description: "Pre-formulated multi-compound research blends. HPLC-verified, lyophilised, independent COA.",
};

export default function BundlesPage() {
  const blends = uniqueProducts.filter((p) => p.category === "Blends & Stacks");

  return (
    <Section>
      <SectionHead
        eyebrow="Research Stacks"
        title="Bundles & Blends"
        subtitle="Purpose-formulated multi-compound research preparations in a single lyophilised vial."
      />

      <div
        className="mb-10 p-5 rounded-lg"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Each Arcane Peptides blend is lyophilised as a single combined preparation. All constituent
          compounds are independently HPLC-verified. A Certificate of Analysis covering the full blend
          is available for each lot number on our{" "}
          <a href="/lab-tests" className="underline" style={{ color: "var(--accent)" }}>
            Lab Tests portal
          </a>
          .
        </p>
      </div>

      {blends.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No bundles currently available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blends.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </Section>
  );
}
