import { useState } from "react";
import { Bell, Edit, Mail, Save, ShieldAlert, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminNotificationConfig as ConfigType } from "@/lib/api/administration";
import { toast } from "sonner";

export function AdminNotificationConfig({ initialConfig }: { initialConfig: ConfigType }) {
  const [config, setConfig] = useState<ConfigType>(initialConfig);

  const handleSave = () => {
    toast.success("Notification settings & alert thresholds saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">System Notification & Escalation Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Configure system-wide alert thresholds, email templates, and automated escalation workflows
          </p>
        </div>
        <Button onClick={handleSave} className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
          <Save className="h-3.5 w-3.5" />
          Save Settings
        </Button>
      </div>

      {/* Alert Thresholds */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          System Alert Thresholds
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Denial Rate Threshold (%)</label>
            <Input
              type="number"
              step="0.1"
              value={config.alertThresholds.denialRatePct}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alertThresholds: { ...prev.alertThresholds, denialRatePct: Number(e.target.value) },
                }))
              }
              className="h-10 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground">Trigger alert when daily denials exceed this rate</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">A/R 90+ Days Threshold (%)</label>
            <Input
              type="number"
              step="0.1"
              value={config.alertThresholds.arOver90DaysPct}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alertThresholds: { ...prev.alertThresholds, arOver90DaysPct: Number(e.target.value) },
                }))
              }
              className="h-10 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground">Trigger alert when 90+ day A/R exceeds this ratio</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Daily Revenue Drop (%)</label>
            <Input
              type="number"
              step="0.1"
              value={config.alertThresholds.dailyRevenueDropPct}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alertThresholds: { ...prev.alertThresholds, dailyRevenueDropPct: Number(e.target.value) },
                }))
              }
              className="h-10 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground">Trigger alert when daily collections drop below baseline</p>
          </div>
        </div>
      </div>

      {/* Escalation Rules */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Automated Alert Escalation Rules
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-4">Escalation Tier</th>
                <th className="py-2.5 px-4">Delay Hours</th>
                <th className="py-2.5 px-4">Target Role Notification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {config.escalationRules.map((rule) => (
                <tr key={rule.level} className="hover:bg-muted/30">
                  <td className="py-3 px-4 font-semibold text-foreground">{rule.level}</td>
                  <td className="py-3 px-4 font-mono">{rule.delayHours} hours</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{rule.notifyRole}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Templates & Default Escalation User */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Configured Email Templates
          </h4>
          <ul className="divide-y divide-border/60 text-xs">
            {config.emailTemplates.map((t) => (
              <li key={t.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.trigger}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Configured
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            Default Escalation User
          </h4>
          <div className="space-y-2">
            <label className="text-xs font-semibold">Primary System Administrator Email</label>
            <Input
              value={config.defaultEscalationUser}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, defaultEscalationUser: e.target.value }))
              }
              className="h-10 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unassigned critical alerts and fallback system notifications will dispatch directly to this administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
