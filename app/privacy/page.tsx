import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Privacy Policy" };

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Section>
      <SectionHead eyebrow="Legal" title="Privacy Policy" />
      <div className="max-w-3xl">
        <LegalSection title="1. Data Controller">
          <p>TODO: insert registered company name and address. We are registered under the UK GDPR as a data controller.</p>
        </LegalSection>
        <LegalSection title="2. Data We Collect">
          <p>We collect name, email address, shipping address, and order details when you place an order. We may collect browsing data via essential cookies.</p>
        </LegalSection>
        <LegalSection title="3. How We Use Your Data">
          <p>We use your data solely to process and fulfil orders, communicate about your order, and comply with legal obligations. We do not sell your data to third parties.</p>
        </LegalSection>
        <LegalSection title="4. Data Retention">
          <p>Order records are retained for 7 years for tax and legal compliance. You may request deletion of your personal data by contacting us.</p>
        </LegalSection>
        <LegalSection title="5. Your Rights">
          <p>Under UK GDPR you have rights to access, rectify, erase, and port your personal data. Contact info@arcanepeptides.co.uk to exercise these rights.</p>
        </LegalSection>
        <LegalSection title="6. Cookies">
          <p>We use essential cookies only by default. See our Cookie Policy for details. You can manage cookie preferences via the banner on your first visit.</p>
        </LegalSection>
        <LegalSection title="7. Contact">
          <p>Email: info@arcanepeptides.co.uk</p>
        </LegalSection>
      </div>
    </Section>
  );
}
