import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { TrendPill } from "./TrendPill";
import type { KpiMetric } from "@/lib/api/types";

export interface ExtendedKpiMetric extends KpiMetric {
  confidencePct?: number;
}

export function KpiCard({
  metric,
  index = 0,
  invertTrend = false,
  confidencePct,
}: {
  metric: ExtendedKpiMetric;
  index?: number;
  invertTrend?: boolean;
  confidencePct?: number;
}) {
  const progress =
    metric.target !== undefined
      ? Math.min(100, Math.round((metric.value / metric.target) * 100))
      : undefined;

  const conf = confidencePct ?? metric.confidencePct;

  return (
    <article
      className="surface-card surface-card-interactive animate-rise flex flex-col justify-between p-4 sm:p-5 min-w-0 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2 min-w-0">
          <p className="min-w-0 flex-1 text-xs sm:text-sm font-medium text-muted-foreground leading-snug break-words">
            {metric.label}
          </p>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {conf ? (
              <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/30 font-mono gap-1 px-1.5 shrink-0">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                <span>{conf}% Conf</span>
              </Badge>
            ) : null}
            <TrendPill value={metric.deltaPct} trend={metric.trend} positiveWhenDown={invertTrend} />
          </div>
        </div>
        <p className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
          {formatMetric(metric.value, metric.format)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{metric.helper}</p>
      </div>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full bg-primary transition-all duration-700 ease-out")}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}
