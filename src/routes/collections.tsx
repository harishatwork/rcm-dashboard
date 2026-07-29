import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard, ExportButton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DrillDownProvider, useDrillDown } from "@/components/dashboard/DrillDownProvider";
import {
  CollectionsKpiGrid,
  COLLECTIONS_DRILL_HIERARCHY,
} from "@/components/dashboard/CollectionsKpiGrid";
import {
  CollectionsBreakdownCard,
  CollectionsInsightsPanel,
  InsuranceCollectionsTable,
  ProviderCollectionsTable,
  RecentPaymentsTable,
} from "@/components/dashboard/CollectionsTables";
import {
  CashFlowForecastChart,
  CollectionTrendChart,
  CollectionsByDimensionChart,
  CollectionsColumnChart,
  DailyCollectionsChart,
  InsuranceVsPatientChart,
  MonthlyComparisonChart,
  PaymentMethodChart,
} from "@/components/charts/CollectionsCharts";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/collections")({
  head: () =>
    pageMeta(
      "Collections Dashboard",
      "Cash posting analytics: insurance and patient collections, collection rates, days to payment, cash flow forecast and payment detail by provider, payer, facility and CPT.",
    ),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <AppShell>
      <DrillDownProvider>
        <CollectionsDashboardView />
      </DrillDownProvider>
    </AppShell>
  );
}

function CollectionsDashboardView() {
  const dashboard = useQuery(rcmQueries.collectionsDashboard());
  const openDrillDown = useDrillDown();
  const data = dashboard.data;
  const retry = () => dashboard.refetch();

  const chartState = {
    isLoading: dashboard.isLoading,
    error: dashboard.error,
    onRetry: retry,
  };

  const empty = (length: number | undefined) => !dashboard.isLoading && (length ?? 0) === 0;

  return (
    <>
      <PageHeader
        title="Collections Dashboard"
        description="Insurance and patient cash, collection rates, days to payment and forecasted cash flow across the enterprise."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={retry} disabled={dashboard.isFetching}>
              <RefreshCw className={dashboard.isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <ExportButton rows={data?.recentPayments ?? []} fileName="collections-payments" />
          </div>
        }
      />

      <p className="mb-6 text-xs text-muted-foreground">
        {data
          ? `Last updated ${new Date(data.lastRefreshedAt).toLocaleString("en-US")} · ${data.source}`
          : "Loading collections snapshot…"}
      </p>

      <section aria-label="Collections KPIs" className="mb-6">
        <CollectionsKpiGrid metrics={data?.kpis ?? []} isLoading={dashboard.isLoading} />
      </section>

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Collection trend"
          subtitle="Cash posted against target over the last 12 months"
          isEmpty={empty(data?.trend.length)}
          emptyMessage="No collections for the selected filters."
          {...chartState}
        >
          <CollectionTrendChart
            data={data?.trend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Collections · ${point.month}`,
                hint: `Monthly cash posting composition. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(point.collections),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Insurance vs patient collections"
          subtitle="Monthly split between payer remittances and patient cash"
          isEmpty={empty(data?.trend.length)}
          {...chartState}
        >
          <InsuranceVsPatientChart
            data={data?.trend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Payer mix · ${point.month}`,
                hint: `Insurance versus patient responsibility split. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/patients",
                value: formatCurrency(point.insurance + point.patient),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by provider"
          subtitle="Cash collected per billing provider"
          height={340}
          isEmpty={empty(data?.byProvider.length)}
          {...chartState}
        >
          <CollectionsByDimensionChart
            data={data?.byProvider ?? []}
            colorIndex={0}
            height={340}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Provider collections detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/provider-performance",
                value: formatCurrency(row.collections),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by payer"
          subtitle="Cash collected per insurance company"
          height={340}
          isEmpty={empty(data?.byPayer.length)}
          {...chartState}
        >
          <CollectionsByDimensionChart
            data={data?.byPayer ?? []}
            colorIndex={1}
            height={340}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Payer collections detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/payers",
                value: formatCurrency(row.collections),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by facility"
          subtitle="Cash posted per service location"
          isEmpty={empty(data?.byFacility.length)}
          {...chartState}
        >
          <CollectionsColumnChart
            data={data?.byFacility ?? []}
            colorIndex={2}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Facility collections detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/ar",
                value: formatCurrency(row.collections),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Revenue by CPT"
          subtitle="Top procedure codes by cash collected"
          height={340}
          isEmpty={empty(data?.byCpt.length)}
          {...chartState}
        >
          <CollectionsByDimensionChart
            data={data?.byCpt ?? []}
            colorIndex={3}
            height={340}
            onSelect={(row) =>
              openDrillDown({
                title: `CPT ${row.name}`,
                hint: `${row.meta ?? "Procedure"} reimbursement detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/revenue",
                value: formatCurrency(row.collections),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Payment method distribution"
          subtitle="EFT, check, card and portal payment mix"
          isEmpty={empty(data?.paymentMethods.length)}
          {...chartState}
        >
          <PaymentMethodChart
            data={data?.paymentMethods ?? []}
            onSelect={(slice) =>
              openDrillDown({
                title: slice.method,
                hint: `Remittance channel detail across ${slice.transactions} transactions. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/billing",
                value: formatCurrency(slice.amount),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Cash flow forecast"
          subtitle="Projected cash with an 80% confidence band"
          isEmpty={empty(data?.cashFlowForecast.length)}
          {...chartState}
        >
          <CashFlowForecastChart data={data?.cashFlowForecast ?? []} />
        </ChartCard>

        <ChartCard
          title="Monthly collections comparison"
          subtitle="Current year versus prior year cash"
          isEmpty={empty(data?.monthlyComparison.length)}
          {...chartState}
        >
          <MonthlyComparisonChart
            data={data?.monthlyComparison ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `${point.month} year over year`,
                hint: `Year-over-year cash variance drivers. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(point.currentYear),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Daily collections trend"
          subtitle="Daily cash posted with a 5-day rolling average"
          isEmpty={empty(data?.daily.length)}
          {...chartState}
        >
          <DailyCollectionsChart
            data={data?.daily ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Cash posted ${point.label}`,
                hint: `Daily deposit and batch detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                path: "/billing",
                value: formatCurrency(point.collections),
              })
            }
          />
        </ChartCard>
      </div>

      <section aria-label="Collection breakdown" className="mb-6">
        <h2 className="mb-4 text-base font-bold">Collection breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {dashboard.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))
            : (data?.breakdown ?? []).map((group) => (
                <CollectionsBreakdownCard key={group.id} group={group} />
              ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-6">
          <ChartCard title="Collections by provider" height={0} className="p-5 sm:p-6">
            <ProviderCollectionsTable
              rows={data?.providerRows ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>

          <ChartCard title="Collections by insurance" height={0} className="p-5 sm:p-6">
            <InsuranceCollectionsTable
              rows={data?.insuranceRows ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>

          <ChartCard title="Recent payments" height={0} className="p-5 sm:p-6">
            <RecentPaymentsTable
              rows={data?.recentPayments ?? []}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              onRetry={retry}
            />
          </ChartCard>
        </div>

        <aside className="min-w-0">
          <div className="xl:sticky xl:top-24">
            <CollectionsInsightsPanel
              items={data?.insights ?? []}
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
