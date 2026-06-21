import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, Shield, Zap, Package, Microscope, Calculator } from "lucide-react";
import { uniqueProducts, getProductBySlug, POPULAR_SLUGS, type Product } from "@/data/products";
import { Section, SectionHead } from "@/components/ui/Section";
import { StatBlock } from "@/components/ui/StatBlock";
import { Tabs } from "@/components/ui/Tabs";
import HomeCatalogue from "@/components/home/HomeCatalogue";
import ReviewsStrip from "@/components/home/ReviewsStrip";
import RestockCapture from "@/components/home/RestockCapture";
import FormatSelector from "@/components/home/FormatSelector";
import ResearchHubTeaser from "@/components/home/ResearchHubTeaser";

export const metadata: Metadata = {
  title: "Arcane Peptides — Verified Research Compounds | UK",
  description:
    "HPLC-verified research peptides and compounds. Lyophilised for stability. Independent COA on every batch. UK-based. Research use only.",
};

const TRUST_ITEMS = [
  { icon: Shield,      label: "100% HPLC Verified",       desc: "Independent third-party purity analysis on every batch." },
  { icon: FlaskConical, label: "Lyophilised Stability",    desc: "Freeze-dried for maximum shelf life and compound integrity." },
  { icon: Zap,         label: "Dispatched Within 24 Hours", desc: "Orders placed by 12:00 Mon–Fri dispatched same day." },
];

const STACKS = [
  { name: "Tissue Support",     slug: "tissue-repair",               desc: "BPC-157 · TB-500 · GHK-Cu" },
  { name: "Metabolic Pathway",  slug: "glp1-metabolic",              desc: "Semaglutide · Tirzepatide · Retatrutide" },
  { name: "GH Axis",            slug: "gh-secretagogues",            desc: "Ipamorelin · CJC-1295 · Sermorelin" },
  { name: "Anti-Ageing",        slug: "anti-ageing",                 desc: "Epitalon · GHK-Cu · NAD+" },
  { name: "Cognitive",          slug: "cognitive",                   desc: "Selank · Semax · DSIP" },
  { name: "Reconstitution Kit", slug: "reconstitution-lab-supplies", desc: "Bacteriostatic water · Supplies" },
];

const STATS = [
  { value: "≥99%",  label: "Min. Purity" },
  { value: "100%",  label: "In-House Tested" },
  { value: "24hr",  label: "Dispatch Time" },
  { value: "EU+",   label: "Countries Shipped" },
];

export default function HomePage() {
  const staffPicks = uniqueProducts.filter((p) => p.badges?.includes("Staff Pick")).slice(0, 6);
  const restocked  = uniqueProducts.filter((p) => p.badges?.includes("Restocked")).slice(0, 6);
  const newItems   = uniqueProducts.slice(0, 6);
  const popular    = POPULAR_SLUGS
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center min-h-[68vh] px-4 sm:px-6 py-16 sm:py-20 overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(111,99,216,0.1) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1280px] mx-auto w-full">
          <p className="label-upper mb-6" style={{ color: "var(--accent)" }}>
            UK Research Compounds · HPLC Verified
          </p>

          <h1 className="display mb-3" style={{ maxWidth: "900px" }}>
            Elevate
          </h1>
          <p
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              color: "var(--accent)",
              letterSpacing: "-0.01em",
            }}
          >
            Arcane Peptides
          </p>

          <p className="text-base sm:text-lg mb-10 max-w-lg" style={{ color: "var(--muted)" }}>
            Beyond the Veil of Research — verified compounds, independent COA on every batch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded font-semibold tracking-wide transition-all hover:brightness-110 active:scale-95"
              style={{ background: "var(--accent)", color: "#fff", fontSize: "0.875rem", letterSpacing: "0.06em" }}
            >
              ACCESS CATALOGUE <ArrowRight size={16} />
            </Link>
            <Link
              href="/lab-tests"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded font-semibold tracking-wide border transition-colors hover:bg-[var(--surface)]"
              style={{ borderColor: "var(--line-med)", color: "var(--muted)", fontSize: "0.875rem", letterSpacing: "0.06em" }}
            >
              VIEW LAB REPORTS <FlaskConical size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Trust strip ───────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div
          className="max-w-[1280px] mx-auto px-4 sm:px-6 grid sm:grid-cols-3"
          style={{ borderColor: "var(--line)" }}
        >
          {TRUST_ITEMS.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className="flex items-start gap-4 py-7 px-4 sm:px-8"
              style={{ borderLeft: i > 0 ? "1px solid var(--line)" : undefined }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-dim)" }}
              >
                <Icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">{label}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Most Popular ─────────────────────────────────────────────────── */}
      {popular.length > 0 && (
        <Section>
          <SectionHead
            eyebrow="Selling Fast"
            title="Most Popular"
            subtitle="Our researchers' most-ordered compounds this season."
          />
          <HomeCatalogue products={popular} />
        </Section>
      )}

      {/* ── 3. Shop by Research Need ─────────────────────────────────────── */}
      <Section>
        <SectionHead
          eyebrow="Research Stacks"
          title="Shop by Research Need"
          subtitle="Purpose-grouped compound selections for streamlined procurement."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STACKS.map((s) => (
            <Link
              key={s.slug}
              href={`/shop/${s.slug}`}
              className="flex flex-col gap-2 p-4 rounded-lg border transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
              style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
            >
              <Microscope size={20} style={{ color: "var(--accent)" }} />
              <p className="font-semibold text-sm leading-tight" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                {s.name}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── 4. Stats band ────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <StatBlock stats={STATS} />
        </div>
      </div>

      {/* ── 5. Format ────────────────────────────────────────────────────── */}
      <Section>
        <SectionHead eyebrow="Format" title="How We Supply" />
        <FormatSelector />
      </Section>

      {/* ── 6. Catalogue highlights ──────────────────────────────────────── */}
      <Section>
        <SectionHead eyebrow="Catalogue" title="Selected Compounds" />
        <Tabs
          tabs={[
            { label: "Staff Picks",    content: <HomeCatalogue products={staffPicks} /> },
            { label: "Restocked",      content: <HomeCatalogue products={restocked.length > 0 ? restocked : staffPicks} /> },
            { label: "All Compounds",  content: <HomeCatalogue products={newItems} /> },
          ]}
        />
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm border transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--line-med)", color: "var(--text)" }}
          >
            View Full Catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* ── 7. Open-source purity ────────────────────────────────────────── */}
      <Section>
        <div
          className="rounded-xl p-8 sm:p-12 grid sm:grid-cols-2 gap-12 items-center"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <div>
            <p className="label-upper mb-3" style={{ color: "var(--accent)" }}>Verified Purity</p>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Open-Source Purity
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
              Every batch is independently tested by an accredited third-party laboratory.
              Certificates of Analysis are publicly accessible — lot-matched to your exact vial.
            </p>
            <Link
              href="/lab-tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              View Lab Reports <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔬", title: "Independent HPLC",    desc: "Third-party analysis — not self-certified." },
              { icon: "📄", title: "Downloadable COA",    desc: "PDF certificates for every batch number." },
              { icon: "🔒", title: "Lot-Matched",         desc: "Your vial is traceable to its exact COA." },
              { icon: "✓",  title: "≥99% Purity",        desc: "Minimum threshold on every compound." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-lg"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-xs mb-1">{item.title}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 8. Reviews ───────────────────────────────────────────────────── */}
      <Section>
        <SectionHead eyebrow="Customer Reviews" title="What Researchers Say" align="center" />
        <ReviewsStrip />
        <div className="mt-8 text-center">
          <Link href="/reviews" className="text-sm underline" style={{ color: "var(--accent)" }}>
            View all reviews
          </Link>
        </div>
      </Section>

      {/* ── 9. Utility teasers ───────────────────────────────────────────── */}
      <Section>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/peptide-calculator", icon: Calculator, title: "Peptide Calculator",   desc: "Reconstitution calculator — compute concentration, units per syringe, mg/mL ratios." },
            { href: "/storage-handling",   icon: Package,    title: "Storage & Handling",    desc: "Proper storage protocol for lyophilised vials, reconstituted solutions, and cartridges." },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-5 p-6 rounded-xl border transition-all hover:border-[var(--accent)]"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-dim)" }}
              >
                <Icon size={22} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── 10. Research Hub ─────────────────────────────────────────────── */}
      <Section>
        <SectionHead eyebrow="Research Hub" title="Latest Articles" />
        <ResearchHubTeaser />
        <div className="mt-8">
          <Link href="/research-hub" className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--accent)" }}>
            View all articles <ArrowRight size={14} />
          </Link>
        </div>
      </Section>

      {/* ── Restock alerts ───────────────────────────────────────────────── */}
      <Section>
        <RestockCapture />
      </Section>
    </>
  );
}
