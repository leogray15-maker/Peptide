"use client";
import { useLocalStorageItem, writeLocalStorageItem } from "@/lib/useLocalStorage";

const AGE_KEY = "arcane_age_verified";
const TERMS_KEY = "arcane_terms_accepted";

export default function ComplianceGate() {
  const ageOk = useLocalStorageItem(AGE_KEY) !== null;
  const termsOk = useLocalStorageItem(TERMS_KEY) !== null;
  const step: "age" | "terms" | "done" = !ageOk ? "age" : !termsOk ? "terms" : "done";

  if (step === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {step === "age" && (
        <AgeGate
          onAccept={() => writeLocalStorageItem(AGE_KEY, "1")}
          onDecline={() => {
            window.location.href = "https://www.google.com";
          }}
        />
      )}

      {step === "terms" && (
        <TermsModal
          onAccept={() => writeLocalStorageItem(TERMS_KEY, "1")}
        />
      )}
    </div>
  );
}

function AgeGate({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      className="rounded-lg p-8 sm:p-12 max-w-md w-full text-center"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-med)",
      }}
    >
      {/* Sigil */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 28 28"
        fill="none"
        className="mx-auto mb-6"
        aria-hidden="true"
      >
        <polygon
          points="14,2 26,8 26,20 14,26 2,20 2,8"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="14" cy="14" r="2.5" fill="var(--accent)" />
      </svg>

      <p className="label-upper mb-3" id="gate-title">Age Verification</p>
      <h2
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: "var(--font-syne), sans-serif" }}
      >
        You must be 18 or over to enter this site
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Arcane Peptides sells research compounds strictly for laboratory use.
        This site is intended for qualified researchers only.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAccept}
          className="flex-1 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:brightness-110 active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          I AM 18 OR OVER
        </button>
        <button
          onClick={onDecline}
          className="flex-1 py-3 rounded font-semibold text-sm tracking-wide border transition-colors hover:bg-[var(--surface-2)]"
          style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
        >
          I AM UNDER 18
        </button>
      </div>
    </div>
  );
}

function TermsModal({ onAccept }: { onAccept: () => void }) {
  return (
    <div
      className="rounded-lg max-w-2xl w-full overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-med)",
      }}
    >
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--line)" }}>
        <p className="label-upper mb-1" id="gate-title">Research Use Disclaimer</p>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Please Read Before Entering
        </h2>
      </div>

      <div
        className="px-8 py-6 max-h-72 overflow-y-auto text-sm leading-relaxed space-y-4"
        style={{ color: "var(--muted)" }}
      >
        <p>
          All products sold by Arcane Peptides are supplied exclusively as{" "}
          <strong style={{ color: "var(--text)" }}>
            research chemicals for in-vitro laboratory research use only
          </strong>
          . They are <strong style={{ color: "var(--text)" }}>not</strong> licensed
          medicinal products and are not intended for administration to humans or animals
          under any circumstances.
        </p>
        <p>
          These products have <strong style={{ color: "var(--text)" }}>not</strong> been
          evaluated or approved by the MHRA, FDA, or any other regulatory body for
          therapeutic, diagnostic, or prophylactic use. They must not be used as drugs,
          food additives, cosmetics, or any other product for human or veterinary
          consumption.
        </p>
        <p>
          By entering this website and placing an order you confirm that:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You are a qualified researcher or are purchasing on behalf of a legitimate research institution.</li>
          <li>You will use these products solely for lawful in-vitro laboratory research.</li>
          <li>You accept full and sole responsibility for compliance with all laws and regulations applicable in your jurisdiction.</li>
          <li>You are 18 years of age or older.</li>
          <li>You have read, understood, and agree to our full <a href="/terms" className="underline" style={{ color: "var(--accent)" }}>Terms & Conditions</a> and <a href="/privacy" className="underline" style={{ color: "var(--accent)" }}>Privacy Policy</a>.</li>
        </ul>
        <p>
          Arcane Peptides reserves the right to refuse sale to any individual or entity that it suspects
          intends to use its products for any purpose other than legitimate scientific research.
        </p>
      </div>

      <div className="px-8 py-6 border-t" style={{ borderColor: "var(--line)" }}>
        <button
          onClick={onAccept}
          className="w-full py-3 rounded font-semibold text-sm tracking-wide transition-all hover:brightness-110 active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          I UNDERSTAND — ENTER SITE
        </button>
        <p className="mt-3 text-xs text-center" style={{ color: "var(--subtle)" }}>
          Clicking above constitutes your agreement to the terms above and our full Terms & Conditions.
        </p>
      </div>
    </div>
  );
}
