import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DrawerPanel } from "@/components/common/DrawerPanel";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DrillDownDetailResponse, DrillLevel, EntityType } from "@/lib/api/drilldown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface DrillDownDrawerPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownDetailResponse | null;
  onNavigateLevel?: (level: DrillLevel, entityType: EntityType, entityId: string) => void;
}

export function DrillDownDrawerPanel({
  open,
  onOpenChange,
  data,
  onNavigateLevel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownDetailResponse | null;
  onNavigateLevel?: (level: DrillLevel, entityType: EntityType, entityId: string) => void;
}) {
  if (!data) return null;

  const node = data.node;
  const breadcrumbs = data.breadcrumbs;

  const fullPageRoute = `/drilldown?level=${node.level}&entityType=${node.entityType}&entityId=${node.entityId}`;

  return (
    <DrawerPanel
      open={open}
      onOpenChange={onOpenChange}
      title={node.title}
      description={`Level ${node.level} of 4 · Context preserved across global filters`}
      width="sm:max-w-2xl"
      footer={
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <div className="flex items-center gap-1">
            {data.parentLink && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl text-xs gap-1"
                onClick={() =>
                  onNavigateLevel?.(
                    data.parentLink!.level,
                    data.parentLink!.entityType,
                    data.parentLink!.entityId,
                  )
                }
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Level {data.parentLink.level}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button asChild size="sm" className="h-8 rounded-xl text-xs gap-1.5 font-semibold">
              <Link
                to="/drilldown"
                search={{ level: node.level, entityType: node.entityType, entityId: node.entityId }}
                onClick={() => onOpenChange(false)}
              >
                Open Full Detail Page
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Breadcrumb Level Bar */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 p-2 text-xs">
          {breadcrumbs.map((b, idx) => (
            <div key={b.entityId} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <button
                onClick={() => onNavigateLevel?.(b.level, b.entityType, b.entityId)}
                className={cn(
                  "font-semibold transition-colors px-1.5 py-0.5 rounded-md",
                  b.level === node.level
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                L{b.level}: {b.label}
              </button>
            </div>
          ))}
        </div>

        {/* Preserved Filters Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
          <p className="font-semibold text-primary flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Active Filter Context Preserved
          </p>
          <div className="grid gap-2 sm:grid-cols-2 text-muted-foreground text-[11px] pt-1">
            <span>Date Range: <strong className="text-foreground">{data.preservedFilters.dateRange}</strong></span>
            <span>Practice: <strong className="text-foreground">{data.preservedFilters.practice}</strong></span>
            <span>Provider: <strong className="text-foreground">{data.preservedFilters.provider}</strong></span>
            <span>Payor: <strong className="text-foreground">{data.preservedFilters.payor}</strong></span>
          </div>
        </div>

        {/* Value Hero Banner */}
        {node.value ? (
          <div className="surface-card p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {node.entityType} Target Metric Value
            </span>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl font-extrabold text-foreground">{node.value}</p>
              {node.deltaPct ? (
                <Badge variant="outline" className="text-xs font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  +{node.deltaPct}% vs prev period
                </Badge>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Summary Details Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {node.summaryData.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-3 space-y-0.5">
              <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
              {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
            </div>
          ))}
        </div>

        {/* Line Items Table Preview */}
        {node.tableData && node.tableData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Line Items & Transaction Records
              </h4>
              {data.childLinks?.[0] && (
                <button
                  onClick={() =>
                    onNavigateLevel?.(
                      data.childLinks![0].level,
                      data.childLinks![0].entityType,
                      data.childLinks![0].entityId,
                    )
                  }
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  Drill down to Level {data.childLinks[0].level}
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Identifier</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {node.tableData.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => onNavigateLevel?.(4, "claim", r.col1)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-primary">{r.col1}</td>
                      <td className="py-2.5 px-3">{r.col2}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.col4}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {r.amount ? formatCurrency(r.amount) : r.col3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Timeline & Notes */}
        {node.timelineData && node.timelineData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Audit History & Event Timeline
            </h4>
            <div className="space-y-2">
              {node.timelineData.map((t) => (
                <div key={t.id} className="rounded-xl border border-border/70 p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{t.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{t.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
