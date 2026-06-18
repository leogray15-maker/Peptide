import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Mail, MessageSquare } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Arcane Peptides — UK research compound supplier.",
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <Section>
      <SectionHead
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="For ordering enquiries, bulk quotes, or general questions."
      />

      <div className="grid sm:grid-cols-2 gap-12">
        {/* Contact options */}
        <div className="flex flex-col gap-6">
          <div
            className="p-5 rounded-xl flex items-start gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-dim)" }}
            >
              <Mail size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Email</p>
              <a
                href="mailto:info@arcanepeptides.co.uk"
                className="text-sm underline"
                style={{ color: "var(--accent)" }}
              >
                info@arcanepeptides.co.uk
              </a>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Response within 1 working day
              </p>
            </div>
          </div>

          <div
            className="p-5 rounded-xl flex items-start gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(37,211,102,0.1)" }}
            >
              <MessageSquare size={18} style={{ color: "#25D366" }} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">WhatsApp</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: "#25D366" }}>
                Message us on WhatsApp
              </a>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {WHATSAPP_NUMBER} · Mon–Fri 09:00–17:00
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg text-xs leading-relaxed"
            style={{ background: "var(--surface-2)", color: "var(--muted)" }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>Please note:</p>
            We cannot provide dosing advice, medical guidance, or recommendations on specific compounds
            for personal use. All enquiries must relate to laboratory research applications.
          </div>
        </div>

        {/* Contact form */}
        <ContactForm />
      </div>
    </Section>
  );
}
