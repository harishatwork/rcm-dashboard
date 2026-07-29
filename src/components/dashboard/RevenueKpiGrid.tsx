import { ChevronRight } from "lucide-react";
import { TrendPill } from "@/components/data/TrendPill";
import { KpiSparkline } from "@/components/charts/RevenueDashboardCharts";
import { useDrillDown } from "./DrillDownProvider";
import { formatMetric } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { RevenueKpi } from "@/lib/api/revenue-dashboard";

/** KPIs where a decrease is the healthy direction. */
const INVERTED = new Set(["total-adjustments", "outstanding-balance"]);

function RevenueKpiCard({ metric, index }: { metric: RevenueKpi; index: number }) {
  const openDrillDown = useDrillDown();
  const value = formatMetric(metric.value, metric.format);
  const previous = formatMetric(metric.previousValue, metric.format);
  const inverted = INVERTED.has(metric.id);
  const healthy = metric.trend === "flat" || (inverted ? metric.trend === "down" : metric.trend === "up");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${metric.label} — open drill-down`}
          onClick={() =>
            openDrillDown({
              title: metric.label,
              hint: `${metric.drillHint} Hierarchy: Revenue → Insurance → Provider → Patient → Encounter → Claim → CPT → Payment details.`,
              path: metric.drillPath,
              value,
            })
          }
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
          className="surface-card surface-card-interactive animate-rise group w-full p-5 text-left"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <p className="min-w-0 truncate text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <TrendPill value={metric.deltaPct} trend={metric.trend} positiveWhenDown={inverted} />
          </div>
          <p className="mt-3 font-display text-2xl font-extrabold tracking-tight">{value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {previous} · {metric.previousLabel}
          </p>
          <div className="mt-3 -mx-1">
            <KpiSparkline points={metric.sparkline} positive={healthy} />
          </div>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Drill down
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
        {metric.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function RevenueKpiGrid({
  metrics,
  isLoading,
}: {
  metrics: RevenueKpi[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <RevenueKpiCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}
