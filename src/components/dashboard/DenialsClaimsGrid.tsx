import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  FileSpreadsheet,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { AppealStatus, DenialClaimRow } from "@/lib/api/denials-dashboard";
import { cn } from "@/lib/utils";

type SortField =
  | "claimNumber"
  | "patient"
  | "provider"
  | "payor"
  | "claimAmount"
  | "deniedAmount"
  | "denialCategory"
  | "appealStatus"
  | "daysSinceDenial";

type SortDirection = "asc" | "desc";

const STATUS_CONFIG: Record<
  AppealStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any; className: string }
> = {
  not_appealed: {
    label: "Not Appealed",
    variant: "destructive",
    icon: XCircle,
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  under_review: {
    label: "Under Review",
    variant: "secondary",
    icon: Clock,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  appealed: {
    label: "Appealed",
    variant: "outline",
    icon: ShieldAlert,
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  recovered: {
    label: "Recovered",
    variant: "default",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  written_off: {
    label: "Written Off",
    variant: "outline",
    icon: XCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function DenialsClaimsGrid({ claims }: { claims: DenialClaimRow[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [payorFilter, setPayorFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<SortField>("daysSinceDenial");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(() => Array.from(new Set(claims.map((c) => c.denialCategory))), [claims]);
  const payors = useMemo(() => Array.from(new Set(claims.map((c) => c.payor))), [claims]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return claims.filter((claim) => {
      const matchSearch =
        !s ||
        claim.claimNumber.toLowerCase().includes(s) ||
        claim.patient.toLowerCase().includes(s) ||
        claim.provider.toLowerCase().includes(s) ||
        claim.payor.toLowerCase().includes(s) ||
        claim.denialReason.toLowerCase().includes(s);

      const matchCat = categoryFilter === "all" || claim.denialCategory === categoryFilter;
      const matchStatus = statusFilter === "all" || claim.appealStatus === statusFilter;
      const matchPayor = payorFilter === "all" || claim.payor === payorFilter;

      return matchSearch && matchCat && matchStatus && matchPayor;
    });
  }, [claims, search, categoryFilter, statusFilter, payorFilter]);

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
      setSortDir("asc");
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
      sorted.map((c) => ({
        "Claim Number": c.claimNumber,
        Patient: c.patient,
        Provider: c.provider,
        Payor: c.payor,
        Practice: c.practice,
        Specialty: c.specialty,
        "Claim Amount": c.claimAmount,
        "Denied Amount": c.deniedAmount,
        Category: c.denialCategory,
        Reason: c.denialReason,
        Status: STATUS_CONFIG[c.appealStatus]?.label ?? c.appealStatus,
        "Days Since Denial": c.daysSinceDenial,
        "Denial Date": c.denialDate,
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
              placeholder="Search claim #, patient, provider..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[170px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={payorFilter}
            onValueChange={(v) => {
              setPayorFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[160px] rounded-xl">
              <SelectValue placeholder="Payor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payors</SelectItem>
              {payors.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[160px] rounded-xl">
              <SelectValue placeholder="Appeal Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_appealed">Not Appealed</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="appealed">Appealed</SelectItem>
              <SelectItem value="recovered">Recovered</SelectItem>
              <SelectItem value="written_off">Written Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="denied-claims-grid" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimNumber")}>
                <div className="flex items-center gap-1.5">
                  Claim # {renderSortIcon("claimNumber")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("patient")}>
                <div className="flex items-center gap-1.5">
                  Patient {renderSortIcon("patient")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("provider")}>
                <div className="flex items-center gap-1.5">
                  Provider {renderSortIcon("provider")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("payor")}>
                <div className="flex items-center gap-1.5">
                  Payor {renderSortIcon("payor")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimAmount")}>
                <div className="flex items-center justify-end gap-1.5">
                  Claim Amt {renderSortIcon("claimAmount")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("deniedAmount")}>
                <div className="flex items-center justify-end gap-1.5">
                  Denied Amt {renderSortIcon("deniedAmount")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("denialCategory")}>
                <div className="flex items-center gap-1.5">
                  Category {renderSortIcon("denialCategory")}
                </div>
              </th>
              <th className="py-3.5 px-4 min-w-[200px]">Reason</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("appealStatus")}>
                <div className="flex items-center gap-1.5">
                  Appeal Status {renderSortIcon("appealStatus")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("daysSinceDenial")}>
                <div className="flex items-center justify-end gap-1.5">
                  Age (Days) {renderSortIcon("daysSinceDenial")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-muted-foreground">
                  No denied claims match the current filters.
                </td>
              </tr>
            ) : (
              paginated.map((claim) => {
                const statusInfo = STATUS_CONFIG[claim.appealStatus] ?? STATUS_CONFIG.not_appealed;
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={claim.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-xs text-primary">
                      {claim.claimNumber}
                    </td>
                    <td className="py-3 px-4 font-medium">{claim.patient}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{claim.provider}</td>
                    <td className="py-3 px-4 text-xs">{claim.payor}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{formatCurrency(claim.claimAmount)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-destructive">
                      {formatCurrency(claim.deniedAmount)}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="inline-block rounded-md bg-secondary px-2 py-0.5 font-medium">
                        {claim.denialCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs max-w-[220px] truncate" title={claim.denialReason}>
                      {claim.denialReason}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("gap-1 text-[11px] font-semibold py-0.5 px-2", statusInfo.className)}>
                        <StatusIcon className="h-3 w-3 shrink-0" />
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-medium">
                      {claim.daysSinceDenial}d
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <div>
          Showing {paginated.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} claims
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
