import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in to your Arcane Peptides account to view prices and place orders.",
};

export default function AccountPage() {
  return (
    <Section>
      <SectionHead
        eyebrow="Account"
        title="Account"
        subtitle="Sign in to view prices and place orders. New here? Creating an account takes a few seconds."
      />
      <AccountClient />
    </Section>
  );
}
