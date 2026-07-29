import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { DenialAiInsight } from "@/lib/api/denials-dashboard";
import { toast } from "sonner";

export function DenialsAiInsights({ insights }: { insights: DenialAiInsight[] }) {
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const handleAction = (insight: DenialAiInsight) => {
    setAppliedActions((prev) => ({ ...prev, [insight.id]: true }));
    toast.success(`Action initiated: "${insight.recommendation.slice(0, 45)}..."`, {
      description: `Estimated revenue recovery: ${formatCurrency(insight.estimatedImpact)}`,
    });
  };

  return (
    <div className="surface-card p-5 sm:p-6 space-y-4 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 via-card to-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold tracking-tight flex items-center gap-2">
              AI Denial Intelligence & Revenue Recommendations
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time pattern detection over trailing 30-day denial data
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold gap-1">
          <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
          3 Actionable Opportunities
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((item) => {
          const isDone = appliedActions[item.id];
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-border/80 bg-card/80 p-4 transition-all hover:shadow-e2 hover:border-primary/40"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
                    {item.category}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.estimatedImpact)} oppty
                  </span>
                </div>

                <h4 className="font-semibold text-sm leading-snug line-clamp-2">
                  {item.headline}
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.body}
                </p>

                <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-foreground font-medium border border-border/50">
                  <span className="font-semibold text-primary">Recommendation: </span>
                  {item.recommendation}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {item.confidence}% confidence
                </span>

                <Button
                  size="sm"
                  variant={isDone ? "secondary" : "default"}
                  disabled={isDone}
                  onClick={() => handleAction(item)}
                  className="h-8 text-xs rounded-lg gap-1.5"
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Applied
                    </>
                  ) : (
                    <>
                      Execute Action
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
