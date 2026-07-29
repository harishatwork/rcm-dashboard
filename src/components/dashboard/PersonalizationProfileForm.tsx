import { useState } from "react";
import { User, Save, Clock, Globe, DollarSign, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserProfilePreferences } from "@/lib/api/personalization";
import { toast } from "sonner";

export function PersonalizationProfileForm({
  initialProfile,
  onSave,
}: {
  initialProfile: UserProfilePreferences;
  onSave?: (profile: UserProfilePreferences) => void;
}) {
  const [profile, setProfile] = useState<UserProfilePreferences>(initialProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(profile);
    toast.success("User profile preferences saved and persisted.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Personal User Profile & Locale Settings</h3>
          <p className="text-xs text-muted-foreground">
            Configure your personal display name, time zone, currency symbol, and date formatting
          </p>
        </div>
        <Button type="submit" className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
          <Save className="h-3.5 w-3.5" />
          Save Profile
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Display Name</label>
          <Input
            value={profile.displayName}
            onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
            className="h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Email Address (Read-only)</label>
          <Input value={profile.email} disabled className="h-10 rounded-xl bg-muted/50" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            Time Zone
          </label>
          <Select
            value={profile.timeZone}
            onValueChange={(v) => setProfile((prev) => ({ ...prev, timeZone: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York (EST)">America/New_York (EST)</SelectItem>
              <SelectItem value="America/Chicago (CST)">America/Chicago (CST)</SelectItem>
              <SelectItem value="America/Denver (MST)">America/Denver (MST)</SelectItem>
              <SelectItem value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Date Format
          </label>
          <Select
            value={profile.dateFormat}
            onValueChange={(v: any) => setProfile((prev) => ({ ...prev, dateFormat: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            Currency Symbol
          </label>
          <Select
            value={profile.currency}
            onValueChange={(v: any) => setProfile((prev) => ({ ...prev, currency: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD ($)">USD ($)</SelectItem>
              <SelectItem value="EUR (€)">EUR (€)</SelectItem>
              <SelectItem value="GBP (£)">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            Display Language
          </label>
          <Select
            value={profile.language}
            onValueChange={(v) => setProfile((prev) => ({ ...prev, language: v }))}
          >
            <SelectTrigger className="h-10 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English (US)">English (US)</SelectItem>
              <SelectItem value="Spanish (ES)">Spanish (ES)</SelectItem>
              <SelectItem value="French (FR)">French (FR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}
