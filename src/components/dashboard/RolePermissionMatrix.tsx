import { useState } from "react";
import { Copy, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PermissionCategory, RolePermissionDefinition } from "@/lib/api/administration";
import { toast } from "sonner";

export function RolePermissionMatrix({
  initialRoles,
}: {
  initialRoles: RolePermissionDefinition[];
}) {
  const [roles, setRoles] = useState<RolePermissionDefinition[]>(initialRoles);
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const categories: PermissionCategory[] = [
    "Dashboard Access",
    "Financial Data",
    "Claims",
    "AR",
    "Denials",
    "Reports",
    "Administration",
    "User Management",
  ];

  const togglePermission = (roleId: string, category: PermissionCategory) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.roleId === roleId) {
          const nextVal = !role.permissions[category];
          toast.success(
            `Permission "${category}" ${nextVal ? "granted" : "revoked"} for ${role.roleName}`,
          );
          return {
            ...role,
            permissions: { ...role.permissions, [category]: nextVal },
          };
        }
        return role;
      }),
    );
  };

  const handleCloneRole = (role: RolePermissionDefinition) => {
    const cloned: RolePermissionDefinition = {
      roleId: `custom-${Date.now()}`,
      roleName: `${role.roleName} (Copy)`,
      description: `Cloned from ${role.roleName}`,
      isCustom: true,
      permissions: { ...role.permissions },
    };
    setRoles((prev) => [...prev, cloned]);
    toast.success(`Role cloned: "${cloned.roleName}"`);
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    setRoles((prev) => prev.filter((r) => r.roleId !== roleId));
    toast.error(`Custom role deleted: "${roleName}"`);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: RolePermissionDefinition = {
      roleId: `custom-${Date.now()}`,
      roleName: newRoleName,
      description: newRoleDesc || "Custom organizational role",
      isCustom: true,
      permissions: {
        "Dashboard Access": true,
        "Financial Data": false,
        Claims: false,
        AR: false,
        Denials: false,
        Reports: true,
        Administration: false,
        "User Management": false,
      },
    };

    setRoles((prev) => [...prev, newRole]);
    setCreateOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
    toast.success(`Role created: "${newRole.roleName}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs text-muted-foreground">
            Configure permission categories across system roles to restrict access to sensitive financial & clinical data
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
              <Plus className="h-3.5 w-3.5" />
              Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Create New Custom Role</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define custom role identifiers and default permission templates.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateRole} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Role Name</label>
                <Input
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Senior Denial Analyst"
                  className="h-10 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description</label>
                <Input
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Appeals specialist focused on CARC/RARC denial recovery"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="h-9 text-xs rounded-xl" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs rounded-xl">
                  Save Role
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role-Permission Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 min-w-[200px]">Permission Category</th>
              {roles.map((role) => (
                <th key={role.roleId} className="py-3.5 px-4 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-foreground text-xs">{role.roleName}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Clone Role"
                        className="h-6 w-6 p-0 hover:text-primary"
                        onClick={() => handleCloneRole(role)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {role.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete Role"
                          className="h-6 w-6 p-0 hover:text-destructive"
                          onClick={() => handleDeleteRole(role.roleId, role.roleName)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {categories.map((cat) => (
              <tr key={cat} className="hover:bg-muted/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  {cat}
                </td>
                {roles.map((role) => {
                  const isChecked = !!role.permissions[cat];
                  return (
                    <td key={`${role.roleId}-${cat}`} className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => togglePermission(role.roleId, cat)}
                          className="h-4 w-4 rounded"
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
