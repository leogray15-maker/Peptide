import Link from "next/link";
import { FlaskConical, ShieldCheck, ArrowRight } from "lucide-react";

const POINTS = [
  "Room-temperature stable (unopened)",
  "Longest shelf life",
  "Reconstitute fresh, on demand",
  "All research compounds available",
];

export default function FormatSelector() {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <div className="grid md:grid-cols-2">
        {/* Left — the format */}
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-dim)" }}
          >
            <FlaskConical size={24} style={{ color: "var(--accent)" }} />
          </div>

          <div>
            <p className="label-upper mb-1" style={{ color: "var(--accent)" }}>Lyophilised Powder Only</p>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Supplied as Lyophilised Vials
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Every compound ships as a freeze-dried (lyophilised) powder — never pre-mixed or
              pre-reconstituted. You reconstitute fresh with bacteriostatic water, so you control
              sterility, concentration and handling from the start.
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm self-start transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Browse the Catalogue <ArrowRight size={15} />
          </Link>
        </div>

        {/* Right — why / points */}
        <div
          className="p-6 sm:p-8 flex flex-col gap-4 border-t md:border-t-0 md:border-l"
          style={{ borderColor: "var(--line)", background: "var(--surface-2)" }}
        >
          <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
            {POINTS.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span style={{ color: "var(--green)" }}>✓</span> {item}
              </li>
            ))}
          </ul>

          <div
            className="mt-auto flex items-start gap-3 p-4 rounded-lg text-xs leading-relaxed"
            style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)" }}
          >
            <ShieldCheck size={18} className="shrink-0 mt-0.5" style={{ color: "var(--green)" }} />
            <span>
              <strong style={{ color: "var(--text)" }}>Health &amp; safety:</strong> we do not sell
              pre-mixed or pre-filled solutions. Lyophilised powder is the most stable format and
              avoids the cold-chain and contamination risks of pre-reconstituted products.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
