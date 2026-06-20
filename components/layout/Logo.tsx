import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="Arcane Peptides — Home">
      <Image
        src="/logo/arcane-peptides.png"
        alt="Arcane Peptides"
        width={44}
        height={44}
        priority
        className="shrink-0 w-11 h-11 transition-transform duration-300 group-hover:rotate-12"
      />

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
