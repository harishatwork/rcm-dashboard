import { AlertTriangle, Info, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import { SectionCard } from "@/components/data/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency, formatMetric } from "@/lib/format";
import { useDrillDown } from "./DrillDownProvider";
import type { AiInsight, AlertSeverity, CriticalAlert, SnapshotItem } from "@/lib/api/types";

const SEVERITY: Record<
  AlertSeverity,
  { icon: typeof Info; tone: string; label: string }
> = {
  critical: { icon: ShieldAlert, tone: "bg-danger-soft text-destructive", label: "Critical" },
  warning: { icon: AlertTriangle, tone: "bg-warning-soft text-warning", label: "Warning" },
  info: { icon: Info, tone: "bg-secondary text-muted-foreground", label: "Info" },
};

/** Today's operational snapshot — same-day charge, payment and claim volume. */
export function TodaysSnapshot({ items }: { items: SnapshotItem[] }) {
  const openDrillDown = useDrillDown();

  return (
    <SectionCard title="Today's snapshot" subtitle="Activity posted since midnight">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              openDrillDown({
                title: item.label,
                hint: `Same-day detail for ${item.label.toLowerCase()} with source transactions.`,
                path: item.drillPath,
                value: formatMetric(item.value, item.format),
              })
            }
            className="rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60"
          >
            <p className="truncate text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 font-display text-xl font-extrabold">
              {formatMetric(item.value, item.format)}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.helper}</p>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

/** Ranked revenue-cycle exceptions that need executive attention. */
export function CriticalAlerts({ alerts }: { alerts: CriticalAlert[] }) {
  const openDrillDown = useDrillDown();
  const criticalCount = alerts.filter((alert) => alert.severity === "critical").length;

  return (
    <SectionCard
      title="Critical alerts"
      subtitle={`${criticalCount} critical · ${alerts.length} total open`}
    >
      <ul className="space-y-3">
        {alerts.map((alert) => {
          const meta = SEVERITY[alert.severity];
          const Icon = meta.icon;
          return (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() =>
                  openDrillDown({
                    title: alert.title,
                    hint: alert.detail,
                    path: alert.drillPath,
                    value: alert.impact > 0 ? formatCurrency(alert.impact) : undefined,
                  })
                }
                className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60"
              >
                <span className={cn("rounded-lg p-2", meta.tone)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold">{alert.title}</span>
                    <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                      {meta.label}
                    </Badge>
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{alert.detail}</span>
                  {alert.impact > 0 ? (
                    <span className="mt-1.5 block text-xs font-semibold">
                      {formatCurrency(alert.impact)} at risk
                    </span>
                  ) : null}
                </span>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

/** Placeholder surface for the upcoming AI narrative summary. */
export function AiInsightSummary({ insights }: { insights: AiInsight[] }) {
  const openDrillDown = useDrillDown();

  return (
    <SectionCard
      title="AI insight summary"
      subtitle="Preview — generated narrative arrives with the analytics service"
      actions={
        <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
          Placeholder
        </Badge>
      }
    >
      <div className="space-y-3">
        {insights.map((insight) => (
          <button
            key={insight.id}
            type="button"
            onClick={() =>
              openDrillDown({
                title: insight.headline,
                hint: insight.body,
                path: insight.drillPath,
              })
            }
            className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60"
          >
            <span className="rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{insight.headline}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{insight.body}</span>
              <span className="mt-2 flex items-center gap-2">
                <Progress value={insight.confidence * 100} className="h-1.5 w-24" />
                <span className="text-[11px] text-muted-foreground">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
