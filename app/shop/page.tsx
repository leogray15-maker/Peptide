"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid, List, LayoutGrid } from "lucide-react";
import { uniqueProducts, CATEGORIES, type Category, type ProductBadge } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import type { Product } from "@/data/products";

type SortKey = "default" | "name-asc" | "name-desc" | "price-asc" | "price-desc";
type ShowCount = 24 | 48 | 96;

function ShopContent() {
  const searchParams = useSearchParams();

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [filterCategory, setFilterCategory] = useState<Category | "">((searchParams.get("category") as Category) ?? "");
  const [filterInStock, setFilterInStock] = useState<"all" | "in" | "out">("all");
  const [filterBadge, setFilterBadge] = useState<ProductBadge | "">((searchParams.get("badge") as ProductBadge) ?? "");
  const [sort, setSort] = useState<SortKey>((searchParams.get("sort") as SortKey) ?? "default");
  const [show, setShow] = useState<ShowCount>(24);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compare, setCompare] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = uniqueProducts.filter((p) => {
      // Category
      if (filterCategory && p.category !== filterCategory) return false;

      // Badge
      if (filterBadge && !p.badges?.includes(filterBadge)) return false;

      // Stock
      const hasStock = p.variants.some((v) => v.inStock);
      if (filterInStock === "in" && !hasStock) return false;
      if (filterInStock === "out" && hasStock) return false;

      // Price (by cheapest variant with a price)
      const cheapest = p.variants.find((v) => v.priceGBP !== null)?.priceGBP;
      if (cheapest !== undefined && cheapest !== null) {
        if (cheapest < priceMin || cheapest > priceMax) return false;
      }

      return true;
    });

    // Sort
    switch (sort) {
      case "name-asc":  list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case "price-asc": list = [...list].sort((a, b) => {
        const ap = a.variants.find((v) => v.priceGBP !== null)?.priceGBP ?? Infinity;
        const bp = b.variants.find((v) => v.priceGBP !== null)?.priceGBP ?? Infinity;
        return ap - bp;
      }); break;
      case "price-desc": list = [...list].sort((a, b) => {
        const ap = a.variants.find((v) => v.priceGBP !== null)?.priceGBP ?? -Infinity;
        const bp = b.variants.find((v) => v.priceGBP !== null)?.priceGBP ?? -Infinity;
        return bp - ap;
      }); break;
    }

    return list;
  }, [filterCategory, filterBadge, filterInStock, priceMin, priceMax, sort]);

  const paginated = filtered.slice(0, page * show);
  const hasMore = paginated.length < filtered.length;

  function toggleCompare(slug: string) {
    setCompare((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 4 ? [...prev, slug] : prev
    );
  }

  function resetFilters() {
    setFilterCategory("");
    setFilterBadge("");
    setFilterInStock("all");
    setPriceMin(0);
    setPriceMax(500);
    setSort("default");
    setPage(1);
  }

  const inStockCount = uniqueProducts.filter((p) => p.variants.some((v) => v.inStock)).length;
  const outOfStockCount = uniqueProducts.filter((p) => p.variants.every((v) => !v.inStock)).length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="label-upper mb-2">Research Compounds</p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Full Catalogue
        </h1>
      </div>

      {/* Mobile filter overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex gap-8">
        {/* ── Sidebar ── */}
        <aside
          className={`w-64 shrink-0 lg:block lg:static lg:z-auto lg:translate-x-0 lg:bg-transparent lg:border-0 lg:p-0 lg:max-w-none fixed top-0 left-0 z-50 h-full max-w-[85vw] overflow-y-auto p-6 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ background: "var(--bg)", borderRight: "1px solid var(--line)" }}
          aria-label="Filter sidebar"
        >
          <div className="flex flex-col gap-6 lg:sticky lg:top-20">
            <div className="flex items-center justify-between">
              <p className="label-upper">Filters</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={resetFilters}
                  className="text-xs underline"
                  style={{ color: "var(--muted)" }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-xs"
                  style={{ color: "var(--muted)" }}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="label-upper mb-3">Price (GBP)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={priceMax}
                  value={priceMin}
                  onChange={(e) => { setPriceMin(+e.target.value); setPage(1); }}
                  className="w-full rounded px-2 py-1.5 text-sm border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
                  aria-label="Minimum price"
                />
                <span style={{ color: "var(--muted)" }}>–</span>
                <input
                  type="number"
                  min={priceMin}
                  max={1000}
                  value={priceMax}
                  onChange={(e) => { setPriceMax(+e.target.value); setPage(1); }}
                  className="w-full rounded px-2 py-1.5 text-sm border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <p className="label-upper mb-3">Availability</p>
              <div className="flex flex-col gap-2">
                {(["all", "in", "out"] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      checked={filterInStock === v}
                      onChange={() => { setFilterInStock(v); setPage(1); }}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {v === "all" ? `All (${uniqueProducts.length})` :
                       v === "in"  ? `In Stock (${inStockCount})` :
                                     `Out of Stock (${outOfStockCount})`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="label-upper mb-3">Category</p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => { setFilterCategory(""); setPage(1); }}
                  className="text-left text-sm py-1 transition-colors"
                  style={{ color: filterCategory === "" ? "var(--accent)" : "var(--muted)" }}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setPage(1); }}
                    className="text-left text-sm py-1 transition-colors"
                    style={{ color: filterCategory === cat ? "var(--accent)" : "var(--muted)" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div>
              <p className="label-upper mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {(["Selling fast", "New", "Restocked", "Staff Pick"] as ProductBadge[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => { setFilterBadge(filterBadge === b ? "" : b); setPage(1); }}
                    className="px-2.5 py-1 rounded text-xs font-semibold border transition-colors"
                    style={{
                      borderColor: filterBadge === b ? "var(--accent)" : "var(--line-med)",
                      color: filterBadge === b ? "var(--accent)" : "var(--muted)",
                      background: filterBadge === b ? "var(--accent-dim)" : "transparent",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div
            className="flex flex-wrap items-center gap-3 pb-4 mb-6 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 text-sm px-3 py-2 rounded border"
              style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="ml-auto flex items-center gap-3">
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
                className="text-sm rounded px-3 py-2 border"
                style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
                aria-label="Sort by"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>

              {/* Show */}
              <select
                value={show}
                onChange={(e) => { setShow(+e.target.value as ShowCount); setPage(1); }}
                className="text-sm rounded px-2 py-2 border"
                style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
                aria-label="Items per page"
              >
                {([24, 48, 96] as const).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>

              {/* Grid / List */}
              <div
                className="flex border rounded overflow-hidden"
                style={{ borderColor: "var(--line-med)" }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className="p-2 transition-colors"
                  aria-label="Grid view"
                  style={{
                    background: viewMode === "grid" ? "var(--surface-2)" : "transparent",
                    color: viewMode === "grid" ? "var(--text)" : "var(--muted)",
                  }}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="p-2 transition-colors"
                  aria-label="List view"
                  style={{
                    background: viewMode === "list" ? "var(--surface-2)" : "transparent",
                    color: viewMode === "list" ? "var(--text)" : "var(--muted)",
                  }}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Compare bar */}
          {compare.length > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3 mb-6 rounded-lg border"
              style={{ background: "var(--accent-dim)", borderColor: "var(--accent)" }}
            >
              <p className="text-sm" style={{ color: "var(--accent)" }}>
                {compare.length} product{compare.length !== 1 ? "s" : ""} selected for comparison
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCompare([])}
                  className="text-xs underline"
                  style={{ color: "var(--muted)" }}
                >
                  Clear
                </button>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Compare
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
              <p className="text-lg mb-2">No results found</p>
              <button onClick={resetFilters} className="text-sm underline" style={{ color: "var(--accent)" }}>
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col gap-3"
                }
              >
                {paginated.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    onQuickView={setQuickView}
                    compareSelected={compare.includes(product.slug)}
                    onCompareToggle={toggleCompare}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-8 py-3 rounded border font-semibold text-sm transition-colors hover:bg-[var(--surface-2)]"
                    style={{ borderColor: "var(--line-med)", color: "var(--text)" }}
                  >
                    Load more ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
