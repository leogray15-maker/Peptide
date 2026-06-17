"use client";
import { useState, useMemo } from "react";

interface CalculationResult {
  concentrationMgPerMl: number;
  concentrationMcgPerUl: number;
  unitsPerDose: number | null;
  mcgPer10Units: number;
  mcgPer20Units: number;
  mcgPer50Units: number;
  mcgPer100Units: number;
}

export default function PeptideCalculatorClient() {
  const [peptideMg, setPeptideMg] = useState<string>("5");
  const [waterMl, setWaterMl] = useState<string>("2");
  const [targetMcg, setTargetMcg] = useState<string>("");

  const result = useMemo((): CalculationResult | null => {
    const mg = parseFloat(peptideMg);
    const ml = parseFloat(waterMl);
    if (!mg || !ml || mg <= 0 || ml <= 0) return null;

    const concentrationMgPerMl  = mg / ml;
    const concentrationMcgPerUl = concentrationMgPerMl * 1000; // mcg per mL ÷ 1000 = mcg per µL; but per 1 unit (10µL) on insulin syringe...
    // On a U-100 insulin syringe, 1 unit = 10 µL
    const mcgPerUnit = concentrationMgPerMl * 0.01; // mg/mL × 0.01 mL/unit = mg/unit; × 1000 = mcg

    const target = parseFloat(targetMcg);
    const unitsPerDose = !isNaN(target) && target > 0 ? target / (mcgPerUnit * 1000) : null;

    return {
      concentrationMgPerMl,
      concentrationMcgPerUl: concentrationMcgPerUl / 100, // mcg per µL
      unitsPerDose,
      mcgPer10Units:  mcgPerUnit * 10 * 1000,
      mcgPer20Units:  mcgPerUnit * 20 * 1000,
      mcgPer50Units:  mcgPerUnit * 50 * 1000,
      mcgPer100Units: mcgPerUnit * 100 * 1000,
    };
  }, [peptideMg, waterMl, targetMcg]);

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Inputs */}
      <div
        className="p-6 rounded-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <p className="label-upper mb-6">Inputs</p>

        <div className="flex flex-col gap-5">
          <CalcField
            label="Peptide Amount (mg)"
            value={peptideMg}
            onChange={setPeptideMg}
            unit="mg"
            hint="Total mass in the vial (e.g. 5)"
          />
          <CalcField
            label="Bacteriostatic Water Added (mL)"
            value={waterMl}
            onChange={setWaterMl}
            unit="mL"
            hint="Volume of BW used for reconstitution (e.g. 2)"
          />
          <CalcField
            label="Target Dose (optional, mcg)"
            value={targetMcg}
            onChange={setTargetMcg}
            unit="mcg"
            hint="Desired research dose in micrograms — calculates units to draw"
          />
        </div>

        {/* mg↔mL helpers */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
          <p className="label-upper mb-3">Quick Reference</p>
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <div>1 mg = 1,000 mcg</div>
            <div>1 mL = 1,000 µL</div>
            <div>1 IU (GH) ≈ 0.333 mg</div>
            <div>1 U-100 unit = 10 µL</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className="p-6 rounded-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <p className="label-upper mb-6">Results</p>

        {!result ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Enter peptide amount and water volume to calculate.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <ResultRow
              label="Concentration"
              value={`${result.concentrationMgPerMl.toFixed(3)} mg/mL`}
              sub={`${(result.concentrationMgPerMl * 1000).toFixed(1)} mcg/mL`}
              highlight
            />

            <div>
              <p className="label-upper mb-3">Insulin Syringe (U-100) Reference</p>
              <div className="overflow-hidden rounded-lg" style={{ border: "1px solid var(--line)" }}>
                {[
                  { units: "10 units (0.1 mL)", mcg: result.mcgPer10Units },
                  { units: "20 units (0.2 mL)", mcg: result.mcgPer20Units },
                  { units: "50 units (0.5 mL)", mcg: result.mcgPer50Units },
                  { units: "100 units (1.0 mL)", mcg: result.mcgPer100Units },
                ].map(({ units, mcg }) => (
                  <div
                    key={units}
                    className="flex justify-between items-center px-4 py-2.5 text-sm border-b last:border-0"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span style={{ color: "var(--muted)" }}>{units}</span>
                    <span className="font-semibold" style={{ color: "var(--text)" }}>
                      {mcg.toFixed(1)} mcg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.unitsPerDose !== null && (
              <ResultRow
                label={`Units to draw for ${targetMcg} mcg`}
                value={`${result.unitsPerDose.toFixed(1)} units`}
                sub={`on a U-100 insulin syringe`}
                highlight
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CalcField({
  label, value, onChange, unit, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="label-upper block mb-1.5">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="0"
          step="any"
          className="flex-1 px-3 py-2.5 text-sm rounded-l-lg border border-r-0"
          style={{
            background: "var(--surface-2)",
            borderColor: "var(--line-med)",
            color: "var(--text)",
            outline: "none",
          }}
        />
        <span
          className="px-3 py-2.5 text-sm flex items-center rounded-r-lg border font-medium"
          style={{
            background: "var(--surface-3)",
            borderColor: "var(--line-med)",
            color: "var(--muted)",
            minWidth: "3.5rem",
            justifyContent: "center",
          }}
        >
          {unit}
        </span>
      </div>
      {hint && <p className="mt-1 text-xs" style={{ color: "var(--subtle)" }}>{hint}</p>}
    </div>
  );
}

function ResultRow({
  label, value, sub, highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg"
      style={{
        background: highlight ? "var(--accent-dim)" : "var(--surface-2)",
        border: `1px solid ${highlight ? "rgba(124,111,240,0.3)" : "var(--line)"}`,
      }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <div className="text-right">
        <p className="font-bold text-base" style={{ color: highlight ? "var(--accent)" : "var(--text)" }}>
          {value}
        </p>
        {sub && <p className="text-xs" style={{ color: "var(--muted)" }}>{sub}</p>}
      </div>
    </div>
  );
}
