import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import type { AuditLogEntry } from "@/lib/api/administration";
import { cn } from "@/lib/utils";

type SortField = "timestamp" | "user" | "action" | "status";
type SortDirection = "asc" | "desc";

export function AuditLogsTable({ logs }: { logs: AuditLogEntry[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return logs.filter((row) => {
      const matchGlobal =
        !s ||
        row.user.toLowerCase().includes(s) ||
        row.action.toLowerCase().includes(s) ||
        row.resource.toLowerCase().includes(s) ||
        row.ipAddress.toLowerCase().includes(s);

      const matchStatus = statusFilter === "all" || row.status === statusFilter;

      return matchGlobal && matchStatus;
    });
  }, [logs, search, statusFilter]);

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
        Timestamp: r.timestamp,
        User: r.user,
        Role: r.role,
        Action: r.action,
        Resource: r.resource,
        "IP Address": r.ipAddress,
        Status: r.status,
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
              placeholder="Search user, action, resource, IP..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[150px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ExportButton rows={exportRows} fileName="security-audit-logs" className="h-10 rounded-xl" />
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("timestamp")}>
                <div className="flex items-center gap-1.5">
                  Timestamp {renderSortIcon("timestamp")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("user")}>
                <div className="flex items-center gap-1.5">
                  User Member {renderSortIcon("user")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("action")}>
                <div className="flex items-center gap-1.5">
                  Action Executed {renderSortIcon("action")}
                </div>
              </th>
              <th className="py-3.5 px-4">Resource Target</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-3 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("status")}>
                <div className="flex items-center justify-center gap-1.5">
                  Result {renderSortIcon("status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs font-mono">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground font-sans">
                  No audit log records match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-muted-foreground">{row.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <p className="font-semibold text-foreground">{row.user}</p>
                    <p className="text-[11px] text-muted-foreground">{row.role}</p>
                  </td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-primary">{row.action}</td>
                  <td className="py-3.5 px-4 font-sans text-muted-foreground">{row.resource}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{row.ipAddress}</td>
                  <td className="py-3.5 px-3 text-center font-sans">
                    <Badge
                      variant={row.status === "Success" ? "default" : row.status === "Failed" ? "destructive" : "secondary"}
                      className={cn(
                        "text-[10px]",
                        row.status === "Success" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                      )}
                    >
                      {row.status}
                    </Badge>
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} audit events
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
