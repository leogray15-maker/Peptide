"use client";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ANNOUNCEMENTS } from "@/lib/config";
import { useLocalStorageItem, writeLocalStorageItem } from "@/lib/useLocalStorage";

const DISMISS_KEY = "arcane_announce_dismissed";

export default function AnnouncementBar() {
  const dismissed = useLocalStorageItem(DISMISS_KEY) !== null;
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((i) => (i + 1) % ANNOUNCEMENTS.length), []);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length),
    []
  );

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [dismissed, next]);

  if (dismissed) return null;

  return (
    <div
      className="relative flex items-center justify-center px-10 py-2 text-xs font-medium tracking-wide"
      style={{ background: "var(--accent)", color: "#fff" }}
      role="status"
      aria-live="polite"
    >
      <button
        onClick={prev}
        aria-label="Previous announcement"
        className="absolute left-3 opacity-70 hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={14} />
      </button>

      <span className="label-upper" style={{ color: "#fff", fontSize: "0.65rem" }}>
        {ANNOUNCEMENTS[idx]}
      </span>

      <button
        onClick={next}
        aria-label="Next announcement"
        className="absolute right-8 opacity-70 hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={14} />
      </button>

      <button
        onClick={() => writeLocalStorageItem(DISMISS_KEY, "1")}
        aria-label="Dismiss announcement"
        className="absolute right-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={13} />
      </button>
    </div>
  );
}
