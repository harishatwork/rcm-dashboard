import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronsUpDown, ChevronRight } from "lucide-react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Pagination } from "./Pagination";
import { cn } from "@/lib/utils";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  className?: string;
  /** Enables client-side sorting for this column. */
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
}

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onRowClick?: (row: T) => void;
  /** Renders an expandable detail panel below the row when provided. */
  renderExpanded?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  /** Enable built-in client-side pagination. */
  paginated?: boolean;
  initialPageSize?: number;
  className?: string;
}

/** Sortable, paginated table with built-in loading / empty / error states. */
export function DataGrid<T>({
  columns,
  rows,
  getRowKey,
  isLoading,
  error,
  onRetry,
  onRowClick,
  renderExpanded,
  emptyTitle = "No records found",
  emptyMessage = "No records match the current filters.",
  paginated = false,
  initialPageSize = 10,
  className,
}: DataGridProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((col) => col.key === sort.key);
    if (!column?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      const result = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? result : -result;
    });
  }, [rows, sort, columns]);

  const visible = paginated ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  function toggleSort(key: string) {
    setSort((current) =>
      current?.key === key
        ? current.dir === "asc"
          ? { key, dir: "desc" }
          : null
        : { key, dir: "asc" },
    );
  }

  if (error) return <ErrorState error={error} onRetry={onRetry} className={className} />;

  return (
    <div className={className}>
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {renderExpanded ? <th scope="col" className="w-10 px-5 pb-3 sm:px-6" /> : null}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-5 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground",
                        col.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {col.header}
                      {sort?.key === col.key ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/70">
                    {renderExpanded ? <td className="px-5 py-4 sm:px-6" /> : null}
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4 sm:px-6">
                        <LoadingSkeleton count={1} className="max-w-28" />
                      </td>
                    ))}
                  </tr>
                ))
              : visible.map((row, index) => {
                  const rowKey = getRowKey(row, index);
                  const isOpen = Boolean(expanded[rowKey]);
                  return (
                    <Fragment key={rowKey}>
                      <tr
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        className={cn(
                          "border-b border-border/70 transition-colors duration-150 hover:bg-secondary/60",
                          onRowClick && "cursor-pointer",
                          isOpen && "bg-secondary/40",
                        )}
                      >
                        {renderExpanded ? (
                          <td className="px-5 py-4 align-middle sm:px-6">
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              aria-label={isOpen ? "Collapse row" : "Expand row"}
                              onClick={(event) => {
                                event.stopPropagation();
                                setExpanded((current) => ({ ...current, [rowKey]: !isOpen }));
                              }}
                              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        ) : null}
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
                      {renderExpanded && isOpen ? (
                        <tr className="border-b border-border/70 bg-secondary/25">
                          <td colSpan={columns.length + 1} className="px-5 pb-5 pt-1 sm:px-6">
                            {renderExpanded(row)}
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
          </tbody>

        </table>
      </div>

      {!isLoading && sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyMessage} className="mt-5 border-0" />
      ) : null}

      {paginated && !isLoading && sorted.length > 0 ? (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={sorted.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}
    </div>
  );
}
