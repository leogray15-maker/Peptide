import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Cookie Policy" };

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

export default function CookiesPolicyPage() {
  return (
    <Section>
      <SectionHead eyebrow="Legal" title="Cookie Policy" />
      <div className="max-w-3xl">
        <LegalSection title="What Are Cookies">
          <p>Cookies are small text files stored on your device when you visit a website. We use cookies to make this site function correctly.</p>
        </LegalSection>
        <LegalSection title="Essential Cookies">
          <p>We use the following essential cookies which are required for the site to operate:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>arcane_age_verified</strong> — Stores your age verification acknowledgement.</li>
            <li><strong>arcane_terms_accepted</strong> — Stores your research-use disclaimer acceptance.</li>
            <li><strong>arcane_cookie_consent</strong> — Stores your cookie preference.</li>
            <li><strong>arcane_cart_v1</strong> — Stores your cart contents in localStorage.</li>
            <li><strong>arcane_announce_dismissed</strong> — Stores whether you have dismissed the announcement bar.</li>
          </ul>
          <p className="mt-2">These cannot be disabled as they are required for core functionality.</p>
        </LegalSection>
        <LegalSection title="Analytics Cookies">
          <p>We do not set analytics or tracking cookies without your explicit consent. If you select &ldquo;Accept all&rdquo; in the cookie banner, we may set anonymised analytics cookies (TODO: specify service if implemented).</p>
        </LegalSection>
        <LegalSection title="Managing Cookies">
          <p>You can clear cookies at any time via your browser settings. Clearing essential cookies will reset your age verification and terms acceptance on your next visit.</p>
        </LegalSection>
        <LegalSection title="Contact">
          <p>Cookie-related queries: info@arcanepeptides.co.uk</p>
        </LegalSection>
      </div>
    </Section>
  );
}
