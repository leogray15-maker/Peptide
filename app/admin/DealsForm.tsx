"use client";
import { useEffect, useState } from "react";
import { Check, Plus, Save, Trash2, Tag } from "lucide-react";
import {
  getPromotions,
  savePromotions,
  DEFAULT_SOCIAL_PROOF,
  type Promotions,
  type SocialProofSettings,
} from "@/lib/db/promotions";
import {
  DEAL_PRESETS,
  DEAL_TYPE_META,
  EMPTY_DEAL,
  type Deal,
  type DealType,
} from "@/lib/deals";

const DEAL_TYPES = Object.keys(DEAL_TYPE_META) as DealType[];

function newId(): string {
  return `deal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function DealsForm() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProofSettings>(DEFAULT_SOCIAL_PROOF);
  const [presetKey, setPresetKey] = useState(DEAL_PRESETS[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPromotions()
      .then((p: Promotions) => {
        if (!active) return;
        setDeals(p.deals);
        setSocialProof(p.socialProof);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Could not load saved deals.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function touch() {
    setSaved(false);
  }

  function addPreset() {
    const preset = DEAL_PRESETS.find((p) => p.key === presetKey);
    const base = preset ? preset.deal : EMPTY_DEAL;
    setDeals((prev) => [...prev, { ...base, id: newId() }]);
    touch();
  }

  function addCustom() {
    setDeals((prev) => [...prev, { ...EMPTY_DEAL, label: "New deal", id: newId() }]);
    touch();
  }

  function patchDeal(id: string, patch: Partial<Deal>) {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    touch();
  }

  function removeDeal(id: string) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    touch();
  }

  function patchSocialProof(patch: Partial<SocialProofSettings>) {
    setSocialProof((prev) => ({ ...prev, ...patch }));
    touch();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await savePromotions({
        // Guard against a max gap below the min — the popup timer would throw
        // the range away and fire back-to-back.
        deals,
        socialProof: {
          ...socialProof,
          maxGapSec: Math.max(socialProof.minGapSec, socialProof.maxGapSec),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      const code = (err as { code?: string })?.code ?? "";
      if (code === "permission-denied") {
        setError(
          "Save denied by Firestore rules. Publish the updated rules (they must include the /settings block) and make sure you're signed in as an admin email."
        );
      } else if (code === "deadline-exceeded" || code === "unavailable") {
        setError("Couldn't reach Firestore (request timed out). Check your connection, then try again.");
      } else {
        setError(`Save failed${code ? ` (${code})` : ""}. Confirm you're signed in as an admin and the rules are published.`);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: "var(--muted)" }}>Loading deals…</p>;

  const liveCount = deals.filter((d) => d.enabled).length;

  return (
    <form onSubmit={handleSave} className="max-w-3xl flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Deals apply automatically to every basket as soon as they&apos;re switched on — no
        redeploy needed. Give a deal a code instead if you only want customers who enter it
        at checkout to get it. {liveCount} deal{liveCount !== 1 ? "s" : ""} currently live.
      </p>

      {/* Add a deal */}
      <div
        className="p-5 rounded-lg flex flex-wrap items-end gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <label className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
          <span className="label-upper">Start from a preset</span>
          <select
            value={presetKey}
            onChange={(e) => setPresetKey(e.target.value)}
            className="text-sm rounded px-3 py-2 border"
            style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
          >
            {DEAL_PRESETS.map((p) => (
              <option key={p.key} value={p.key}>{p.name}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={addPreset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Plus size={15} /> Add Deal
        </button>
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold border transition-colors hover:bg-[var(--surface-2)]"
          style={{ borderColor: "var(--line-med)", color: "var(--muted)" }}
        >
          Custom
        </button>
      </div>

      {/* Saved deals */}
      {deals.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No deals yet. Pick a preset above to run your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onChange={(patch) => patchDeal(deal.id, patch)}
              onRemove={() => removeDeal(deal.id)}
            />
          ))}
        </div>
      )}

      {/* Social proof */}
      <div
        className="p-5 rounded-lg flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label-upper">Live activity popups</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Small notifications showing recent shopper activity (&ldquo;… is at checkout&rdquo;,
              &ldquo;… ordered 2 × GHK-Cu 50 mg&rdquo;). Products come from the live catalogue.
            </p>
          </div>
          <Toggle
            checked={socialProof.enabled}
            onChange={(enabled) => patchSocialProof({ enabled })}
            label="Show popups"
          />
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <NumberField
            label="First popup after (s)"
            value={socialProof.initialDelaySec}
            min={0}
            onChange={(initialDelaySec) => patchSocialProof({ initialDelaySec })}
          />
          <NumberField
            label="Min gap (s)"
            value={socialProof.minGapSec}
            min={5}
            onChange={(minGapSec) => patchSocialProof({ minGapSec })}
          />
          <NumberField
            label="Max gap (s)"
            value={socialProof.maxGapSec}
            min={5}
            onChange={(maxGapSec) => patchSocialProof({ maxGapSec })}
          />
          <NumberField
            label="Visible for (s)"
            value={socialProof.visibleSec}
            min={2}
            onChange={(visibleSec) => patchSocialProof({ visibleSec })}
          />
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: "#E74C3C" }}>{error}</p>}

      <div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? "Saving…" : saved ? "Saved" : "Save Deals"}
        </button>
      </div>
    </form>
  );
}

function DealCard({
  deal,
  onChange,
  onRemove,
}: {
  deal: Deal;
  onChange: (patch: Partial<Deal>) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="p-5 rounded-lg flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: `1px solid ${deal.enabled ? "var(--accent)" : "var(--line)"}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Tag size={15} style={{ color: deal.enabled ? "var(--accent)" : "var(--subtle)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            {DEAL_TYPE_META[deal.type].label}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Toggle checked={deal.enabled} onChange={(enabled) => onChange({ enabled })} label="Live" />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete deal ${deal.label || deal.id}`}
            className="p-1.5 rounded transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: "var(--subtle)" }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Headline shown to customers"
          value={deal.label}
          placeholder="20% off everything"
          onChange={(label) => onChange({ label })}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Deal type</span>
          <select
            value={deal.type}
            onChange={(e) => onChange({ type: e.target.value as DealType })}
            className="text-sm rounded px-3 py-2 border"
            style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
          >
            {DEAL_TYPES.map((t) => (
              <option key={t} value={t}>{DEAL_TYPE_META[t].label}</option>
            ))}
          </select>
        </label>

        {deal.type === "percent_off" && (
          <NumberField
            label="Percent off (%)"
            value={deal.percentOff}
            min={0}
            max={100}
            onChange={(percentOff) => onChange({ percentOff })}
          />
        )}

        {deal.type === "amount_off" && (
          <NumberField
            label="Amount off (£)"
            value={deal.amountOffGBP}
            min={0}
            step={0.01}
            onChange={(amountOffGBP) => onChange({ amountOffGBP })}
          />
        )}

        {deal.type === "bogo" && (
          <>
            <NumberField
              label="Buy (qty)"
              value={deal.buyQty}
              min={1}
              onChange={(buyQty) => onChange({ buyQty })}
            />
            <NumberField
              label="Get free (qty)"
              value={deal.getQty}
              min={1}
              onChange={(getQty) => onChange({ getQty })}
            />
          </>
        )}

        {deal.type === "free_gift" && (
          <TextField
            label="Free item"
            value={deal.giftName}
            placeholder="Bacteriostatic Water 10 ml"
            onChange={(giftName) => onChange({ giftName })}
          />
        )}

        <NumberField
          label="Minimum spend (£) — 0 for none"
          value={deal.minSpendGBP}
          min={0}
          step={0.01}
          onChange={(minSpendGBP) => onChange({ minSpendGBP })}
        />
        <TextField
          label="Code (leave blank to apply automatically)"
          value={deal.code}
          placeholder="e.g. SUMMER20"
          onChange={(code) => onChange({ code: code.toUpperCase() })}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--subtle)" }}>
        {DEAL_TYPE_META[deal.type].hint}
      </p>
    </div>
  );
}

function TextField({
  label, value, placeholder, onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm rounded px-3 py-2 border"
        style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
      />
    </label>
  );
}

function NumberField({
  label, value, min, max, step, onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => {
          const next = Number(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className="text-sm rounded px-3 py-2 border"
        style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
      />
    </label>
  );
}

function Toggle({
  checked, onChange, label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer shrink-0" style={{ color: "var(--muted)" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[var(--accent)]"
      />
      {label}
    </label>
  );
}
