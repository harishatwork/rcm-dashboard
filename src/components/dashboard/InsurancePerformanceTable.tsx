import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { InsurancePerformanceRow } from "@/lib/api/insurance-dashboard";
import { cn } from "@/lib/utils";

type SortField =
  | "insuranceCompany"
  | "financialClass"
  | "claimsSubmitted"
  | "claimsPaid"
  | "claimsDenied"
  | "totalPayments"
  | "avgPaymentDays"
  | "collectionRate"
  | "outstandingBalance";

type SortDirection = "asc" | "desc";

export function InsurancePerformanceTable({
  rows,
  onSelectRow,
}: {
  rows: InsurancePerformanceRow[];
  onSelectRow?: (row: InsurancePerformanceRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [financialClassFilter, setFinancialClassFilter] = useState("all");
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const [sortField, setSortField] = useState<SortField>("totalPayments");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const financialClasses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.financialClass))),
    [rows],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const companySearch = columnSearch.company?.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGlobal =
        !s ||
        row.insuranceCompany.toLowerCase().includes(s) ||
        row.financialClass.toLowerCase().includes(s);

      const matchClass =
        financialClassFilter === "all" || row.financialClass === financialClassFilter;

      const matchColCompany =
        !companySearch || row.insuranceCompany.toLowerCase().includes(companySearch);

      return matchGlobal && matchClass && matchColCompany;
    });
  }, [rows, search, financialClassFilter, columnSearch]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const exportRows = useMemo(
    () =>
      sorted.map((r) => ({
        "Insurance Company": r.insuranceCompany,
        "Financial Class": r.financialClass,
        "Claims Submitted": r.claimsSubmitted,
        "Claims Paid": r.claimsPaid,
        "Claims Denied": r.claimsDenied,
        "Total Payments": r.totalPayments,
        "Avg Payment Days": r.avgPaymentDays,
        "Collection Rate": `${r.collectionRate}%`,
        "Outstanding Balance": r.outstandingBalance,
      })),
    [sorted],
  );

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search insurance company, class..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={financialClassFilter}
            onValueChange={(v) => {
              setFinancialClassFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[190px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Financial Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Financial Classes</SelectItem>
              {financialClasses.map((fc) => (
                <SelectItem key={fc} value={fc}>
                  {fc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={columnSearch.company ?? ""}
            onChange={(e) => {
              setColumnSearch((prev) => ({ ...prev, company: e.target.value }));
              setPage(1);
            }}
            placeholder="Filter company..."
            className="h-10 w-[180px] rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="insurance-performance-table" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("insuranceCompany")}>
                <div className="flex items-center gap-1.5">
                  Insurance Company {renderSortIcon("insuranceCompany")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("financialClass")}>
                <div className="flex items-center gap-1.5">
                  Class {renderSortIcon("financialClass")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimsSubmitted")}>
                <div className="flex items-center justify-end gap-1.5">
                  Submitted {renderSortIcon("claimsSubmitted")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimsPaid")}>
                <div className="flex items-center justify-end gap-1.5">
                  Paid {renderSortIcon("claimsPaid")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimsDenied")}>
                <div className="flex items-center justify-end gap-1.5">
                  Denied {renderSortIcon("claimsDenied")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("totalPayments")}>
                <div className="flex items-center justify-end gap-1.5">
                  Total Payments {renderSortIcon("totalPayments")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("avgPaymentDays")}>
                <div className="flex items-center justify-end gap-1.5">
                  Avg Days {renderSortIcon("avgPaymentDays")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("collectionRate")}>
                <div className="flex items-center justify-end gap-1.5">
                  Collection Rate {renderSortIcon("collectionRate")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("outstandingBalance")}>
                <div className="flex items-center justify-end gap-1.5">
                  Outstanding AR {renderSortIcon("outstandingBalance")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-muted-foreground">
                  No insurance companies match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow?.(row)}
                  className="hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-extrabold">
                      {row.insuranceCompany.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="group-hover:text-primary transition-colors">{row.insuranceCompany}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      {row.financialClass}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatNumber(row.claimsSubmitted)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {formatNumber(row.claimsPaid)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-medium text-destructive">
                    {formatNumber(row.claimsDenied)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-foreground">
                    {formatCurrency(row.totalPayments)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{row.avgPaymentDays}d</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    <span
                      className={cn(
                        row.collectionRate >= 96
                          ? "text-emerald-600 dark:text-emerald-400"
                          : row.collectionRate >= 94
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-destructive",
                      )}
                    >
                      {row.collectionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    {formatCurrency(row.outstandingBalance)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg group-hover:bg-primary/15 group-hover:text-primary">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <div>
          Showing {paginated.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} payors
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16 rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg px-2.5 text-xs"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-2 font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg px-2.5 text-xs"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
