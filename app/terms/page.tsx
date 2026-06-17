import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <Section>
      <SectionHead eyebrow="Legal" title="Terms & Conditions" />
      <div className="max-w-3xl prose-legal">
        <LegalSection title="1. Research Use Only">
          <p>All products sold by Arcane Peptides are supplied exclusively for in-vitro laboratory research use only. They are not licensed medicinal products and are not intended for administration to humans or animals. By purchasing you confirm you are a qualified researcher and will use products only for lawful laboratory research.</p>
        </LegalSection>
        <LegalSection title="2. Age Restriction">
          <p>You must be 18 years of age or older to purchase from this site.</p>
        </LegalSection>
        <LegalSection title="3. Eligibility">
          <p>Products may only be purchased by researchers, scientific institutions, or laboratory professionals for legitimate research purposes. Arcane Peptides reserves the right to refuse any order at its discretion.</p>
        </LegalSection>
        <LegalSection title="4. Pricing and Payment">
          <p>All prices are in GBP unless otherwise stated. We accept bank transfer and cryptocurrency. Orders are processed once payment is confirmed. We reserve the right to change prices at any time without notice.</p>
        </LegalSection>
        <LegalSection title="5. Shipping">
          <p>We aim to dispatch within 24 hours of payment confirmation on working days. Shipping times are estimates and not guaranteed. Risk passes to the buyer upon dispatch. See our Shipping Policy for full details.</p>
        </LegalSection>
        <LegalSection title="6. Returns and Refunds">
          <p>Returns are accepted on unopened items in original condition within 14 days of receipt, subject to verification. Opened research chemicals cannot be returned for safety reasons unless there is a verifiable quality defect. See our Refund Policy for details.</p>
        </LegalSection>
        <LegalSection title="7. Limitation of Liability">
          <p>Arcane Peptides shall not be liable for any loss or damage arising from the misuse of research compounds or failure to comply with applicable laws. Our total liability shall not exceed the value of the relevant order.</p>
        </LegalSection>
        <LegalSection title="8. Governing Law">
          <p>These terms are governed by the laws of England and Wales. Disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </LegalSection>
        <LegalSection title="9. Contact">
          <p>TODO: insert registered company name, number, VAT number, and registered office address.</p>
          <p>Email: info@arcanepeptides.co.uk</p>
        </LegalSection>
      </div>
    </Section>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}
