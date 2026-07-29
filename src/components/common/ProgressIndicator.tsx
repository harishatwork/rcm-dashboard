import { cn } from "@/lib/utils";

export type ProgressTone = "primary" | "success" | "warning" | "danger";

const tones: Record<ProgressTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  /** Right-aligned caption; defaults to the percentage. */
  caption?: string;
  tone?: ProgressTone;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

/** Linear progress bar for targets, goal attainment and job status. */
export function ProgressIndicator({
  value,
  max = 100,
  label,
  caption,
  tone = "primary",
  size = "md",
  showValue = true,
  className,
}: ProgressIndicatorProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label || showValue || caption ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label ? <span className="truncate text-xs font-medium">{label}</span> : <span />}
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
            {caption ?? (showValue ? `${Math.round(pct)}%` : null)}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-full bg-secondary",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Circular variant for compact KPI tiles. */
export function CircularProgress({
  value,
  size = 64,
  strokeWidth = 6,
  tone = "primary",
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: ProgressTone;
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeColors: Record<ProgressTone, string> = {
    primary: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-destructive",
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={label ?? `${pct}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          className={cn("fill-none transition-all duration-700 ease-out", strokeColors[tone])}
        />
      </svg>
      <span className="absolute text-xs font-bold">{Math.round(pct)}%</span>
    </div>
  );
}
