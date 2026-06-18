import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import LabTestsClient from "./LabTestsClient";

export const metadata: Metadata = {
  title: "Lab Tests / COA Portal",
  description: "Every Arcane Peptides batch has an independently verified Certificate of Analysis. Search by lot number or compound.",
};

// TODO: replace with real COA data — link to actual PDF files in /public/coa/
export const COA_BATCHES = [
  { lot: "AP-BPC-001-0624", compound: "BPC-157", size: "5 mg", purity: "99.4%", date: "2024-06-10", pdf: "/coa/placeholder-bpc157.pdf" },
  { lot: "AP-TB5-001-0624", compound: "TB-500", size: "5 mg", purity: "99.2%", date: "2024-06-10", pdf: "/coa/placeholder-tb500.pdf" },
  { lot: "AP-GHK-001-0624", compound: "GHK-Cu", size: "50 mg", purity: "99.7%", date: "2024-06-01", pdf: "/coa/placeholder-ghkcu.pdf" },
  { lot: "AP-SEM-001-0524", compound: "Semaglutide", size: "5 mg", purity: "99.1%", date: "2024-05-20", pdf: "/coa/placeholder-semaglutide.pdf" },
  { lot: "AP-IPM-001-0524", compound: "Ipamorelin", size: "5 mg", purity: "99.5%", date: "2024-05-15", pdf: "/coa/placeholder-ipamorelin.pdf" },
  { lot: "AP-EPT-001-0524", compound: "Epitalon", size: "10 mg", purity: "99.3%", date: "2024-05-10", pdf: "/coa/placeholder-epitalon.pdf" },
  { lot: "AP-NAD-001-0424", compound: "NAD+", size: "100 mg", purity: "99.0%", date: "2024-04-22", pdf: "/coa/placeholder-nad.pdf" },
  { lot: "AP-MOT-001-0424", compound: "MOTS-c", size: "10 mg", purity: "99.6%", date: "2024-04-15", pdf: "/coa/placeholder-motsc.pdf" },
];

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
            { icon: "✓",  title: "≥99% Purity Guarantee", desc: "We do not ship any batch that fails our 99% minimum purity threshold." },
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
