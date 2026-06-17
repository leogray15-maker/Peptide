import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  maxWidth?: boolean;
  id?: string;
}

export function Section({ children, className = "", maxWidth = true, id }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-24 px-4 sm:px-6 ${className}`}
    >
      {maxWidth ? (
        <div className="max-w-[1280px] mx-auto">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHead({ eyebrow, title, subtitle, align = "left" }: SectionHeadProps) {
  const textAlign = align === "center" ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col gap-2 mb-12 ${textAlign}`}>
      {eyebrow && <p className="label-upper">{eyebrow}</p>}
      <h2
        className="text-3xl sm:text-4xl font-bold"
        style={{ fontFamily: "var(--font-syne), sans-serif", letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-base max-w-xl" style={{ color: "var(--muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
