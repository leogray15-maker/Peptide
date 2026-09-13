import { ArrowRight, BookOpen, Download, FileText } from "lucide-react";
import { GUIDE } from "@/data/guide";
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

// Full-width band for the homepage.
export function GuideFeature() {
  return (
    <div
      className="rounded-xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <div>
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
            <Download size={13} /> {GUIDE.modules.length} modules · instant download
          </span>
        </div>
      </div>

      <div
        className="rounded-lg p-6"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={15} style={{ color: "var(--accent)" }} />
          <p className="label-upper">What&apos;s Inside</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {GUIDE.modules.map((m) => (
            <div key={m.title} className="flex items-start gap-2">
              <FileText size={13} className="shrink-0 mt-1" style={{ color: "var(--subtle)" }} />
              <p className="text-sm leading-snug" style={{ color: "var(--text)" }}>
                {m.title}
              </p>
            </div>
          ))}
        </div>
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
        written modules, from the beginners&apos; guide through GLP,
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
