// ─── Product Catalogue ────────────────────────────────────────────────────────
// To add a product: add an entry below following the Product type.
// Prices are in GBP. TODO comments flag items needing price/size confirmation.

export type ProductBadge = "Selling fast" | "New" | "Restocked" | "Staff Pick";

export type Category =
  | "GLP-1 / Metabolic"
  | "Growth Hormone Secretagogues"
  | "Tissue & Repair"
  | "Cognitive / Nootropic"
  | "Melanocortin"
  | "Anti-Ageing / Bioregulators"
  | "Blends & Stacks"
  | "Cellular / Longevity"
  | "Reconstitution & Lab Supplies"
  | "Other";

export const CATEGORIES: Category[] = [
  "GLP-1 / Metabolic",
  "Growth Hormone Secretagogues",
  "Tissue & Repair",
  "Cognitive / Nootropic",
  "Melanocortin",
  "Anti-Ageing / Bioregulators",
  "Blends & Stacks",
  "Cellular / Longevity",
  "Reconstitution & Lab Supplies",
  "Other",
];

export const CATEGORY_SLUGS: Record<Category, string> = {
  "GLP-1 / Metabolic":              "glp1-metabolic",
  "Growth Hormone Secretagogues":   "gh-secretagogues",
  "Tissue & Repair":                "tissue-repair",
  "Cognitive / Nootropic":          "cognitive",
  "Melanocortin":                   "melanocortin",
  "Anti-Ageing / Bioregulators":    "anti-ageing",
  "Blends & Stacks":                "blends-stacks",
  "Cellular / Longevity":           "longevity",
  "Reconstitution & Lab Supplies":  "reconstitution-lab-supplies",
  "Other":                          "other",
};

export type ProductFormat =
  | "Lyophilised Vial"
  | "Pre-filled Cartridge"
  | "Solution"
  | "Blend"
  | "Supply";

export interface Variant {
  sku: string;
  size: string;
  priceGBP: number | null; // null = TODO: price placeholder
  inStock: boolean;
}

export interface Product {
  slug: string;
  name: string;
  synonyms?: string[];
  category: Category;
  molecularFormula?: string;
  format: ProductFormat;
  variants: Variant[];
  badges?: ProductBadge[];
  description: string; // NEUTRAL research context only — no dosing, no therapeutic claims
  storageNote?: string;
  image?: string; // path from /public, supplied later
  coaAvailable?: boolean;
  purityMin?: number; // e.g. 99 (%)
  reconstitutionNote?: string;
}

// ─── GLP-1 / Metabolic ───────────────────────────────────────────────────────

const semaglutide: Product = {
  slug: "semaglutide",
  image: "/products/semaglutide.png",
  name: "Semaglutide",
  synonyms: ["OzempicPeptide", "NovoPeptide", "SM"],
  category: "GLP-1 / Metabolic",
  molecularFormula: "C₁₈₇H₂₉₁N₄₅O₅₉",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Selling fast", "Staff Pick"],
  description:
    "Semaglutide is a GLP-1 receptor agonist analogue studied in metabolic pathway research. Presented as lyophilised powder, it is stable at room temperature pre-reconstitution.",
  storageNote: "Store unopened vials at –20 °C. Reconstituted: 2–8 °C, use within 28 days. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "SM5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "SM10", size: "10 mg", priceGBP: null, inStock: true },
    { sku: "SM15", size: "15 mg", priceGBP: null, inStock: true },
    { sku: "SM20", size: "20 mg", priceGBP: null, inStock: true },
    { sku: "SM30", size: "30 mg", priceGBP: null, inStock: false },
  ],
};

const tirzepatide: Product = {
  slug: "tirzepatide",
  image: "/products/tirzepatide.png",
  name: "Tirzepatide",
  synonyms: ["TR", "GIP/GLP-1 dual agonist"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Selling fast"],
  description:
    "Tirzepatide is a dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist studied in metabolic research contexts.",
  storageNote: "Store unopened vials at –20 °C. Reconstituted: 2–8 °C, use within 28 days.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "TR5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "TR10", size: "10 mg", priceGBP: null, inStock: true },
    { sku: "TR15", size: "15 mg", priceGBP: null, inStock: true },
    { sku: "TR20", size: "20 mg", priceGBP: null, inStock: true },
    { sku: "TR30", size: "30 mg", priceGBP: null, inStock: true },
    { sku: "TR40", size: "40 mg", priceGBP: null, inStock: false },
    { sku: "TR45", size: "45 mg", priceGBP: null, inStock: false },
    { sku: "TR50", size: "50 mg", priceGBP: null, inStock: false },
    { sku: "TR60", size: "60 mg", priceGBP: null, inStock: false },
  ],
};

const retatrutide: Product = {
  slug: "retatrutide",
  image: "/products/retatrutide.png",
  name: "Retatrutide",
  synonyms: ["GGG agonist", "RT", "LY3437943"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["New"],
  description:
    "Retatrutide is a triple GIP/GLP-1/glucagon receptor agonist studied in metabolic pathway research.",
  storageNote: "Store at –20 °C. Reconstituted: 2–8 °C, protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "RT5",  size: "5 mg",  priceGBP: 80.50, inStock: true },
    { sku: "RT10", size: "10 mg", priceGBP: null,  inStock: true },
    { sku: "RT15", size: "15 mg", priceGBP: null,  inStock: true },
    { sku: "RT20", size: "20 mg", priceGBP: null,  inStock: true },
    { sku: "RT24", size: "24 mg", priceGBP: null,  inStock: false },
    { sku: "RT30", size: "30 mg", priceGBP: null,  inStock: false },
    { sku: "RT36", size: "36 mg", priceGBP: null,  inStock: false },
    { sku: "RT40", size: "40 mg", priceGBP: null,  inStock: false },
    { sku: "RT50", size: "50 mg", priceGBP: null,  inStock: false },
    { sku: "RT60", size: "60 mg", priceGBP: null,  inStock: false },
  ],
};

const mazdutide: Product = {
  slug: "mazdutide",
  image: "/products/mazdutide.png",
  name: "Mazdutide",
  synonyms: ["IBI362"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Mazdutide is a GLP-1/glucagon dual receptor agonist analogue studied in metabolic research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "MDT10", size: "10 mg", priceGBP: null, inStock: true }],
};

const survodutide: Product = {
  slug: "survodutide",
  image: "/products/survodutide.png",
  name: "Survodutide",
  synonyms: ["BI 456906"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Survodutide is a GLP-1/glucagon dual receptor agonist peptide used in metabolic pathway research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "SUR10", size: "10 mg", priceGBP: null, inStock: true }],
};

const cagrilintide: Product = {
  slug: "cagrilintide",
  image: "/products/cagrilintide.png",
  name: "Cagrilintide",
  synonyms: ["AM833", "CGL"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Cagrilintide is a long-acting amylin analogue studied in metabolic research contexts. Often researched alongside GLP-1 receptor agonists.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "CGL5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "CGL10", size: "10 mg", priceGBP: null, inStock: true },
  ],
};

const aod9604: Product = {
  slug: "aod9604",
  image: "/products/aod9604.png",
  name: "AOD9604",
  synonyms: ["HGH Fragment 176-191", "AOD"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "AOD9604 is a synthetic peptide fragment of human growth hormone (residues 176–191) studied in metabolic pathway research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "5AD", size: "5 mg", priceGBP: 26.45, inStock: true }],
};

const sluPP332: Product = {
  slug: "slu-pp-332",
  image: "/products/slu-pp-332.png",
  name: "SLU-PP-332",
  synonyms: ["ERR agonist"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "SLU-PP-332 is an oestrogen-related receptor (ERR) pan-agonist studied in metabolic and mitochondrial pathway research.",
  storageNote: "Store at –20 °C, protect from light.",
  coaAvailable: true,
  variants: [{ sku: "332", size: "Research quantity", priceGBP: null, inStock: true }],
};

const aminoMQ: Product = {
  slug: "5-amino-1mq",
  image: "/products/5-amino-1mq.png",
  name: "5-Amino-1MQ",
  synonyms: ["5-amino-1-methylquinolinium", "5AM"],
  category: "GLP-1 / Metabolic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "5-Amino-1MQ is a small-molecule NNMT inhibitor studied in metabolic pathway and cellular energy research.",
  storageNote: "Store at –20 °C.",
  coaAvailable: true,
  variants: [{ sku: "5AM", size: "1 mg", priceGBP: null, inStock: true }],
};

// ─── Growth Hormone Secretagogues ────────────────────────────────────────────

const hgh: Product = {
  slug: "hgh",
  image: "/products/hgh.png",
  name: "Human Growth Hormone (HGH)",
  synonyms: ["Somatropin", "rHGH"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Recombinant human growth hormone (191 amino acid sequence) supplied as lyophilised powder for research purposes.",
  storageNote: "Store at 2–8 °C. Do not freeze reconstituted solution.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "H10", size: "10 IU", priceGBP: null, inStock: true },  // TODO: confirm IU pricing
    { sku: "H15", size: "15 IU", priceGBP: null, inStock: true },
  ],
};

const ipamorelin: Product = {
  slug: "ipamorelin",
  image: "/products/ipamorelin.png",
  name: "Ipamorelin",
  synonyms: ["NNC 26-0161"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Staff Pick"],
  description:
    "Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor agonist studied in GH-axis research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "IP5",  size: "5 mg",  priceGBP: null,  inStock: true },
    { sku: "IP10", size: "10 mg", priceGBP: null,  inStock: true },
  ],
};

const cjcNoDac: Product = {
  slug: "cjc-1295-no-dac",
  image: "/products/cjc-1295-no-dac.png",
  name: "CJC-1295 (No DAC)",
  synonyms: ["Modified GRF 1-29", "CJC-1295 without DAC", "Mod GRF"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "CJC-1295 without DAC (Drug Affinity Complex) is a GHRH analogue with a shorter half-life, studied in pulsatile GH secretion research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "CND5",  size: "5 mg",  priceGBP: 23.95, inStock: true },
    { sku: "CND10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

const cjcWithDac: Product = {
  slug: "cjc-1295-with-dac",
  image: "/products/cjc-1295-with-dac.png",
  name: "CJC-1295 (With DAC)",
  synonyms: ["CJC-1295 DAC", "DAC:GRF"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "CJC-1295 with the Drug Affinity Complex modification extends its half-life significantly. Studied in sustained GH-axis research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "CD5", size: "5 mg", priceGBP: 38.50, inStock: true },
  ],
};

const cjcIpaBlend: Product = {
  slug: "cjc-1295-ipamorelin-blend",
  image: "/products/cjc-1295-ipamorelin-blend.png",
  name: "CJC-1295 / Ipamorelin Blend",
  synonyms: ["CP Blend"],
  category: "Growth Hormone Secretagogues",
  format: "Blend",
  purityMin: 99,
  description:
    "Pre-blended lyophilised combination of CJC-1295 (no DAC) 5 mg and Ipamorelin 5 mg, used in combined GH-axis secretagogue research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "CP10", size: "10 mg (5 mg + 5 mg)", priceGBP: null, inStock: true }],
};

const sermorelin: Product = {
  slug: "sermorelin",
  image: "/products/sermorelin.png",
  name: "Sermorelin",
  synonyms: ["GHRH 1-29", "GRF 1-29"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Sermorelin is a synthetic analogue of GHRH (amino acids 1–29) studied in growth hormone axis research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "SMO5",  size: "5 mg",  priceGBP: 27.50, inStock: true },
    { sku: "SMO10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

const tesamorelin: Product = {
  slug: "tesamorelin",
  image: "/products/tesamorelin.png",
  name: "Tesamorelin",
  synonyms: ["TH9507"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Tesamorelin is a synthetic analogue of GHRH studied in GH-axis and metabolic pathway research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "TSM5",  size: "5 mg",  priceGBP: 27.50, inStock: true },
    { sku: "TSM10", size: "10 mg", priceGBP: null,   inStock: true },
    { sku: "TSM15", size: "15 mg", priceGBP: null,   inStock: false },
  ],
};

const ghrp6: Product = {
  slug: "ghrp-6",
  image: "/products/ghrp-6.png",
  name: "GHRP-6",
  synonyms: ["Growth Hormone Releasing Peptide-6", "His-DTrp-Ala-Trp-DPhe-Lys-NH2"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "GHRP-6 is a synthetic hexapeptide growth hormone secretagogue studied in GH-axis and ghrelin receptor research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "G65",  size: "5 mg",  priceGBP: 8.95, inStock: true },
    { sku: "G610", size: "10 mg", priceGBP: null,  inStock: true },
  ],
};

const igf1lr3: Product = {
  slug: "igf-1-lr3",
  image: "/products/igf-1-lr3.png",
  name: "IGF-1 LR3",
  synonyms: ["Long R3 IGF-1", "Insulin-like Growth Factor-1 LR3"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "IGF-1 LR3 is a recombinant, long-acting analogue of IGF-1 with an arginine substitution at position 3. Studied in cell proliferation and GH-axis research.",
  storageNote: "Store at –20 °C. Reconstituted: 2–8 °C, use within 14 days.",
  reconstitutionNote: "Reconstitute with 0.1% acetic acid (pH ~3).",
  coaAvailable: true,
  variants: [
    { sku: "IG01", size: "0.1 mg", priceGBP: null,  inStock: true },
    { sku: "IG1",  size: "1 mg",   priceGBP: 41.95, inStock: true },
  ],
};

const igfDes: Product = {
  slug: "igf-des",
  image: "/products/igf-des.png",
  name: "IGF-1 DES(1-3)",
  synonyms: ["des(1-3)IGF-1", "IGF-DES"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "IGF-1 DES is a truncated form of IGF-1 (lacking the first three amino acids) with altered binding characteristics. Studied in cell biology research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with 0.1% acetic acid.",
  coaAvailable: true,
  variants: [{ sku: "IGD", size: "Research quantity", priceGBP: null, inStock: true }],
};

const hmg: Product = {
  slug: "hmg",
  image: "/products/hmg.png",
  name: "Human Menopausal Gonadotropin (HMG)",
  synonyms: ["Menotropin", "G75"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "HMG is a combination of FSH and LH-activity glycoprotein hormones derived from urinary sources. Used in reproductive endocrinology research.",
  storageNote: "Store at 2–8 °C.",
  coaAvailable: true,
  variants: [{ sku: "G75", size: "75 IU", priceGBP: null, inStock: true }],
};

const hcg: Product = {
  slug: "hcg",
  image: "/products/hcg.png",
  name: "Human Chorionic Gonadotropin (HCG)",
  synonyms: ["hCG", "Choriogonadotropin alfa"],
  category: "Growth Hormone Secretagogues",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "HCG is a glycoprotein hormone studied in reproductive endocrinology, luteinisation research, and LH-axis studies.",
  storageNote: "Store at 2–8 °C. Do not freeze reconstituted solution.",
  coaAvailable: true,
  variants: [
    { sku: "G5K",  size: "5,000 IU",  priceGBP: null, inStock: true },
    { sku: "G10K", size: "10,000 IU", priceGBP: null, inStock: true },
  ],
};

// ─── Tissue & Repair ─────────────────────────────────────────────────────────

const bpc157: Product = {
  slug: "bpc-157",
  image: "/products/bpc-157.png",
  name: "BPC-157",
  synonyms: ["Body Protection Compound-157", "PL 14736"],
  category: "Tissue & Repair",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Staff Pick", "Selling fast"],
  description:
    "BPC-157 is a stable gastric pentadecapeptide fragment studied in gastric mucosal protection, angiogenesis, and connective tissue research contexts.",
  storageNote: "Store at –20 °C. Reconstituted: 2–8 °C, use within 14 days. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "BC5",  size: "5 mg",  priceGBP: 15.45, inStock: true },
    { sku: "BC10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

const tb500: Product = {
  slug: "tb-500",
  image: "/products/tb-500.png",
  name: "TB-500 (Thymosin Beta-4 Fragment)",
  synonyms: ["Thymosin Beta-4 Frag", "TB4 Fragment"],
  category: "Tissue & Repair",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Staff Pick"],
  description:
    "TB-500 is a synthetic fragment of thymosin beta-4 studied in actin-binding, cellular migration, and tissue repair research.",
  storageNote: "Store at –20 °C. Reconstituted: 2–8 °C, use within 14 days.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "TB5",  size: "5 mg",  priceGBP: 30.95, inStock: true },
    { sku: "TB10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

const bpcTbBlend5: Product = {
  slug: "bpc-157-tb-500-blend-5mg",
  image: "/products/bpc-157-tb-500-blend-5mg.png",
  name: "BPC-157 + TB-500 Blend (5 mg each)",
  synonyms: ["BB10"],
  category: "Tissue & Repair",
  format: "Blend",
  purityMin: 99,
  description:
    "Pre-blended lyophilised combination of BPC-157 (5 mg) and TB-500 (5 mg) in a single vial, used in combined tissue and angiogenesis research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "BB10", size: "10 mg (5+5)", priceGBP: null, inStock: true }],
};

const bpcTbBlend10: Product = {
  slug: "bpc-157-tb-500-blend-10mg",
  image: "/products/bpc-157-tb-500-blend-10mg.png",
  name: "BPC-157 + TB-500 Blend (10 mg each)",
  synonyms: ["BB20"],
  category: "Tissue & Repair",
  format: "Blend",
  purityMin: 99,
  description:
    "Pre-blended lyophilised combination of BPC-157 (10 mg) and TB-500 (10 mg) in a single vial.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "BB20", size: "20 mg (10+10)", priceGBP: null, inStock: true }],
};

const kpv: Product = {
  slug: "kpv",
  image: "/products/kpv.png",
  name: "KPV",
  synonyms: ["α-MSH tripeptide C-terminal", "Lys-Pro-Val"],
  category: "Tissue & Repair",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "KPV is the C-terminal tripeptide of α-melanocyte-stimulating hormone (α-MSH), studied in anti-inflammatory and mucosal research contexts.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "KPV5",  size: "5 mg",  priceGBP: 33.95, inStock: true },
    { sku: "KPV10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

// ─── Cognitive / Nootropic ────────────────────────────────────────────────────

const selank: Product = {
  slug: "selank",
  image: "/products/selank.png",
  name: "Selank",
  synonyms: ["TP-7"],
  category: "Cognitive / Nootropic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Selank is a synthetic heptapeptide analogue of tuftsin studied in anxiolytic, neuropeptide, and immune-modulation research.",
  storageNote: "Store at –20 °C. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "SK5",  size: "5 mg",  priceGBP: 17.45, inStock: true },
    { sku: "SK10", size: "10 mg", priceGBP: null,   inStock: true },
  ],
};

const semax: Product = {
  slug: "semax",
  image: "/products/semax.png",
  name: "Semax",
  synonyms: ["ACTH(4-7)PGP", "Methionyl-glutamyl-histidyl-phenylalanyl-prolyl-glycyl-proline"],
  category: "Cognitive / Nootropic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Semax is a synthetic ACTH analogue heptapeptide studied in neuroprotection, BDNF expression, and cognitive research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "XA5",  size: "5 mg",  priceGBP: 21.25, inStock: true },
    { sku: "XA11", size: "11 mg", priceGBP: null,   inStock: true },
  ],
};

const cerebrolysin: Product = {
  slug: "cerebrolysin",
  image: "/products/cerebrolysin.png",
  name: "Cerebrolysin",
  synonyms: ["FPF 1070"],
  category: "Cognitive / Nootropic",
  format: "Solution",
  purityMin: 99,
  description:
    "Cerebrolysin is a neurotrophic peptide mixture derived from porcine brain tissue, studied in neuroprotection and cognitive research.",
  storageNote: "Store at 2–8 °C. Do not freeze.",
  coaAvailable: true,
  variants: [{ sku: "CBL60", size: "60 mL", priceGBP: null, inStock: true }],
};

const dsip: Product = {
  slug: "dsip",
  image: "/products/dsip.png",
  name: "DSIP",
  synonyms: ["Delta Sleep Inducing Peptide", "Delta-Sleep-Inducing Peptide"],
  category: "Cognitive / Nootropic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "DSIP is a neuropeptide studied in sleep regulation, stress response, and neuroendocrine research contexts.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "DS5",  size: "5 mg",  priceGBP: 12.45, inStock: true },
    { sku: "DS15", size: "15 mg", priceGBP: null,   inStock: true },
  ],
};

// ─── Melanocortin ─────────────────────────────────────────────────────────────

const mtII: Product = {
  slug: "melanotan-2",
  image: "/products/melanotan-2.png",
  name: "Melanotan II (MT-II)",
  synonyms: ["MT-2", "Melanotan-2"],
  category: "Melanocortin",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Melanotan II is a synthetic analogue of α-melanocyte-stimulating hormone (α-MSH) studied in melanocortin receptor research.",
  storageNote: "Store at –20 °C. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "ML10", size: "10 mg", priceGBP: 22.95, inStock: true }],
};

const mtI: Product = {
  slug: "melanotan-1",
  image: "/products/melanotan-1.png",
  name: "Melanotan I (MT-I)",
  synonyms: ["Afamelanotide", "MT-1"],
  category: "Melanocortin",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Melanotan I is a synthetic linear analogue of α-MSH studied in melanocortin receptor and pigmentation research.",
  storageNote: "Store at –20 °C. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "MT1", size: "Research quantity", priceGBP: null, inStock: true }],
};

const pt141: Product = {
  slug: "pt-141",
  image: "/products/pt-141.png",
  name: "PT-141 (Bremelanotide)",
  synonyms: ["Bremelanotide", "PT141"],
  category: "Melanocortin",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "PT-141 is a cyclic heptapeptide melanocortin receptor agonist studied in melanocortin-3 and -4 receptor research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "P41",  size: "Research quantity", priceGBP: null,  inStock: true },
    { sku: "PT10", size: "10 mg",             priceGBP: 19.50, inStock: true },
  ],
};

// ─── Anti-Ageing / Bioregulators / Longevity ─────────────────────────────────

const epitalon: Product = {
  slug: "epitalon",
  image: "/products/epitalon.png",
  name: "Epitalon",
  synonyms: ["Epithalon", "Ala-Glu-Asp-Gly", "Epithalamin"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Epitalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied in telomerase activation, circadian regulation, and bioregulator research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "ET10", size: "10 mg", priceGBP: 18.25, inStock: true },
    { sku: "ET50", size: "50 mg", priceGBP: null,   inStock: true },
  ],
};

const thymalin: Product = {
  slug: "thymalin",
  image: "/products/thymalin.png",
  name: "Thymalin",
  synonyms: ["Thymic extract", "TY"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Thymalin is a bovine thymus gland extract studied in immune system modulation and bioregulator research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "TY10", size: "10 mg", priceGBP: null, inStock: true }],
};

const thymosineAlpha1: Product = {
  slug: "thymosin-alpha-1",
  image: "/products/thymosin-alpha-1.png",
  name: "Thymosin Alpha-1",
  synonyms: ["Tα1", "Thymalfasin", "TA-1"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Thymosin Alpha-1 is a 28-amino acid thymic peptide studied in immune-modulation and T-cell activation research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "TA5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "TA10", size: "10 mg", priceGBP: null, inStock: true },
  ],
};

const pinealon: Product = {
  slug: "pinealon",
  image: "/products/pinealon.png",
  name: "Pinealon",
  synonyms: ["EDR tripeptide", "Glu-Asp-Arg"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Pinealon is a synthetic tripeptide (Glu-Asp-Arg) studied in neuroprotection and circadian rhythm regulation research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "PI5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "PI10", size: "10 mg", priceGBP: null, inStock: true },
    { sku: "PI20", size: "20 mg", priceGBP: null, inStock: true },
  ],
};

const pnc27: Product = {
  slug: "pnc-27",
  image: "/products/pnc-27.png",
  name: "PNC-27",
  synonyms: ["MDM2-binding peptide"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "PNC-27 is a p53-derived peptide studied in cancer cell biology and MDM2-binding research.",
  storageNote: "Store at –20 °C.",
  coaAvailable: true,
  variants: [
    { sku: "PNC5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "PNC10", size: "10 mg", priceGBP: null, inStock: true },
  ],
};

const nad: Product = {
  slug: "nad-plus",
  image: "/products/nad-plus.png",
  name: "NAD+",
  synonyms: ["Nicotinamide Adenine Dinucleotide", "NAD"],
  category: "Cellular / Longevity",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Staff Pick"],
  description:
    "NAD+ is a coenzyme central to cellular energy metabolism, studied in sirtuins, DNA repair, and longevity pathway research.",
  storageNote: "Store at –20 °C. Highly moisture-sensitive; reconstitute immediately before use.",
  reconstitutionNote: "Reconstitute with sterile saline or bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "NJ100", size: "100 mg", priceGBP: 97.50,  inStock: true },
    { sku: "NJ500", size: "500 mg", priceGBP: null,    inStock: true },
  ],
};

const motsC: Product = {
  slug: "mots-c",
  image: "/products/mots-c.png",
  name: "MOTS-c",
  synonyms: ["Mitochondrial-derived peptide", "MOTs-c"],
  category: "Cellular / Longevity",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Restocked"],
  description:
    "MOTS-c is a mitochondria-encoded peptide studied in metabolic regulation, AMPK activation, and cellular longevity research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "MS10", size: "10 mg", priceGBP: 20.95, inStock: true },
    { sku: "MS40", size: "40 mg", priceGBP: null,   inStock: true },
  ],
};

const ss31: Product = {
  slug: "ss-31",
  image: "/products/ss-31.png",
  name: "SS-31",
  synonyms: ["Elamipretide", "MTP-131", "Bendavia"],
  category: "Cellular / Longevity",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "SS-31 is a mitochondria-targeted antioxidant tetrapeptide studied in cardioprotection and mitochondrial membrane research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "2S10", size: "10 mg", priceGBP: null, inStock: true },
    { sku: "2S50", size: "50 mg", priceGBP: null, inStock: false },
  ],
};

const ghkCu: Product = {
  slug: "ghk-cu",
  image: "/products/ghk-cu.png",
  name: "GHK-Cu",
  synonyms: ["Copper peptide", "Glycyl-L-histidyl-L-lysine copper"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  badges: ["Staff Pick"],
  description:
    "GHK-Cu is a naturally occurring copper tripeptide studied in skin biology, collagen synthesis, and tissue remodelling research.",
  storageNote: "Store at –20 °C. Protect from light.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "CU50",  size: "50 mg",  priceGBP: 24.45, inStock: true },
    { sku: "CU100", size: "100 mg", priceGBP: null,   inStock: true },
  ],
};

const glutathione: Product = {
  slug: "glutathione",
  name: "Glutathione",
  synonyms: ["GSH", "L-glutathione"],
  category: "Cellular / Longevity",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Glutathione is the principal intracellular antioxidant tripeptide, studied in redox biology, detoxification, and cellular longevity research.",
  storageNote: "Store at –20 °C. Highly sensitive to oxidation — reconstitute fresh.",
  coaAvailable: true,
  // TODO: confirm Glutathione sizes with Leo before publishing
  variants: [
    { sku: "GTT", size: "TODO: confirm size", priceGBP: null, inStock: true },
  ],
};

const ara290: Product = {
  slug: "ara-290",
  image: "/products/ara-290.png",
  name: "ARA-290",
  synonyms: ["Cibinetide"],
  category: "Tissue & Repair",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "ARA-290 is a non-haematopoietic erythropoietin analogue studied in neuroprotection, anti-inflammation, and tissue repair research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "RA10", size: "10 mg", priceGBP: null, inStock: true }],
};

const snap8: Product = {
  slug: "snap-8",
  image: "/products/snap-8.png",
  name: "SNAP-8",
  synonyms: ["Acetyl Glutamyl Heptapeptide-3"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "SNAP-8 is a synthetic octapeptide analogue of SNAP-25 studied in SNARE complex and neuromuscular junction research.",
  storageNote: "Store at –20 °C.",
  coaAvailable: true,
  variants: [{ sku: "NP810", size: "Research quantity", priceGBP: null, inStock: true }],
};

const kisspeptin10: Product = {
  slug: "kisspeptin-10",
  image: "/products/kisspeptin-10.png",
  name: "Kisspeptin-10",
  synonyms: ["Metastin 45-54", "KP-10"],
  category: "Anti-Ageing / Bioregulators",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Kisspeptin-10 is a neuropeptide studied in hypothalamic-pituitary-gonadal axis research, GPR54 signalling, and reproductive endocrinology.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "KS5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "KS10", size: "10 mg", priceGBP: null, inStock: true },
  ],
};

const vip: Product = {
  slug: "vip",
  image: "/products/vip.png",
  name: "VIP (Vasoactive Intestinal Peptide)",
  synonyms: ["VIP"],
  category: "Cognitive / Nootropic",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "VIP is a 28-amino acid neuropeptide studied in vasodilation, immune modulation, and neuroendocrine research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "VIP5",  size: "5 mg",  priceGBP: null, inStock: true },
    { sku: "VIP10", size: "10 mg", priceGBP: null, inStock: true },
  ],
};

const epo: Product = {
  slug: "epo",
  image: "/products/epo.png",
  name: "Erythropoietin (EPO)",
  synonyms: ["Erythropoietin alpha", "rHuEPO"],
  category: "Other",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Erythropoietin is a glycoprotein cytokine studied in erythropoiesis, haematopoiesis, and red blood cell production research.",
  storageNote: "Store at 2–8 °C. Do not freeze.",
  coaAvailable: true,
  variants: [
    { sku: "E3K", size: "3,000 IU", priceGBP: null, inStock: true },
    { sku: "E5K", size: "5,000 IU", priceGBP: null, inStock: true },
  ],
};

const oxytocin: Product = {
  slug: "oxytocin-acetate",
  image: "/products/oxytocin-acetate.png",
  name: "Oxytocin Acetate",
  synonyms: ["α-Hypophamine", "OT"],
  category: "Other",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Oxytocin is a nonapeptide studied in social behaviour, neuroendocrine, and reproductive physiology research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "OT2", size: "2 mg", priceGBP: null, inStock: true }],
};

const dermorphin: Product = {
  slug: "dermorphin",
  image: "/products/dermorphin.png",
  name: "Dermorphin",
  synonyms: ["Tyr-D-Ala-Phe-Gly-Tyr-Pro-Ser-NH2"],
  category: "Other",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Dermorphin is a naturally occurring heptapeptide opioid found in amphibian skin, studied in μ-opioid receptor research.",
  storageNote: "Store at –20 °C.",
  coaAvailable: true,
  variants: [{ sku: "DR5", size: "5 mg", priceGBP: null, inStock: true }],
};

const ll37: Product = {
  slug: "ll-37",
  image: "/products/ll-37.png",
  name: "LL-37",
  synonyms: ["CAP-18 C-terminal fragment", "Human cathelicidin"],
  category: "Tissue & Repair",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "LL-37 is an antimicrobial and immunomodulatory cathelicidin peptide studied in innate immunity, wound healing, and anti-biofilm research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "375", size: "5 mg", priceGBP: null, inStock: true }],
};

const alprostadil: Product = {
  slug: "alprostadil",
  image: "/products/alprostadil.png",
  name: "Alprostadil",
  synonyms: ["Prostaglandin E1", "PGE1"],
  category: "Other",
  format: "Lyophilised Vial",
  purityMin: 99,
  description:
    "Alprostadil (PGE1) is a naturally occurring prostaglandin studied in vascular biology, vasodilation, and platelet aggregation research.",
  storageNote: "Store at –20 °C. Protect from light.",
  coaAvailable: true,
  variants: [{ sku: "PRO20", size: "20 mcg", priceGBP: null, inStock: true }],
};

// ─── Blends & Stacks ─────────────────────────────────────────────────────────

const glowBlend: Product = {
  slug: "glow-blend",
  image: "/products/glow-blend.png",
  name: "GLOW",
  synonyms: ["GHK-Cu + TB500 + BPC-157 Stack"],
  category: "Blends & Stacks",
  format: "Blend",
  purityMin: 99,
  badges: ["Staff Pick"],
  description:
    "GLOW is a proprietary research blend containing GHK-Cu 35 mg, TB-500 10 mg, and BPC-157 5 mg in a single lyophilised vial.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "GLOW50", size: "50 mg total (GHK-Cu 35 + TB500 10 + BPC 5)", priceGBP: 75.50, inStock: true }],
};

const glowLarge: Product = {
  slug: "glow-blend-large",
  image: "/products/glow-blend-large.png",
  name: "GLOW (Large)",
  synonyms: ["BBG70", "BPC + GHK-Cu + TB500 Large"],
  category: "Blends & Stacks",
  format: "Blend",
  purityMin: 99,
  description:
    "GLOW Large is a proprietary research blend containing BPC-157 10 mg, GHK-Cu 50 mg, and TB-500 10 mg in a single lyophilised vial.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "BBG70", size: "70 mg total (BPC 10 + GHK-Cu 50 + TB500 10)", priceGBP: null, inStock: true }],
};

const klowBlend: Product = {
  slug: "klow-blend",
  image: "/products/klow-blend.png",
  name: "KLOW",
  synonyms: ["KLOW80"],
  category: "Blends & Stacks",
  format: "Blend",
  purityMin: 99,
  description:
    "KLOW is a proprietary research blend of GHK-Cu 50 mg, TB-500 10 mg, BPC-157 10 mg, and KPV 10 mg in a single lyophilised vial.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "KLOW80", size: "80 mg total", priceGBP: null, inStock: true }],
};

const gkpBlend: Product = {
  slug: "gkp-blend",
  image: "/products/gkp-blend.png",
  name: "GKP",
  synonyms: ["GKP70"],
  category: "Blends & Stacks",
  format: "Blend",
  purityMin: 99,
  description:
    "GKP is a proprietary research blend containing GHK-Cu 50 mg, KPV 10 mg, and BPC-157 10 mg in a single lyophilised vial.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [{ sku: "GKP70", size: "70 mg total", priceGBP: null, inStock: true }],
};

const cagriSema: Product = {
  slug: "cagrilintide-semaglutide-blend",
  image: "/products/cagrilintide-semaglutide-blend.png",
  name: "Cagrilintide + Semaglutide Blend",
  synonyms: ["CagriSema", "CS"],
  category: "Blends & Stacks",
  format: "Blend",
  purityMin: 99,
  description:
    "Pre-blended lyophilised combination of Cagrilintide and Semaglutide, studied in combined amylin/GLP-1 receptor agonism research.",
  storageNote: "Store at –20 °C.",
  reconstitutionNote: "Reconstitute with bacteriostatic water.",
  coaAvailable: true,
  variants: [
    { sku: "CS5",  size: "10 mg (5 mg + 5 mg)",   priceGBP: null, inStock: true },
    { sku: "CS10", size: "20 mg (10 mg + 10 mg)",  priceGBP: null, inStock: false },
  ],
};

// ─── Reconstitution & Lab Supplies ───────────────────────────────────────────

const bacteriostaticWater: Product = {
  slug: "bacteriostatic-water",
  image: "/products/bacteriostatic-water.png",
  name: "Bacteriostatic Water",
  synonyms: ["BW", "0.9% Benzyl Alcohol Water for Injection"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "Pharmaceutical-grade bacteriostatic water (0.9% benzyl alcohol) for reconstitution of lyophilised research peptides.",
  storageNote: "Store at room temperature. Discard 28 days after first use.",
  variants: [{ sku: "WA3", size: "10 mL vial", priceGBP: 4.45, inStock: true }],
};

const aceticAcidWater: Product = {
  slug: "acetic-acid-water",
  image: "/products/acetic-acid-water.png",
  name: "Amino / Acetic Acid Water",
  synonyms: ["0.1% Acetic Acid Water", "AA Water"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "0.1% acetic acid in sterile water, suitable for reconstituting peptides that require an acidic diluent (e.g. IGF-1 variants).",
  storageNote: "Store at room temperature.",
  variants: [{ sku: "AA3", size: "10 mL vial", priceGBP: null, inStock: true }],
};

const vitaminB12: Product = {
  slug: "vitamin-b12",
  image: "/products/vitamin-b12.png",
  name: "Vitamin B12 (Cyanocobalamin)",
  synonyms: ["B12", "Cyanocobalamin"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "Pharmaceutical-grade cyanocobalamin solution for laboratory use as a diluent or research supply.",
  storageNote: "Store at 2–8 °C. Protect from light.",
  variants: [
    { sku: "B12",      size: "0.5 mL / vial",       priceGBP: null, inStock: true },
    { sku: "B12-BULK", size: "10 mL × 10 vials",    priceGBP: null, inStock: true },
  ],
};

const vitaminC: Product = {
  slug: "vitamin-c",
  image: "/products/vitamin-c.png",
  name: "Vitamin C (Ascorbic Acid)",
  synonyms: ["Ascorbic Acid", "L-Ascorbic Acid"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "Pharmaceutical-grade ascorbic acid solution for laboratory use.",
  storageNote: "Store at 2–8 °C. Protect from light.",
  variants: [{ sku: "C", size: "0.5 mL / vial", priceGBP: null, inStock: true }],
};

const lCarnitine: Product = {
  slug: "l-carnitine",
  image: "/products/l-carnitine.png",
  name: "L-Carnitine",
  synonyms: ["Levocarnitine"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "Pharmaceutical-grade L-carnitine solution (20 mg/vial) for laboratory research.",
  storageNote: "Store at 2–8 °C.",
  variants: [{ sku: "LC216", size: "20 mg / vial", priceGBP: null, inStock: true }],
};

const methionine: Product = {
  slug: "methionine",
  image: "/products/methionine.png",
  name: "Methionine",
  synonyms: ["L-Methionine"],
  category: "Reconstitution & Lab Supplies",
  format: "Supply",
  description:
    "Pharmaceutical-grade L-methionine solution (15 mg/vial) for laboratory research.",
  storageNote: "Store at 2–8 °C.",
  variants: [{ sku: "LC120", size: "15 mg / vial", priceGBP: null, inStock: true }],
};

// TODO: confirm what "Lemmon bottle" refers to before publishing
// const lemmon: Product = { slug: "lemmon", ... };

// ─── Export ───────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // GLP-1 / Metabolic
  semaglutide, tirzepatide, retatrutide, mazdutide, survodutide,
  cagrilintide, aod9604, sluPP332, aminoMQ,

  // Growth Hormone Secretagogues
  hgh, ipamorelin, cjcNoDac, cjcWithDac, cjcIpaBlend, sermorelin,
  tesamorelin, ghrp6, igf1lr3, igfDes, hmg, hcg,

  // Tissue & Repair
  bpc157, tb500, bpcTbBlend5, bpcTbBlend10, kpv, ara290, ll37,

  // Cognitive / Nootropic
  selank, semax, cerebrolysin, dsip, vip,

  // Melanocortin
  mtII, mtI, pt141,

  // Anti-Ageing / Bioregulators
  epitalon, thymalin, thymosineAlpha1, pinealon, pnc27, ghkCu,
  snap8, kisspeptin10,

  // Cellular / Longevity
  nad, motsC, ss31, glutathione,

  // Blends & Stacks
  glowBlend, glowLarge, klowBlend, gkpBlend, cagriSema,
  bpcTbBlend5, bpcTbBlend10, cjcIpaBlend,

  // Other
  epo, oxytocin, dermorphin, alprostadil,

  // Reconstitution & Lab Supplies
  bacteriostaticWater, aceticAcidWater, vitaminB12, vitaminC,
  lCarnitine, methionine,
];

// De-duplicate (blends appear in both their category AND blends)
export const uniqueProducts: Product[] = products.filter(
  (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
);

export function getProductBySlug(slug: string): Product | undefined {
  return uniqueProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return uniqueProducts.filter((p) => p.category === category);
}
