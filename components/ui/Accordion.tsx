"use client";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export function Accordion({ items, defaultOpen }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);

  return (
    <div className="divide-y" style={{ borderColor: "var(--line)" }}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-medium text-sm sm:text-base" style={{ color: "var(--text)" }}>
              {item.question}
            </span>
            <ChevronDown
              size={18}
              className="shrink-0 transition-transform duration-200"
              style={{
                color: "var(--muted)",
                transform: open === i ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </button>

          {open === i && (
            <div
              className="pb-5 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
