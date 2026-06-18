import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ComplianceGate from "@/components/compliance/ComplianceGate";
import CookieBanner from "@/components/compliance/CookieBanner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://arcanepeptides.co.uk"),
  title: {
    default: "Arcane Peptides — Verified Research Compounds | UK",
    template: "%s | Arcane Peptides",
  },
  description:
    "Premium HPLC-verified research peptides and compounds. Lyophilised vials, independent COA reports. UK-based. Research use only.",
  keywords: [
    "research peptides UK",
    "buy peptides UK",
    "HPLC verified peptides",
    "BPC-157 UK",
    "Semaglutide research",
    "peptide supplier UK",
    "lyophilised peptides",
    "COA peptides",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://arcanepeptides.co.uk",
    siteName: "Arcane Peptides",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${syne.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <ComplianceGate />
              <CookieBanner />
              <AnnouncementBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
