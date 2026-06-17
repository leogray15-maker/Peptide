import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import GlossaryClient from "./GlossaryClient";

export const metadata: Metadata = {
  title: "Compound Glossary",
  description: "A–Z glossary of research peptide and compound names, abbreviations, and synonyms.",
};

export const GLOSSARY_TERMS = [
  { term: "5-Amino-1MQ", abbr: "5AM", def: "A small-molecule NNMT (nicotinamide N-methyltransferase) inhibitor studied in metabolic and cellular energy research.", category: "Metabolic" },
  { term: "AOD9604", abbr: "HGH-Frag 176-191", def: "A synthetic fragment of human growth hormone (residues 176–191), studied in metabolic pathway research.", category: "Metabolic" },
  { term: "ARA-290", abbr: "Cibinetide", def: "A non-haematopoietic erythropoietin peptide analogue studied in neuroprotection and anti-inflammatory research.", category: "Tissue & Repair" },
  { term: "Bacteriostatic Water", abbr: "BW", def: "Sterile water containing 0.9% benzyl alcohol used as a diluent for reconstituting lyophilised peptides.", category: "Supplies" },
  { term: "BPC-157", abbr: "Body Protection Compound-157", def: "A stable 15-amino acid gastric pentadecapeptide fragment studied in angiogenesis, connective tissue, and mucosal protection research.", category: "Tissue & Repair" },
  { term: "Cagrilintide", abbr: "AM833", def: "A long-acting amylin analogue studied in metabolic and satiety-pathway research.", category: "Metabolic" },
  { term: "Cerebrolysin", abbr: "FPF 1070", def: "A neurotrophic peptide mixture from porcine brain tissue studied in neuroprotection and cognitive research.", category: "Cognitive" },
  { term: "CJC-1295 (no DAC)", abbr: "Modified GRF 1-29", def: "A GHRH analogue with a short half-life, studied in pulsatile GH secretion research.", category: "GH Axis" },
  { term: "CJC-1295 (with DAC)", abbr: "DAC:GRF", def: "A GHRH analogue with a Drug Affinity Complex modification extending its half-life, studied in sustained GH-axis research.", category: "GH Axis" },
  { term: "COA", abbr: "Certificate of Analysis", def: "A document issued by an accredited laboratory that verifies the identity, purity, and potency of a research compound batch.", category: "Quality" },
  { term: "DSIP", abbr: "Delta Sleep Inducing Peptide", def: "A neuropeptide studied in sleep regulation, stress response, and neuroendocrine research.", category: "Cognitive" },
  { term: "Epitalon", abbr: "Epithalon", def: "A synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied in telomerase activation, circadian rhythm regulation, and bioregulator research.", category: "Anti-Ageing" },
  { term: "GHK-Cu", abbr: "Copper Peptide GHK", def: "A naturally occurring copper tripeptide studied in skin biology, collagen synthesis, and tissue remodelling research.", category: "Anti-Ageing" },
  { term: "GHRP-6", abbr: "Growth Hormone Releasing Peptide-6", def: "A synthetic hexapeptide GH secretagogue studied in ghrelin receptor and GH-axis research.", category: "GH Axis" },
  { term: "GLP-1", abbr: "Glucagon-Like Peptide-1", def: "A naturally occurring incretin hormone; the target of numerous synthetic agonists studied in metabolic and pancreatic research.", category: "Metabolic" },
  { term: "HCG", abbr: "Human Chorionic Gonadotropin", def: "A glycoprotein hormone studied in reproductive endocrinology and LH-axis research.", category: "GH Axis" },
  { term: "HGH", abbr: "Human Growth Hormone", def: "A 191 amino acid peptide hormone; recombinant forms are studied in GH-axis and metabolic research.", category: "GH Axis" },
  { term: "HPLC", abbr: "High-Performance Liquid Chromatography", def: "An analytical technique used to separate, identify, and quantify components in a compound sample. Used by Arcane Peptides for independent purity verification.", category: "Quality" },
  { term: "IGF-1 LR3", abbr: "Long R3 IGF-1", def: "A recombinant, long-acting analogue of IGF-1 studied in cell proliferation and GH-axis research.", category: "GH Axis" },
  { term: "Ipamorelin", abbr: "NNC 26-0161", def: "A selective GH secretagogue and ghrelin receptor agonist studied in GH-axis research.", category: "GH Axis" },
  { term: "KPV", abbr: "Lys-Pro-Val", def: "The C-terminal tripeptide of α-MSH studied in anti-inflammatory and mucosal research.", category: "Tissue & Repair" },
  { term: "Kisspeptin-10", abbr: "KP-10", def: "A neuropeptide studied in HPG axis signalling and GPR54 receptor research.", category: "Anti-Ageing" },
  { term: "LL-37", abbr: "Human Cathelicidin", def: "An antimicrobial and immunomodulatory cathelicidin peptide studied in innate immunity and wound healing research.", category: "Tissue & Repair" },
  { term: "Lyophilisation", abbr: "Freeze-Drying", def: "A preservation technique that removes moisture from compounds under vacuum while frozen, producing a stable lyophilised powder.", category: "Quality" },
  { term: "Mazdutide", abbr: "IBI362", def: "A GLP-1/glucagon dual receptor agonist analogue studied in metabolic research.", category: "Metabolic" },
  { term: "Melanotan I", abbr: "Afamelanotide", def: "A linear α-MSH analogue studied in melanocortin receptor and pigmentation research.", category: "Melanocortin" },
  { term: "Melanotan II", abbr: "MT-II", def: "A cyclic α-MSH analogue studied in melanocortin receptor research.", category: "Melanocortin" },
  { term: "MOTS-c", abbr: "Mitochondrial-derived peptide", def: "A mitochondria-encoded peptide studied in metabolic regulation, AMPK activation, and cellular longevity research.", category: "Longevity" },
  { term: "NAD+", abbr: "Nicotinamide Adenine Dinucleotide", def: "A coenzyme central to cellular energy metabolism studied in sirtuin activation, DNA repair, and longevity pathways.", category: "Longevity" },
  { term: "PT-141", abbr: "Bremelanotide", def: "A cyclic melanocortin receptor agonist studied in MC3R and MC4R research.", category: "Melanocortin" },
  { term: "Retatrutide", abbr: "LY3437943", def: "A triple GIP/GLP-1/glucagon receptor agonist studied in metabolic pathway research.", category: "Metabolic" },
  { term: "RUO", abbr: "Research Use Only", def: "A designation indicating that a product is sold solely for laboratory research purposes and is not approved for human or veterinary use.", category: "Regulatory" },
  { term: "Selank", abbr: "TP-7", def: "A synthetic heptapeptide tuftsin analogue studied in anxiolytic, neuropeptide, and immune-modulation research.", category: "Cognitive" },
  { term: "Semaglutide", abbr: "SM", def: "A GLP-1 receptor agonist analogue studied in metabolic pathway research. Presented as lyophilised powder.", category: "Metabolic" },
  { term: "Semax", abbr: "ACTH(4-7)PGP", def: "A synthetic ACTH analogue heptapeptide studied in neuroprotection, BDNF expression, and cognitive research.", category: "Cognitive" },
  { term: "Sermorelin", abbr: "GHRH 1-29", def: "A synthetic analogue of GHRH studied in growth hormone axis and pituitary research.", category: "GH Axis" },
  { term: "SKU", abbr: "Stock Keeping Unit", def: "A unique identifier for each product variant (e.g. BC5 = BPC-157 5mg).", category: "General" },
  { term: "SLU-PP-332", abbr: "ERR pan-agonist", def: "An oestrogen-related receptor pan-agonist studied in metabolic and mitochondrial pathway research.", category: "Metabolic" },
  { term: "SS-31", abbr: "Elamipretide", def: "A mitochondria-targeted antioxidant tetrapeptide studied in cardioprotection and mitochondrial membrane research.", category: "Longevity" },
  { term: "Survodutide", abbr: "BI 456906", def: "A GLP-1/glucagon dual receptor agonist peptide studied in metabolic pathway research.", category: "Metabolic" },
  { term: "TB-500", abbr: "Thymosin Beta-4 Fragment", def: "A synthetic fragment of thymosin beta-4 studied in actin-binding, cellular migration, and tissue repair research.", category: "Tissue & Repair" },
  { term: "Tesamorelin", abbr: "TH9507", def: "A synthetic GHRH analogue studied in GH-axis and metabolic pathway research.", category: "GH Axis" },
  { term: "Thymalin", abbr: "Thymic extract", def: "A bovine thymus gland extract studied in immune system modulation and bioregulator research.", category: "Anti-Ageing" },
  { term: "Thymosin Alpha-1", abbr: "Tα1", def: "A 28-amino acid thymic peptide studied in immune-modulation and T-cell activation research.", category: "Anti-Ageing" },
  { term: "Tirzepatide", abbr: "GIP/GLP-1 dual agonist", def: "A dual GIP and GLP-1 receptor agonist studied in metabolic pathway research.", category: "Metabolic" },
  { term: "VIP", abbr: "Vasoactive Intestinal Peptide", def: "A 28-amino acid neuropeptide studied in vasodilation, immune modulation, and neuroendocrine research.", category: "Cognitive" },
];

export default function GlossaryPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Reference"
        title="Compound Glossary"
        subtitle="A–Z reference for research peptide names, abbreviations, and definitions."
      />
      <GlossaryClient terms={GLOSSARY_TERMS} />
    </Section>
  );
}
