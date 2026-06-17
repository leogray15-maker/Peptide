import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your Arcane Peptides order using your Royal Mail tracking number.",
};

export default function TrackOrderPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Order Tracking"
        title="Track Your Order"
        subtitle="Enter your Royal Mail tracking number to check the status of your shipment."
      />
      <TrackOrderClient />
    </Section>
  );
}
