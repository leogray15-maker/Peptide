import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_SLUGS, getProductsByCategory, type Category } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

interface Props {
  params: Promise<{ category: string }>;
}

function getCategoryFromSlug(slug: string): Category | undefined {
  return (Object.entries(CATEGORY_SLUGS) as [Category, string][]).find(
    ([, s]) => s === slug
  )?.[0];
}

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = getCategoryFromSlug(slug);
  if (!cat) return {};
  return {
    title: cat,
    description: `Browse ${cat} research compounds — HPLC-verified, lyophilised vials. UK-based.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
        <Link href="/shop" style={{ color: "var(--muted)" }}>Shop</Link>
        <span style={{ color: "var(--subtle)" }}>/</span>
        <span style={{ color: "var(--text)" }}>{category}</span>
      </nav>

      <div className="mb-8">
        <p className="label-upper mb-2">Category</p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          {category}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {products.length} compound{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
