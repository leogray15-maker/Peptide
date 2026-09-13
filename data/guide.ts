// ─── Arcane Peptides 101 — digital guide ──────────────────────────────────
// A downloadable literature bundle sold separately from the compound
// catalogue. It is paid for through a Stripe payment link rather than the
// bank-transfer / crypto checkout, so it never enters the cart.
//
// `lessons` lists the sub-modules inside a module. Where a module's lesson
// list hasn't been supplied yet the array is empty and the storefront simply
// shows the module title — never invent lesson names here, the list is what
// customers are being sold.

export interface GuideModule {
  title: string;
  lessons: string[];
}

export const GUIDE = {
  name: "Arcane Peptides 101",
  tagline: "Everything You Need To Know",
  // Stripe payment link — update here if the product is recreated in Stripe.
  checkoutUrl: "https://buy.stripe.com/3cIfZg4e0fVw3B08uy0Ba0c",
  // TODO: confirm the price. Leave null to show the CTA without a price —
  // the live figure is always the one on the Stripe checkout page.
  priceGBP: null as number | null,
  summary:
    "Twelve written modules covering the research literature behind the compounds we supply — how peptide classes are grouped, how studies describe combining them, and how the wider research landscape fits together. Delivered as an instant digital download.",
  modules: [
    {
      title: "The Overall Beginners Guide To Peptides",
      lessons: [
        "What ARE Peptides",
        "Units — what they are and why they matter",
        "Reconstitution is easy (here's how)",
        "Understanding why some compounds use acetic acid",
        "Nasal peptides: how to reconstitute & use",
        "Peptide calculator to calculate dosing",
        "How to use a peptide calculator",
        "GHK-Cu serum",
        "Tracking your peptides — why it's important",
        "Half-life of peptides explained",
        "Research language explained",
        "Anaphylactic reaction on peptides",
        "Peptide protocol website",
        "How to actually read a Certificate of Analysis",
        "Peptide stacking — what actually works together",
        "How to read a Certificate of Analysis (CoA)",
        "Histamine reactions on peptides",
        "Why bloodwork is important",
      ],
    },
    {
      title: "The Ultimate GLP Course",
      lessons: [
        "GLPs 101 — what this course is all about",
        "Semaglutide / GLP-1: the OG — what it actually does",
        "Tirzepatide (GLP-1 + GIP): the food noise killer",
        "Retatrutide: the most aggressive GLP yet",
        "How to make the most of your Reta",
        "What should I stack with my GLP?",
        "Why getting lab work matters",
        "GLPs can blunt addictions?",
        "How to switch from Tirzepatide to Retatrutide",
      ],
    },
    { title: "Peptide Breakdowns", lessons: [] },
    {
      title: "Stacking Peptides",
      lessons: [
        "Semax + Choline: why they work better together",
        "The foundation vitamins most people neglect",
        "Retatrutide + Tesa — the body recomp stack",
        "The KLOW stack explained",
        "SS-31 + MOTS-c — the ultimate energy stack",
        "The longevity stack",
        "Reta + Cagrilintide — the ultimate weight loss duo",
        "CJC-1295 + Ipamorelin explained",
        "Why stacking CJC-1295 and Tesamorelin is redundant",
        "Pumptira / HSN / Peeled (Peptira blends)",
        "How to create your own peptide stack",
        "Why more peptides isn't the same as \"more energy\"",
      ],
    },
    { title: "Peptides For Pets", lessons: [] },
    { title: "Supplements", lessons: [] },
    { title: "Peptides Tips & Tricks", lessons: [] },
    { title: "Bioregulators 101", lessons: [] },
    {
      title: "Bloodwork 101",
      lessons: [
        "Why bloodwork comes before any protocol",
        "Metabolic markers",
        "Liver & kidney function",
        "Lipid panel",
        "CBC basics",
        "Hormone panel",
        "Reading & tracking your labs over time",
        "Where to get your labs done",
      ],
    },
    { title: "Nootropics 101", lessons: [] },
    {
      title: "The Full Energy Course",
      lessons: [
        "What \"energy\" actually means",
        "Rule these out before you spend on peptides",
        "MOTS-c: your mitochondria have their own genes",
        "SS-31 / Elamipretide",
        "The NAD+ pathway — NAD+, NMN, NR and 5-Amino-1MQ",
        "CNS energy vs. cellular energy",
        "Stacking logic",
        "FOXO4-DRI and the senolytic category",
      ],
    },
    { title: "Gut Health", lessons: [] },
  ] satisfies GuideModule[],
} as const;

// Lessons we can actually list. Modules whose lesson list hasn't been supplied
// contribute nothing, so this is a floor — the storefront shows it as "N+".
export const GUIDE_LESSON_COUNT = GUIDE.modules.reduce(
  (sum, m) => sum + m.lessons.length,
  0
);
