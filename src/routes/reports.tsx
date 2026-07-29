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
import type { ReportLibraryRow } from "@/lib/api/reports-analytics-dashboard";
import {
  DashboardActivityRoleChart,
  MostViewedReportsChart,
  ReportGenerationTrendChart,
  ReportsByCategoryChart,
  ReportUsageTrendChart,
} from "@/components/charts/ReportsDashboardCharts";
import { ReportCategoryGrid } from "@/components/dashboard/ReportCategoryGrid";
import { ReportsLibraryTable } from "@/components/dashboard/ReportsLibraryTable";
import { ScheduledReportsManager } from "@/components/dashboard/ScheduledReportsManager";
import { ReportsAiInsights } from "@/components/dashboard/ReportsAiInsights";
import { ReportViewerModal } from "@/components/dashboard/ReportViewerModal";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive reports & analytics dashboard offering automated report scheduling, export metrics, category browsing, and interactive report viewers.",
      },
      { property: "og:title", content: "Reports & Analytics Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Run, schedule, and export standard financial, A/R, claims, denials, and operational reports.",
      },
    ],
  }),
  component: ReportsAnalyticsDashboardPage,
});

export function ReportsAnalyticsDashboardPage() {
  const query = useQuery(rcmQueries.reportsAnalyticsDashboard());

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportLibraryRow | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleViewReport = (row: ReportLibraryRow) => {
    setSelectedReport(row);
    setViewerOpen(true);
  };

  const handleChartDrillDown = (reportName: string) => {
    if (!data) return;
    const match = data.libraryRows.find(
      (r) => r.reportName.toLowerCase().includes(reportName.toLowerCase()) || r.category.toLowerCase().includes(reportName.toLowerCase()),
    );
    if (match) {
      setSelectedReport(match);
      setViewerOpen(true);
    } else if (data.libraryRows[0]) {
      setSelectedReport(data.libraryRows[0]);
      setViewerOpen(true);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Reports & Analytics Dashboard"
        description="Standard healthcare RCM report catalog, automated schedule management, report export analytics, and interactive data previews."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Reports & Analytics Dashboard data
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
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.libraryRows[0]?.reportName ?? "")}>
              <KpiCard metric={data.kpis.totalReports} index={0} invertTrend={false} />
            </div>
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.libraryRows[1]?.reportName ?? "")}>
              <KpiCard metric={data.kpis.scheduledReports} index={1} invertTrend={false} />
            </div>
            <KpiCard metric={data.kpis.reportsGeneratedToday} index={2} invertTrend={false} />
            <KpiCard metric={data.kpis.exportCount} index={3} invertTrend={false} />
            <KpiCard metric={data.kpis.dashboardViews} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.activeUsers} index={5} invertTrend={false} />
            <KpiCard metric={data.kpis.mostAccessedReport} index={6} invertTrend={false} />
            <KpiCard metric={data.kpis.avgGenerationTime} index={7} invertTrend={true} />
          </div>

          {/* 8 Category Tiles Grid */}
          <ReportCategoryGrid
            categories={data.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* AI Insights Panel */}
          <ReportsAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Report Usage Trend"
              subtitle="Daily volume of report executions, downloads & exports over time"
            >
              <ReportUsageTrendChart data={data.usageTrend} />
            </SectionCard>

            <SectionCard
              title="2. Reports Execution by Category"
              subtitle="Proportion of report executions split across Financial, Denials, A/R & Provider"
            >
              <ReportsByCategoryChart data={data.reportsByCategory} />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Most Viewed Reports"
              subtitle="Ranking top 5 most accessed standard RCM reports (Click bar to preview)"
            >
              <MostViewedReportsChart
                data={data.mostViewedReports}
                onSelectReport={(r) => handleChartDrillDown(r.reportName)}
              />
            </SectionCard>

            <SectionCard
              title="4. Report Generation Trend (Manual vs Scheduled)"
              subtitle="Monthly comparison of manual ad-hoc executions vs automated scheduled dispatches"
            >
              <ReportGenerationTrendChart data={data.generationTrend} />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Dashboard & Report Activity by User Role"
            subtitle="Breakdown of page views, report exports, and schedule configurations per role"
          >
            <DashboardActivityRoleChart data={data.activityByRole} />
          </SectionCard>

          {/* Interactive Reports Library Table */}
          <SectionCard
            title="Reports Library Register"
            subtitle="Search, filter, sort, paginate, run, view, schedule, and export standard RCM reports"
          >
            <ReportsLibraryTable
              rows={data.libraryRows}
              selectedCategory={selectedCategory}
              onViewReport={handleViewReport}
            />
          </SectionCard>

          {/* Scheduled Reports Management Section */}
          <SectionCard
            title="Automated Report Schedules"
            subtitle="Manage recurring email & SFTP report dispatches (Create, Pause, Resume, Delete)"
          >
            <ScheduledReportsManager initialRows={data.scheduledRows} />
          </SectionCard>
        </div>
      ) : null}

      {/* Interactive Report Viewer Dialog */}
      <ReportViewerModal
        report={selectedReport}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </AppShell>
  );
}
