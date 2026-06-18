import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { COA_BATCHES } from "@/lib/coa";
import LabTestsClient from "./LabTestsClient";

export const metadata: Metadata = {
  title: "Lab Tests / COA Portal",
  description: "Every Arcane Peptides batch has an independently verified Certificate of Analysis. Search by lot number or compound.",
};

export default function LabTestsPage() {
  return (
    <>
      <Section>
        <SectionHead
          eyebrow="Verified Purity"
          title="Lab Tests & COA Portal"
          subtitle="Every vial corresponds to a publicly accessible, independently verified Certificate of Analysis. Search by batch lot or compound name."
        />

        {/* Explainer */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "🔬", title: "Independent Testing", desc: "All batches are analysed by an accredited third-party HPLC laboratory — never self-reported." },
            { icon: "📄", title: "Lot-Matched COA", desc: "Every vial has a unique lot number that maps directly to its COA. Your vial is traceable." },
            { icon: "✓",  title: "≥99.3% Purity Guarantee", desc: "We do not ship any batch that fails our 99.3% minimum purity threshold." },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-lg"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <p className="font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <LabTestsClient batches={COA_BATCHES} />
      </Section>
    </>
  );
}
