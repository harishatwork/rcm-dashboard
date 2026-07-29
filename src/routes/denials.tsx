import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { DataTable, type Column } from "@/components/data/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { TopDenialReasonRow } from "@/lib/api/denials-dashboard";
import {
  DenialCategoriesChart,
  DenialFinancialImpactChart,
  DenialsByPayorChart,
  DenialTrendChart,
} from "@/components/charts/DenialsCharts";
import { DenialsClaimsGrid } from "@/components/dashboard/DenialsClaimsGrid";
import { DenialsAiInsights } from "@/components/dashboard/DenialsAiInsights";

export const Route = createFileRoute("/denials")({
  head: () => ({
    meta: [
      { title: "Denials Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive denial management dashboard tracking denial trends, payor distributions, root cause categories, financial impact, and claims workqueues.",
      },
      { property: "og:title", content: "Denials Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track denial trends, payor performance, appeal success rates, and claim recovery.",
      },
    ],
  }),
  component: DenialsDashboardPage,
});

const topReasonColumns: Column<TopDenialReasonRow>[] = [
  {
    key: "code",
    header: "CARC Code",
    render: (row) => (
      <span className="rounded-lg bg-secondary px-2 py-1 font-mono text-xs font-semibold">
        {row.code}
      </span>
    ),
  },
  {
    key: "reason",
    header: "Denial Reason",
    render: (row) => (
      <div className="min-w-0 max-w-[280px]">
        <p className="truncate font-medium">{row.reason}</p>
        <p className="truncate text-xs capitalize text-muted-foreground">{row.category}</p>
      </div>
    ),
  },
  { key: "count", header: "Claim Vol", align: "right", render: (row) => formatNumber(row.count) },
  {
    key: "amount",
    header: "Denied Charges",
    align: "right",
    render: (row) => formatCurrency(row.amount),
  },
  {
    key: "recoverablePct",
    header: "Recoverable %",
    align: "right",
    render: (row) => (
      <div className="ml-auto flex w-28 items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${row.recoverablePct}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs font-semibold">{row.recoverablePct}%</span>
      </div>
    ),
  },
  {
    key: "avgDaysToAppeal",
    header: "Avg Days to Appeal",
    align: "right",
    render: (row) => <span className="font-mono text-xs">{row.avgDaysToAppeal} days</span>,
  },
];

function DenialsDashboardPage() {
  const query = useQuery(rcmQueries.denialsDashboard());

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  return (
    <AppShell>
      <PageHeader
        title="Denials Dashboard"
        description="Comprehensive analytics tracking denial rates, payor performance, root-cause categories, financial impact, and actionable appeal workqueues."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Denials Dashboard data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while connecting to the analytics server. Please check your network or try again.
          </p>
          <Button
            variant="outline"
            className="mt-6 gap-2 rounded-xl"
            onClick={() => query.refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-44 rounded-2xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          {/* 7 KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <KpiCard metric={data.kpis.totalDeniedClaims} index={0} invertTrend={true} />
            <KpiCard metric={data.kpis.deniedCharges} index={1} invertTrend={true} />
            <KpiCard metric={data.kpis.denialRate} index={2} invertTrend={true} />
            <KpiCard metric={data.kpis.initialDenialRate} index={3} invertTrend={true} />
            <KpiCard metric={data.kpis.appealsSubmitted} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.appealSuccessRate} index={5} invertTrend={false} />
            <KpiCard metric={data.kpis.recoveredRevenue} index={6} invertTrend={false} />
          </div>

          {/* AI Insights Panel */}
          <DenialsAiInsights insights={data.aiInsights} />

          {/* Analytics Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Denial Trend & Initial Rate"
              subtitle="Monthly trajectory of denied charges vs. initial denial percentage"
            >
              <DenialTrendChart data={data.denialTrend} />
            </SectionCard>

            <SectionCard
              title="2. Denials by Payor"
              subtitle="Total denied charges split across major insurance payors"
            >
              <DenialsByPayorChart data={data.denialsByPayor} />
            </SectionCard>
          </div>

          {/* Analytics Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Denial Categories Distribution"
              subtitle="Root cause breakdown across clinical, technical, authorization & coding"
            >
              <DenialCategoriesChart data={data.denialCategories} />
            </SectionCard>

            <SectionCard
              title="4. Financial Impact Breakdown"
              subtitle="Recovered revenue vs uncollected denied charges per month"
            >
              <DenialFinancialImpactChart data={data.financialImpact} />
            </SectionCard>
          </div>

          {/* Top Denial Reasons Table */}
          <SectionCard
            title="5. Top Denial Reasons & Recovery Yield"
            subtitle="CARC code breakdown ranked by claim volume and recoverable potential"
          >
            <DataTable
              columns={topReasonColumns}
              rows={data.topDenialReasons}
              getRowKey={(row) => row.code}
            />
          </SectionCard>

          {/* Interactive Claims Grid */}
          <SectionCard
            title="Interactive Denied Claims Grid"
            subtitle="Search, filter, sort, paginate, and export individual denied claims"
          >
            <DenialsClaimsGrid claims={data.claims} />
          </SectionCard>
        </div>
      ) : null}
    </AppShell>
  );
}
