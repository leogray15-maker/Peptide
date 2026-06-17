import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { StatBlock } from "@/components/ui/StatBlock";

export const metadata: Metadata = {
  title: "About Arcane Peptides",
  description: "About Arcane Peptides — UK-based supplier of HPLC-verified research compounds.",
};

export default function AboutPage() {
  return (
    <>
      <Section>
        <SectionHead
          eyebrow="About"
          title="Beyond the Veil of Research"
          subtitle="Arcane Peptides is a UK-based supplier of independently verified research compounds for the scientific community."
        />

        <div className="grid sm:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Our Mission
            </h2>
            <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              <p>
                Arcane Peptides was founded with a single mandate: to supply the research community
                with the highest-quality, independently verified peptide compounds at competitive prices,
                with complete transparency of provenance.
              </p>
              <p>
                Every compound we supply undergoes independent HPLC analysis by an accredited
                third-party laboratory before it leaves our fulfilment facility. Every lot has a
                publicly accessible Certificate of Analysis.
              </p>
              <p>
                We sell exclusively to qualified researchers and institutions. Our products are research
                chemicals — not medicines — and our communications reflect that clearly and without
                ambiguity.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Our Standards
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                { icon: "🔬", text: "Independent HPLC purity testing on every batch" },
                { icon: "📄", text: "Publicly accessible, lot-matched Certificates of Analysis" },
                { icon: "🧊", text: "Lyophilised preparation for maximum stability" },
                { icon: "⚡", text: "Next working day dispatch on in-stock orders" },
                { icon: "✓",  text: "≥99% purity minimum — we do not ship below this threshold" },
                { icon: "🔒", text: "Strict research-use compliance — no medical claims made" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }}>
                  <span className="text-lg shrink-0">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <StatBlock
          stats={[
            { value: "≥99%", label: "Min. Purity" },
            { value: "100%", label: "Independently Tested" },
            { value: "24hr", label: "Dispatch Time" },
            { value: "EU+",  label: "Countries Served" },
          ]}
        />
      </Section>

      <Section>
        <div
          className="p-6 rounded-xl"
          style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)" }}
        >
          <p className="label-upper mb-3" style={{ color: "#E74C3C" }}>Research Use Only</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Arcane Peptides sells all products strictly for in-vitro laboratory research purposes only.
            None of our products are licensed medicines and they are not intended for human or
            veterinary administration. We do not provide medical advice. Company registration details:
            <strong style={{ color: "var(--text)" }}> TODO: insert company number, VAT number, and registered office address</strong>.
          </p>
        </div>
      </Section>
    </>
  );
}
