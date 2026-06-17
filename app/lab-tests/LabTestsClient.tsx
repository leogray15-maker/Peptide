"use client";
import { useState } from "react";
import { Search, Download, ExternalLink } from "lucide-react";

interface Batch {
  lot: string;
  compound: string;
  size: string;
  purity: string;
  date: string;
  pdf: string;
}

export default function LabTestsClient({ batches }: { batches: Batch[] }) {
  const [query, setQuery] = useState("");

  const filtered = batches.filter(
    (b) =>
      b.lot.toLowerCase().includes(query.toLowerCase()) ||
      b.compound.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />
        <input
          type="search"
          placeholder="Search by lot number or compound name…"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left"
              style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}
            >
              {["Lot Number", "Compound", "Size", "Purity", "Test Date", "Certificate"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 label-upper font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "var(--muted)" }}>
                  No batches found for &ldquo;{query}&rdquo;
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  key={b.lot}
                  className="transition-colors hover:bg-[var(--surface-2)]"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--accent)" }}>
                    {b.lot}
                  </td>
                  <td className="px-4 py-3 font-medium">{b.compound}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{b.size}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        background: "rgba(46,204,113,0.1)",
                        color: "var(--green)",
                        border: "1px solid rgba(46,204,113,0.3)",
                      }}
                    >
                      {b.purity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={b.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ color: "var(--accent)" }}
                    >
                      <Download size={13} /> Download PDF
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs" style={{ color: "var(--subtle)" }}>
        TODO: Replace placeholder entries with real batch data and PDF links as stock is validated.
      </p>
    </div>
  );
}
