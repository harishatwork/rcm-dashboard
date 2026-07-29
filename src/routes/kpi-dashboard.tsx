import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard, ExportButton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DrillDownProvider } from "@/components/dashboard/DrillDownProvider";
import { ExecutiveKpiGrid } from "@/components/dashboard/ExecutiveKpiGrid";
import {
  GrowthIndicatorTable,
  TopPayersTable,
  TopProvidersTable,
} from "@/components/dashboard/KpiPerformanceTables";
import {
  ClaimsSubmittedChart,
  CollectionRateChart,
  MonthlyTrendChart,
  PeriodComparisonChart,
  RevenueDistributionChart,
  TargetVsActualChart,
} from "@/components/charts/KpiDashboardCharts";
import { rcmQueries } from "@/lib/api/queries";
import { pageMeta } from "@/lib/seo";
import type { ComparisonBasis } from "@/lib/api/kpi-dashboard";

export const Route = createFileRoute("/kpi-dashboard")({
  head: () =>
    pageMeta(
      "KPI Dashboard",
      "High-level revenue cycle KPIs: charges, claims, collections, adjustments, outstanding balance and collection rates with MoM, QoQ and YoY growth.",
    ),
  component: KpiDashboardPage,
});

const BASIS_LABEL: Record<ComparisonBasis, { toggle: string; prior: string; subtitle: string }> = {
  mom: {
    toggle: "MoM",
    prior: "Prior month",
    subtitle: "July 2026 against June 2026",
  },
  qoq: {
    toggle: "QoQ",
    prior: "Prior quarter avg.",
    subtitle: "Q3 2026 to date against the Q2 2026 monthly average",
  },
  yoy: {
    toggle: "YoY",
    prior: "Same month last year",
    subtitle: "July 2026 against July 2025",
  },
};

const DISTRIBUTION_TABS = [
  { id: "payer", label: "By payer" },
  { id: "service", label: "By service line" },
] as const;

function KpiDashboardPage() {
  const [basis, setBasis] = useState<ComparisonBasis>("mom");
  const [distribution, setDistribution] = useState<(typeof DISTRIBUTION_TABS)[number]["id"]>("payer");
  const dashboard = useQuery(rcmQueries.kpiDashboard());
  const data = dashboard.data;

  const distributionData =
    distribution === "payer" ? data?.revenueByPayer ?? [] : data?.revenueByServiceLine ?? [];

  return (
    <AppShell>
      <DrillDownProvider>
        <PageHeader
          title="KPI Dashboard"
          description="Headline revenue cycle performance with target attainment, growth indicators and contribution rankings."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => dashboard.refetch()}
                disabled={dashboard.isFetching}
              >
                <RefreshCw className={dashboard.isFetching ? "animate-spin" : undefined} />
                Refresh
              </Button>
              <ExportButton rows={data?.monthly ?? []} fileName="kpi-dashboard-monthly" />
            </div>
          }
        />

        <p className="mb-6 text-xs text-muted-foreground">
          {data
            ? `Last refreshed ${new Date(data.lastRefreshedAt).toLocaleString("en-US")} · ${data.source}`
            : "Loading metric snapshot…"}
        </p>

        <section aria-label="Headline KPIs" className="mb-6">
          {dashboard.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ExecutiveKpiGrid metrics={data?.kpis ?? []} />
          )}
        </section>

        <div className="mb-6 grid gap-4 xl:grid-cols-2">
          <ChartCard
            title="Monthly trend"
            subtitle="Charges, collections and adjustments over the trailing 12 months"
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            isEmpty={!dashboard.isLoading && (data?.monthly.length ?? 0) === 0}
            onRetry={() => dashboard.refetch()}
          >
            <MonthlyTrendChart data={data?.monthly ?? []} />
          </ChartCard>

          <ChartCard
            title="Target vs. actual"
            subtitle="Collections against the board-approved monthly cash target"
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            onRetry={() => dashboard.refetch()}
          >
            <TargetVsActualChart data={data?.monthly ?? []} />
          </ChartCard>
        </div>

        <div className="mb-6 grid gap-4 xl:grid-cols-2">
          <ChartCard
            title="Period comparison"
            subtitle={BASIS_LABEL[basis].subtitle}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            onRetry={() => dashboard.refetch()}
            actions={
              <ToggleGroup
                type="single"
                size="sm"
                value={basis}
                onValueChange={(value) => value && setBasis(value as ComparisonBasis)}
                aria-label="Comparison basis"
                variant="outline"
              >
                {(Object.keys(BASIS_LABEL) as ComparisonBasis[]).map((key) => (
                  <ToggleGroupItem key={key} value={key} aria-label={BASIS_LABEL[key].toggle}>
                    {BASIS_LABEL[key].toggle}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            }
          >
            <PeriodComparisonChart
              data={data?.comparisons[basis] ?? []}
              priorLabel={BASIS_LABEL[basis].prior}
            />
          </ChartCard>

          <ChartCard
            title="Revenue distribution"
            subtitle="Share of collected revenue for the current month"
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            onRetry={() => dashboard.refetch()}
            actions={
              <ToggleGroup
                type="single"
                size="sm"
                value={distribution}
                onValueChange={(value) =>
                  value && setDistribution(value as (typeof DISTRIBUTION_TABS)[number]["id"])
                }
                aria-label="Revenue distribution dimension"
                variant="outline"
              >
                {DISTRIBUTION_TABS.map((tab) => (
                  <ToggleGroupItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            }
          >
            <RevenueDistributionChart data={distributionData} />
          </ChartCard>
        </div>

        <div className="mb-6 grid gap-4 xl:grid-cols-2">
          <ChartCard
            title="Claims submitted"
            subtitle="Monthly submission volume across all payers"
            height={240}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            onRetry={() => dashboard.refetch()}
          >
            <ClaimsSubmittedChart data={data?.monthly ?? []} />
          </ChartCard>

          <ChartCard
            title="Collection rate quality"
            subtitle="Gross versus net collection rate trend"
            height={240}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            onRetry={() => dashboard.refetch()}
          >
            <CollectionRateChart data={data?.monthly ?? []} />
          </ChartCard>
        </div>

        <section className="surface-card animate-rise mb-6 p-5 sm:p-6" aria-label="Growth indicators">
          <div className="mb-4">
            <h2 className="text-base font-bold">Growth indicators</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Month-over-month, quarter-over-quarter and year-over-year movement per KPI
            </p>
          </div>
          {dashboard.isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <GrowthIndicatorTable rows={data?.growth ?? []} />
          )}
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="surface-card animate-rise p-5 sm:p-6" aria-label="Top performing providers">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold">Top performing providers</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ranked by collected revenue for the current month
                </p>
              </div>
              <ExportButton rows={data?.topProviders ?? []} fileName="top-providers" />
            </div>
            <TopProvidersTable rows={data?.topProviders ?? []} isLoading={dashboard.isLoading} />
          </section>

          <section className="surface-card animate-rise p-5 sm:p-6" aria-label="Top payers">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold">Top payers</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contribution, yield and payment velocity by payer
                </p>
              </div>
              <ExportButton rows={data?.topPayers ?? []} fileName="top-payers" />
            </div>
            <TopPayersTable rows={data?.topPayers ?? []} isLoading={dashboard.isLoading} />
          </section>
        </div>
      </DrillDownProvider>
    </AppShell>
  );
}
