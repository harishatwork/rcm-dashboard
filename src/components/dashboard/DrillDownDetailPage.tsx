import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportButton } from "@/components/common/ExportButton";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DrillLevel, EntityType } from "@/lib/api/drilldown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DrillDownDetailPage() {
  const search = useSearch({ strict: false }) as any;
  const level: DrillLevel = (Number(search.level) || 2) as DrillLevel;
  const entityType: EntityType = (search.entityType as EntityType) || "revenue";
  const entityId: string = search.entityId || "root";

  const query = useQuery(rcmQueries.drilldown(entityType, entityId, level));

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleActionClick = (actionName: string) => {
    toast.success(`Action initiated: "${actionName}"`, {
      description: `Target entity: ${entityType.toUpperCase()} #${entityId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Invalid Drill-down Path or Missing Record
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The target record ({entityType} #{entityId}) could not be located in the current workspace context.
          </p>
          <Button variant="outline" className="mt-6 gap-2 rounded-xl" onClick={() => query.refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry Query
          </Button>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : null}

      {/* Main Detail View */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          {/* Top Breadcrumbs & Level Indicator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-e1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {data.breadcrumbs.map((b, idx) => (
                <div key={b.entityId} className="flex items-center gap-1">
                  {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  <Link
                    to="/drilldown"
                    search={{ level: b.level, entityType: b.entityType, entityId: b.entityId }}
                    className={cn(
                      "font-semibold transition-colors px-2 py-1 rounded-lg flex items-center gap-1",
                      b.level === level
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    L{b.level}: {b.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-mono">
                Level {level} of 4 Depth
              </Badge>
              <ExportButton
                rows={data.node.tableData.map((t) => ({
                  ID: t.col1,
                  Entity: t.col2,
                  Details: t.col4,
                  Amount: t.amount ?? t.col3,
                  Status: t.status ?? "Active",
                }))}
                fileName={`drilldown-${entityType}-L${level}`}
                className="h-8 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Preserved Filters Banner */}
          <div className="surface-card p-4 space-y-2 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Active Global Filter Context Preserved
              </p>
              <span className="text-[11px] text-muted-foreground">Automatic Session Sync</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6 text-xs text-muted-foreground pt-1">
              <div>
                <span>Date Range:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.dateRange}</p>
              </div>
              <div>
                <span>Practice:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.practice}</p>
              </div>
              <div>
                <span>Provider:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.provider}</p>
              </div>
              <div>
                <span>Payor:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.payor}</p>
              </div>
              <div>
                <span>Location:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.location}</p>
              </div>
              <div>
                <span>Specialty:</span>
                <p className="font-semibold text-foreground truncate">{data.preservedFilters.specialty}</p>
              </div>
            </div>
          </div>

          {/* KPI Metrics Summary Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.node.kpiMetrics.map((m, idx) => (
              <KpiCard key={m.id} metric={m} index={idx} invertTrend={m.id === "m-3" || m.id === "m-4"} />
            ))}
          </div>

          {/* Detail Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="h-11 rounded-xl p-1 bg-muted">
              <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <FileText className="h-3.5 w-3.5" />
                Overview & Summary
              </TabsTrigger>
              <TabsTrigger value="financial" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <Layers className="h-3.5 w-3.5" />
                Financial Performance
              </TabsTrigger>
              <TabsTrigger value="records" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Related Records & Line Items ({data.node.tableData.length})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <Clock className="h-3.5 w-3.5" />
                Timeline & Activity History ({data.node.timelineData.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 — Overview */}
            <TabsContent value="overview" className="space-y-4">
              <SectionCard title="Target Entity Summary Specification">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {data.node.summaryData.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-card p-4 space-y-1">
                      <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                      <p className="text-base font-bold text-foreground">{s.value}</p>
                      {s.note && <p className="text-[11px] text-muted-foreground">{s.note}</p>}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            {/* Tab 2 — Financial Summary */}
            <TabsContent value="financial" className="space-y-4">
              <SectionCard title="Financial Performance & Variance Analysis">
                <div className="space-y-3 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    Detailed financial yield metrics tracked for {entityType.toUpperCase()} target #{entityId} within the selected date range.
                  </p>
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Gross Billed Charges</span>
                      <span className="font-mono font-bold">$4,180,000</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="font-semibold">Net Collections Collected</span>
                      <span className="font-mono font-bold">$3,820,000</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-600">
                      <span className="font-semibold">Contractual Allowances & Adjustments</span>
                      <span className="font-mono font-bold">$360,000</span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </TabsContent>

            {/* Tab 3 — Related Records */}
            <TabsContent value="records" className="space-y-4">
              <SectionCard title="Line Items & Claim Transaction Register">
                <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
                      <tr>
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Entity Member</th>
                        <th className="py-3 px-4">Payor / Program</th>
                        <th className="py-3 px-4">CPT / Procedure Detail</th>
                        <th className="py-3 px-4 text-right">Billed Amount</th>
                        <th className="py-3 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {data.node.tableData.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-primary">{row.col1}</td>
                          <td className="py-3 px-4 font-medium">{row.col2}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.col3}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.col4}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold">
                            {row.amount ? formatCurrency(row.amount) : "$0"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="text-[10px]">
                              {row.status ?? "Active"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </TabsContent>

            {/* Tab 4 — Timeline & History */}
            <TabsContent value="timeline" className="space-y-4">
              <SectionCard title="Audit History & Event Timeline">
                <div className="space-y-3">
                  {data.node.timelineData.map((t) => (
                    <div key={t.id} className="rounded-xl border border-border bg-card p-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">{t.title}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{t.timestamp}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{t.description}</p>
                      <p className="text-[11px] text-primary font-medium pt-1">Logged by: {t.actor}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
