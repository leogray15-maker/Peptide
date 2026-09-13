// ─── Arcane Peptides 101 — digital guide ──────────────────────────────────
// A downloadable literature bundle sold separately from the compound
// catalogue. It is paid for through a Stripe payment link rather than the
// bank-transfer / crypto checkout, so it never enters the cart.

export interface GuideModule {
  title: string;
  desc: string;
}

export const GUIDE = {
  name: "Arcane Peptides 101",
  tagline: "Everything You Need To Know",
  // Stripe payment link — update here if the product is recreated in Stripe.
  checkoutUrl: "https://buy.stripe.com/5kQ00i39WaBc5J85im0Ba05",
  // TODO: confirm the price. Leave null to show the CTA without a price —
  // the live figure is always the one on the Stripe checkout page.
  priceGBP: null as number | null,
  summary:
    "Twelve written modules covering the research literature behind the compounds we supply — how peptide classes are grouped, how studies describe combining them, and how the wider research landscape fits together. Delivered as an instant digital download.",
  modules: [
    { title: "The Overall Beginners Guide To Peptides", desc: "Start here — the vocabulary, classes and literature landscape." },
    { title: "The Ultimate GLP Course",                 desc: "The GLP-1 / metabolic family, compound by compound." },
    { title: "Peptide Breakdowns",                      desc: "Individual compound profiles and the studies behind them." },
    { title: "Stacking Peptides",                       desc: "How combinations are grouped and discussed in the literature." },
    { title: "Peptides For Pets",                       desc: "Veterinary research context and where it differs." },
    { title: "Supplements",                             desc: "Where supplements sit alongside peptide research." },
    { title: "Peptides Tips & Tricks",                  desc: "Handling, reconstitution and storage practicalities." },
    { title: "Bioregulators 101",                       desc: "Short-chain bioregulators and the ageing research around them." },
    { title: "Bloodwork 101",                           desc: "Reading the markers research papers report on." },
    { title: "Nootropics 101",                          desc: "Cognitive compounds and the nootropic literature." },
    { title: "The Full Energy Course",                  desc: "Mitochondrial and cellular-energy research." },
    { title: "Gut Health",                              desc: "Gut and mucosal research compounds." },
  ] satisfies GuideModule[],
} as const;
