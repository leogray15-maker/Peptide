"use client";
import { useState } from "react";
import { Search } from "lucide-react";

interface Term {
  term: string;
  abbr: string;
  def: string;
  category: string;
}

export default function GlossaryClient({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");

  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const filtered = query
    ? sorted.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.abbr.toLowerCase().includes(query.toLowerCase()) ||
          t.def.toLowerCase().includes(query.toLowerCase())
      )
    : sorted;

  const letters = Array.from(new Set(filtered.map((t) => t.term[0].toUpperCase()))).sort();

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8 max-w-lg">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          type="search"
          placeholder="Search compound, abbreviation, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg text-sm border"
          style={{
            background: "var(--surface-2)",
            borderColor: "var(--line-med)",
            color: "var(--text)",
            outline: "none",
          }}
        />
      </div>

      {/* A–Z index */}
      {!query && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {letters.map((l) => (
            <a
              key={l}
              href={`#glossary-${l}`}
              className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Terms */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No terms found for &ldquo;{query}&rdquo;.</p>
      ) : (
        letters.map((letter) => {
          const group = filtered.filter((t) => t.term[0].toUpperCase() === letter);
          if (group.length === 0) return null;
          return (
            <div key={letter} id={`glossary-${letter}`} className="mb-10">
              <p
                className="text-2xl font-bold mb-4 pb-3 border-b"
                style={{ fontFamily: "var(--font-syne), sans-serif", borderColor: "var(--line)", color: "var(--accent)" }}
              >
                {letter}
              </p>
              <div className="flex flex-col gap-4">
                {group.map((t) => (
                  <div key={t.term} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-6">
                    <div>
                      <p className="font-semibold text-sm">{t.term}</p>
                      {t.abbr !== t.term && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{t.abbr}</p>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {t.def}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
