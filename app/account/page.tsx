import type { Metadata } from "next";
import Link from "next/link";
import { UserCircle, Package, MessageCircle } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Arcane Peptides account.",
};

export default function AccountPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Account"
        title="Account"
        subtitle="Customer accounts are coming soon. In the meantime, you can track an existing order or get in touch."
      />

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        <Link
          href="/track-order"
          className="flex items-start gap-4 p-6 rounded-lg border transition-all hover:border-[var(--accent)]"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <Package size={22} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <div>
            <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Track an Order
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Look up the status of an order using your tracking number.
            </p>
          </div>
        </Link>

        <Link
          href="/contact"
          className="flex items-start gap-4 p-6 rounded-lg border transition-all hover:border-[var(--accent)]"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <MessageCircle size={22} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <div>
            <p className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Contact Us
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Questions about a past order, payment, or your account.
            </p>
          </div>
        </Link>
      </div>

      <div
        className="flex items-start gap-3 mt-8 p-4 rounded-lg max-w-2xl"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
      >
        <UserCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }} />
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Sign-in and order history are not yet available. Since we don&apos;t require an account to
          order, your order reference and confirmation details are all you need to track a purchase.
        </p>
      </div>
    </Section>
  );
}
