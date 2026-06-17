import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Thermometer, Sun, Droplets, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Storage & Handling",
  description: "Proper storage and handling protocols for lyophilised peptide vials and reconstituted research compounds.",
};

const PROTOCOLS = [
  {
    icon: Thermometer,
    heading: "Unopened Lyophilised Vials",
    points: [
      "Store at –20 °C (standard laboratory freezer) for optimal long-term stability.",
      "Some compounds may be stored at 2–8 °C (refrigerated) for up to 3 months — refer to your specific COA.",
      "Avoid temperature cycling. Repeated freeze-thaw reduces peptide integrity.",
      "GLP-1 class peptides (Semaglutide, Tirzepatide, etc.) are most stable at –20 °C.",
    ],
  },
  {
    icon: Droplets,
    heading: "Reconstituted Solutions",
    points: [
      "After reconstitution, store at 2–8 °C (refrigerated). Do not refreeze.",
      "Use within 14–28 days of reconstitution depending on compound — refer to your COA.",
      "Keep sterile: use aseptic technique throughout reconstitution.",
      "Bacteriostatic water (0.9% benzyl alcohol) extends stability post-reconstitution vs. sterile water.",
    ],
  },
  {
    icon: Sun,
    heading: "Light Protection",
    points: [
      "All peptide vials must be protected from direct light and UV exposure.",
      "Store in original amber or foil-wrapped vials where provided.",
      "GHK-Cu and melanocortin peptides are particularly light-sensitive.",
      "Minimise exposure time during reconstitution and handling.",
    ],
  },
  {
    icon: Clock,
    heading: "Shelf Life",
    points: [
      "Lyophilised compounds: typically 2 years from manufacture date at –20 °C.",
      "Reconstituted solutions: 14–28 days refrigerated (varies by compound).",
      "Open bacteriostatic water vials: discard after 28 days.",
      "Check the lot-specific COA for compound-specific stability data.",
    ],
  },
  {
    icon: AlertTriangle,
    heading: "Pre-filled Cartridges (Special Handling)",
    points: [
      "Require continuous cold chain: 2–8 °C at all times.",
      "Do not freeze — freezing will irreversibly damage the pre-filled formulation.",
      "Must be received via cold-chain delivery and logged in a monitored refrigerator.",
      "Discard any cartridge that has been above 8 °C for more than 6 hours.",
    ],
  },
];

export default function StorageHandlingPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Laboratory Protocol"
        title="Storage & Handling"
        subtitle="Correct storage conditions are essential for research compound integrity. Read before use."
      />

      <div className="flex flex-col gap-6">
        {PROTOCOLS.map(({ icon: Icon, heading, points }) => (
          <div
            key={heading}
            className="p-6 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-dim)" }}
              >
                <Icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                {heading}
              </h2>
            </div>
            <ul className="flex flex-col gap-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                  <span className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>›</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="mt-8 p-4 rounded-lg text-xs leading-relaxed"
        style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)", color: "var(--muted)" }}
      >
        <strong style={{ color: "#E74C3C" }}>Research Use Only.</strong> Storage protocols are provided
        for laboratory reference only. These compounds are not for human or veterinary use. Arcane
        Peptides accepts no liability for improper storage or handling.
      </div>
    </Section>
  );
}
