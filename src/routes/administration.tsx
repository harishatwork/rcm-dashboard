import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  Database,
  FileCode2,
  Key,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import { AdminUserManagementTable } from "@/components/dashboard/AdminUserManagementTable";
import { RolePermissionMatrix } from "@/components/dashboard/RolePermissionMatrix";
import { MasterDataGrid } from "@/components/dashboard/MasterDataGrid";
import { AdminNotificationConfig } from "@/components/dashboard/AdminNotificationConfig";
import { AuditLogsTable } from "@/components/dashboard/AuditLogsTable";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Administration & Settings | RCM Analytics" },
      {
        name: "description",
        content:
          "Centralized administration portal managing user provisioning, RBAC role-permission matrices, master data, notification rules, API integrations, and security audit logs.",
      },
      { property: "og:title", content: "Administration & Settings | RCM Analytics" },
      {
        property: "og:description",
        content: "Manage workspace members, practices, payors, providers, security policies, and integrations.",
      },
    ],
  }),
  component: AdministrationPortalPage,
});

export function AdministrationPortalPage() {
  const query = useQuery(rcmQueries.administration());
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const sectionsNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
    { id: "practices", label: "Practices", icon: Building2 },
    { id: "providers", label: "Providers", icon: Stethoscope },
    { id: "payors", label: "Payors", icon: Wallet },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "specialties", label: "Specialties", icon: Activity },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "config", label: "System Configuration", icon: Settings2 },
    { id: "integrations", label: "API & Integrations", icon: FileCode2 },
    { id: "audit", label: "Audit Logs", icon: Database },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Administration & Settings Portal"
        description="Centralized administration for user provisioning, RBAC role matrices, master data management, notification thresholds, API integrations, and security audit logs."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Administration & Settings Portal data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while connecting to the workspace administrative API. Please check your network or try again.
          </p>
          <Button variant="outline" className="mt-6 gap-2 rounded-xl" onClick={() => query.refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : null}

      {/* Main Dashboard Portal View */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          {/* Frameless Wrapping Sub-Navigation Tabs (Subtle Defined Pills) */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/60">
            {sectionsNav.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Portal View Content Area */}
          <div className="space-y-6">
            {/* Section 1 — Dashboard */}
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <KpiCard metric={data.kpis.totalUsers} index={0} invertTrend={false} />
                  <KpiCard metric={data.kpis.activeUsers} index={1} invertTrend={false} />
                  <KpiCard metric={data.kpis.userRoles} index={2} invertTrend={false} />
                  <KpiCard metric={data.kpis.connectedPractices} index={3} invertTrend={false} />
                  <KpiCard metric={data.kpis.apiIntegrations} index={4} invertTrend={false} />
                  <KpiCard metric={data.kpis.systemHealth} index={5} invertTrend={false} />
                </div>

                <SectionCard
                  title="System Integrations Uptime & Health Status"
                  subtitle="Real-time status of clearinghouse 837/835 feeds, EHR encounter sync, and data pipelines"
                >
                  <ul className="divide-y divide-border">
                    {data.integrations.map((item) => (
                      <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.endpointUrl} · Last sync {item.lastSync}</p>
                        </div>
                        <Badge variant={item.status === "Connected" ? "default" : "destructive"} className="text-xs font-semibold">
                          {item.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard
                  title="Recent Security & System Audit Trail"
                  subtitle="Latest administrative actions logged across the workspace"
                >
                  <AuditLogsTable logs={data.auditLogs.slice(0, 5)} />
                </SectionCard>
              </div>
            )}

            {/* Section 2 — User Management */}
            {activeSection === "users" && (
              <SectionCard
                title="User Provisioning & Member Access"
                subtitle="Provision workspace members, assign RBAC roles, trigger password resets, and enforce MFA"
              >
                <AdminUserManagementTable initialUsers={data.users} />
              </SectionCard>
            )}

            {/* Section 3 — Roles & Permissions */}
            {activeSection === "roles" && (
              <SectionCard
                title="Role-Based Access Control (RBAC) Permissions Matrix"
                subtitle="Define role permissions across 8 functional modules (Dashboard Access, Financial Data, Claims, A/R, Denials, Reports, Administration, User Management)"
              >
                <RolePermissionMatrix initialRoles={data.rolePermissions} />
              </SectionCard>
            )}

            {/* Section 4 to 8 — Master Data Screens (Practices, Providers, Payors, Locations, Specialties) */}
            {(activeSection === "practices" ||
              activeSection === "providers" ||
              activeSection === "payors" ||
              activeSection === "locations" ||
              activeSection === "specialties") && (
                <SectionCard
                  title={`Master Data Management — ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
                  subtitle="CRUD master records, bulk import CSV datasets, search, filter, and export entity data"
                >
                  <MasterDataGrid initialData={data.masterData} />
                </SectionCard>
              )}

            {/* Section 9 — Notification Settings */}
            {activeSection === "notifications" && (
              <SectionCard
                title="Notification Settings & Alert Thresholds"
                subtitle="Configure email templates, system alert thresholds, escalation rules, and default escalation user"
              >
                <AdminNotificationConfig initialConfig={data.notificationConfig} />
              </SectionCard>
            )}

            {/* Section 10 — System Configuration */}
            {activeSection === "config" && (
              <SectionCard
                title="Workspace Security & System Configuration"
                subtitle="Manage session timeouts, password strength policies, IP address whitelisting, and workspace security controls"
              >
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-border p-4 space-y-3">
                    <h4 className="font-bold text-sm text-foreground">Session Timeout & Lock Policies</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Inactivity Timeout (Minutes)</label>
                        <Input defaultValue="30" className="h-9 rounded-xl text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Maximum Failed Login Attempts</label>
                        <Input defaultValue="5" className="h-9 rounded-xl text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4 space-y-3">
                    <h4 className="font-bold text-sm text-foreground">IP Address Whitelisting</h4>
                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">Allowed CIDR Subnets (Comma-separated)</label>
                      <Input defaultValue="192.168.1.0/24, 10.0.0.0/16" className="h-9 rounded-xl text-xs" />
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Section 11 — API & Integrations */}
            {activeSection === "integrations" && (
              <SectionCard
                title="API & Integration Management"
                subtitle="Manage clearinghouse 837/835 feeds, EHR FHIR endpoints, API keys, and webhooks"
              >
                <div className="space-y-4">
                  {data.integrations.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{item.name}</span>
                        <Badge variant={item.status === "Connected" ? "default" : "destructive"} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">Endpoint: {item.endpointUrl}</p>
                      <p className="text-xs text-muted-foreground font-mono">API Key: {item.apiKeyMasked}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Section 12 — Audit Logs */}
            {activeSection === "audit" && (
              <SectionCard
                title="Security & User Action Audit Logs"
                subtitle="Complete audit trail logging user authentication, data exports, role modifications, and system events"
              >
                <AuditLogsTable logs={data.auditLogs} />
              </SectionCard>
            )}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
