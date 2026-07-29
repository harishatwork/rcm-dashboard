import { useState } from "react";
import { Bell, Check, Mail, MessageSquare, Save, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { NotificationCategory, NotificationPreferences } from "@/lib/api/notifications";
import { toast } from "sonner";

export function NotificationPreferencesPanel({
  initialPreferences,
}: {
  initialPreferences: NotificationPreferences;
}) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPreferences);

  const toggleChannel = (channel: keyof Omit<NotificationPreferences, "categories">) => {
    setPrefs((prev) => {
      const next = { ...prev, [channel]: !prev[channel] };
      toast.success("Notification channel preference updated");
      return next;
    });
  };

  const toggleCategory = (cat: NotificationCategory) => {
    setPrefs((prev) => {
      const nextCats = { ...prev.categories, [cat]: !prev.categories[cat] };
      toast.success(`Category "${cat}" ${nextCats[cat] ? "enabled" : "disabled"}`);
      return { ...prev, categories: nextCats };
    });
  };

  const handleSaveAll = () => {
    toast.success("All notification preferences saved successfully.");
  };

  const categoryKeys: NotificationCategory[] = [
    "Financial Alerts",
    "AR Alerts",
    "Denial Alerts",
    "Claims Alerts",
    "Payment Alerts",
    "Operational Alerts",
    "System Notifications",
    "User Activity",
    "Scheduled Reports",
    "AI Recommendations",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Notification Channels & Delivery Preferences</h3>
          <p className="text-xs text-muted-foreground">
            Configure delivery channels and choose which alert categories send instant notifications
          </p>
        </div>
        <Button onClick={handleSaveAll} className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
          <Save className="h-3.5 w-3.5" />
          Save Preferences
        </Button>
      </div>

      {/* Delivery Channels */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Email Notifications</p>
              <p className="text-[11px] text-muted-foreground">Daily/Instant email digests</p>
            </div>
          </div>
          <Switch
            checked={prefs.emailEnabled}
            onCheckedChange={() => toggleChannel("emailEnabled")}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">In-App Drawer</p>
              <p className="text-[11px] text-muted-foreground">Real-time header bell drawer</p>
            </div>
          </div>
          <Switch
            checked={prefs.inAppEnabled}
            onCheckedChange={() => toggleChannel("inAppEnabled")}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                SMS Alerts
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  Placeholder
                </Badge>
              </p>
              <p className="text-[11px] text-muted-foreground">Critical SMS alerts to phone</p>
            </div>
          </div>
          <Switch
            checked={prefs.smsEnabled}
            onCheckedChange={() => toggleChannel("smsEnabled")}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Smartphone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                Push Notifications
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  Placeholder
                </Badge>
              </p>
              <p className="text-[11px] text-muted-foreground">Mobile app push dispatches</p>
            </div>
          </div>
          <Switch
            checked={prefs.pushEnabled}
            onCheckedChange={() => toggleChannel("pushEnabled")}
          />
        </div>
      </div>

      {/* Per-Category Subscriptions */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h4 className="font-display text-sm font-bold text-foreground">
          Category Subscription Toggles
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryKeys.map((cat) => {
            const isSubscribed = prefs.categories[cat] ?? true;
            return (
              <div
                key={cat}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3"
              >
                <div>
                  <p className="text-xs font-semibold">{cat}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {isSubscribed ? "Subscribed to alerts" : "Muted"}
                  </p>
                </div>
                <Switch
                  checked={isSubscribed}
                  onCheckedChange={() => toggleCategory(cat)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
