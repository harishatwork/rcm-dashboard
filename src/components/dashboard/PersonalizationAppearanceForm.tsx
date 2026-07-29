import { useState } from "react";
import { Moon, Sun, Monitor, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { AppearanceSettings } from "@/lib/api/personalization";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PersonalizationAppearanceForm({
  initialAppearance,
  onSave,
}: {
  initialAppearance: AppearanceSettings;
  onSave?: (appearance: AppearanceSettings) => void;
}) {
  const { theme: activeTheme, setTheme } = useTheme();
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    ...initialAppearance,
    theme: activeTheme as any,
  });

  const handleThemeChange = (t: "light" | "dark" | "system") => {
    if (t === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
    } else {
      setTheme(t);
    }
    setAppearance((prev) => ({ ...prev, theme: t }));
    toast.success(`Theme updated to ${t}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(appearance);
    toast.success("Appearance settings & default landing dashboard saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Theme & Workspace Appearance</h3>
          <p className="text-xs text-muted-foreground">
            Customize color themes, layout density, sidebar state, and default landing page
          </p>
        </div>
        <Button type="submit" className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
          <Save className="h-3.5 w-3.5" />
          Save Appearance
        </Button>
      </div>

      {/* Theme Cards Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold">Color Theme</label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            onClick={() => handleThemeChange("light")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
              appearance.theme === "light"
                ? "border-primary bg-primary/5 shadow-e2 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <Sun className="h-6 w-6 text-amber-500" />
            <span className="text-xs font-bold">Light Theme</span>
            <span className="text-[10px] text-muted-foreground">Clean, high-contrast light mode</span>
          </div>

          <div
            onClick={() => handleThemeChange("dark")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
              appearance.theme === "dark"
                ? "border-primary bg-primary/5 shadow-e2 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <Moon className="h-6 w-6 text-indigo-400" />
            <span className="text-xs font-bold">Dark Theme</span>
            <span className="text-[10px] text-muted-foreground">Sleek, low-glare dark mode</span>
          </div>

          <div
            onClick={() => handleThemeChange("system")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
              appearance.theme === "system"
                ? "border-primary bg-primary/5 shadow-e2 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <Monitor className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold">System Preference</span>
            <span className="text-[10px] text-muted-foreground">Match OS light/dark theme</span>
          </div>
        </div>
      </div>

      {/* Density & Landing Settings */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Display Layout Density</label>
          <Select
            value={appearance.density}
            onValueChange={(v: any) => setAppearance((prev) => ({ ...prev, density: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Comfortable (Standard Padding)</SelectItem>
              <SelectItem value="compact">Compact (Dense Data View)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Sidebar Default State</label>
          <Select
            value={appearance.sidebarDefault}
            onValueChange={(v: any) => setAppearance((prev) => ({ ...prev, sidebarDefault: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expanded">Expanded (Full Menu)</SelectItem>
              <SelectItem value="collapsed">Collapsed (Icon-only)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Default Landing Dashboard</label>
          <Select
            value={appearance.defaultLandingDashboard}
            onValueChange={(v) => setAppearance((prev) => ({ ...prev, defaultLandingDashboard: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/kpi-dashboard">Executive KPI Dashboard</SelectItem>
              <SelectItem value="/revenue">Revenue Analytics</SelectItem>
              <SelectItem value="/denials">Denials Dashboard</SelectItem>
              <SelectItem value="/predictive-analytics">Predictive Analytics</SelectItem>
              <SelectItem value="/operational-dashboard">Operational Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}
