import { ChevronRight } from "lucide-react";
import { TrendPill } from "@/components/data/TrendPill";
import { KpiSparkline } from "@/components/charts/RevenueDashboardCharts";
import { useDrillDown } from "./DrillDownProvider";
import { formatCurrency, formatMetric, formatNumber, formatPercent } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ArAgingCard, ArKpi } from "@/lib/api/ar-dashboard";

export const AR_DRILL_HIERARCHY =
  "Hierarchy: AR → Insurance → Provider → Patient → Claim → Payment history.";

/** KPIs where a decrease is the healthy direction. */
const INVERTED = new Set([
  "current-ar",
  "days-in-ar",
  "avg-ar-days",
  "patient-ar",
  "insurance-ar",
  "outstanding-claims",
  "outstanding-balance",
]);

function ArKpiCard({ metric, index }: { metric: ArKpi; index: number }) {
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
              hint: `${metric.drillHint} ${AR_DRILL_HIERARCHY}`,
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

export function ArKpiGrid({ metrics, isLoading }: { metrics: ArKpi[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <ArKpiCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}

/* -------------------------------- Aging cards ------------------------------- */

const TONE_BAR: Record<ArAgingCard["tone"], string> = {
  healthy: "bg-status-paid",
  watch: "bg-status-pending",
  risk: "bg-status-denied",
};

const TONE_LABEL: Record<ArAgingCard["tone"], string> = {
  healthy: "Current",
  watch: "Watch",
  risk: "At risk",
};

export function ArAgingCards({
  buckets,
  isLoading,
}: {
  buckets: ArAgingCard[];
  isLoading?: boolean;
}) {
  const openDrillDown = useDrillDown();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
      {buckets.map((bucket, index) => (
        <button
          key={bucket.id}
          type="button"
          onClick={() =>
            openDrillDown({
              title: `AR aging · ${bucket.bucket} days`,
              hint: `Open claims aged ${bucket.bucket} days. ${AR_DRILL_HIERARCHY}`,
              path: "/claims",
              value: formatCurrency(bucket.amount),
            })
          }
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          className="surface-card surface-card-interactive animate-rise w-full p-5 text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold">{bucket.bucket}</p>
              <p className="text-xs text-muted-foreground">days · {TONE_LABEL[bucket.tone]}</p>
            </div>
            <TrendPill value={bucket.deltaPct} trend={bucket.trend} positiveWhenDown />
          </div>
          <p className="mt-3 font-display text-xl font-extrabold tracking-tight">
            {formatCurrency(bucket.amount, true)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatPercent(bucket.sharePct)} of AR · {formatNumber(bucket.claims)} claims
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full", TONE_BAR[bucket.tone])}
              style={{ width: `${Math.min(bucket.sharePct * 2, 100)}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
