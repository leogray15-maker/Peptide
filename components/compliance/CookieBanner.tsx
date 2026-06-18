"use client";
import Link from "next/link";
import { useLocalStorageItem, writeLocalStorageItem } from "@/lib/useLocalStorage";

const COOKIE_KEY = "arcane_cookie_consent";

export default function CookieBanner() {
  const visible = useLocalStorageItem(COOKIE_KEY) === null;

  if (!visible) return null;

  function accept(type: "essential" | "all") {
    writeLocalStorageItem(COOKIE_KEY, type);
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[9000] rounded-lg p-5 shadow-2xl"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line-med)",
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="label-upper mb-2">Cookie Preferences</p>
      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        We use essential cookies to operate this site. No analytics or tracking
        cookies are set without your consent.{" "}
        <Link href="/cookies-policy" className="underline" style={{ color: "var(--accent)" }}>
          Read our cookie policy
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => accept("essential")}
          className="flex-1 py-2 rounded text-sm font-semibold border transition-colors hover:bg-[var(--surface-3)]"
          style={{ borderColor: "var(--line-med)", color: "var(--text)" }}
        >
          Essential only
        </button>
        <button
          onClick={() => accept("all")}
          className="flex-1 py-2 rounded text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
