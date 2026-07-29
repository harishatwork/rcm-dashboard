import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trend } from "@/lib/api/types";

export function TrendPill({
  value,
  trend,
  positiveWhenDown = false,
}: {
  value: number;
  trend: Trend;
  positiveWhenDown?: boolean;
}) {
  const isGood = trend === "flat" ? true : positiveWhenDown ? trend === "down" : trend === "up";
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        trend === "flat"
          ? "bg-muted text-muted-foreground"
          : isGood
            ? "bg-success-soft text-success"
            : "bg-danger-soft text-destructive",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
