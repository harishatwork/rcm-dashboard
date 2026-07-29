import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard, ExportButton, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrillDownProvider, useDrillDown } from "@/components/dashboard/DrillDownProvider";
import { ArAgingCards, ArKpiGrid, AR_DRILL_HIERARCHY } from "@/components/dashboard/ArKpiGrid";
import {
  ArActionPanel,
  InsuranceArTable,
  OutstandingClaimsTable,
  ProviderArTable,
} from "@/components/dashboard/ArTables";
import {
  ArAgingDistributionChart,
  ArAgingShareChart,
  ArByDimensionChart,
  ArTrendChart,
  DaysInArTrendChart,
  DenialTrendChart,
  DenialsByDimensionChart,
  OutstandingClaimsTrendChart,
  TopDenialReasonsChart,
} from "@/components/charts/ArCharts";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/ar")({
  head: () =>
    pageMeta(
      "Accounts Receivable Dashboard",
      "AR aging, days in AR, insurance and patient balances, denial analysis and outstanding claim workqueues across every payer, provider and facility.",
    ),
  component: ArPage,
});

function ArPage() {
  return (
    <AppShell>
      <DrillDownProvider>
        <ArDashboardView />
      </DrillDownProvider>
    </AppShell>
  );
}

function ArDashboardView() {
  const dashboard = useQuery(rcmQueries.arDashboard());
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
        title="Accounts Receivable Dashboard"
        description="Aging concentration, days in AR, payer and provider balances, denial drivers and the claims that need work today."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={retry} disabled={dashboard.isFetching}>
              <RefreshCw className={dashboard.isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <ExportButton rows={data?.outstandingClaims ?? []} fileName="ar-outstanding-claims" />
          </div>
        }
      />

      <p className="mb-6 text-xs text-muted-foreground">
        {data
          ? `Last updated ${new Date(data.lastRefreshedAt).toLocaleString("en-US")} · ${data.source}`
          : "Loading accounts receivable snapshot…"}
      </p>

      <section aria-label="Accounts receivable KPIs" className="mb-6">
        <ArKpiGrid metrics={data?.kpis ?? []} isLoading={dashboard.isLoading} />
      </section>

      <section aria-label="AR aging analysis" className="mb-6">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">Aging analysis</h2>
        <ArAgingCards buckets={data?.aging ?? []} isLoading={dashboard.isLoading} />
      </section>

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="AR aging distribution"
          subtitle="Outstanding balance by aging bucket"
          isEmpty={empty(data?.aging.length)}
          {...chartState}
        >
          <ArAgingDistributionChart
            data={data?.aging ?? []}
            onSelect={(row) =>
              openDrillDown({
                title: `AR aging · ${row.bucket} days`,
                hint: `Bucket composition by payer and provider. ${AR_DRILL_HIERARCHY}`,
                path: "/claims",
                value: formatCurrency(row.amount),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Aging share"
          subtitle="Proportion of receivable held in each bucket"
          isEmpty={empty(data?.aging.length)}
          {...chartState}
        >
          <ArAgingShareChart data={data?.aging ?? []} />
        </ChartCard>

        <ChartCard
          title="AR trend"
          subtitle="Insurance and patient receivable over the last 12 months"
          isEmpty={empty(data?.trend.length)}
          {...chartState}
        >
          <ArTrendChart
            data={data?.trend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `AR · ${point.month}`,
                hint: `Month-end receivable composition. ${AR_DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(point.ar),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Days in AR trend"
          subtitle="Rolling days in AR against the 35-day goal"
          isEmpty={empty(data?.trend.length)}
          {...chartState}
        >
          <DaysInArTrendChart
            data={data?.trend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Days in AR · ${point.month}`,
                hint: `Days in AR by payer class and service line. ${AR_DRILL_HIERARCHY}`,
                path: "/kpi-dashboard",
                value: `${point.daysInAr} days`,
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Insurance AR"
          subtitle="Outstanding balance per payer"
          height={340}
          isEmpty={empty(data?.byInsurance.length)}
          {...chartState}
        >
          <ArByDimensionChart
            data={data?.byInsurance ?? []}
            colorIndex={0}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Payer AR detail. ${AR_DRILL_HIERARCHY}`,
                path: "/payers",
                value: formatCurrency(row.ar),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Provider AR"
          subtitle="Outstanding balance per billing provider"
          height={340}
          isEmpty={empty(data?.byProvider.length)}
          {...chartState}
        >
          <ArByDimensionChart
            data={data?.byProvider ?? []}
            colorIndex={1}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Provider AR detail. ${AR_DRILL_HIERARCHY}`,
                path: "/provider-performance",
                value: formatCurrency(row.ar),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Facility AR"
          subtitle="Outstanding balance per facility"
          height={300}
          isEmpty={empty(data?.byFacility.length)}
          {...chartState}
        >
          <ArByDimensionChart
            data={data?.byFacility ?? []}
            colorIndex={2}
            height={300}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Facility AR detail. ${AR_DRILL_HIERARCHY}`,
                path: "/financial-analytics",
                value: formatCurrency(row.ar),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="CPT AR"
          subtitle="Outstanding balance by procedure code"
          height={340}
          isEmpty={empty(data?.byCpt.length)}
          {...chartState}
        >
          <ArByDimensionChart
            data={data?.byCpt ?? []}
            colorIndex={3}
            onSelect={(row) =>
              openDrillDown({
                title: row.name,
                hint: `Procedure level AR detail. ${AR_DRILL_HIERARCHY}`,
                path: "/claims",
                value: formatCurrency(row.ar),
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Outstanding claims trend"
          subtitle="Open claim count by month"
          isEmpty={empty(data?.trend.length)}
          className="xl:col-span-2"
          {...chartState}
        >
          <OutstandingClaimsTrendChart
            data={data?.trend ?? []}
            onSelect={(point) =>
              openDrillDown({
                title: `Outstanding claims · ${point.month}`,
                hint: `Open claim inventory by status and age. ${AR_DRILL_HIERARCHY}`,
                path: "/claims",
                value: formatNumber(point.outstandingClaims),
              })
            }
          />
        </ChartCard>
      </div>

      <section aria-label="Denial analysis" className="mb-6">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">Denial analysis</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard
            title="Top 10 denial reasons"
            subtitle="Denied dollars by remittance reason code"
            height={360}
            isEmpty={empty(data?.denialReasons.length)}
            {...chartState}
          >
            <TopDenialReasonsChart
              data={data?.denialReasons ?? []}
              onSelect={(row) =>
                openDrillDown({
                  title: `${row.code} · ${row.reason}`,
                  hint: `Denial reason detail — ${formatPercent(row.recoverablePct)} estimated recoverable. ${AR_DRILL_HIERARCHY}`,
                  path: "/denials",
                  value: formatCurrency(row.amount),
                })
              }
            />
          </ChartCard>

          <ChartCard
            title="Denial trend"
            subtitle="Denial volume, overturns and denial rate"
            isEmpty={empty(data?.denialTrend.length)}
            {...chartState}
          >
            <DenialTrendChart
              data={data?.denialTrend ?? []}
              onSelect={(point) =>
                openDrillDown({
                  title: `Denials · ${point.month}`,
                  hint: `Denial cohort for the month with appeal outcomes. ${AR_DRILL_HIERARCHY}`,
                  path: "/denials",
                  value: formatNumber(point.denials),
                })
              }
            />
          </ChartCard>

          <ChartCard
            title="Denials by insurance"
            subtitle="Denied dollars and denial rate per payer"
            isEmpty={empty(data?.denialsByInsurance.length)}
            {...chartState}
          >
            <DenialsByDimensionChart
              data={data?.denialsByInsurance ?? []}
              colorIndex={4}
              onSelect={(row) =>
                openDrillDown({
                  title: row.name,
                  hint: `Payer denial detail. ${AR_DRILL_HIERARCHY}`,
                  path: "/payers",
                  value: formatCurrency(row.amount),
                })
              }
            />
          </ChartCard>

          <ChartCard
            title="Denials by provider"
            subtitle="Denied dollars and denial rate per provider"
            isEmpty={empty(data?.denialsByProvider.length)}
            {...chartState}
          >
            <DenialsByDimensionChart
              data={data?.denialsByProvider ?? []}
              colorIndex={1}
              onSelect={(row) =>
                openDrillDown({
                  title: row.name,
                  hint: `Provider denial detail. ${AR_DRILL_HIERARCHY}`,
                  path: "/provider-performance",
                  value: formatCurrency(row.amount),
                })
              }
            />
          </ChartCard>

          <ChartCard
            title="Denials by CPT"
            subtitle="Denied dollars and denial rate per procedure"
            className="xl:col-span-2"
            isEmpty={empty(data?.denialsByCpt.length)}
            {...chartState}
          >
            <DenialsByDimensionChart
              data={data?.denialsByCpt ?? []}
              colorIndex={2}
              onSelect={(row) =>
                openDrillDown({
                  title: row.name,
                  hint: `Procedure denial detail. ${AR_DRILL_HIERARCHY}`,
                  path: "/denials",
                  value: formatCurrency(row.amount),
                })
              }
            />
          </ChartCard>
        </div>
      </section>

      <SectionCard
        title="AR detail"
        subtitle="Outstanding claims, payer balances and provider receivable."
        className="mb-6"
      >
        <Tabs defaultValue="claims">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="claims">Outstanding claims</TabsTrigger>
            <TabsTrigger value="insurance">Insurance AR</TabsTrigger>
            <TabsTrigger value="provider">Provider AR</TabsTrigger>
          </TabsList>
          <TabsContent value="claims">
            <OutstandingClaimsTable rows={data?.outstandingClaims ?? []} {...chartState} />
          </TabsContent>
          <TabsContent value="insurance">
            <InsuranceArTable rows={data?.insuranceAr ?? []} {...chartState} />
          </TabsContent>
          <TabsContent value="provider">
            <ProviderArTable rows={data?.providerAr ?? []} {...chartState} />
          </TabsContent>
        </Tabs>
      </SectionCard>

      <section aria-label="AR action panel" className="mb-6">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">Action panel</h2>
        <ArActionPanel groups={data?.actions ?? []} isLoading={dashboard.isLoading} />
      </section>
    </>
  );
}
