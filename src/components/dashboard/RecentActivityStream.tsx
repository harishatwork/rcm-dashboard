import { Link } from "@tanstack/react-router";
import { Clock, ExternalLink, FileText, History, LayoutDashboard, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RecentActivityItem } from "@/lib/api/personalization";

export function RecentActivityStream({ items }: { items: RecentActivityItem[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-base font-bold tracking-tight">Recent Activity Log</h3>
        <p className="text-xs text-muted-foreground">
          Recently accessed dashboards, generated reports, claims, and filter presets with 1-click reopen links
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-e1 divide-y divide-border/60">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                {item.type === "Dashboard" ? (
                  <LayoutDashboard className="h-4 w-4" />
                ) : item.type === "Report" ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {item.title}
                  <Badge variant="outline" className="text-[10px]">
                    {item.type}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground font-mono">{item.timestamp}</span>
              <Button asChild size="sm" variant="outline" className="h-8 text-xs rounded-lg gap-1.5 font-semibold">
                <Link to={item.path}>
                  Reopen
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
