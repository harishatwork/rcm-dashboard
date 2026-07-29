import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Info,
  MailCheck,
  Search,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/common/ExportButton";
import type { NotificationItem, NotificationPriority } from "@/lib/api/notifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortField = "title" | "category" | "priority" | "dateTime" | "status";
type SortDirection = "asc" | "desc";

export function NotificationListTable({
  initialRows,
}: {
  initialRows: NotificationItem[];
}) {
  const [rows, setRows] = useState<NotificationItem[]>(initialRows);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState<SortField>("dateTime");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(() => Array.from(new Set(rows.map((r) => r.category))), [rows]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (row.archived) return false;

      const matchGlobal =
        !s ||
        row.title.toLowerCase().includes(s) ||
        row.description.toLowerCase().includes(s) ||
        row.sourceModule.toLowerCase().includes(s);

      const matchPriority = priorityFilter === "all" || row.priority === priorityFilter;
      const matchCategory = categoryFilter === "all" || row.category === categoryFilter;
      const matchStatus = statusFilter === "all" || row.status === statusFilter;

      return matchGlobal && matchPriority && matchCategory && matchStatus;
    });
  }, [rows, search, priorityFilter, categoryFilter, statusFilter]);

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

  const toggleRead = (id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === "Unread" ? "Read" : "Unread";
          toast.info(`Notification marked as ${nextStatus.toLowerCase()}`);
          return { ...r, status: nextStatus };
        }
        return r;
      }),
    );
  };

  const handleMarkAllRead = () => {
    setRows((prev) => prev.map((r) => ({ ...r, status: "Read" })));
    toast.success("All notifications marked as read");
  };

  const handleArchive = (id: string, title: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, archived: true } : r)));
    toast.info(`Notification archived: "${title}"`);
  };

  const handleDelete = (id: string, title: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.error(`Notification deleted: "${title}"`);
  };

  const exportRows = useMemo(
    () =>
      sorted.map((r) => ({
        Title: r.title,
        Category: r.category,
        Priority: r.priority,
        Description: r.description,
        "Date & Time": r.dateTime,
        "Source Module": r.sourceModule,
        Status: r.status,
        "Assigned User": r.assignedUser ?? "Unassigned",
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
              placeholder="Search notification title, description..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={priorityFilter}
            onValueChange={(v) => {
              setPriorityFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[150px] rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
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
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[130px] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Unread">Unread</SelectItem>
              <SelectItem value="Read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl gap-1.5 text-xs font-semibold" onClick={handleMarkAllRead}>
            <MailCheck className="h-4 w-4" />
            Mark All Read
          </Button>
          <ExportButton rows={exportRows} fileName="notifications-list" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("title")}>
                <div className="flex items-center gap-1.5">
                  Notification Alert {renderSortIcon("title")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("category")}>
                <div className="flex items-center gap-1.5">
                  Category {renderSortIcon("category")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("priority")}>
                <div className="flex items-center justify-center gap-1.5">
                  Priority {renderSortIcon("priority")}
                </div>
              </th>
              <th className="py-3.5 px-4">Source & Assigned</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("dateTime")}>
                <div className="flex items-center gap-1.5">
                  Date & Time {renderSortIcon("dateTime")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("status")}>
                <div className="flex items-center justify-center gap-1.5">
                  Status {renderSortIcon("status")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No active notifications match the current search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/40 transition-colors group",
                    row.status === "Unread" && "bg-primary/5 font-medium",
                  )}
                >
                  <td className="py-3.5 px-4">
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {row.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{row.description}</p>
                      {row.suggestedAction && (
                        <p className="text-[11px] text-primary font-medium">
                          Suggested Action: {row.suggestedAction}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <Badge variant="outline" className="font-normal">
                      {row.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant={
                        row.priority === "Critical"
                          ? "destructive"
                          : row.priority === "High"
                          ? "secondary"
                          : "outline"
                      }
                      className={cn(
                        "text-[10px] font-bold",
                        row.priority === "High" && "bg-amber-500/10 text-amber-600 border-amber-500/30",
                      )}
                    >
                      {row.priority}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <p className="font-medium text-foreground">{row.sourceModule}</p>
                    <p className="text-[11px] text-muted-foreground">{row.assignedUser ?? "Unassigned"}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">{row.dateTime}</td>
                  <td className="py-3.5 px-3 text-center">
                    <Badge variant={row.status === "Unread" ? "default" : "secondary"} className="text-[10px]">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title={row.status === "Unread" ? "Mark as Read" : "Mark as Unread"}
                        className="h-8 w-8 p-0 rounded-lg hover:text-primary"
                        onClick={() => toggleRead(row.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Archive"
                        className="h-8 w-8 p-0 rounded-lg hover:text-amber-600"
                        onClick={() => handleArchive(row.id, row.title)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete"
                        className="h-8 w-8 p-0 rounded-lg hover:text-destructive"
                        onClick={() => handleDelete(row.id, row.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} notifications
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
