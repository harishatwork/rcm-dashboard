import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Filter,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatNumber } from "@/lib/format";
import type { OperationalSummaryRow } from "@/lib/api/operational-dashboard";
import { cn } from "@/lib/utils";

type SortField =
  | "practice"
  | "location"
  | "provider"
  | "scheduledAppointments"
  | "completedVisits"
  | "noShows"
  | "cancellations"
  | "avgWaitMinutes"
  | "avgVisitDurationMinutes"
  | "utilizationPct";

type SortDirection = "asc" | "desc";

export function OperationalSummaryTable({
  rows,
  onSelectRow,
}: {
  rows: OperationalSummaryRow[];
  onSelectRow?: (row: OperationalSummaryRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const [sortField, setSortField] = useState<SortField>("scheduledAppointments");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const locations = useMemo(() => Array.from(new Set(rows.map((r) => r.location))), [rows]);
  const departments = useMemo(() => Array.from(new Set(rows.map((r) => r.department))), [rows]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const locColSearch = columnSearch.location?.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGlobal =
        !s ||
        row.practice.toLowerCase().includes(s) ||
        row.location.toLowerCase().includes(s) ||
        row.provider.toLowerCase().includes(s) ||
        row.department.toLowerCase().includes(s);

      const matchLocation = locationFilter === "all" || row.location === locationFilter;
      const matchDepartment = departmentFilter === "all" || row.department === departmentFilter;
      const matchLocCol = !locColSearch || row.location.toLowerCase().includes(locColSearch);

      return matchGlobal && matchLocation && matchDepartment && matchLocCol;
    });
  }, [rows, search, locationFilter, departmentFilter, columnSearch]);

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
        Practice: r.practice,
        Location: r.location,
        Provider: r.provider,
        Department: r.department,
        "Scheduled Appointments": r.scheduledAppointments,
        "Completed Visits": r.completedVisits,
        "No Shows": r.noShows,
        Cancellations: r.cancellations,
        "Avg Wait (Min)": `${r.avgWaitMinutes} min`,
        "Avg Duration (Min)": `${r.avgVisitDurationMinutes} min`,
        "Utilization %": `${r.utilizationPct}%`,
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
              placeholder="Search practice, location, provider..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={locationFilter}
            onValueChange={(v) => {
              setLocationFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={departmentFilter}
            onValueChange={(v) => {
              setDepartmentFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={columnSearch.location ?? ""}
            onChange={(e) => {
              setColumnSearch((prev) => ({ ...prev, location: e.target.value }));
              setPage(1);
            }}
            placeholder="Filter location..."
            className="h-10 w-[170px] rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="operational-summary-table" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("practice")}>
                <div className="flex items-center gap-1.5">
                  Practice {renderSortIcon("practice")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("location")}>
                <div className="flex items-center gap-1.5">
                  Location {renderSortIcon("location")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("provider")}>
                <div className="flex items-center gap-1.5">
                  Provider {renderSortIcon("provider")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("scheduledAppointments")}>
                <div className="flex items-center justify-end gap-1.5">
                  Scheduled {renderSortIcon("scheduledAppointments")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("completedVisits")}>
                <div className="flex items-center justify-end gap-1.5">
                  Completed {renderSortIcon("completedVisits")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("noShows")}>
                <div className="flex items-center justify-end gap-1.5">
                  No Shows {renderSortIcon("noShows")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("cancellations")}>
                <div className="flex items-center justify-end gap-1.5">
                  Cancellations {renderSortIcon("cancellations")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("avgWaitMinutes")}>
                <div className="flex items-center justify-end gap-1.5">
                  Avg Wait {renderSortIcon("avgWaitMinutes")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("avgVisitDurationMinutes")}>
                <div className="flex items-center justify-end gap-1.5">
                  Avg Duration {renderSortIcon("avgVisitDurationMinutes")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("utilizationPct")}>
                <div className="flex items-center justify-end gap-1.5">
                  Utilization {renderSortIcon("utilizationPct")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-muted-foreground">
                  No operational records match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow?.(row)}
                  className="hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {row.practice}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium">{row.location}</td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.provider}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatNumber(row.scheduledAppointments)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatNumber(row.completedVisits)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-amber-600 dark:text-amber-400">{row.noShows}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-muted-foreground">{row.cancellations}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-medium">
                    <span className={cn(row.avgWaitMinutes > 15 ? "text-destructive font-bold" : "text-foreground")}>
                      {row.avgWaitMinutes} min
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-muted-foreground">{row.avgVisitDurationMinutes} min</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-primary">
                    {row.utilizationPct}%
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} records
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
