"use client";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

export default function TrackOrderClient() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const cleanedTracking = trackingNumber.trim().replace(/\s+/g, "");
  const rmUrl = `https://www.royalmail.com/track-your-item#/tracking-results/${cleanedTracking}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cleanedTracking) {
      window.open(rmUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="max-w-lg">
      <div
        className="p-6 rounded-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-upper block mb-1.5">Royal Mail Tracking Number</label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. AB123456789GB"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm border"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--line-med)",
                  color: "var(--text)",
                  outline: "none",
                  letterSpacing: "0.05em",
                }}
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
              Your tracking number is included in your dispatch confirmation email.
            </p>
          </div>

          <button
            type="submit"
            disabled={!cleanedTracking}
            className="flex items-center justify-center gap-2 py-3 rounded font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <ExternalLink size={15} />
            Track on Royal Mail
          </button>
        </form>

        <div className="mt-5 pt-5 border-t text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
          <p>
            Clicking &lsquo;Track on Royal Mail&rsquo; will open the Royal Mail tracking website in a new tab.
            Tracking information typically updates within 24 hours of dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}
