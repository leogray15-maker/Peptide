"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PriceGateProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const FONT_SIZE: Record<NonNullable<PriceGateProps["size"]>, string> = {
  sm: "0.6875rem",
  md: "0.8125rem",
  lg: "0.9375rem",
};
const ICON_SIZE: Record<NonNullable<PriceGateProps["size"]>, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

// Wraps any price display — shows the real value once signed in, otherwise
// a "Sign in to view price" prompt. UI-level gating only: product data
// (including prices) still ships in the page bundle.
export function PriceGate({ children, className, size = "md" }: PriceGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <span className={className} style={{ opacity: 0.35 }} aria-hidden="true">
        •••
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/account"
        className={`inline-flex items-center gap-1 font-semibold transition-colors hover:underline ${className ?? ""}`}
        style={{ color: "var(--accent)", fontSize: FONT_SIZE[size] }}
      >
        <Lock size={ICON_SIZE[size]} />
        Sign in for price
      </Link>
    );
  }

  return <>{children}</>;
}
