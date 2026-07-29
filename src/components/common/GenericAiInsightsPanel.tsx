import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export interface GenericAiInsightItem {
  id: string;
  headline: string;
  body: string;
  recommendation?: string;
  suggestedAction?: string;
  category: string;
  estimatedImpact: number;
  confidence: number;
  type: "positive" | "warning" | "critical" | "info";
}

export interface GenericAiInsightsPanelProps {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  actionButtonLabel?: string;
  insights: GenericAiInsightItem[];
  onApplyAction?: (item: GenericAiInsightItem) => void;
}

export function GenericAiInsightsPanel({
  title = "AI Intelligence Insights",
  subtitle = "Automated observations and corrective action recommendations",
  badgeLabel = "3 AI Optimization Plans",
  actionButtonLabel = "Apply Suggestion",
  insights,
  onApplyAction,
}: GenericAiInsightsPanelProps) {
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const handleAction = (item: GenericAiInsightItem) => {
    setAppliedActions((prev) => ({ ...prev, [item.id]: true }));
    if (onApplyAction) {
      onApplyAction(item);
    } else {
      toast.success(`Action applied: "${item.category}"`, {
        description: item.recommendation ?? item.suggestedAction,
      });
    }
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
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold gap-1">
          <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
          {badgeLabel}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((item) => {
          const isDone = appliedActions[item.id];
          const actionText = item.recommendation ?? item.suggestedAction;

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-border/80 bg-card/80 p-4 transition-all hover:shadow-e2 hover:border-primary/40"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={item.type === "positive" ? "default" : item.type === "critical" ? "destructive" : "secondary"}
                    className="text-[10px] uppercase tracking-wider font-semibold"
                  >
                    {item.category}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.estimatedImpact)} impact
                  </span>
                </div>

                <h4 className="font-semibold text-sm leading-snug line-clamp-2">
                  {item.headline}
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.body}
                </p>

                {actionText && (
                  <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-foreground font-medium border border-border/50">
                    <span className="font-semibold text-primary">Recommendation: </span>
                    {actionText}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {item.confidence}% confidence score
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
                      {actionButtonLabel}
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
