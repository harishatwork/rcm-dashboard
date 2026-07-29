import { ChevronRight } from "lucide-react";
import { TrendPill } from "@/components/data/TrendPill";
import { KpiSparkline } from "@/components/charts/RevenueDashboardCharts";
import { useDrillDown } from "./DrillDownProvider";
import { formatMetric } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionsKpi } from "@/lib/api/collections-dashboard";

export const COLLECTIONS_DRILL_HIERARCHY =
  "Hierarchy: Collection → Insurance → Provider → Patient → Claim → Payment → ERA.";

/** KPIs where a decrease is the healthy direction. */
const INVERTED = new Set(["avg-days-to-payment", "payment-variance"]);

function CollectionsKpiCard({ metric, index }: { metric: CollectionsKpi; index: number }) {
  const openDrillDown = useDrillDown();
  const value = formatMetric(metric.value, metric.format);
  const previous = formatMetric(metric.previousValue, metric.format);
  const inverted = INVERTED.has(metric.id);
  const healthy =
    metric.trend === "flat" || (inverted ? metric.trend === "down" : metric.trend === "up");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${metric.label} — open drill-down`}
          onClick={() =>
            openDrillDown({
              title: metric.label,
              hint: `${metric.drillHint} ${COLLECTIONS_DRILL_HIERARCHY}`,
              path: metric.drillPath,
              value,
            })
          }
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
          className="surface-card surface-card-interactive animate-rise group flex flex-col justify-between w-full p-4 sm:p-5 text-left min-w-0 overflow-hidden"
        >
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 min-w-0">
              <p className="min-w-0 flex-1 text-xs sm:text-sm font-medium leading-snug text-muted-foreground break-words">
                {metric.label}
              </p>
              <div className="shrink-0">
                <TrendPill value={metric.deltaPct} trend={metric.trend} positiveWhenDown={inverted} />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight truncate">{value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {previous} · {metric.previousLabel}
            </p>
          </div>
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

export function CollectionsKpiGrid({
  metrics,
  isLoading,
}: {
  metrics: CollectionsKpi[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <CollectionsKpiCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}
