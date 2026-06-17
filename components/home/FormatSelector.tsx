"use client";
import { useState } from "react";
import Link from "next/link";
import { FlaskConical, Syringe, AlertTriangle } from "lucide-react";

export default function FormatSelector() {
  const [cartridgeAcknowledged, setCartridgeAcknowledged] = useState(false);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Lyophilised Vials */}
      <div
        className="flex flex-col gap-4 p-6 rounded-xl border"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-dim)" }}
        >
          <FlaskConical size={24} style={{ color: "var(--accent)" }} />
        </div>

        <div>
          <p className="label-upper mb-1" style={{ color: "var(--accent)" }}>Recommended</p>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Lyophilised Vials
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Freeze-dried powder for maximum stability at ambient temperature. Reconstitute with
            bacteriostatic water before use. Suitable for all standard lab environments.
          </p>
        </div>

        <ul className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
          {["Room-temperature stable (unopened)", "Reconstitution required", "Longest shelf life", "All research compounds available"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span style={{ color: "var(--green)" }}>✓</span> {item}
            </li>
          ))}
        </ul>

        <Link
          href="/shop?format=Lyophilised+Vial"
          className="mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Browse Lyophilised Vials
        </Link>
      </div>

      {/* Pre-filled Cartridges */}
      <div
        className="flex flex-col gap-4 p-6 rounded-xl border"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(243,156,18,0.1)" }}
        >
          <Syringe size={24} style={{ color: "var(--amber)" }} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="label-upper" style={{ color: "var(--amber)" }}>Strict Handling Required</p>
            <AlertTriangle size={13} style={{ color: "var(--amber)" }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Pre-filled Cartridges
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Pre-reconstituted solution in cartridge format. Requires refrigeration and strict cold-chain
            handling. Only suitable for suitably equipped laboratory environments.
          </p>
        </div>

        <div
          className="p-3 rounded text-xs leading-relaxed"
          style={{ background: "rgba(243,156,18,0.08)", border: "1px solid rgba(243,156,18,0.25)", color: "var(--muted)" }}
        >
          <strong style={{ color: "var(--amber)" }}>Handling Notice:</strong> Pre-filled cartridges require
          continuous 2–8 °C cold chain. Must be stored and handled in a qualified laboratory setting.
          Purchaser assumes full responsibility for proper cold-chain management.
        </div>

        {cartridgeAcknowledged ? (
          <Link
            href="/shop?format=Pre-filled+Cartridge"
            className="mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded font-semibold text-sm border transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--amber)", color: "var(--amber)" }}
          >
            Browse Cartridges
          </Link>
        ) : (
          <button
            onClick={() => setCartridgeAcknowledged(true)}
            className="mt-auto px-5 py-2.5 rounded font-semibold text-sm border transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
          >
            I Acknowledge Handling Requirements
          </button>
        )}
      </div>
    </div>
  );
}
