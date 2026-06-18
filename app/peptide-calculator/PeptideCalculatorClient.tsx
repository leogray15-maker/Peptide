"use client";
import { useMemo, useState } from "react";

type DoseUnit = "mg" | "mcg";

const VIAL_MG_OPTIONS = [1, 2, 5, 10, 15, 20, 30, 50, 100];
const WATER_ML_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 5];
const DOSE_MG_OPTIONS = [0.1, 0.25, 0.5, 1, 2, 2.5, 5, 7.5, 10, 12.5, 15];
const DOSE_MCG_OPTIONS = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];

const SYRINGE_CAPACITY_UNITS = 100; // standard U-100, 1 mL insulin syringe

interface CalculationResult {
  concentrationMgPerMl: number;
  concentrationMcgPerMl: number;
  doseMcg: number;
  unitsToDraw: number;
  mlToDraw: number;
  dosesInVial: number;
  overCapacity: boolean;
}

export default function PeptideCalculatorClient() {
  const [vialMg, setVialMg] = useState<string>("5");
  const [waterMl, setWaterMl] = useState<string>("2");
  const [doseUnit, setDoseUnit] = useState<DoseUnit>("mcg");
  const [doseValue, setDoseValue] = useState<string>("250");

  const result = useMemo((): CalculationResult | null => {
    const mg = parseFloat(vialMg);
    const ml = parseFloat(waterMl);
    const dose = parseFloat(doseValue);
    if (!mg || !ml || mg <= 0 || ml <= 0 || !dose || dose <= 0) return null;

    const concentrationMgPerMl = mg / ml;
    const concentrationMcgPerMl = concentrationMgPerMl * 1000;
    const doseMcg = doseUnit === "mg" ? dose * 1000 : dose;

    const mlToDraw = doseMcg / concentrationMcgPerMl;
    const unitsToDraw = mlToDraw * 100; // 1 mL = 100 units on a U-100 syringe

    return {
      concentrationMgPerMl,
      concentrationMcgPerMl,
      doseMcg,
      unitsToDraw,
      mlToDraw,
      dosesInVial: Math.floor((mg * 1000) / doseMcg),
      overCapacity: unitsToDraw > SYRINGE_CAPACITY_UNITS,
    };
  }, [vialMg, waterMl, doseUnit, doseValue]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div
        className="p-6 rounded-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <p className="label-upper mb-6">Inputs</p>

        <div className="flex flex-col gap-7">
          <ChipField
            label="Peptide Amount in Vial"
            value={vialMg}
            onChange={setVialMg}
            options={VIAL_MG_OPTIONS}
            unit="mg"
            hint="Total peptide mass in the vial"
          />
          <ChipField
            label="Bacteriostatic Water Added"
            value={waterMl}
            onChange={setWaterMl}
            options={WATER_ML_OPTIONS}
            unit="mL"
            hint="Volume of diluent used for reconstitution"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label-upper">Target Dose</label>
              <div
                className="flex rounded-md overflow-hidden border text-xs font-semibold"
                style={{ borderColor: "var(--line-med)" }}
              >
                {(["mcg", "mg"] as DoseUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setDoseUnit(u);
                      setDoseValue(u === "mg" ? "2.5" : "250");
                    }}
                    className="px-3 py-1 transition-colors"
                    style={{
                      background: doseUnit === u ? "var(--accent)" : "var(--surface-2)",
                      color: doseUnit === u ? "#fff" : "var(--muted)",
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <ChipField
              value={doseValue}
              onChange={setDoseValue}
              options={doseUnit === "mg" ? DOSE_MG_OPTIONS : DOSE_MCG_OPTIONS}
              unit={doseUnit}
              hint="Desired research dose — calculates units to draw"
            />
          </div>
        </div>

        {/* mg<->mL helpers */}
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
            Enter the vial amount, water volume, and target dose to calculate.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <ResultRow
                label="Peptide Dose"
                value={
                  doseUnit === "mg"
                    ? `${parseFloat(doseValue).toString()} mg`
                    : `${parseFloat(doseValue).toString()} mcg`
                }
              />
              <ResultRow
                label="Concentration"
                value={`${result.concentrationMgPerMl.toFixed(3)} mg/mL`}
                sub={`${result.concentrationMcgPerMl.toFixed(0)} mcg/mL`}
              />
            </div>

            <ResultRow
              label="Draw Syringe To"
              value={`${result.unitsToDraw.toFixed(1)} units`}
              sub={`${result.mlToDraw.toFixed(3)} mL on a U-100 insulin syringe`}
              highlight={!result.overCapacity}
              warning={result.overCapacity}
            />

            {result.overCapacity && (
              <p
                className="text-xs leading-relaxed -mt-2 p-3 rounded-lg"
                style={{ background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.25)", color: "var(--muted)" }}
              >
                This dose exceeds the 100-unit (1 mL) capacity of a single U-100 syringe at the
                current concentration. Add more bacteriostatic water to reduce concentration, or
                split the draw across two syringes.
              </p>
            )}

            <SyringeVisual units={result.unitsToDraw} capacity={SYRINGE_CAPACITY_UNITS} />

            <ResultRow
              label="Your Vial Contains"
              value={`${result.dosesInVial} dose${result.dosesInVial !== 1 ? "s" : ""}`}
              sub={`at ${doseUnit === "mg" ? parseFloat(doseValue) : parseFloat(doseValue)} ${doseUnit} per dose`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ChipField({
  label, value, onChange, options, unit, hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: number[];
  unit: string;
  hint?: string;
}) {
  const selectedNum = parseFloat(value);

  return (
    <div>
      {label && <label className="label-upper block mb-2">{label}</label>}
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(String(opt))}
            className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style={{
              borderColor: selectedNum === opt ? "var(--accent)" : "var(--line-med)",
              background: selectedNum === opt ? "var(--accent-dim)" : "transparent",
              color: selectedNum === opt ? "var(--accent)" : "var(--muted)",
            }}
          >
            {opt}{unit}
          </button>
        ))}
      </div>
      <div className="flex">
        <input
          type="number"
          inputMode="decimal"
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
          className="px-3 py-2.5 text-sm flex items-center justify-center rounded-r-lg border font-medium"
          style={{
            background: "var(--surface-3)",
            borderColor: "var(--line-med)",
            color: "var(--muted)",
            minWidth: "3.5rem",
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
  label, value, sub, highlight, warning,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  const accentColor = warning ? "#E74C3C" : "var(--accent)";
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg"
      style={{
        background: warning ? "rgba(231,76,60,0.06)" : highlight ? "var(--accent-dim)" : "var(--surface-2)",
        border: `1px solid ${warning ? "rgba(231,76,60,0.25)" : highlight ? "rgba(111,99,216,0.3)" : "var(--line)"}`,
      }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <div className="text-right">
        <p className="font-bold text-base" style={{ color: highlight || warning ? accentColor : "var(--text)" }}>
          {value}
        </p>
        {sub && <p className="text-xs" style={{ color: "var(--muted)" }}>{sub}</p>}
      </div>
    </div>
  );
}

function SyringeVisual({ units, capacity }: { units: number; capacity: number }) {
  const clamped = Math.min(Math.max(units, 0), capacity);
  const fillPct = (clamped / capacity) * 100;
  const overCapacity = units > capacity;

  const majorTicks = Array.from({ length: capacity / 10 }, (_, i) => (i + 1) * 10);

  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
    >
      <p className="label-upper mb-4">Syringe Fill (U-100, 1 mL)</p>

      <div className="flex items-center gap-0 select-none" aria-hidden="true">
        {/* needle */}
        <div style={{ width: 18, height: 3, background: "var(--subtle)", flexShrink: 0 }} />
        <div
          style={{
            width: 10,
            height: 14,
            background: "var(--surface-3)",
            border: "1px solid var(--line-med)",
            borderRadius: "2px 0 0 2px",
            flexShrink: 0,
          }}
        />

        {/* barrel */}
        <div
          className="relative flex-1"
          style={{
            height: 36,
            background: "var(--surface)",
            border: "2px solid var(--line-med)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* fill */}
          <div
            className="absolute top-0 left-0 h-full transition-all duration-300"
            style={{
              width: `${fillPct}%`,
              background: overCapacity ? "rgba(231,76,60,0.55)" : "var(--accent)",
              opacity: 0.85,
            }}
          />

          {/* tick marks */}
          {Array.from({ length: capacity }, (_, i) => i + 1).map((tick) => (
            <div
              key={tick}
              className="absolute top-0"
              style={{
                left: `${(tick / capacity) * 100}%`,
                width: 1,
                height: tick % 10 === 0 ? "70%" : tick % 5 === 0 ? "50%" : "32%",
                background: "var(--line-med)",
              }}
            />
          ))}

          {/* draw-to marker */}
          {!overCapacity && (
            <div
              className="absolute top-0 h-full"
              style={{ left: `${fillPct}%`, width: 2, background: "var(--text)" }}
            />
          )}
        </div>

        {/* plunger */}
        <div
          style={{
            width: 8,
            height: 44,
            background: "var(--surface-3)",
            border: "1px solid var(--line-med)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            width: 16,
            height: 28,
            background: "var(--line-med)",
            borderRadius: 6,
            flexShrink: 0,
          }}
        />
      </div>

      {/* tick labels — mirrors the barrel's flex layout so percentages line up exactly */}
      <div className="flex items-start mt-1.5 h-4 text-[10px]" style={{ color: "var(--muted)" }} aria-hidden="true">
        <div style={{ width: 18 + 10, flexShrink: 0 }} />
        <div className="relative flex-1 h-full">
          {majorTicks.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2"
              style={{ left: `${(tick / capacity) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div style={{ width: 8 + 16, flexShrink: 0 }} />
      </div>

      <p className="mt-3 text-sm font-semibold" style={{ color: overCapacity ? "#E74C3C" : "var(--text)" }}>
        {overCapacity
          ? `Exceeds syringe capacity (${units.toFixed(1)} units)`
          : `Draw to ${units.toFixed(1)} units`}
      </p>
    </div>
  );
}
