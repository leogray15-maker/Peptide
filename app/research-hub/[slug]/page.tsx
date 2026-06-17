import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// TODO: replace with CMS-driven content
const ARTICLE_CONTENT: Record<string, { title: string; category: string; date: string; body: string }> = {
  "understanding-glp1-receptor-agonists": {
    title: "Understanding GLP-1 Receptor Agonists in Research",
    category: "GLP-1 / Metabolic",
    date: "2025-06-01",
    body: `GLP-1 receptor agonists are a class of peptides that mimic the action of native glucagon-like peptide-1. In research contexts, these compounds are studied for their effects on pancreatic beta-cell function, gastric motility, and various metabolic pathways.\n\nSynthetic GLP-1 receptor agonists such as Semaglutide and Tirzepatide are frequently used in in-vitro research models studying insulin secretion, cellular signalling, and related metabolic mechanisms.\n\nThis article provides a neutral overview of the structural characteristics and studied mechanisms of this compound class for research reference only.`,
  },
  "bpc-157-research-applications": {
    title: "BPC-157: Research Applications and Molecular Mechanisms",
    category: "Tissue & Repair",
    date: "2025-05-15",
    body: `BPC-157 (Body Protection Compound-157) is a stable 15-amino acid pentadecapeptide fragment of the human gastric juice protein body protection compound. In vitro studies have examined its effects on angiogenesis, fibroblast proliferation, and connective tissue biology.\n\nThe compound is studied in cell culture models for its interactions with growth factor signalling pathways including VEGF and TGF-β, as well as its effects on nitric oxide synthesis and endothelial cell behaviour.\n\nThis article summarises the research context for BPC-157 for laboratory reference only.`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLE_CONTENT[slug];
  return {
    title: article?.title ?? "Research Article",
    description: article ? `${article.category} research article — Arcane Peptides Research Hub.` : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLE_CONTENT[slug];

  return (
    <Section>
      <Link href="/research-hub" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: "var(--muted)" }}>
        <ArrowLeft size={14} /> Back to Research Hub
      </Link>

      {article ? (
        <article className="max-w-3xl">
          <p className="label-upper mb-2" style={{ color: "var(--accent)" }}>{article.category}</p>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-syne), sans-serif", letterSpacing: "-0.02em" }}
          >
            {article.title}
          </h1>
          <p className="text-xs mb-8" style={{ color: "var(--muted)" }}>
            Published {new Date(article.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div
            className="mb-6 p-4 rounded-lg text-xs"
            style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)", color: "var(--muted)" }}
          >
            <strong style={{ color: "#E74C3C" }}>Research Reference Only.</strong> This article is for
            laboratory research reference purposes only. Nothing in this article constitutes medical
            advice, dosing guidance, or therapeutic recommendations.
          </div>

          <div className="flex flex-col gap-4 text-sm leading-loose" style={{ color: "var(--muted)" }}>
            {article.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Article Not Found
          </h1>
          <p style={{ color: "var(--muted)" }}>
            This article is not yet available. Check back soon or{" "}
            <Link href="/research-hub" className="underline" style={{ color: "var(--accent)" }}>
              browse all articles
            </Link>
            .
          </p>
        </div>
      )}
    </Section>
  );
}
