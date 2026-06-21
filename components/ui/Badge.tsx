import type { ReactNode } from "react";

type BadgeVariant = "accent" | "green" | "amber" | "red" | "muted" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<BadgeVariant, string> = {
  accent:  "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)]/30",
  green:   "bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/30",
  amber:   "bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/30",
  red:     "bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/30",
  muted:   "bg-[var(--surface-3)] text-[var(--muted)] border border-[var(--line)]",
  outline: "border border-[var(--line-med)] text-[var(--muted)]",
};

export function Badge({ variant = "muted", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase",
        STYLES[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

// Convenience badge map for product flags
export const PRODUCT_BADGE_MAP = {
  "Most Popular": "accent",
  "Selling fast": "amber",
  "New":          "accent",
  "Restocked":    "green",
  "Staff Pick":   "muted",
} as const;
