import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Shipping Policy" };

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

export default function ShippingPolicyPage() {
  return (
    <Section>
      <SectionHead eyebrow="Legal" title="Shipping Policy" />
      <div className="max-w-3xl">
        <LegalSection title="Dispatch Time">
          <p>Orders are dispatched within 24 hours of payment confirmation on working days (Monday–Friday, excluding UK bank holidays). Orders confirmed after 12:00 on Friday dispatch the following Monday.</p>
        </LegalSection>
        <LegalSection title="UK Shipping">
          <p>UK orders are dispatched via Royal Mail Tracked 48 or Tracked 24. Free shipping on UK orders over £50. Orders below this threshold: shipping calculated at checkout.</p>
        </LegalSection>
        <LegalSection title="International Shipping">
          <p>We ship to selected EU and international destinations. International shipping rates are calculated at checkout based on destination and weight. Delivery times vary by destination.</p>
        </LegalSection>
        <LegalSection title="Import Duties & Taxes">
          <p>International orders may be subject to import duties and local taxes. These are the sole responsibility of the buyer. Arcane Peptides will not be responsible for delays caused by customs clearance.</p>
        </LegalSection>
        <LegalSection title="Import Compliance">
          <p>It is the buyer&apos;s sole responsibility to ensure that importation of research compounds is lawful in their jurisdiction before placing an order. Arcane Peptides accepts no liability for orders seized or refused by customs.</p>
        </LegalSection>
        <LegalSection title="Tracking">
          <p>A Royal Mail tracking number is emailed on dispatch. Use our Track Order tool or visit the Royal Mail website to check delivery status.</p>
        </LegalSection>
      </div>
    </Section>
  );
}
