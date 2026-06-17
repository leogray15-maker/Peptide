import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   "bg-[var(--accent)] text-white hover:brightness-110 active:brightness-90",
  secondary: "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line-med)] hover:bg-[var(--surface-3)]",
  ghost:     "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
  danger:    "bg-[var(--red)] text-white hover:brightness-110",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded font-semibold tracking-wide",
          "transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <span
            className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
            style={{ animation: "spin 0.7s linear infinite" }}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
