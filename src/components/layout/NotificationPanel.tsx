import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { rcmQueries } from "@/lib/api/queries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const query = useQuery(rcmQueries.notifications());
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});

  const notifications = query.data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => n.status === "Unread" && !readIds[n.id]).length;

  const handleMarkAllRead = () => {
    const updated: Record<string, boolean> = {};
    notifications.forEach((n) => {
      updated[n.id] = true;
    });
    setReadIds(updated);
    toast.success("All notifications marked as read");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-lg font-extrabold flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-bold">
                  {unreadCount} new
                </span>
              )}
            </SheetTitle>
            <SheetDescription className="text-xs">Revenue cycle alerts & activity stream.</SheetDescription>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <ul className="divide-y divide-border">
            {notifications.length === 0 ? (
              <li className="p-8 text-center text-xs text-muted-foreground">No recent notifications.</li>
            ) : (
              notifications.map((n) => {
                const isRead = n.status === "Read" || readIds[n.id];
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-6 py-4 transition-colors hover:bg-secondary/60",
                      !isRead && "bg-primary/5 font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold",
                        n.priority === "Critical"
                          ? "bg-destructive/15 text-destructive"
                          : n.priority === "High"
                          ? "bg-amber-500/15 text-amber-600"
                          : "bg-primary/15 text-primary",
                      )}
                    >
                      {n.priority === "Critical" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : n.priority === "High" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
                        <p className="truncate text-xs font-bold text-foreground">{n.title}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{n.dateTime}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                        {n.description}
                      </p>
                      {n.suggestedAction && (
                        <p className="mt-1 text-[10px] text-primary font-medium">
                          Suggested: {n.suggestedAction}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>

        <div className="border-t border-border p-4 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl flex-1" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
          <Button asChild size="sm" className="h-9 text-xs rounded-xl flex-1 gap-1.5" onClick={() => setOpen(false)}>
            <Link to="/notifications">
              View All Center
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
