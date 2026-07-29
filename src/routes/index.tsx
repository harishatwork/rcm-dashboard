import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { RevenueTrendChart } from "@/components/charts/RcmCharts";
import {
  ArTrendChart,
  ClaimsTrendChart,
  CollectionsTrendChart,
} from "@/components/charts/ExecutiveCharts";
import { DrillDownProvider, useDrillDown } from "@/components/dashboard/DrillDownProvider";
import { ExecutiveKpiGrid } from "@/components/dashboard/ExecutiveKpiGrid";
import {
  AiInsightSummary,
  CriticalAlerts,
  TodaysSnapshot,
} from "@/components/dashboard/ExecutiveSummary";
import { QuickActions, RecentActivity } from "@/components/dashboard/ActivityAndActions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { rcmQueries } from "@/lib/api/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Home Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Executive revenue cycle home: charges, collections, adjustments, AR, denial rate, cash forecast, critical alerts and trend analytics in one view.",
      },
      { property: "og:title", content: "Executive Home Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content:
          "Track charges, collections, claims, AR and cash flow forecast with critical alerts and drill-down analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExecutiveHomeRoute,
});

function ExecutiveHomeRoute() {
  return (
    <AppShell>
      <DrillDownProvider>
        <ExecutiveHome />
      </DrillDownProvider>
    </AppShell>
  );
}

function TrendCard({
  title,
  subtitle,
  drill,
  isLoading,
  children,
}: {
  title: string;
  subtitle: string;
  drill: { hint: string; path: string };
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const openDrillDown = useDrillDown();
  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      actions={
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl"
          onClick={() => openDrillDown({ title, hint: drill.hint, path: drill.path })}
        >
          Drill down
        </Button>
      }
    >
      {isLoading ? <Skeleton className="h-[260px] rounded-xl" /> : children}
    </SectionCard>
  );
}

function ExecutiveHome() {
  const dashboard = useQuery(rcmQueries.executiveDashboard());
  const revenue = useQuery(rcmQueries.revenueTrend());
  const data = dashboard.data;

  const refreshedLabel = data
    ? new Date(data.lastRefreshedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <>
      <PageHeader
        title="Executive home"
        description="Enterprise revenue cycle performance across every facility, payer and provider — with drill-down into any metric."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                dashboard.refetch();
                revenue.refetch();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="rounded-xl shadow-brand">
              <Download className="h-4 w-4" />
              Export board pack
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>
          Last data refresh: <span className="font-semibold text-foreground">{refreshedLabel}</span>
        </span>
        {data ? <span aria-hidden>·</span> : null}
        {data ? <span>{data.source}</span> : null}
        {dashboard.isFetching ? <span className="text-primary">Refreshing…</span> : null}
      </div>

      {dashboard.isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : (
        <ExecutiveKpiGrid metrics={data.kpis} />
      )}

      {data ? (
        <>
          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <TodaysSnapshot items={data.snapshot} />
            <CriticalAlerts alerts={data.alerts} />
          </div>

          <div className="mt-6">
            <AiInsightSummary insights={data.insights} />
          </div>
        </>
      ) : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <TrendCard
          title="Revenue trend"
          subtitle="Billed vs. collected, trailing 8 months"
          drill={{ hint: "Revenue by facility, service line and payer.", path: "/revenue" }}
          isLoading={revenue.isLoading}
        >
          <RevenueTrendChart data={revenue.data ?? []} />
        </TrendCard>

        <TrendCard
          title="Collections trend"
          subtitle="Cash posted vs. monthly goal"
          drill={{ hint: "Cash posting detail by batch, payer and date.", path: "/collections" }}
          isLoading={dashboard.isLoading}
        >
          <CollectionsTrendChart data={data?.collectionsTrend ?? []} />
        </TrendCard>

        <TrendCard
          title="Claims trend"
          subtitle="Submitted, paid, denied and pending volume"
          drill={{ hint: "Claim lifecycle detail with status transitions.", path: "/claims" }}
          isLoading={dashboard.isLoading}
        >
          <ClaimsTrendChart data={data?.claimsTrend ?? []} />
        </TrendCard>

        <TrendCard
          title="A/R trend"
          subtitle="Open receivable and days in A/R"
          drill={{ hint: "A/R aging waterfall by payer and facility.", path: "/ar" }}
          isLoading={dashboard.isLoading}
        >
          <ArTrendChart data={data?.arTrend ?? []} />
        </TrendCard>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {data ? <RecentActivity events={data.activity} /> : <Skeleton className="h-80 rounded-2xl" />}
        <QuickActions />
      </div>
    </>
  );
}
