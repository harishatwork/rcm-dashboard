import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  Edit,
  FileSpreadsheet,
  Filter,
  Plus,
  PlusCircle,
  Search,
  Stethoscope,
  Trash2,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExportButton } from "@/components/common/ExportButton";
import type { MasterDataItem } from "@/lib/api/administration";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CategoryFilter = "Practices" | "Providers" | "Payors" | "Locations" | "Specialties" | "Departments";
type SortField = "name" | "code" | "status";
type SortDirection = "asc" | "desc";

export function MasterDataGrid({
  initialData,
}: {
  initialData: MasterDataItem[];
}) {
  const [data, setData] = useState<MasterDataItem[]>(initialData);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Practices");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add Item dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return data.filter((row) => {
      if (row.category !== activeCategory) return false;

      const matchGlobal =
        !s ||
        row.name.toLowerCase().includes(s) ||
        row.code.toLowerCase().includes(s) ||
        row.details.toLowerCase().includes(s);

      const matchStatus = statusFilter === "all" || row.status === statusFilter;

      return matchGlobal && matchStatus;
    });
  }, [data, activeCategory, search, statusFilter]);

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

  const toggleItemStatus = (id: string, name: string) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Active" ? "Inactive" : "Active";
          toast.info(`Master item status set to ${nextStatus}: "${name}"`);
          return { ...item, status: nextStatus };
        }
        return item;
      }),
    );
  };

  const handleImport = () => {
    toast.success("CSV/Excel import dialog opened", {
      description: "Select file to bulk import entity master records.",
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: MasterDataItem = {
      id: `m-${Date.now()}`,
      name: newName,
      code: newCode || `${activeCategory.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      category: activeCategory,
      status: "Active",
      details: newDetails || `Master ${activeCategory.toLowerCase()} entity record`,
    };

    setData((prev) => [newItem, ...prev]);
    setAddOpen(false);
    setNewName("");
    setNewCode("");
    setNewDetails("");
    toast.success(`Entity created in ${activeCategory}: "${newItem.name}"`);
  };

  const categoriesList: CategoryFilter[] = [
    "Practices",
    "Providers",
    "Payors",
    "Locations",
    "Specialties",
    "Departments",
  ];

  const exportRows = useMemo(
    () =>
      sorted.map((r) => ({
        Name: r.name,
        Code: r.code,
        Category: r.category,
        Status: r.status,
        Details: r.details,
        NPI: r.npi ?? "N/A",
      })),
    [sorted],
  );

  return (
    <div className="space-y-4">
      {/* Category Selection Sub-Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-e1"
                    : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl gap-1.5" onClick={handleImport}>
            <Upload className="h-3.5 w-3.5" />
            Import CSV
          </Button>
          <ExportButton rows={exportRows} fileName={`master-data-${activeCategory.toLowerCase()}`} className="h-9 rounded-xl text-xs" />
        </div>
      </div>

      {/* Table Controls */}
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
              placeholder={`Search ${activeCategory.toLowerCase()} name, code...`}
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
            <SelectTrigger className="h-10 w-[140px] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 text-xs rounded-xl gap-1.5 font-semibold">
              <Plus className="h-4 w-4" />
              Add {activeCategory.slice(0, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add Master {activeCategory.slice(0, -1)}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Create a new master data entry for {activeCategory}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddItem} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Entity Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`e.g. ${activeCategory} Name`}
                  className="h-10 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">System Code / ID</label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CODE-101"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description / Notes</label>
                <Input
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Additional master details"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="h-9 text-xs rounded-xl" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs rounded-xl">
                  Save Entity
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1.5">
                  Name {renderSortIcon("name")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("code")}>
                <div className="flex items-center gap-1.5">
                  Code {renderSortIcon("code")}
                </div>
              </th>
              <th className="py-3.5 px-4">Description / Details</th>
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
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  No {activeCategory.toLowerCase()} master entries match the current search.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{row.name}</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-primary">{row.code}</td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.details}</td>
                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={row.status === "Active" ? "default" : "secondary"}
                      className={cn(
                        "text-[10px]",
                        row.status === "Active" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                      )}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs rounded-lg hover:text-primary"
                      onClick={() => toggleItemStatus(row.id, row.name)}
                    >
                      Toggle Status
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} {activeCategory.toLowerCase()}
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
