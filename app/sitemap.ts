import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { uniqueProducts, CATEGORY_SLUGS } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date().toISOString();

  const staticRoutes = [
    "",
    "/shop",
    "/bundles",
    "/lab-tests",
    "/peptide-calculator",
    "/research-hub",
    "/storage-handling",
    "/glossary",
    "/faq",
    "/reviews",
    "/about",
    "/contact",
    "/track-order",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/shipping-policy",
    "/cookies-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const productRoutes = uniqueProducts.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryRoutes = Object.values(CATEGORY_SLUGS).map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
