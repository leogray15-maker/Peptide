import Link from "next/link";
import { ArrowRight } from "lucide-react";

// TODO: replace with CMS-driven articles
const ARTICLES = [
  {
    slug: "understanding-glp1-receptor-agonists",
    category: "GLP-1 / Metabolic",
    title: "Understanding GLP-1 Receptor Agonists in Research",
    excerpt: "A neutral overview of GLP-1 receptor agonist peptides and their role in current metabolic pathway research.",
    date: "2025-06-01",
  },
  {
    slug: "bpc-157-research-applications",
    category: "Tissue & Repair",
    title: "BPC-157: Research Applications and Molecular Mechanisms",
    excerpt: "Examining BPC-157's studied roles in angiogenesis, mucosal protection, and connective tissue biology.",
    date: "2025-05-15",
  },
  {
    slug: "peptide-storage-best-practices",
    category: "Laboratory Guide",
    title: "Peptide Storage: Best Practices for Research Labs",
    excerpt: "Cold-chain management, lyophilisation benefits, reconstitution protocols, and stability considerations.",
    date: "2025-05-01",
  },
  {
    slug: "nad-plus-cellular-biology",
    category: "Cellular / Longevity",
    title: "NAD+ in Cellular Biology: A Research Overview",
    excerpt: "Reviewing the role of nicotinamide adenine dinucleotide in sirtuin pathways, DNA repair, and metabolic research.",
    date: "2025-04-20",
  },
];

export default function ResearchHubTeaser() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ARTICLES.map((a) => (
        <Link
          key={a.slug}
          href={`/research-hub/${a.slug}`}
          className="flex flex-col gap-3 p-5 rounded-lg border transition-all hover:border-[var(--accent)]"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <p className="label-upper" style={{ color: "var(--accent)" }}>{a.category}</p>
          <h3
            className="font-bold text-sm leading-tight"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            {a.title}
          </h3>
          <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
            {a.excerpt}
          </p>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
            Read more <ArrowRight size={11} />
          </span>
        </Link>
      ))}
    </div>
  );
}
