import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  /** Height of the chart body in px. */
  height?: number;
  isLoading?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * Container for any visualization. Owns the loading / empty / error
 * lifecycle so charts themselves stay presentational.
 */
export function ChartCard({
  title,
  subtitle,
  actions,
  footer,
  height = 300,
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data available for the selected filters.",
  onRetry,
  className,
  children,
}: ChartCardProps) {
  return (
    <section className={cn("surface-card animate-rise p-5 sm:p-6", className)}>
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions}
      </div>

      <div style={{ minHeight: height }}>
        {error ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : isLoading ? (
          <LoadingSkeleton variant="chart" height={height} />
        ) : isEmpty ? (
          <EmptyState title="Nothing to plot" description={emptyMessage} />
        ) : (
          children
        )}
      </div>

      {footer ? (
        <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
