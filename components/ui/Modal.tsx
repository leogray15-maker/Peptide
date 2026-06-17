"use client";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[8000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${SIZES[size]} rounded-lg overflow-hidden`}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line-med)",
          maxHeight: "90vh",
        }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <h2 className="font-semibold text-base">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded transition-colors hover:text-[var(--text)]"
              style={{ color: "var(--muted)" }}
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto" style={{ maxHeight: title ? "calc(90vh - 64px)" : "90vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
