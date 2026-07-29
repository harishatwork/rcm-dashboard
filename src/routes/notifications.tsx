import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bell, RefreshCw, Settings2, Sparkles } from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import { NotificationListTable } from "@/components/dashboard/NotificationListTable";
import { NotificationPreferencesPanel } from "@/components/dashboard/NotificationPreferencesPanel";
import { AiNotificationRecommendations } from "@/components/dashboard/AiNotificationRecommendations";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications Center | RCM Analytics" },
      {
        name: "description",
        content:
          "Centralized notifications center tracking financial alerts, denial spikes, A/R thresholds, operational events, and AI recommendations.",
      },
      { property: "og:title", content: "Notifications Center | RCM Analytics" },
      {
        property: "og:description",
        content: "Manage alerts, configure channel preferences, and resolve AI recommendations.",
      },
    ],
  }),
  component: NotificationsCenterPage,
});

export function NotificationsCenterPage() {
  const query = useQuery(rcmQueries.notifications());

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  return (
    <AppShell>
      <PageHeader
        title="Notifications Center"
        description="Centralized revenue cycle alert manager, priority notifications log, AI recommendation engine, and channel preference settings."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Notifications Center data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while connecting to the notification dispatch service. Please check your network or try again.
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : null}

      {/* Main Dashboard View */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          {/* 4 KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard metric={data.kpis.totalNotifications} index={0} invertTrend={false} />
            <KpiCard metric={data.kpis.unreadNotifications} index={1} invertTrend={true} />
            <KpiCard metric={data.kpis.criticalAlerts} index={2} invertTrend={true} />
            <KpiCard metric={data.kpis.todayNotifications} index={3} invertTrend={false} />
          </div>

          {/* AI Recommendations Panel */}
          <AiNotificationRecommendations recommendations={data.aiRecommendations} />

          {/* Tabbed Notification Center Sections */}
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList className="h-11 rounded-xl p-1 bg-muted">
              <TabsTrigger value="list" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <Bell className="h-3.5 w-3.5" />
                Notification Register ({data.notifications.length})
              </TabsTrigger>
              <TabsTrigger value="ai" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <Sparkles className="h-3.5 w-3.5" />
                AI Recommendations ({data.aiRecommendations.length})
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg text-xs font-semibold gap-1.5 px-4">
                <Settings2 className="h-3.5 w-3.5" />
                Notification Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <SectionCard
                title="Active & Historical Notifications"
                subtitle="Search, filter by category/priority, sort, paginate, mark as read, archive, and export alerts"
              >
                <NotificationListTable initialRows={data.notifications} />
              </SectionCard>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <SectionCard
                title="AI Automated Alert Recommendations"
                subtitle="High denial rates, large AR balances, slow-paying payors, and operational bottlenecks"
              >
                <AiNotificationRecommendations recommendations={data.aiRecommendations} />
              </SectionCard>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <SectionCard
                title="Notification Delivery Settings"
                subtitle="Configure email, in-app, SMS, push channels and per-category subscription toggles"
              >
                <NotificationPreferencesPanel initialPreferences={data.preferences} />
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </AppShell>
  );
}
