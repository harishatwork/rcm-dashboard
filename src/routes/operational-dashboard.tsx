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
import type { OperationalSummaryRow } from "@/lib/api/operational-dashboard";
import {
  AppointmentStatusDistributionChart,
  AverageWaitTimeLocationChart,
  DailyAppointmentTrendChart,
  PatientFlowTimelineChart,
  ProviderUtilizationChart,
} from "@/components/charts/OperationalCharts";
import { OperationalSummaryTable } from "@/components/dashboard/OperationalSummaryTable";
import { OperationalDrillDownModal } from "@/components/dashboard/OperationalDrillDownModal";
import { OperationalAiInsights } from "@/components/dashboard/OperationalAiInsights";

export const Route = createFileRoute("/operational-dashboard")({
  head: () => ({
    meta: [
      { title: "Operational Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Real-time operational dashboard tracking appointment schedules, patient wait times, check-ins, provider capacity utilization, and facility throughput.",
      },
      { property: "og:title", content: "Operational Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track clinical operations, lobby wait times, appointment completion rates, and provider utilization.",
      },
    ],
  }),
  component: OperationalDashboardPage,
});

export function OperationalDashboardPage() {
  const query = useQuery(rcmQueries.operationalDashboard());

  const [selectedRow, setSelectedRow] = useState<OperationalSummaryRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleOpenDrillDown = (row: OperationalSummaryRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleChartDrillDown = (name: string) => {
    if (!data) return;
    const match = data.summaryRows.find(
      (r) => r.location.toLowerCase().includes(name.toLowerCase()) || r.provider.toLowerCase().includes(name.toLowerCase()),
    );
    if (match) {
      setSelectedRow(match);
      setModalOpen(true);
    } else if (data.summaryRows[0]) {
      setSelectedRow(data.summaryRows[0]);
      setModalOpen(true);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Operational Dashboard"
        description="Real-time clinical operations tracking appointment scheduling volume, patient check-ins, lobby wait times, provider capacity utilization, and facility patient flow."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Operational Dashboard data
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
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.summaryRows[0]?.location ?? "")}>
              <KpiCard metric={data.kpis.totalAppointments} index={0} invertTrend={false} />
            </div>
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.summaryRows[1]?.location ?? "")}>
              <KpiCard metric={data.kpis.patientCheckIns} index={1} invertTrend={false} />
            </div>
            <KpiCard metric={data.kpis.avgWaitTime} index={2} invertTrend={true} />
            <KpiCard metric={data.kpis.avgVisitDuration} index={3} invertTrend={true} />
            <KpiCard metric={data.kpis.providerUtilization} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.appointmentCompletionRate} index={5} invertTrend={false} />
            <KpiCard metric={data.kpis.noShowRate} index={6} invertTrend={true} />
            <KpiCard metric={data.kpis.cancellationRate} index={7} invertTrend={true} />
          </div>

          {/* AI Insights Panel */}
          <OperationalAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Daily Appointment Trend"
              subtitle="Daily trajectory of scheduled appointments vs completed patient check-ins"
            >
              <DailyAppointmentTrendChart data={data.dailyTrend} />
            </SectionCard>

            <SectionCard
              title="2. Appointment Status Distribution"
              subtitle="Proportion of scheduled visits split between Completed, No-Show, and Cancelled"
            >
              <AppointmentStatusDistributionChart data={data.statusDistribution} />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Provider Utilization"
              subtitle="Schedule capacity utilization percentage per provider (Click bar to inspect schedule)"
            >
              <ProviderUtilizationChart
                data={data.providerUtilization}
                onSelectProvider={(p) => handleChartDrillDown(p.providerName)}
              />
            </SectionCard>

            <SectionCard
              title="4. Average Wait Time by Location"
              subtitle="Lobby wait duration in minutes across practice locations vs. 15 min threshold"
            >
              <AverageWaitTimeLocationChart
                data={data.waitTimeByLocation}
                onSelectLocation={(l) => handleChartDrillDown(l.location)}
              />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Patient Flow Timeline (Hourly Arrival & Exam Throughput)"
            subtitle="Hourly patient arrival check-ins vs in-exam room throughput (08:00 AM – 05:00 PM)"
          >
            <PatientFlowTimelineChart data={data.patientFlowTimeline} />
          </SectionCard>

          {/* Interactive Operational Summary Table */}
          <SectionCard
            title="Operational Summary Register"
            subtitle="Search, filter, sort, paginate, and export facility & practice operational metrics (Click row to inspect 5-tab drill-down)"
          >
            <OperationalSummaryTable
              rows={data.summaryRows}
              onSelectRow={handleOpenDrillDown}
            />
          </SectionCard>
        </div>
      ) : null}

      {/* Interactive 5-Tab Drill-Down Modal */}
      <OperationalDrillDownModal
        row={selectedRow}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppShell>
  );
}
