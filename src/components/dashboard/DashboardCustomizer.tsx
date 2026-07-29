import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, LayoutGrid, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardWidgetOrder } from "@/lib/api/personalization";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DashboardCustomizer({
  initialWidgets,
  onSave,
}: {
  initialWidgets: DashboardWidgetOrder[];
  onSave?: (widgets: DashboardWidgetOrder[]) => void;
}) {
  const [widgets, setWidgets] = useState<DashboardWidgetOrder[]>(initialWidgets);

  const moveWidget = (index: number, direction: "up" | "down") => {
    const nextWidgets = [...widgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= nextWidgets.length) return;

    const temp = nextWidgets[index];
    nextWidgets[index] = nextWidgets[targetIndex];
    nextWidgets[targetIndex] = temp;

    setWidgets(nextWidgets);
    toast.info(`Moved "${temp.title}" ${direction}`);
  };

  const toggleVisibility = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.widgetId === widgetId) {
          const next = !w.visible;
          toast.info(`Widget "${w.title}" ${next ? "visible" : "hidden"}`);
          return { ...w, visible: next };
        }
        return w;
      }),
    );
  };

  const handleReset = () => {
    setWidgets(initialWidgets);
    toast.success("Dashboard widget layout restored to default.");
  };

  const handleSave = () => {
    onSave?.(widgets);
    toast.success("Custom dashboard layout saved.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Dashboard Layout & Widget Reordering</h3>
          <p className="text-xs text-muted-foreground">
            Rearrange widgets, show/hide sections, and customize your executive dashboard workspace
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl gap-1.5" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Restore Default
          </Button>
          <Button size="sm" className="h-9 text-xs rounded-xl gap-1.5 font-semibold" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-e1 divide-y divide-border/60">
        {widgets.map((w, idx) => (
          <div key={w.widgetId} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                #{idx + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {w.title}
                  <Badge variant="outline" className="text-[10px]">
                    {w.category}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {w.visible ? "Visible on dashboard" : "Hidden"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === 0}
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => moveWidget(idx, "up")}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === widgets.length - 1}
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => moveWidget(idx, "down")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant={w.visible ? "outline" : "secondary"}
                size="sm"
                className="h-8 text-xs rounded-lg gap-1.5"
                onClick={() => toggleVisibility(w.widgetId)}
              >
                {w.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                {w.visible ? "Visible" : "Hidden"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
