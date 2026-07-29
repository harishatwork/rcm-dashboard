import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Filter,
  Search,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { ProviderPerformanceRow } from "@/lib/api/provider-performance-dashboard";
import { cn } from "@/lib/utils";

type SortField =
  | "providerName"
  | "specialty"
  | "encounters"
  | "charges"
  | "collections"
  | "avgRevenuePerVisit"
  | "denialRate"
  | "collectionRate"
  | "outstandingAr";

type SortDirection = "asc" | "desc";

export function ProviderPerformanceTable({
  rows,
  onSelectRow,
}: {
  rows: ProviderPerformanceRow[];
  onSelectRow?: (row: ProviderPerformanceRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [providerTypeFilter, setProviderTypeFilter] = useState("all");
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const [sortField, setSortField] = useState<SortField>("collections");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const specialties = useMemo(() => Array.from(new Set(rows.map((r) => r.specialty))), [rows]);
  const providerTypes = useMemo(() => Array.from(new Set(rows.map((r) => r.providerType))), [rows]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const nameColSearch = columnSearch.name?.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGlobal =
        !s ||
        row.providerName.toLowerCase().includes(s) ||
        row.npi.includes(s) ||
        row.specialty.toLowerCase().includes(s) ||
        row.practice.toLowerCase().includes(s);

      const matchSpecialty = specialtyFilter === "all" || row.specialty === specialtyFilter;
      const matchType = providerTypeFilter === "all" || row.providerType === providerTypeFilter;
      const matchNameCol = !nameColSearch || row.providerName.toLowerCase().includes(nameColSearch);

      return matchGlobal && matchSpecialty && matchType && matchNameCol;
    });
  }, [rows, search, specialtyFilter, providerTypeFilter, columnSearch]);

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
        "Provider Name": r.providerName,
        NPI: r.npi,
        Specialty: r.specialty,
        "Provider Type": r.providerType,
        Practice: r.practice,
        Encounters: r.encounters,
        Charges: r.charges,
        Collections: r.collections,
        "Avg Revenue / Visit": r.avgRevenuePerVisit,
        "Denial Rate": `${r.denialRate}%`,
        "Collection Rate": `${r.collectionRate}%`,
        "Outstanding AR": r.outstandingAr,
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
              placeholder="Search provider, NPI, practice..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={specialtyFilter}
            onValueChange={(v) => {
              setSpecialtyFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={providerTypeFilter}
            onValueChange={(v) => {
              setProviderTypeFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <SelectValue placeholder="Provider Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provider Types</SelectItem>
              {providerTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={columnSearch.name ?? ""}
            onChange={(e) => {
              setColumnSearch((prev) => ({ ...prev, name: e.target.value }));
              setPage(1);
            }}
            placeholder="Filter by provider..."
            className="h-10 w-[170px] rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="provider-performance-table" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("providerName")}>
                <div className="flex items-center gap-1.5">
                  Provider Name {renderSortIcon("providerName")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("specialty")}>
                <div className="flex items-center gap-1.5">
                  Specialty {renderSortIcon("specialty")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("encounters")}>
                <div className="flex items-center justify-end gap-1.5">
                  Encounters {renderSortIcon("encounters")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("charges")}>
                <div className="flex items-center justify-end gap-1.5">
                  Charges {renderSortIcon("charges")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("collections")}>
                <div className="flex items-center justify-end gap-1.5">
                  Collections {renderSortIcon("collections")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("avgRevenuePerVisit")}>
                <div className="flex items-center justify-end gap-1.5">
                  Avg Rev / Visit {renderSortIcon("avgRevenuePerVisit")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("denialRate")}>
                <div className="flex items-center justify-end gap-1.5">
                  Denial Rate {renderSortIcon("denialRate")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("collectionRate")}>
                <div className="flex items-center justify-end gap-1.5">
                  Collection Rate {renderSortIcon("collectionRate")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("outstandingAr")}>
                <div className="flex items-center justify-end gap-1.5">
                  Outstanding AR {renderSortIcon("outstandingAr")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-muted-foreground">
                  No providers match the current search or filters.
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
                      {row.providerName.replace(/^Dr\.?\s*/i, "").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold group-hover:text-primary transition-colors">{row.providerName}</p>
                      <p className="truncate text-[11px] text-muted-foreground">NPI: {row.npi}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <Badge variant="outline" className="font-normal">
                      {row.specialty}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatNumber(row.encounters)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-muted-foreground">{formatCurrency(row.charges)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-foreground">
                    {formatCurrency(row.collections)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-medium">{formatCurrency(row.avgRevenuePerVisit)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    <span className={cn(row.denialRate <= 4 ? "text-emerald-600 dark:text-emerald-400" : row.denialRate <= 5.5 ? "text-amber-600 dark:text-amber-400" : "text-destructive")}>
                      {row.denialRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    <span className={cn(row.collectionRate >= 96 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                      {row.collectionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    {formatCurrency(row.outstandingAr)}
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} providers
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
