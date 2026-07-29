import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard, ExportButton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { DrillDownProvider, useDrillDown } from "@/components/dashboard/DrillDownProvider";
import { RevenueKpiGrid } from "@/components/dashboard/RevenueKpiGrid";
import {
  FacilityRevenueTable,
  RevenueDistributionCard,
  RevenueLeakagePanel,
  TopCptTable,
  TopInsuranceTable,
  TopProvidersRevenueTable,
} from "@/components/dashboard/RevenueTables";
import {
  MonthlyRevenueTrendChart,
  RevenueByInsuranceChart,
  RevenueByProviderChart,
  RevenueBySpecialtyChart,
  RevenueColumnChart,
  RevenueForecastChart,
  RevenueWaterfallChart,
} from "@/components/charts/RevenueDashboardCharts";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/revenue")({
  head: () =>
    pageMeta(
      "Revenue Dashboard",
      "Enterprise revenue analytics: charges, net revenue, collections, adjustments, forecast, leakage and contribution by provider, payer, facility and CPT.",
    ),
  component: RevenuePage,
});

const DRILL_HIERARCHY =
  "Hierarchy: Revenue → Insurance → Provider → Patient → Encounter → Claim → CPT → Payment details.";

function RevenuePage() {
  return (
    <AppShell>
      <DrillDownProvider>
        <RevenueDashboard />
      </DrillDownProvider>
    </AppShell>
  );
}

function RevenueDashboard() {
  const dashboard = useQuery(rcmQueries.revenueDashboard());
  const openDrillDown = useDrillDown();
  const data = dashboard.data;
  const retry = () => dashboard.refetch();

  const chartState = {
    isLoading: dashboard.isLoading,
    error: dashboard.error,
    onRetry: retry,
  };

  return (
    <>
      <PageHeader
        title="Revenue Dashboard"
        description="Charges, net revenue, collections and forecast across providers, facilities, payers and service lines."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={retry} disabled={dashboard.isFetching}>
              <RefreshCw className={dashboard.isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <ExportButton rows={data?.monthlyTrend ?? []} fileName="revenue-dashboard-trend" />
          </div>
        }
      />

      <p className="mb-6 text-xs text-muted-foreground">
        {data
          ? `Last refreshed ${new Date(data.lastRefreshedAt).toLocaleString("en-US")} · ${data.source}`
          : "Loading revenue snapshot…"}
      </p>

      <section aria-label="Revenue KPIs" className="mb-6">
        <RevenueKpiGrid metrics={data?.kpis ?? []} isLoading={dashboard.isLoading} />
      </section>

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Monthly revenue trend"
          subtitle="Gross revenue, net revenue and cash collections over 12 months"
          isEmpty={!dashboard.isLoading && (data?.monthlyTrend.length ?? 0) === 0}
          emptyMessage="No revenue data for the selected filters."
          {...chartState}
        >
          <MonthlyRevenueTrendChart
            data={data?.monthlyTrend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Revenue · ${point.month}`,
                hint: `Monthly revenue composition. ${DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(point.netRevenue),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by provider"
          subtitle="Top eight providers by net revenue"
          height={340}
          isEmpty={!dashboard.isLoading && (data?.byProvider.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueByProviderChart
            data={data?.byProvider ?? []}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Provider revenue detail. ${DRILL_HIERARCHY}`,
                path: "/provider-performance",
                value: formatCurrency(row.revenue),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by facility"
          subtitle="Net revenue by service location entity"
          isEmpty={!dashboard.isLoading && (data?.byFacility.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueColumnChart
            data={data?.byFacility ?? []}
            colorIndex={0}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Facility revenue detail. ${DRILL_HIERARCHY}`,
                path: "/ar",
                value: formatCurrency(row.revenue),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by location"
          subtitle="Geographic distribution across metro markets"
          isEmpty={!dashboard.isLoading && (data?.byLocation.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueColumnChart
            data={data?.byLocation ?? []}
            colorIndex={1}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Market-level revenue detail (${row.meta}). ${DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(row.revenue),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by specialty"
          subtitle="Service line contribution mix"
          isEmpty={!dashboard.isLoading && (data?.bySpecialty.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueBySpecialtyChart
            data={data?.bySpecialty ?? []}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Specialty revenue detail. ${DRILL_HIERARCHY}`,
                path: "/provider-performance",
                value: formatCurrency(row.revenue),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by insurance"
          subtitle="Primary, secondary and patient responsibility split"
          isEmpty={!dashboard.isLoading && (data?.byInsurance.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueByInsuranceChart
            data={data?.byInsurance ?? []}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Payer revenue detail. ${DRILL_HIERARCHY}`,
                path: "/payers",
                value: formatCurrency(row.primary + row.secondary + row.patient),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue waterfall"
          subtitle="Gross charges to net revenue bridge, July 2026"
          height={320}
          isEmpty={!dashboard.isLoading && (data?.waterfall.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueWaterfallChart
            steps={data?.waterfall ?? []}
            onSelect={(step) =>
              openDrillDown({
                title: step.label,
                hint: `Bridge component detail. ${DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(step.value),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue forecast"
          subtitle="Next six months with an 80% confidence band"
          isEmpty={!dashboard.isLoading && (data?.forecast.length ?? 0) === 0}
          {...chartState}
        >
          <RevenueForecastChart data={data?.forecast ?? []} />
        </ChartCard>
      </div>

      <section aria-label="Revenue distribution" className="mb-6">
        <h2 className="mb-4 text-base font-bold">Revenue distribution</h2>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {dashboard.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="surface-card h-72 animate-pulse p-5" />
              ))
            : (data?.distribution ?? []).map((group) => (
                <RevenueDistributionCard key={group.id} group={group} />
              ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-6">
          <ChartCard title="Top providers by revenue" height={0} className="p-5 sm:p-6">
            <TopProvidersRevenueTable
              rows={data?.topProviders ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>

          <ChartCard title="Top insurance companies" height={0} className="p-5 sm:p-6">
            <TopInsuranceTable
              rows={data?.topInsurance ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>

          <ChartCard title="Top CPT codes" height={0} className="p-5 sm:p-6">
            <TopCptTable
              rows={data?.topCpt ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>

          <ChartCard title="Revenue by facility" height={0} className="p-5 sm:p-6">
            <FacilityRevenueTable
              rows={data?.facilityRevenue ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>
        </div>

        <aside className="min-w-0">
          <div className="xl:sticky xl:top-24">
            <RevenueLeakagePanel
              items={data?.leakage ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
