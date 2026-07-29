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
import type { InsurancePerformanceRow } from "@/lib/api/insurance-dashboard";
import {
  ClaimsStatusDistributionChart,
  InsurancePaymentsTrendChart,
  MonthlySubmittedVsPaidChart,
  PaymentsByInsuranceChart,
  TopInsuranceCompaniesRevenueChart,
} from "@/components/charts/InsuranceCharts";
import { InsurancePerformanceTable } from "@/components/dashboard/InsurancePerformanceTable";
import { InsuranceDrillDownModal } from "@/components/dashboard/InsuranceDrillDownModal";
import { InsuranceAiInsights } from "@/components/dashboard/InsuranceAiInsights";

export const Route = createFileRoute("/insurance-dashboard")({
  head: () => ({
    meta: [
      { title: "Insurance Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive insurance analytics dashboard tracking payments, AR balances, claim status distributions, payor turnaround times, and contract performance.",
      },
      { property: "og:title", content: "Insurance Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track insurance payments, payor performance, collection rates, and claims turnaround.",
      },
    ],
  }),
  component: InsuranceDashboardPage,
});

export function InsuranceDashboardPage() {
  const query = useQuery(rcmQueries.insuranceDashboard());

  const [selectedPayor, setSelectedPayor] = useState<InsurancePerformanceRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const handleOpenDrillDown = (row: InsurancePerformanceRow) => {
    setSelectedPayor(row);
    setModalOpen(true);
  };

  const handleChartDrillDown = (payorName: string) => {
    if (!data) return;
    const match = data.performanceRows.find(
      (r) => r.insuranceCompany.toLowerCase() === payorName.toLowerCase(),
    );
    if (match) {
      setSelectedPayor(match);
      setModalOpen(true);
    } else if (data.performanceRows[0]) {
      setSelectedPayor(data.performanceRows[0]);
      setModalOpen(true);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Insurance Dashboard"
        description="Comprehensive analytics tracking insurance payments, payor turnaround times, collection rates, AR balances, and contract renewal strategy."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Insurance Dashboard data
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
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.performanceRows[0]?.insuranceCompany ?? "")}>
              <KpiCard metric={data.kpis.totalInsurancePayments} index={0} invertTrend={false} />
            </div>
            <div className="cursor-pointer" onClick={() => handleChartDrillDown(data.performanceRows[2]?.insuranceCompany ?? "")}>
              <KpiCard metric={data.kpis.insuranceAr} index={1} invertTrend={true} />
            </div>
            <KpiCard metric={data.kpis.claimsSubmitted} index={2} invertTrend={false} />
            <KpiCard metric={data.kpis.claimsPaid} index={3} invertTrend={false} />
            <KpiCard metric={data.kpis.firstPassAcceptanceRate} index={4} invertTrend={false} />
            <KpiCard metric={data.kpis.avgPaymentTime} index={5} invertTrend={true} />
            <KpiCard metric={data.kpis.avgReimbursement} index={6} invertTrend={false} />
            <KpiCard metric={data.kpis.collectionRate} index={7} invertTrend={false} />
          </div>

          {/* AI Insights Panel */}
          <InsuranceAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. Insurance Payments & A/R Trend"
              subtitle="Monthly trajectory of total insurance payments vs insurance AR balance"
            >
              <InsurancePaymentsTrendChart
                data={data.paymentsTrend}
                onSelectMonth={() => handleChartDrillDown(data.performanceRows[0]?.insuranceCompany ?? "")}
              />
            </SectionCard>

            <SectionCard
              title="2. Payments by Insurance Company"
              subtitle="Total insurance payments per major payor (Click bar to drill down)"
            >
              <PaymentsByInsuranceChart
                data={data.paymentsByCompany}
                onSelectPayor={(p) => handleChartDrillDown(p.payor)}
              />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Claims Status Distribution"
              subtitle="Breakdown across Paid, Pending, Denied, Appealed & Newly Submitted"
            >
              <ClaimsStatusDistributionChart data={data.claimsStatusDistribution} />
            </SectionCard>

            <SectionCard
              title="4. Monthly Submitted vs Paid Claims"
              subtitle="Volume comparison of submitted claims vs paid claims per month"
            >
              <MonthlySubmittedVsPaidChart data={data.monthlySubmittedVsPaid} />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Top Insurance Companies by Revenue"
            subtitle="Net revenue contribution per insurance company (Click to inspect contract details)"
          >
            <TopInsuranceCompaniesRevenueChart
              data={data.topCompaniesByRevenue}
              onSelectCompany={(c) => handleChartDrillDown(c.payor)}
            />
          </SectionCard>

          {/* Interactive Performance Table */}
          <SectionCard
            title="Insurance Performance Table"
            subtitle="Search, filter, sort, paginate, and export payor performance data (Click row to drill down)"
          >
            <InsurancePerformanceTable
              rows={data.performanceRows}
              onSelectRow={handleOpenDrillDown}
            />
          </SectionCard>
        </div>
      ) : null}

      {/* Interactive Drill-Down Modal */}
      <InsuranceDrillDownModal
        payor={selectedPayor}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppShell>
  );
}
