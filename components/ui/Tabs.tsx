"use client";
import { useState, type ReactNode } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
  className?: string;
}

export function Tabs({ tabs, defaultTab = 0, className = "" }: TabsProps) {
  const [active, setActive] = useState(defaultTab);

  return (
    <div className={className}>
      <div
        className="flex gap-0 border-b overflow-x-auto no-scrollbar"
        style={{ borderColor: "var(--line)" }}
        role="tablist"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
            style={{
              borderColor: i === active ? "var(--accent)" : "transparent",
              color: i === active ? "var(--text)" : "var(--muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-6">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
