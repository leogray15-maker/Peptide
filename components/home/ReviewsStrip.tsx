import { Star } from "lucide-react";

// TODO: replace with real verified reviews — no therapeutic claims, no human use implications
const REVIEWS = [
  {
    name: "Lily Carter",
    role: "Verified Researcher",
    rating: 5,
    body: "Consistent purity across multiple batches. COA linked directly from the product page — exactly what professional procurement requires.",
  },
  {
    name: "Ethan Reid",
    role: "Research Biochemist",
    rating: 5,
    body: "Dispatch was next working day as advertised. The lyophilised preparation was intact and reconstituted cleanly. Will reorder.",
  },
  {
    name: "Jamie Osborne",
    role: "Lab Procurement Lead",
    rating: 5,
    body: "Arcane is now our primary UK supplier. Pricing is competitive and the independently verified COA on each lot is non-negotiable for our institution.",
  },
  {
    name: "Sophie Bennett",
    role: "Pharmacology Researcher",
    rating: 5,
    body: "The peptide calculator on the site saved me considerable time. Exact mg/mL outputs matched my own calculations.",
  },
  {
    name: "Marcus Hale",
    role: "Sports Science Lab",
    rating: 5,
    body: "Used the GLOW blend for in-vitro fibroblast assays. Packaging was temperature-controlled and professional.",
  },
  {
    name: "Priya Shah",
    role: "Research Associate",
    rating: 5,
    body: "I appreciate the clear research-only positioning. Other suppliers blur this line; Arcane does not.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < n ? "var(--amber)" : "none"}
          stroke={i < n ? "var(--amber)" : "var(--subtle)"}
        />
      ))}
    </div>
  );
}

export default function ReviewsStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {REVIEWS.map((r) => (
        <div
          key={r.name}
          className="flex flex-col gap-3 p-5 rounded-lg"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <Stars n={r.rating} />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            &ldquo;{r.body}&rdquo;
          </p>
          <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--line)" }}>
            <p className="text-xs font-semibold">{r.name}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{r.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
