import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHead } from "@/components/ui/Section";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Hub — Articles & Resources",
  description: "Research articles, compound overviews, and laboratory guides from Arcane Peptides.",
};

// TODO: replace with CMS-driven article data
const ARTICLES = [
  { slug: "understanding-glp1-receptor-agonists", category: "GLP-1 / Metabolic", title: "Understanding GLP-1 Receptor Agonists in Research", excerpt: "A neutral overview of GLP-1 receptor agonist peptides and their role in current metabolic pathway research.", date: "2025-06-01" },
  { slug: "bpc-157-research-applications",        category: "Tissue & Repair",    title: "BPC-157: Research Applications and Molecular Mechanisms", excerpt: "Examining BPC-157's studied roles in angiogenesis, mucosal protection, and connective tissue biology.", date: "2025-05-15" },
  { slug: "peptide-storage-best-practices",       category: "Laboratory Guide",   title: "Peptide Storage: Best Practices for Research Labs", excerpt: "Cold-chain management, lyophilisation benefits, reconstitution protocols, and stability considerations.", date: "2025-05-01" },
  { slug: "nad-plus-cellular-biology",            category: "Cellular / Longevity", title: "NAD+ in Cellular Biology: A Research Overview", excerpt: "Reviewing the role of nicotinamide adenine dinucleotide in sirtuin pathways, DNA repair, and metabolic research.", date: "2025-04-20" },
  { slug: "gh-axis-secretagogues",                category: "GH Axis",            title: "GH Axis Secretagogues: An Overview of Research Peptides", excerpt: "Ipamorelin, CJC-1295, GHRP-6, and Sermorelin — mechanisms studied in growth hormone axis research.", date: "2025-04-10" },
  { slug: "epitalon-telomerase-research",         category: "Anti-Ageing",        title: "Epitalon and Telomerase: Research Context", excerpt: "The tetrapeptide Ala-Glu-Asp-Gly and its studied relationship with telomerase activation and bioregulation.", date: "2025-03-28" },
];

export default function ResearchHubPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Research Hub"
        title="Articles & Resources"
        subtitle="Neutral, research-context overviews of compounds and laboratory practices. No therapeutic or clinical claims made."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/research-hub/${a.slug}`}
            className="flex flex-col gap-3 p-5 rounded-xl border transition-all hover:border-[var(--accent)]"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <p className="label-upper" style={{ color: "var(--accent)" }}>{a.category}</p>
            <h2 className="font-bold text-base leading-snug" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              {a.title}
            </h2>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
              {a.excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--line)" }}>
              <span className="text-xs" style={{ color: "var(--subtle)" }}>
                {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                Read <ArrowRight size={11} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
