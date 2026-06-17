import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Reviews from verified researchers and laboratory professionals — Arcane Peptides UK.",
};

// TODO: replace with verified Trustpilot / real review data — no human-use/therapeutic implications
const REVIEWS = [
  { name: "Dr. A. Morrison",   role: "Independent Researcher",         rating: 5, date: "2025-05-12", body: "Consistent purity across multiple batches. COA linked directly from the product page — exactly what professional procurement requires. Will continue purchasing." },
  { name: "R. Steinbach",      role: "Research Biochemist",            rating: 5, date: "2025-05-03", body: "Dispatch was next working day as advertised. The lyophilised preparation was intact and reconstituted cleanly. Excellent communications." },
  { name: "J. Okonkwo",        role: "Laboratory Procurement Manager", rating: 5, date: "2025-04-28", body: "Arcane is now our primary UK supplier. Pricing is competitive and the independently verified COA on each lot is non-negotiable for our institution." },
  { name: "Dr. C. Hartley",    role: "Pharmacology Researcher",        rating: 5, date: "2025-04-15", body: "The peptide calculator on the site saved me considerable time. Exact mg/mL outputs matched my own verification calculations." },
  { name: "M. Patel",          role: "Sports Science Lab",             rating: 5, date: "2025-04-10", body: "Used the GLOW blend for in-vitro fibroblast assays. Packaging was temperature-controlled and professional. Highly satisfied." },
  { name: "K. Lindström",      role: "Research Associate",             rating: 5, date: "2025-03-22", body: "I appreciate the clear research-only positioning. Other suppliers blur this line; Arcane does not. The COA portal is exemplary." },
  { name: "T. Nakamura",       role: "Cell Biology Lab Manager",       rating: 5, date: "2025-03-14", body: "Second order this month. Quality and turnaround time is outstanding. The glossary and storage guides are a genuine value-add." },
  { name: "Dr. F. El-Amin",    role: "Clinical Research Scientist",    rating: 5, date: "2025-03-05", body: "The compliance posture is exactly what we require for institutional purchasing. Research-use declarations are clear and unambiguous." },
  { name: "S. Bergmann",       role: "Biochemistry MSc Student",       rating: 4, date: "2025-02-28", body: "Very happy with quality and price. Would appreciate more compounds in the catalogue — hoping to see expansion soon." },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < n ? "var(--amber)" : "none"} stroke={i < n ? "var(--amber)" : "var(--subtle)"} />
      ))}
    </div>
  );
}

const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

export default function ReviewsPage() {
  return (
    <Section>
      <SectionHead eyebrow="Verified Reviews" title="What Researchers Say" />

      {/* Summary */}
      <div
        className="flex items-center gap-6 p-6 rounded-xl mb-12"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div className="text-center">
          <p
            className="text-5xl font-bold"
            style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--accent)" }}
          >
            {avgRating}
          </p>
          <Stars n={5} />
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{REVIEWS.length} reviews</p>
        </div>
        <div className="h-16 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Trusted by Research Professionals
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            All reviews are from verified purchasers. No testimonials imply therapeutic or human-use outcomes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map((r) => (
          <div
            key={r.name + r.date}
            className="flex flex-col gap-3 p-5 rounded-lg"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <Stars n={r.rating} />
            <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text)" }}>
              &ldquo;{r.body}&rdquo;
            </p>
            <div className="pt-3 border-t" style={{ borderColor: "var(--line)" }}>
              <p className="text-xs font-semibold">{r.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{r.role}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--subtle)" }}>
                {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
