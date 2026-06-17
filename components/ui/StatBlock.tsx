interface Stat {
  value: string;
  label: string;
}

interface StatBlockProps {
  stats: Stat[];
  className?: string;
}

export function StatBlock({ stats, className = "" }: StatBlockProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px ${className}`}
      style={{ background: "var(--line)", border: "1px solid var(--line)" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-1 px-6 py-6"
          style={{ background: "var(--surface)" }}
        >
          <span
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--accent)" }}
          >
            {stat.value}
          </span>
          <span className="label-upper">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
