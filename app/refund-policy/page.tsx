import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Refund Policy" };

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <Section>
      <SectionHead eyebrow="Legal" title="Refund Policy" />
      <div className="max-w-3xl">
        <LegalSection title="Eligibility for Returns">
          <p>Unopened products in original, undamaged condition may be returned within 14 days of receipt. Due to the nature of research chemicals, opened products cannot be returned unless there is a verifiable quality defect.</p>
        </LegalSection>
        <LegalSection title="Quality Issues">
          <p>If you receive a product that is damaged, incorrectly dispatched, or fails to meet the purity specification on its COA, contact us within 48 hours of receipt with your order number and photographic evidence. We will arrange replacement or refund at no charge.</p>
        </LegalSection>
        <LegalSection title="Refund Process">
          <p>Approved refunds are processed within 5 working days to the original payment method (bank transfer / original crypto wallet).</p>
        </LegalSection>
        <LegalSection title="Non-Returnable Items">
          <p>Opened research chemicals, items returned beyond 14 days, and items returned without prior approval are not eligible for refund.</p>
        </LegalSection>
        <LegalSection title="Contact">
          <p>Email info@arcanepeptides.co.uk with subject line &ldquo;Return Request — [Your Order ID]&rdquo;.</p>
        </LegalSection>
      </div>
    </Section>
  );
}
