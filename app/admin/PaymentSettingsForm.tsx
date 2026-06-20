"use client";
import { useState, useEffect } from "react";
import { Check, Save } from "lucide-react";
import {
  getPaymentSettings,
  savePaymentSettings,
  PAYMENT_FIELDS,
  EMPTY_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/lib/db/settings";

const GROUPS = ["Bank Transfer", "Crypto Wallets"] as const;

export default function PaymentSettingsForm() {
  const [values, setValues] = useState<PaymentSettings>(EMPTY_PAYMENT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPaymentSettings()
      .then((s) => {
        if (!active) return;
        if (s) setValues({ ...EMPTY_PAYMENT_SETTINGS, ...s });
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Could not load saved payment settings.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function set(key: keyof PaymentSettings, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await savePaymentSettings(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Save failed — confirm you're signed in as an admin and the rules are published.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p style={{ color: "var(--muted)" }}>Loading settings…</p>;
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl flex flex-col gap-6">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        These details are shown to customers at checkout. Saved values override the
        environment-variable defaults. Leave a field blank to fall back to the default.
      </p>

      {GROUPS.map((group) => (
        <div
          key={group}
          className="p-5 rounded-lg flex flex-col gap-4"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <p className="label-upper">{group}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PAYMENT_FIELDS.filter((f) => f.group === group).map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5">
                <span className="text-xs" style={{ color: "var(--muted)" }}>{f.label}</span>
                <input
                  type="text"
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="text-sm rounded px-3 py-2 border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--line-med)", color: "var(--text)" }}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-sm" style={{ color: "#E74C3C" }}>{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? "Saving…" : saved ? "Saved" : "Save Payment Details"}
        </button>
      </div>
    </form>
  );
}
