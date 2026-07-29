import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Filter,
  Play,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrency } from "@/lib/format";
import type { ClaimRiskAnalysisRow } from "@/lib/api/predictive-analytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortField =
  | "claimNumber"
  | "patient"
  | "payor"
  | "claimAmount"
  | "riskScore"
  | "denialProbability"
  | "expectedCollectionDate";

type SortDirection = "asc" | "desc";

export function ClaimRiskTable({
  rows,
  onSelectClaim,
}: {
  rows: ClaimRiskAnalysisRow[];
  onSelectClaim?: (row: ClaimRiskAnalysisRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [payorFilter, setPayorFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const [sortField, setSortField] = useState<SortField>("riskScore");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const payors = useMemo(() => Array.from(new Set(rows.map((r) => r.payor))), [rows]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGlobal =
        !s ||
        row.claimNumber.toLowerCase().includes(s) ||
        row.patient.toLowerCase().includes(s) ||
        row.payor.toLowerCase().includes(s) ||
        row.recommendedAction.toLowerCase().includes(s);

      const matchPayor = payorFilter === "all" || row.payor === payorFilter;
      const matchRisk = riskFilter === "all" || row.riskLevel === riskFilter;

      return matchGlobal && matchPayor && matchRisk;
    });
  }, [rows, search, payorFilter, riskFilter]);

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

  const handleAction = (e: React.MouseEvent, row: ClaimRiskAnalysisRow) => {
    e.stopPropagation();
    setAppliedActions((prev) => ({ ...prev, [row.id]: true }));
    toast.success(`Scrub action executed for ${row.claimNumber}`, {
      description: row.recommendedAction,
    });
  };

  const exportRows = useMemo(
    () =>
      sorted.map((r) => ({
        "Claim Number": r.claimNumber,
        Patient: r.patient,
        Payor: r.payor,
        "Claim Amount": r.claimAmount,
        "Risk Score": r.riskScore,
        "Probability of Denial": `${r.denialProbability}%`,
        "Expected Collection Date": r.expectedCollectionDate,
        "Recommended Action": r.recommendedAction,
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
              placeholder="Search claim, patient, payor, action..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={payorFilter}
            onValueChange={(v) => {
              setPayorFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
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
            value={riskFilter}
            onValueChange={(v) => {
              setRiskFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[150px] rounded-xl">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="High Risk">High Risk</SelectItem>
              <SelectItem value="Medium Risk">Medium Risk</SelectItem>
              <SelectItem value="Low Risk">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton rows={exportRows} fileName="claim-risk-analysis" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimNumber")}>
                <div className="flex items-center gap-1.5">
                  Claim Number {renderSortIcon("claimNumber")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("patient")}>
                <div className="flex items-center gap-1.5">
                  Patient {renderSortIcon("patient")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("payor")}>
                <div className="flex items-center gap-1.5">
                  Payor {renderSortIcon("payor")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("claimAmount")}>
                <div className="flex items-center justify-end gap-1.5">
                  Claim Amount {renderSortIcon("claimAmount")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("riskScore")}>
                <div className="flex items-center justify-center gap-1.5">
                  Risk Score {renderSortIcon("riskScore")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("denialProbability")}>
                <div className="flex items-center justify-center gap-1.5">
                  Prob of Denial {renderSortIcon("denialProbability")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("expectedCollectionDate")}>
                <div className="flex items-center gap-1.5">
                  Expected Collection {renderSortIcon("expectedCollectionDate")}
                </div>
              </th>
              <th className="py-3.5 px-4">Recommended Action</th>
              <th className="py-3.5 px-3 text-center">Execute</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted-foreground">
                  No high-risk claims match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => {
                const isDone = appliedActions[row.id];
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectClaim?.(row)}
                    className="hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-primary">{row.claimNumber}</td>
                    <td className="py-3.5 px-4 font-medium">{row.patient}</td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.payor}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold">{formatCurrency(row.claimAmount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={row.riskLevel === "High Risk" ? "destructive" : row.riskLevel === "Medium Risk" ? "secondary" : "outline"}
                        className="font-mono text-[11px]"
                      >
                        {row.riskScore} / 100
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs font-bold">
                      <span className={cn(row.denialProbability >= 70 ? "text-destructive" : row.denialProbability >= 40 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600")}>
                        {row.denialProbability}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.expectedCollectionDate}</td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="rounded-lg bg-muted/60 p-2 text-[11px] text-foreground font-medium border border-border/50">
                        {row.recommendedAction}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Button
                        size="sm"
                        variant={isDone ? "secondary" : "default"}
                        disabled={isDone}
                        onClick={(e) => handleAction(e, row)}
                        className="h-7 text-[11px] rounded-lg px-2"
                      >
                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Play className="h-3 w-3" />}
                      </Button>
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
