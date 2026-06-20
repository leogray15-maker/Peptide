import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function FormatSelector() {
  return (
    <div className="max-w-xl mx-auto">
      {/* Lyophilised Vials */}
      <div
        className="flex flex-col gap-4 p-6 rounded-xl border"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-dim)" }}
        >
          <FlaskConical size={24} style={{ color: "var(--accent)" }} />
        </div>

        <div>
          <p className="label-upper mb-1" style={{ color: "var(--accent)" }}>Recommended</p>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Lyophilised Vials
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Freeze-dried powder for maximum stability at ambient temperature. Reconstitute with
            bacteriostatic water before use. Suitable for all standard lab environments.
          </p>
        </div>

        <ul className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
          {["Room-temperature stable (unopened)", "Reconstitution required", "Longest shelf life", "All research compounds available"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span style={{ color: "var(--green)" }}>✓</span> {item}
            </li>
          ))}
        </ul>

        <Link
          href="/shop?format=Lyophilised+Vial"
          className="mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Browse Lyophilised Vials
        </Link>
      </div>
    </div>
  );
}
