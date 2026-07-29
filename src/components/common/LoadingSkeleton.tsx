import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type SkeletonVariant = "text" | "card" | "kpi" | "chart" | "table" | "list";

export interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  /** Rows / items / cards to render. */
  count?: number;
  /** Only used by the chart variant. */
  height?: number;
  className?: string;
}

/** Consistent shimmer placeholders for every async surface in the app. */
export function LoadingSkeleton({
  variant = "text",
  count = 3,
  height = 280,
  className,
}: LoadingSkeletonProps) {
  if (variant === "chart") {
    return (
      <div className={cn("flex w-full items-end gap-3", className)} style={{ height }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-lg"
            style={{ height: `${30 + ((i * 37) % 65)}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "kpi") {
    return (
      <div className={cn("grid gap-5 sm:grid-cols-2 xl:grid-cols-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-card space-y-4 p-5 sm:p-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("grid gap-5 sm:grid-cols-2", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-card space-y-3 p-5 sm:p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === count - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
