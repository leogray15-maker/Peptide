"use client";
import { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Download, FileText } from "lucide-react";
import { GUIDE, GUIDE_LESSON_COUNT } from "@/data/guide";
import { formatPrice } from "@/lib/config";

// The guide is paid for on Stripe, not through the site checkout, so every CTA
// here is an external link rather than an add-to-cart.
function CtaLabel() {
  return (
    <>
      Get Instant Access
      {GUIDE.priceGBP !== null && <span> — {formatPrice(GUIDE.priceGBP)}</span>}
      <ArrowRight size={15} />
    </>
  );
}

// Modules expand to show the lessons inside them. A module whose lesson list
// hasn't been supplied yet is shown as a plain, non-expandable row.
function ModuleList() {
  // Collapsed by default — the homepage band stays compact until a shopper
  // asks for detail.
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col divide-y" style={{ borderColor: "var(--line)" }}>
      {GUIDE.modules.map((module) => {
        const expandable = module.lessons.length > 0;
        const isOpen = expandable && open === module.title;

        return (
          <div key={module.title}>
            {expandable ? (
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : module.title)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2.5 py-2.5 text-left"
              >
                <FileText size={13} className="shrink-0" style={{ color: "var(--accent)" }} />
                <span className="flex-1 text-sm leading-snug" style={{ color: "var(--text)" }}>
                  {module.title}
                </span>
                <span className="text-[11px] shrink-0" style={{ color: "var(--subtle)" }}>
                  {module.lessons.length} lessons
                </span>
                <ChevronDown
                  size={14}
                  className="shrink-0 transition-transform duration-200"
                  style={{ color: "var(--muted)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
            ) : (
              <div className="flex items-center gap-2.5 py-2.5">
                <FileText size={13} className="shrink-0" style={{ color: "var(--subtle)" }} />
                <span className="flex-1 text-sm leading-snug" style={{ color: "var(--text)" }}>
                  {module.title}
                </span>
              </div>
            )}

            {isOpen && (
              // Long modules (Peptide Breakdowns runs to 41) split into two
              // columns so the panel doesn't become a wall of text.
              <ul
                className={`pb-3 pl-6 ${
                  module.lessons.length > 12
                    ? "sm:columns-2 sm:gap-6"
                    : "flex flex-col gap-1.5"
                }`}
              >
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson}
                    className="text-xs leading-snug flex gap-2 break-inside-avoid mb-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    <span style={{ color: "var(--subtle)" }}>·</span>
                    {lesson}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Full-width band for the homepage.
export function GuideFeature() {
  return (
    <div
      className="rounded-xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <div className="lg:sticky lg:top-24">
        <p className="label-upper mb-3" style={{ color: "var(--accent)" }}>
          Digital Guide
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-syne), sans-serif", letterSpacing: "-0.02em" }}
        >
          {GUIDE.name}
        </h2>
        <p className="text-lg mb-4" style={{ color: "var(--accent)" }}>
          {GUIDE.tagline}
        </p>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
          {GUIDE.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={GUIDE.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <CtaLabel />
          </a>
          <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--subtle)" }}>
            <Download size={13} /> {GUIDE.modules.length} modules ·{" "}
            {GUIDE_LESSON_COUNT}+ lessons
          </span>
        </div>
      </div>

      <div
        className="rounded-lg p-5 sm:p-6"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={15} style={{ color: "var(--accent)" }} />
          <p className="label-upper">What&apos;s Inside</p>
        </div>
        <ModuleList />
      </div>
    </div>
  );
}

// Compact upsell for the cart and the order-confirmation screen.
export function GuideUpsell({
  heading = "Add the guide to your research",
  className = "",
}: {
  heading?: string;
  className?: string;
}) {
  return (
    <div
      className={`p-5 rounded-lg ${className}`}
      style={{ background: "var(--surface)", border: "1px solid var(--line-med)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={15} style={{ color: "var(--accent)" }} />
        <p className="label-upper">{heading}</p>
      </div>

      <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
        {GUIDE.name} — {GUIDE.tagline}
      </p>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
        {GUIDE.modules.length}{" "}
        modules and {GUIDE_LESSON_COUNT}+ lessons, from the beginners&apos; guide through GLP,
        stacking, bioregulators, nootropics and bloodwork. Instant digital download, bought
        separately from your order.
      </p>

      <a
        href={GUIDE.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <CtaLabel />
      </a>
    </div>
  );
}
