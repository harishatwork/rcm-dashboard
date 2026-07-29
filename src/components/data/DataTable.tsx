import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  className?: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  emptyMessage = "No records match the current filters.",
  getRowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string;
}) {
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border/70">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 sm:px-6">
                      <Skeleton className="h-4 w-full max-w-28" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="border-b border-border/70 transition-colors duration-150 hover:bg-secondary/60"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-4 align-middle sm:px-6",
                        col.align === "right" ? "text-right" : "text-left",
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!isLoading && rows.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : null}
    </div>
  );
}
