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
    {
      title: "Peptide Breakdowns",
      lessons: [
        "BPC-157 — the healing peptide explained",
        "BPC-157: oral or injectable",
        "KPV — the anti-inflammatory peptide you're missing",
        "CJC-1295 + Ipamorelin: the GH stack explained",
        "AOD-9604: the sleeper fat loss agent",
        "Semax vs Selank — what's the difference?",
        "IGF-1 LR3 — the \"muscle building peptide\"",
        "Sermorelin 101 (the safe GH secretagogue?)",
        "GHK-Cu (copper peptide) — full breakdown",
        "Tesamorelin — the \"visceral fat shredder\"",
        "MT-1 (Melanotan I) — the full breakdown",
        "MT-2 (Melanotan II) — the full breakdown",
        "NAD+ — energy/healing in a bottle",
        "Cagrilintide 101 (the secret appetite suppressant)",
        "5-Amino-1MQ (the sleeper fat killer)",
        "Cerebrolysin — the brain peptide you've never heard of",
        "The love peptide — PT-141",
        "VIP: the ultimate vasodilator",
        "Kisspeptin — the master hormonal peptide",
        "Thymosin Alpha-1 — the master immunity peptide",
        "Adamax — the brain peptide stronger than Semax",
        "CJC-1295 — the ultimate growth hormone analog",
        "SS-31 — the mitochondrial repair peptide",
        "HGH — the complete breakdown",
        "ARA-290 — the neuropathy peptide",
        "Enclomiphene — raise testosterone without anabolics",
        "Glutathione — your body's master antioxidant",
        "MOTS-c — the ultimate mitochondria peptide",
        "FOXO4-DRI (the zombie cell killer)",
        "Phenibut — the ultimate \"chill\" compound",
        "Tadalafil — the most underrated compound in health",
        "MK-677 (Ibutamoren) — the oral GH secretagogue",
        "Dihexa — the brain strengthening peptide",
        "GB-115 — ultimate anxiolytic",
        "TB-500 — the ultimate healing peptide",
        "DSIP — the sleep peptide nobody talks about enough",
        "SLU-PP-332 — the exercise mimetic deep dive",
        "AHK-Cu — the other copper peptide for hair & skin",
        "LL-37 — the natural antibiotic peptide",
        "The dopamine reset button (kinda) — 9-Me-BC",
        "ATX-304: the secret health compound",
      ],
    },
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
    {
      title: "Peptides For Pets",
      lessons: [
        "BPC-157 (Body Protection Compound) for tissue healing in animals",
        "TB-500 — systemic tissue remodeling",
        "KPV — the anti-inflammatory",
        "Practical notes for working with a vet",
        "Canine BPC-157 protocol chart",
      ],
    },
    {
      title: "Supplements",
      lessons: [
        "Usefulness of creatine",
        "CoQ10 (cognition)",
        "Supplements for focus and energy",
        "Lipo-C, homocysteine & lab work",
        "Fiber is NOT the enemy",
      ],
    },
    {
      title: "Peptides Tips & Tricks",
      lessons: [
        "Why timing matters more than dose with IGF-1 LR3",
        "Why stacking multiple GLP-1s isn't a good idea",
        "3 underrated peptides nobody's talking about",
        "Free testosterone vs. total testosterone",
        "How to make your own peptide stack",
        "Ways you're wasting your Tesamorelin",
        "How to switch from Tirzepatide to Retatrutide",
        "Why your syringe has bubbles, and what that means",
        "How to use a peptide calculator the right way",
        "Skin sensitivity with Retatrutide",
        "Research language explained",
        "How to travel with peptides",
        "Which \"energy\" peptide is actually right for you?",
      ],
    },
    {
      title: "Bioregulators 101",
      lessons: [
        "The ultimate guide to bioregulators",
        "Cartalax: the bioregulator for tissue & cartilage",
        "Epithalon — the longevity peptide",
        "Pinealon: the peptide that talks to your DNA",
      ],
    },
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
    {
      title: "Nootropics 101",
      lessons: [
        "How nootropics actually work",
        "The racetam family",
        "Peptide nootropics",
        "Where to start / stacking logic",
      ],
    },
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
    {
      title: "Gut Health",
      lessons: [
        "Why gut health is a performance variable",
        "How people damage their gut",
        "Recognizing the warning signs",
        "The barrier itself",
        "Where peptides fit into gut repair",
        "The foundational supplement layer",
        "Diet and lifestyle",
        "Putting it together",
      ],
    },
  ] satisfies GuideModule[],
} as const;

export const GUIDE_LESSON_COUNT = GUIDE.modules.reduce(
  (sum, m) => sum + m.lessons.length,
  0
);

// True once every module has its lesson list, so the storefront can drop the
// "+" it shows while some lists are still outstanding.
export const GUIDE_LESSONS_COMPLETE = GUIDE.modules.every(
  (m) => m.lessons.length > 0
);
