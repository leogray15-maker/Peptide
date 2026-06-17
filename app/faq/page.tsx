import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Answers to common questions about ordering, dispatch, payment, and Arcane Peptides research compounds.",
};

const FAQ_ITEMS = [
  {
    question: "What does 'Research Use Only' mean?",
    answer:
      "All products sold by Arcane Peptides are classified as research chemicals for in-vitro laboratory research use only. They are not approved for human or veterinary use, and must not be used as drugs, food additives, or cosmetics. Purchasers confirm they are qualified researchers using the compounds in a legitimate laboratory context.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Browse the catalogue at /shop, add items to your cart, and proceed to checkout. Select bank transfer or cryptocurrency as your payment method, and follow the on-screen payment instructions. Orders are processed once payment is confirmed.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UK bank transfer (GBP) and cryptocurrency (BTC, ETH, USDT-TRC20). Payment details are provided at checkout with your unique order reference. We do not accept card payments at this time.",
  },
  {
    question: "How long does dispatch take?",
    answer:
      "Orders are dispatched within 24 hours of payment confirmation on working days (Monday–Friday, excluding UK bank holidays). Orders confirmed after 12:00 on Friday will typically dispatch on the following Monday.",
  },
  {
    question: "What shipping options are available?",
    answer:
      "We ship within the UK and to selected EU and international destinations. UK orders are dispatched via Royal Mail Tracked. Free shipping on UK orders over £50. International shipping rates vary — see our Shipping Policy for details.",
  },
  {
    question: "How do I track my order?",
    answer: (
      <>
        Once dispatched, you will receive a Royal Mail tracking number by email. You can also use our{" "}
        <a href="/track-order" style={{ color: "var(--accent)" }} className="underline">
          Track Order
        </a>{" "}
        tool to look up your shipment status.
      </>
    ),
  },
  {
    question: "What is your returns policy?",
    answer:
      "Due to the nature of research chemicals, we cannot accept returns on opened products unless there is a verifiable quality or fulfilment error. Damaged or incorrectly sent orders must be reported within 48 hours of receipt. See our Refund Policy for full details.",
  },
  {
    question: "Are your products tested for purity?",
    answer: (
      <>
        Yes. Every batch is independently tested by an accredited third-party HPLC laboratory to a minimum
        99% purity standard. Certificates of Analysis (COA) for each batch are publicly accessible on our{" "}
        <a href="/lab-tests" style={{ color: "var(--accent)" }} className="underline">
          Lab Tests portal
        </a>
        .
      </>
    ),
  },
  {
    question: "Can I buy as a private individual?",
    answer:
      "Arcane Peptides sells exclusively to researchers, research institutions, and laboratory professionals. By placing an order, purchasers confirm they are qualified researchers using the compounds for legitimate in-vitro laboratory research purposes only.",
  },
  {
    question: "What is bacteriostatic water and why do I need it?",
    answer:
      "Bacteriostatic water (BW) is sterile water containing 0.9% benzyl alcohol. It is the recommended diluent for reconstituting most lyophilised peptide compounds as the benzyl alcohol acts as a preservative, extending the stability of the reconstituted solution. We supply pharmaceutical-grade BW separately.",
  },
  {
    question: "How should I store my compounds?",
    answer: (
      <>
        Unopened lyophilised vials should be stored at –20 °C. Reconstituted solutions should be stored at
        2–8 °C and used within 14–28 days. See our{" "}
        <a href="/storage-handling" style={{ color: "var(--accent)" }} className="underline">
          Storage & Handling
        </a>{" "}
        guide for full protocols.
      </>
    ),
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We ship to selected EU countries and international destinations. Import regulations vary by country — it is the purchaser's sole responsibility to ensure compliance with all applicable import laws and regulations in their jurisdiction before placing an order.",
  },
  {
    question: "How do I use the Peptide Calculator?",
    answer: (
      <>
        Our{" "}
        <a href="/peptide-calculator" style={{ color: "var(--accent)" }} className="underline">
          Peptide Reconstitution Calculator
        </a>{" "}
        is a laboratory reference tool. Enter your peptide mass (mg), the volume of bacteriostatic water
        you are adding (mL), and optionally a target dose — it will output concentration in mg/mL, mcg/mL,
        and syringe graduation reference values.
      </>
    ),
  },
  {
    question: "Do you provide medical advice?",
    answer:
      "No. Arcane Peptides is not a pharmacy and does not provide medical, therapeutic, or dosing advice under any circumstances. All information on this site is for research reference only.",
  },
];

export default function FAQPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Help Centre"
        title="Frequently Asked Questions"
        subtitle="If you can't find an answer, contact us at the link below."
      />
      <div className="max-w-3xl">
        <Accordion items={FAQ_ITEMS} />
      </div>
    </Section>
  );
}
