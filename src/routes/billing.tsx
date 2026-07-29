import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard, ExportButton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DrillDownProvider, useDrillDown } from "@/components/dashboard/DrillDownProvider";
import { ExecutiveKpiGrid } from "@/components/dashboard/ExecutiveKpiGrid";
import {
  BillingSummaryTable,
  RecentClaimsTable,
} from "@/components/dashboard/BillingStatusTables";
import {
  BillingSummaryChart,
  ClaimStatusFunnel,
  ClaimStatusPie,
} from "@/components/charts/BillingCharts";
import { rcmQueries } from "@/lib/api/queries";
import { pageMeta } from "@/lib/seo";
import type { BillingStatusDashboard } from "@/lib/api/billing-status";

export const Route = createFileRoute("/billing")({
  head: () =>
    pageMeta(
      "Billing Status",
      "Claim lifecycle status across submitted, paid, denied, rejected, pending and unbilled work, with insurance, provider, facility and CPT billing summaries.",
    ),
  component: BillingStatusPage,
});

const SUMMARY_TABS = [
  {
    id: "insurance",
    label: "Insurance",
    entityHeader: "Payer",
    drillPath: "/payers",
    drillHint: "Payer-level submission mix, denial reasons and adjudication turnaround",
    key: "byInsurance" as const,
  },
  {
    id: "provider",
    label: "Provider",
    entityHeader: "Provider",
    drillPath: "/provider-performance",
    drillHint: "Provider charge capture, coding accuracy and rework attribution",
    key: "byProvider" as const,
  },
  {
    id: "facility",
    label: "Facility",
    entityHeader: "Facility",
    drillPath: "/reports",
    drillHint: "Facility throughput, unbilled backlog and departmental edits",
    key: "byFacility" as const,
  },
  {
    id: "cpt",
    label: "CPT",
    entityHeader: "CPT code",
    drillPath: "/claims",
    drillHint: "Code-level utilization, modifier usage and payer-specific edits",
    key: "byCpt" as const,
  },
];

function BillingStatusPage() {
  return (
    <AppShell>
      <DrillDownProvider>
        <BillingStatusContent />
      </DrillDownProvider>
    </AppShell>
  );
}

function BillingStatusContent() {
  const openDrillDown = useDrillDown();
  const [pieMetric, setPieMetric] = useState<"claims" | "amount">("claims");
  const dashboard = useQuery(rcmQueries.billingStatus());
  const data: BillingStatusDashboard | undefined = dashboard.data;

  return (
    <>
      <PageHeader
        title="Billing Status"
        description="Where every claim sits in the lifecycle, from charge capture through payer adjudication."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => dashboard.refetch()} disabled={dashboard.isFetching}>
              <RefreshCw className={dashboard.isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <ExportButton rows={data?.recentClaims ?? []} fileName="billing-status-claims" />
          </div>
        }
      />

      <p className="mb-6 text-xs text-muted-foreground">
        {data
          ? `Last refreshed ${new Date(data.lastRefreshedAt).toLocaleString("en-US")} · ${data.source}`
          : "Loading claim status snapshot…"}
      </p>

      <section aria-label="Billing status KPIs" className="mb-6">
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
          title="Claim status funnel"
          subtitle="Pass-through from charge capture to paid, with drop-off at each stage"
          isLoading={dashboard.isLoading}
          error={dashboard.error}
          isEmpty={!dashboard.isLoading && (data?.funnel.length ?? 0) === 0}
          onRetry={() => dashboard.refetch()}
        >
          <ClaimStatusFunnel
            stages={data?.funnel ?? []}
            onSelect={(stage) =>
              openDrillDown({
                title: stage.label,
                hint: stage.drillHint,
                path: stage.drillPath,
                value: `${stage.claims.toLocaleString()} claims`,
              })
            }
          />
        </ChartCard>

        <ChartCard
          title="Claim status mix"
          subtitle="Distribution of the current claim inventory"
          isLoading={dashboard.isLoading}
          error={dashboard.error}
          onRetry={() => dashboard.refetch()}
          actions={
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              value={pieMetric}
              onValueChange={(value) => value && setPieMetric(value as "claims" | "amount")}
              aria-label="Status mix measure"
            >
              <ToggleGroupItem value="claims">Claims</ToggleGroupItem>
              <ToggleGroupItem value="amount">Value</ToggleGroupItem>
            </ToggleGroup>
          }
        >
          <ClaimStatusPie data={data?.statusMix ?? []} metric={pieMetric} />
        </ChartCard>
      </div>

      <section className="surface-card animate-rise mb-6 p-5 sm:p-6" aria-label="Billing summaries">
        <div className="mb-4">
          <h2 className="text-base font-bold">Billing summaries</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Outcome mix and first pass acceptance by insurance, provider, facility and CPT code
          </p>
        </div>

        <Tabs defaultValue="insurance">
          <TabsList className="mb-4 flex-wrap">
            {SUMMARY_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SUMMARY_TABS.map((tab) => {
            const rows = data?.[tab.key] ?? [];
            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-5">
                {dashboard.isLoading ? (
                  <Skeleton className="h-64 w-full rounded-xl" />
                ) : (
                  <>
                    <BillingSummaryChart rows={rows} />
                    <BillingSummaryTable
                      rows={rows}
                      entityHeader={tab.entityHeader}
                      drillPath={tab.drillPath}
                      drillHint={tab.drillHint}
                    />
                    <div className="flex justify-end">
                      <ExportButton rows={rows} fileName={`billing-summary-${tab.id}`} />
                    </div>
                  </>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      <section className="surface-card animate-rise p-5 sm:p-6" aria-label="Recent claims">
        <div className="mb-4">
          <h2 className="text-base font-bold">Recent claims</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest claim activity — select a row to open the claim drill-down
          </p>
        </div>
        <RecentClaimsTable rows={data?.recentClaims ?? []} isLoading={dashboard.isLoading} />
      </section>
    </>
  );
}
