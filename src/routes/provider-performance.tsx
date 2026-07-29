import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import type { ProviderPerformanceRow } from "@/lib/api/provider-performance-dashboard";
import {
  EncountersBySpecialtyChart,
  MonthlyProviderCollectionsChart,
  ProviderProductivityTrendChart,
  RevenueByProviderChart,
  TopPerformingProvidersChart,
} from "@/components/charts/ProviderDashboardCharts";
import { ProviderPerformanceTable } from "@/components/dashboard/ProviderPerformanceTable";
import { ProviderDrillDownModal } from "@/components/dashboard/ProviderDrillDownModal";
import { ProviderAiInsights } from "@/components/dashboard/ProviderAiInsights";

export const Route = createFileRoute("/provider-performance")({
  head: () => ({
    meta: [
      { title: "Provider Performance Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive provider performance dashboard tracking provider revenue, wRVU productivity, encounter volumes, collection efficiency, denial rates, and provider scorecards.",
      },
      { property: "og:title", content: "Provider Performance Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track provider productivity, charge capture, collection rates, and denial exposure.",
      },
    ],
  }),
  component: ProviderPerformanceDashboardPage,
});

export function ProviderPerformanceDashboardPage() {
  const query = useQuery(rcmQueries.providerPerformanceDashboard());

  const [selectedProvider, setSelectedProvider] = useState<ProviderPerformanceRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleOpenDrillDown = (row: ProviderPerformanceRow) => {
    setSelectedProvider(row);
    setModalOpen(true);
  };

  const handleChartDrillDown = (name: string) => {
    if (!data) return;
    const match = data.performanceRows.find(
      (r) => r.providerName.toLowerCase().includes(name.toLowerCase()) || r.specialty.toLowerCase().includes(name.toLowerCase()),
    );
    if (match) {
      setSelectedProvider(match);
      setModalOpen(true);
    } else if (data.performanceRows[0]) {
      setSelectedProvider(data.performanceRows[0]);
      setModalOpen(true);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Provider Performance Dashboard"
        description="Comprehensive analytics tracking provider productivity, wRVU target achievement, encounter volumes, collection efficiency, denial exposure, and individual provider scorecards."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Provider Performance Dashboard data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while connecting to the analytics server. Please check your network or try again.
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

      {/* Main Dashboard View */}
      {!isLoading && !isError && data ? (
        <div className="space-y-6">
          {/* 8 KPI Cards Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.performanceRows[0]?.providerName ?? "")}>
              <KpiCard metric={data.kpis.totalProviders} index={0} invertTrend={false} />
            </div>
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.performanceRows[1]?.providerName ?? "")}>
              <KpiCard metric={data.kpis.totalEncounters} index={1} invertTrend={false} />
            </div>
            <KpiCard metric={data.kpis.totalCharges} index={2} invertTrend={false} />
            <KpiCard metric={data.kpis.totalCollections} index={3} invertTrend={false} />
            <KpiCard metric={data.kpis.avgRevenuePerProvider} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.avgEncountersPerDay} index={5} invertTrend={false} />
            <KpiCard metric={data.kpis.denialRate} index={6} invertTrend={true} />
            <KpiCard metric={data.kpis.collectionEfficiency} index={7} invertTrend={false} />
          </div>

          {/* AI Insights Panel */}
          <ProviderAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Revenue by Provider"
              subtitle="Net collections generated per provider (Click bar to inspect profile)"
            >
              <RevenueByProviderChart
                data={data.revenueByProvider}
                onSelectProvider={(p) => handleChartDrillDown(p.providerName)}
              />
            </SectionCard>

            <SectionCard
              title="2. Monthly Provider Collections"
              subtitle="Monthly net collections trajectory vs. operational target"
            >
              <MonthlyProviderCollectionsChart data={data.monthlyCollections} />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Encounters by Specialty"
              subtitle="Patient encounter volume distribution across clinical specialties"
            >
              <EncountersBySpecialtyChart data={data.encountersBySpecialty} />
            </SectionCard>

            <SectionCard
              title="4. Top Performing Providers by Gross Charges"
              subtitle="Ranking top providers by gross charges posted and wRVU output"
            >
              <TopPerformingProvidersChart
                data={data.topPerformingProviders}
                onSelectProvider={(p) => handleChartDrillDown(p.providerName)}
              />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Provider Productivity Trend (wRVU vs Baseline Target)"
            subtitle="Monthly wRVU productivity units compared against benchmark target baseline"
          >
            <ProviderProductivityTrendChart data={data.productivityTrend} />
          </SectionCard>

          {/* Interactive Provider Performance Table */}
          <SectionCard
            title="Provider Scorecard Table"
            subtitle="Search, filter, sort, paginate, and export provider performance metrics (Click row to inspect 5-tab drill-down)"
          >
            <ProviderPerformanceTable
              rows={data.performanceRows}
              onSelectRow={handleOpenDrillDown}
            />
          </SectionCard>
        </div>
      ) : null}

      {/* Interactive 5-Tab Drill-Down Modal */}
      <ProviderDrillDownModal
        provider={selectedProvider}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppShell>
  );
}
