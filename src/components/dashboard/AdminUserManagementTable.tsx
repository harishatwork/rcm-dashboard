import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Edit,
  KeyRound,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserX,
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
import { roleLabel, type AppRole } from "@/lib/rbac";
import type { AdminUser } from "@/lib/api/administration";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortField = "name" | "email" | "role" | "practice" | "status" | "lastLogin";
type SortDirection = "asc" | "desc";

export function AdminUserManagementTable({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add User Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("billing-manager");
  const [newPractice, setNewPractice] = useState("Main Campus Health");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return users.filter((row) => {
      const matchGlobal =
        !s ||
        row.name.toLowerCase().includes(s) ||
        row.email.toLowerCase().includes(s) ||
        row.practice.toLowerCase().includes(s);

      const matchRole = roleFilter === "all" || row.role === roleFilter;
      const matchStatus = statusFilter === "all" || row.status === statusFilter;

      return matchGlobal && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

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

  const toggleUserStatus = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Disabled" : "Active";
          toast.info(`User status changed to ${nextStatus}: "${name}"`);
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const handleResetPassword = (email: string) => {
    toast.success(`Password reset link sent to ${email}`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      practice: newPractice,
      status: "Active",
      lastLogin: "Never",
      mfaEnabled: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [newUser, ...prev]);
    setAddOpen(false);
    setNewName("");
    setNewEmail("");
    toast.success(`User provisioned successfully: "${newUser.name}"`);
  };

  const exportRows = useMemo(
    () =>
      sorted.map((r) => ({
        Name: r.name,
        Email: r.email,
        Role: roleLabel(r.role),
        Practice: r.practice,
        Status: r.status,
        "Last Login": r.lastLogin,
        "MFA Enabled": r.mfaEnabled ? "Yes" : "No",
        Created: r.createdAt,
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
              placeholder="Search user name, email, facility..."
              className="h-10 pl-9 rounded-xl"
            />
          </div>

          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[170px] rounded-xl">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="practice-admin">Practice Admin</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="billing-manager">Billing Manager</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="Disabled">Disabled</SelectItem>
              <SelectItem value="Invited">Invited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 text-xs rounded-xl gap-1.5 font-semibold">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Provision New User Account</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Create a new user profile and assign role-based permissions for RCM Analytics.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddUser} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Full Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Work Email Address</label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jane.smith@northstar.health"
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Assigned Role</label>
                    <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                      <SelectTrigger className="h-10 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="practice-admin">Practice Administrator</SelectItem>
                        <SelectItem value="executive">Executive Leadership</SelectItem>
                        <SelectItem value="billing-manager">Billing Manager</SelectItem>
                        <SelectItem value="provider">Clinical Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Facility / Practice</label>
                    <Input
                      value={newPractice}
                      onChange={(e) => setNewPractice(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" className="h-9 text-xs rounded-xl" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="h-9 text-xs rounded-xl">
                    Create User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <ExportButton rows={exportRows} fileName="users-management" className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1.5">
                  User Member {renderSortIcon("name")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("role")}>
                <div className="flex items-center gap-1.5">
                  Role {renderSortIcon("role")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("practice")}>
                <div className="flex items-center gap-1.5">
                  Practice Facility {renderSortIcon("practice")}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("lastLogin")}>
                <div className="flex items-center gap-1.5">
                  Last Login {renderSortIcon("lastLogin")}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">MFA</th>
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
                  No users match the current search or status filters.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <Badge variant="outline" className="font-medium">
                      {roleLabel(row.role)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-foreground font-medium">{row.practice}</td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">{row.lastLogin}</td>
                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={row.mfaEnabled ? "default" : "secondary"}
                      className={cn(
                        "text-[10px]",
                        row.mfaEnabled && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                      )}
                    >
                      {row.mfaEnabled ? "Enabled" : "Off"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={row.status === "Active" ? "default" : row.status === "Disabled" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Reset Password"
                        className="h-8 w-8 p-0 rounded-lg hover:text-amber-600"
                        onClick={() => handleResetPassword(row.email)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title={row.status === "Active" ? "Disable User" : "Enable User"}
                        className="h-8 w-8 p-0 rounded-lg hover:text-destructive"
                        onClick={() => toggleUserStatus(row.id, row.name)}
                      >
                        {row.status === "Active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4 text-emerald-600" />}
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
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} users
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
