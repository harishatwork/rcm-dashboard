import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { ForecastModelComparison } from "@/lib/api/predictive-analytics";
import { cn } from "@/lib/utils";

export function ForecastModelGrid({ models }: { models: ForecastModelComparison[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "variance">("all");

  const formatValue = (val: number, unit: "currency" | "percent" | "days") => {
    if (unit === "currency") return formatCurrency(val);
    if (unit === "percent") return `${val}%`;
    return `${val} days`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Machine Learning Forecast Models</h3>
          <p className="text-xs text-muted-foreground">
            Side-by-side comparison of Actual baseline vs Machine Learning Forecast vs Model Variance
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 font-semibold transition-all",
              activeTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            All Models ({models.length})
          </button>
          <button
            onClick={() => setActiveTab("variance")}
            className={cn(
              "rounded-lg px-3 py-1.5 font-semibold transition-all",
              activeTab === "variance" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Positive Variances
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {models.map((model) => {
          return (
            <div
              key={model.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-e2 hover:border-primary/40 space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {model.modelName.split(" ")[0]} Model
                  </Badge>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-bold",
                      model.isPositiveVariance ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600",
                    )}
                  >
                    {model.isPositiveVariance ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {model.variancePct > 0 ? `+${model.variancePct}%` : `${model.variancePct}%`}
                  </span>
                </div>

                <h4 className="mt-2 font-bold text-sm leading-snug">{model.modelName}</h4>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{model.description}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-2.5 space-y-1 text-xs border border-border/40">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Actual Baseline:</span>
                  <span className="font-mono font-medium text-foreground">{formatValue(model.actualValue, model.unit)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-primary">ML Forecast:</span>
                  <span className="font-mono text-primary">{formatValue(model.forecastValue, model.unit)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground">Variance:</span>
                  <span
                    className={cn(
                      "font-mono font-bold",
                      model.isPositiveVariance ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600",
                    )}
                  >
                    {model.varianceValue > 0 ? `+${formatValue(model.varianceValue, model.unit)}` : formatValue(model.varianceValue, model.unit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
