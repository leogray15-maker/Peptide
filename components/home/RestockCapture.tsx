"use client";
import { useState } from "react";
import { Bell } from "lucide-react";

export default function RestockCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to email list / CRM
    setSubmitted(true);
  }

  return (
    <div
      className="rounded-xl p-8 sm:p-12 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: "var(--accent-dim)" }}
      >
        <Bell size={22} style={{ color: "var(--accent)" }} />
      </div>

      <p className="label-upper mb-2">Restock Alerts</p>
      <h2
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: "var(--font-syne), sans-serif" }}
      >
        Never Miss a Restock
      </h2>
      <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
        We email about restocks only. No marketing. Unsubscribe at any time.
      </p>

      {submitted ? (
        <p
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
          style={{ background: "rgba(46,204,113,0.1)", color: "var(--green)", border: "1px solid rgba(46,204,113,0.3)" }}
        >
          ✓ You&apos;re on the list
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded text-sm border"
            style={{
              background: "var(--surface-2)",
              borderColor: "var(--line-med)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            NOTIFY ME
          </button>
        </form>
      )}
    </div>
  );
}
