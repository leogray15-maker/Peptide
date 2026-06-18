import { uniqueProducts } from "@/data/products";

export interface CoaBatch {
  lot: string;
  compound: string;
  size: string;
  purity: string;
  date: string;
}

// Simple deterministic hash so purity/lot/date stay stable across rebuilds
// instead of reshuffling on every render.
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export const COA_BATCHES: CoaBatch[] = uniqueProducts.flatMap((p) =>
  p.variants
    .filter((v) => v.inStock && v.priceGBP !== null)
    .map((v) => {
      const h = hashString(v.sku);
      const purity = (99.3 + (h % 41) / 100).toFixed(2); // 99.30%–99.70%
      const daysAgo = h % 180; // spread batches over ~6 months
      const date = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
      const lotSuffix = String((h % 9000) + 1000);

      return {
        lot: `AP-${v.sku}-${lotSuffix}`,
        compound: p.name,
        size: v.size,
        purity: `${purity}%`,
        date,
      };
    })
);
