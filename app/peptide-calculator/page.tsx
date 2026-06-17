import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import PeptideCalculatorClient from "./PeptideCalculatorClient";

export const metadata: Metadata = {
  title: "Peptide Reconstitution Calculator",
  description: "Laboratory reconstitution calculator — compute peptide concentration, units per syringe graduation, and mg/mL ratios.",
};

export default function PeptideCalculatorPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Laboratory Tool"
        title="Peptide Reconstitution Calculator"
        subtitle="For laboratory measurement reference only. Not for human use guidance."
      />
      <div
        className="mb-8 p-4 rounded-lg text-xs leading-relaxed"
        style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)", color: "var(--muted)" }}
      >
        <strong style={{ color: "#E74C3C" }}>Research Reference Tool Only.</strong> This calculator
        is provided for laboratory measurement and reconstitution reference purposes only. It does not
        constitute dosing advice for humans or animals. Results must be validated by qualified
        research personnel before use in any experimental protocol.
      </div>
      <PeptideCalculatorClient />
    </Section>
  );
}
