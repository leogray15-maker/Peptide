import Link from "next/link";
import Logo from "./Logo";
import { SITE_TAGLINE } from "@/lib/config";

const COLS = [
  {
    heading: "Support",
    links: [
      { label: "About", href: "/about" },
      { label: "Lab Tests / COA", href: "/lab-tests" },
      { label: "Research Articles", href: "/research-hub" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "Bundles & Stacks", href: "/bundles" },
      { label: "Customer Reviews", href: "/reviews" },
      { label: "Compound Glossary", href: "/glossary" },
      { label: "Peptide Calculator", href: "/peptide-calculator" },
      { label: "Storage & Handling", href: "/storage-handling" },
      { label: "Track Your Order", href: "/track-order" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Cookie Policy", href: "/cookies-policy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24"
      style={{ borderTop: "1px solid var(--line)", background: "var(--surface)" }}
    >
      {/* Critical notice */}
      <div
        className="px-4 sm:px-6 py-5 text-xs leading-relaxed"
        style={{
          background: "rgba(231,76,60,0.07)",
          borderBottom: "1px solid rgba(231,76,60,0.2)",
          color: "var(--muted)",
        }}
      >
        <p className="label-upper mb-2" style={{ color: "#E74C3C" }}>
          Disclaimer
        </p>
        <p className="max-w-4xl">
          All peptide products (lyophilised powders) and related materials provided by{" "}
          <strong style={{ color: "var(--text)" }}>Arcane Peptides</strong> are strictly
          intended for laboratory research use only. These compounds are not for human or
          veterinary consumption, and no dosing, medical, or therapeutic guidance is supplied
          or implied. Arcane Peptides operates in full accordance with UK regulations
          governing Research-Only chemical supply — all products are supplied exclusively
          for in-vitro, pre-clinical, and scientific research purposes. We are{" "}
          <strong style={{ color: "var(--text)" }}>not</strong> a pharmacy and do not
          endorse, promote, or recommend the use of any product for personal or clinical
          application. Customers must review our{" "}
          <a href="/terms" className="underline" style={{ color: "var(--text)" }}>
            Terms &amp; Conditions
          </a>{" "}
          prior to purchase, must be 18 years of age or older, and must be purchasing for
          scientific research only.
        </p>
      </div>

      {/* Main columns */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-10">
        {/* Brand col */}
        <div className="col-span-2 sm:col-span-1">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {SITE_TAGLINE}
          </p>
          <p className="mt-4 text-xs" style={{ color: "var(--subtle)" }}>
            HPLC-Verified · Lyophilised · UK-Based
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.heading}>
            <p className="label-upper mb-4">{col.heading}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--muted)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-2 text-xs"
        style={{ borderTop: "1px solid var(--line)", color: "var(--subtle)" }}
      >
        <p>© {year} Arcane Peptides Ltd. All rights reserved.</p>
        <span className="hidden sm:block">·</span>
        {/* TODO: insert company number / VAT / registered office */}
        <p>Company No. TODO · VAT No. TODO · Registered in England & Wales</p>
      </div>
    </footer>
  );
}
