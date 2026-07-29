import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Filter,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { PatientSummaryRow } from "@/lib/api/patient-analytics";
import { cn } from "@/lib/utils";

type SortField =
  | "patientId"
  | "patientName"
  | "lastVisit"
  | "provider"
  | "totalVisits"
  | "totalCharges"
  | "totalPayments"
  | "outstandingBalance"
  | "lastPaymentDate";

type SortDirection = "asc" | "desc";

export function PatientSummaryTable({
  rows,
  onSelectRow,
}: {
  rows: PatientSummaryRow[];
  onSelectRow?: (row: PatientSummaryRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [patientTypeFilter, setPatientTypeFilter] = useState("all");
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const [sortField, setSortField] = useState<SortField>("totalCharges");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const nameColSearch = columnSearch.name?.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGlobal =
        !s ||
        row.patientName.toLowerCase().includes(s) ||
        row.patientId.toLowerCase().includes(s) ||
        row.provider.toLowerCase().includes(s) ||
        row.specialty.toLowerCase().includes(s);

      const matchType =
        patientTypeFilter === "all" || row.patientType === patientTypeFilter;

      const matchNameCol =
        !nameColSearch || row.patientName.toLowerCase().includes(nameColSearch);

      return matchGlobal && matchType && matchNameCol;
    });
  }, [rows, search, patientTypeFilter, columnSearch]);

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
        "Patient ID": r.patientId,
        "Patient Name": r.patientName,
        "Last Visit": r.lastVisit,
        Provider: r.provider,
        Specialty: r.specialty,
        "Total Visits": r.totalVisits,
        "Total Charges": r.totalCharges,
        "Total Payments": r.totalPayments,
        "Outstanding Balance": r.outstandingBalance,
        "Last Payment Date": r.lastPaymentDate,
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
              placeholder="Search patient name, ID, provider..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={patientTypeFilter}
            onValueChange={(v) => {
              setPatientTypeFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[170px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Patient Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patient Types</SelectItem>
              <SelectItem value="New">New Patients</SelectItem>
              <SelectItem value="Existing">Existing Patients</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={columnSearch.name ?? ""}
            onChange={(e) => {
              setColumnSearch((prev) => ({ ...prev, name: e.target.value }));
              setPage(1);
            }}
            placeholder="Filter by name..."
            className="h-10 w-[170px] rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="patient-summary-table" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("patientId")}>
                <div className="flex items-center gap-1.5">
                  Patient ID {renderSortIcon("patientId")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("patientName")}>
                <div className="flex items-center gap-1.5">
                  Patient Name {renderSortIcon("patientName")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("lastVisit")}>
                <div className="flex items-center gap-1.5">
                  Last Visit {renderSortIcon("lastVisit")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("provider")}>
                <div className="flex items-center gap-1.5">
                  Provider {renderSortIcon("provider")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("totalVisits")}>
                <div className="flex items-center justify-end gap-1.5">
                  Visits {renderSortIcon("totalVisits")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("totalCharges")}>
                <div className="flex items-center justify-end gap-1.5">
                  Total Charges {renderSortIcon("totalCharges")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("totalPayments")}>
                <div className="flex items-center justify-end gap-1.5">
                  Total Payments {renderSortIcon("totalPayments")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("outstandingBalance")}>
                <div className="flex items-center justify-end gap-1.5">
                  Outstanding AR {renderSortIcon("outstandingBalance")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("lastPaymentDate")}>
                <div className="flex items-center gap-1.5">
                  Last Payment {renderSortIcon("lastPaymentDate")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-muted-foreground">
                  No patients match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow?.(row)}
                  className="hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-primary">{row.patientId}</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="group-hover:text-primary transition-colors">{row.patientName}</span>
                    <Badge variant={row.patientType === "New" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                      {row.patientType}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.lastVisit}</td>
                  <td className="py-3.5 px-4 text-xs">{row.provider}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{row.totalVisits}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-medium">{formatCurrency(row.totalCharges)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(row.totalPayments)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">
                    <span className={cn(row.outstandingBalance > 0 ? "text-destructive" : "text-muted-foreground")}>
                      {formatCurrency(row.outstandingBalance)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.lastPaymentDate}</td>
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} patients
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
