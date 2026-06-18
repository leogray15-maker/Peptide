"use client";
import { useLocalStorageItem, writeLocalStorageItem } from "@/lib/useLocalStorage";

const AGE_KEY = "arcane_age_verified";
const TERMS_KEY = "arcane_terms_accepted";

export default function ComplianceGate() {
  const ageOk = useLocalStorageItem(AGE_KEY) !== null;
  const termsOk = useLocalStorageItem(TERMS_KEY) !== null;
  const accepted = ageOk && termsOk;

  if (accepted) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      <DisclaimerModal
        onAccept={() => {
          writeLocalStorageItem(AGE_KEY, "1");
          writeLocalStorageItem(TERMS_KEY, "1");
        }}
        onDecline={() => {
          window.location.href = "https://www.google.com";
        }}
      />
    </div>
  );
}

function DisclaimerModal({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      className="rounded-lg max-w-2xl w-full overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-med)",
      }}
    >
      <div className="px-8 py-6 border-b text-center" style={{ borderColor: "var(--line)" }}>
        <h2
          id="gate-title"
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-syne), sans-serif", color: "#E74C3C" }}
        >
          Disclaimer
        </h2>
      </div>

      <div
        className="px-8 py-6 max-h-80 overflow-y-auto text-sm leading-relaxed space-y-4"
        style={{ color: "var(--muted)" }}
      >
        <p>
          All peptide products (lyophilised powders) and related materials provided by{" "}
          <strong style={{ color: "var(--text)" }}>Arcane Peptides</strong> are strictly
          intended for laboratory research use only. These compounds are not for human or
          veterinary consumption, and no dosing, medical, or therapeutic guidance is supplied
          or implied.
        </p>
        <p>
          Arcane Peptides operates in full accordance with UK regulations governing
          Research-Only chemical supply. All products are supplied exclusively for in-vitro,
          pre-clinical, and scientific research purposes. We are not a pharmacy and do not
          endorse, promote, or recommend the use of any product for personal or clinical
          application.
        </p>
        <p>
          Customers are required to review our{" "}
          <a href="/terms" className="underline" style={{ color: "var(--accent)" }}>
            Terms &amp; Conditions
          </a>{" "}
          prior to purchase to ensure compliance with applicable UK research laws and
          regulations.
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>You must be 18 years of age or older and purchasing for scientific
          research only.</strong>
        </p>
        <p>
          By clicking &ldquo;I Agree&rdquo;, you confirm that you have read, understood, and
          accepted the terms outlined in this disclaimer.
        </p>
      </div>

      <div className="px-8 py-6 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: "var(--line)" }}>
        <button
          onClick={onDecline}
          className="flex-1 py-3 rounded font-semibold text-sm tracking-wide border transition-colors hover:bg-[var(--surface-2)]"
          style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
        >
          I Disagree
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:brightness-110 active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          I Agree
        </button>
      </div>
    </div>
  );
}
