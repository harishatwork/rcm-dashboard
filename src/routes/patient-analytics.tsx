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
import type { PatientSummaryRow } from "@/lib/api/patient-analytics";
import {
  MonthlyPatientGrowthChart,
  NewVsReturningChart,
  PatientVisitsTrendChart,
  RevenueByPatientTypeChart,
  TopSpecialtiesVolumeChart,
} from "@/components/charts/PatientCharts";
import { PatientSummaryTable } from "@/components/dashboard/PatientSummaryTable";
import { PatientDrillDownModal } from "@/components/dashboard/PatientDrillDownModal";
import { PatientAiInsights } from "@/components/dashboard/PatientAiInsights";

export const Route = createFileRoute("/patient-analytics")({
  head: () => ({
    meta: [
      { title: "Patient Analytics Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive patient analytics dashboard tracking patient growth, visit trends, specialty volume, revenue per patient, and patient billing histories.",
      },
      { property: "og:title", content: "Patient Analytics Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track patient volume growth, new vs returning patient trends, and patient collections.",
      },
    ],
  }),
  component: PatientAnalyticsDashboardPage,
});

export function PatientAnalyticsDashboardPage() {
  const query = useQuery(rcmQueries.patientAnalyticsDashboard());

  const [selectedPatient, setSelectedPatient] = useState<PatientSummaryRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleOpenDrillDown = (row: PatientSummaryRow) => {
    setSelectedPatient(row);
    setModalOpen(true);
  };

  const handleChartDrillDown = (name: string) => {
    if (!data) return;
    const match = data.patientSummaryRows.find(
      (r) => r.patientName.toLowerCase().includes(name.toLowerCase()) || r.specialty.toLowerCase().includes(name.toLowerCase()),
    );
    if (match) {
      setSelectedPatient(match);
      setModalOpen(true);
    } else if (data.patientSummaryRows[0]) {
      setSelectedPatient(data.patientSummaryRows[0]);
      setModalOpen(true);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Patient Analytics Dashboard"
        description="Comprehensive analytics tracking active patient growth, visit frequency, specialty volume distribution, no-show rates, and individual billing histories."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Patient Analytics Dashboard data
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
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.patientSummaryRows[0]?.patientName ?? "")}>
              <KpiCard metric={data.kpis.totalPatients} index={0} invertTrend={false} />
            </div>
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.patientSummaryRows[2]?.patientName ?? "")}>
              <KpiCard metric={data.kpis.newPatients} index={1} invertTrend={false} />
            </div>
            <KpiCard metric={data.kpis.returningPatients} index={2} invertTrend={false} />
            <KpiCard metric={data.kpis.patientCollections} index={3} invertTrend={false} />
            <KpiCard metric={data.kpis.avgRevenuePerPatient} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.avgVisitsPerPatient} index={5} invertTrend={false} />
            <KpiCard metric={data.kpis.noShowRate} index={6} invertTrend={true} />
            <KpiCard metric={data.kpis.patientSatisfactionScore} index={7} invertTrend={false} />
          </div>

          {/* AI Insights Panel */}
          <PatientAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Patient Visits Trend"
              subtitle="Monthly trajectory of New vs. Returning patient visit encounters"
            >
              <PatientVisitsTrendChart
                data={data.visitsTrend}
                onSelectPoint={() => handleChartDrillDown(data.patientSummaryRows[0]?.patientName ?? "")}
              />
            </SectionCard>

            <SectionCard
              title="2. New vs. Returning Patients"
              subtitle="Proportion of active patient base split between New vs Returning"
            >
              <NewVsReturningChart data={data.newVsReturning} />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Revenue by Patient Type"
              subtitle="Collections breakdown across Commercial PPO, Medicare, Self-Pay & Medicaid"
            >
              <RevenueByPatientTypeChart
                data={data.revenueByPatientType}
                onSelectType={(t) => handleChartDrillDown(t.patientType)}
              />
            </SectionCard>

            <SectionCard
              title="4. Top Specialties by Patient Volume"
              subtitle="Active patient encounter distribution across clinical specialties"
            >
              <TopSpecialtiesVolumeChart data={data.topSpecialtiesVolume} />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Monthly Patient Growth"
            subtitle="Net patient acquisition and active patient base expansion per month"
          >
            <MonthlyPatientGrowthChart data={data.monthlyPatientGrowth} />
          </SectionCard>

          {/* Interactive Patient Summary Table */}
          <SectionCard
            title="Patient Summary Register"
            subtitle="Search, filter, sort, paginate, and export patient financial & visit summaries (Click row to inspect profile)"
          >
            <PatientSummaryTable
              rows={data.patientSummaryRows}
              onSelectRow={handleOpenDrillDown}
            />
          </SectionCard>
        </div>
      ) : null}

      {/* Interactive Drill-Down Modal */}
      <PatientDrillDownModal
        patient={selectedPatient}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppShell>
  );
}
