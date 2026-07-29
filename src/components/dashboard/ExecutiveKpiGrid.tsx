import { ChevronRight } from "lucide-react";
import { TrendPill } from "@/components/data/TrendPill";
import { formatMetric } from "@/lib/format";
import { useDrillDown } from "./DrillDownProvider";
import type { ExecutiveKpi } from "@/lib/api/types";

/** KPIs where a decrease is the healthy direction. */
const INVERTED = new Set([
  "adjustments",
  "outstanding-balance",
  "claims-denied",
  "current-ar",
  "days-in-ar",
  "denial-rate",
]);

function ExecutiveKpiCard({ metric, index }: { metric: ExecutiveKpi; index: number }) {
  const openDrillDown = useDrillDown();
  const value = formatMetric(metric.value, metric.format);
  const progress =
    metric.target !== undefined
      ? Math.min(100, Math.round((metric.value / metric.target) * 100))
      : undefined;

  return (
    <button
      type="button"
      aria-label={`${metric.label} — open drill-down`}
      onClick={() =>
        openDrillDown({
          title: metric.label,
          hint: metric.drillHint,
          path: metric.drillPath,
          value,
        })
      }
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="surface-card surface-card-interactive animate-rise group flex flex-col justify-between w-full p-4 sm:p-5 text-left min-w-0 overflow-hidden"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2 min-w-0">
          <p className="min-w-0 flex-1 text-xs sm:text-sm font-medium text-muted-foreground leading-snug break-words">
            {metric.label}
          </p>
          <div className="shrink-0">
            <TrendPill
              value={metric.deltaPct}
              trend={metric.trend}
              positiveWhenDown={INVERTED.has(metric.id)}
            />
          </div>
        </div>
        <p className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight truncate">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{metric.helper}</p>
      </div>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Drill down
        <ChevronRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

/** Top KPI band of the executive home dashboard. */
export function ExecutiveKpiGrid({ metrics }: { metrics: ExecutiveKpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <ExecutiveKpiCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}
