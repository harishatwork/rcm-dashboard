import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bell, Bookmark, History, LayoutGrid, Palette, RefreshCw, UserCog } from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import { rcmApi } from "@/lib/api/client";
import { PersonalizationProfileForm } from "@/components/dashboard/PersonalizationProfileForm";
import { PersonalizationAppearanceForm } from "@/components/dashboard/PersonalizationAppearanceForm";
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer";
import { SavedViewsManager } from "@/components/dashboard/SavedViewsManager";
import { NotificationPreferencesPanel } from "@/components/dashboard/NotificationPreferencesPanel";
import { RecentActivityStream } from "@/components/dashboard/RecentActivityStream";

export const Route = createFileRoute("/personalization")({
  head: () => ({
    meta: [
      { title: "Personalization & Preferences | RCM Analytics" },
      {
        name: "description",
        content:
          "Personalize your healthcare RCM analytics workspace, profile preferences, themes, dashboard widget layouts, saved views, and recent activity stream.",
      },
      { property: "og:title", content: "Personalization & Preferences | RCM Analytics" },
      {
        property: "og:description",
        content: "Customize user preferences, color themes, widget order, saved views, and favorites.",
      },
    ],
  }),
  component: PersonalizationPage,
});

export function PersonalizationPage() {
  const query = useQuery(rcmQueries.personalization());
  const notifQuery = useQuery(rcmQueries.notifications());

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleSaveProfile = (profile: any) => {
    if (data) {
      const nextData = { ...data, profile };
      rcmApi.savePersonalizationData(nextData);
    }
  };

  const handleSaveAppearance = (appearance: any) => {
    if (data) {
      const nextData = { ...data, appearance };
      rcmApi.savePersonalizationData(nextData);
    }
  };

  const handleSaveWidgets = (widgets: any) => {
    if (data) {
      const nextData = { ...data, widgets };
      rcmApi.savePersonalizationData(nextData);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Personalization & Workspace Settings"
        description="Tailor your executive workspace preferences, themes, dashboard widget layout order, custom saved views, favorites, and recent activity stream."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Personalization settings
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while loading your stored workspace preferences. Please try again.
          </p>
          <Button variant="outline" className="mt-6 gap-2 rounded-xl" onClick={() => query.refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : null}

      {/* Main Personalization View */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/60 bg-transparent h-auto p-0 justify-start w-full">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <UserCog className="h-3.5 w-3.5 shrink-0" />
                Profile & Preferences
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <Palette className="h-3.5 w-3.5 shrink-0" />
                Theme & Appearance
              </TabsTrigger>
              <TabsTrigger
                value="layout"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                Dashboard Customizer
              </TabsTrigger>
              <TabsTrigger
                value="savedViews"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <Bookmark className="h-3.5 w-3.5 shrink-0" />
                Saved Views & Favorites ({data.favorites.length})
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <Bell className="h-3.5 w-3.5 shrink-0" />
                Notification Delivery
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary hover:text-foreground hover:border-border/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                <History className="h-3.5 w-3.5 shrink-0" />
                Recent Activity Log ({data.recentActivity.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 — Profile */}
            <TabsContent value="profile" className="space-y-4">
              <SectionCard>
                <PersonalizationProfileForm initialProfile={data.profile} onSave={handleSaveProfile} />
              </SectionCard>
            </TabsContent>

            {/* Tab 2 — Appearance */}
            <TabsContent value="appearance" className="space-y-4">
              <SectionCard>
                <PersonalizationAppearanceForm initialAppearance={data.appearance} onSave={handleSaveAppearance} />
              </SectionCard>
            </TabsContent>

            {/* Tab 3 — Layout */}
            <TabsContent value="layout" className="space-y-4">
              <SectionCard>
                <DashboardCustomizer initialWidgets={data.widgets} onSave={handleSaveWidgets} />
              </SectionCard>
            </TabsContent>

            {/* Tab 4 — Saved Views & Favorites */}
            <TabsContent value="savedViews" className="space-y-4">
              <SectionCard>
                <SavedViewsManager initialViews={data.savedViews} initialFavorites={data.favorites} />
              </SectionCard>
            </TabsContent>

            {/* Tab 5 — Notification Preferences */}
            <TabsContent value="notifications" className="space-y-4">
              <SectionCard>
                {notifQuery.data ? (
                  <NotificationPreferencesPanel initialPreferences={notifQuery.data.preferences} />
                ) : (
                  <Skeleton className="h-48 rounded-xl" />
                )}
              </SectionCard>
            </TabsContent>

            {/* Tab 6 — Recent Activity */}
            <TabsContent value="activity" className="space-y-4">
              <SectionCard>
                <RecentActivityStream items={data.recentActivity} />
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </AppShell>
  );
}
