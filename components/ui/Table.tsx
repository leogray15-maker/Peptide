import type { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  align?: "left" | "right" | "center";
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  compact?: boolean;
}

export function Table<T>({ columns, rows, keyField, compact }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--line)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
            {columns.map((col) => (
              <th
                key={String(col.header)}
                className={`px-4 ${compact ? "py-2.5" : "py-3"} font-semibold label-upper text-left`}
                style={{ textAlign: col.align ?? "left", color: "var(--muted)" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={String(row[keyField])}
              style={{ borderBottom: "1px solid var(--line)" }}
              className="transition-colors hover:bg-[var(--surface-2)]"
            >
              {columns.map((col) => (
                <td
                  key={String(col.header)}
                  className={`px-4 ${compact ? "py-2.5" : "py-3"}`}
                  style={{ textAlign: col.align ?? "left", color: "var(--text)" }}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : String(row[col.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
