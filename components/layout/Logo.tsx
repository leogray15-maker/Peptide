import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="Arcane Peptides — Home">
      {/* Geometric sigil mark — replace with supplied SVG logo */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
      >
        <polygon
          points="14,2 26,8 26,20 14,26 2,20 2,8"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />
        <polygon
          points="14,7 21,11 21,17 14,21 7,17 7,11"
          fill="var(--accent)"
          opacity="0.25"
        />
        <circle cx="14" cy="14" r="2.5" fill="var(--accent)" />
      </svg>

      <span
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontWeight: 800,
          fontSize: "1.0625rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text)",
          lineHeight: 1,
        }}
      >
        Arcane Peptides
      </span>
    </Link>
  );
}
