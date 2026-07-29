import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { KpiCard } from "@/components/data/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import type { ClaimRiskAnalysisRow } from "@/lib/api/predictive-analytics";
import {
  ClaimRiskDistributionChart,
  CollectionForecastVsActualChart,
  HighRiskPayorsChart,
  PredictedArTrendChart,
  RevenueForecastChart,
} from "@/components/charts/PredictiveCharts";
import { ClaimRiskTable } from "@/components/dashboard/ClaimRiskTable";
import { ForecastModelGrid } from "@/components/dashboard/ForecastModelGrid";
import { PredictiveAiInsights } from "@/components/dashboard/PredictiveAiInsights";

export const Route = createFileRoute("/predictive-analytics")({
  head: () => ({
    meta: [
      { title: "Predictive Analytics Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Machine learning predictive analytics dashboard forecasting 30/90-day revenue trends, expected collections, denial probability, and claim risk analysis.",
      },
      { property: "og:title", content: "Predictive Analytics Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track revenue forecasts, claim denial risks, cash flow projections, and machine learning models.",
      },
    ],
  }),
  component: PredictiveAnalyticsDashboardPage,
});

export function PredictiveAnalyticsDashboardPage() {
  const query = useQuery(rcmQueries.predictiveAnalyticsDashboard());

  const [selectedClaim, setSelectedClaim] = useState<ClaimRiskAnalysisRow | null>(null);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  const renderKpiWithConfidence = (metric: any, index: number, invertTrend = false) => {
    return <KpiCard metric={metric} index={index} invertTrend={invertTrend} />;
  };

  return (
    <AppShell>
      <PageHeader
        title="Predictive Analytics Dashboard"
        description="Machine learning predictive forecasting 30/90-day revenue trends, expected cash flow collections, claim denial probability, payor risk exposure, and risk mitigation strategies."
      />

      {/* Error State */}
      {isError ? (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Failed to load Predictive Analytics Dashboard data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            An error occurred while connecting to the analytics prediction server. Please check your network or try again.
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
          {/* 8 KPI Cards Grid with Confidence Badges */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {renderKpiWithConfidence(data.kpis.predictedRevenue, 0, false)}
            {renderKpiWithConfidence(data.kpis.expectedCollections, 1, false)}
            {renderKpiWithConfidence(data.kpis.predictedDenialRate, 2, true)}
            {renderKpiWithConfidence(data.kpis.forecastedAr, 3, true)}
            {renderKpiWithConfidence(data.kpis.cashFlowForecast, 4, false)}
            {renderKpiWithConfidence(data.kpis.highRiskClaims, 5, true)}
            {renderKpiWithConfidence(data.kpis.highRiskPayors, 6, true)}
            {renderKpiWithConfidence(data.kpis.collectionProbability, 7, false)}
          </div>

          {/* AI Insights Panel */}
          <PredictiveAiInsights insights={data.aiInsights} />

          {/* Visualizations Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="1. 90-Day Revenue Forecast (ML Model)"
              subtitle="Projected gross revenue curve with upper/lower 95% confidence interval bands"
            >
              <RevenueForecastChart data={data.revenueForecast} />
            </SectionCard>

            <SectionCard
              title="2. Collection Forecast vs. Actual"
              subtitle="Historical net collections compared against machine learning projected target baseline"
            >
              <CollectionForecastVsActualChart data={data.collectionForecastVsActual} />
            </SectionCard>
          </div>

          {/* Visualizations Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="3. Predicted A/R Exposure Trend"
              subtitle="Projected 30/60/90-day accounts receivable balances following pre-submission scrubbing"
            >
              <PredictedArTrendChart data={data.predictedArTrend} />
            </SectionCard>

            <SectionCard
              title="4. High-Risk Payors (At-Risk Revenue)"
              subtitle="Payor revenue exposure ranked by projected denial rate and claim volume"
            >
              <HighRiskPayorsChart data={data.highRiskPayors} />
            </SectionCard>
          </div>

          {/* Visualizations Row 3 */}
          <SectionCard
            title="5. Claim Risk Level Distribution"
            subtitle="Proportion of submitted claim pipeline categorized by ML risk scoring (Low, Medium, High Risk)"
          >
            <ClaimRiskDistributionChart data={data.claimRiskDistribution} />
          </SectionCard>

          {/* Forecast Models Comparison Section */}
          <SectionCard
            title="Forecast Models Comparison"
            subtitle="Side-by-side performance audit comparing Actual baseline vs ML Forecast vs Variance"
          >
            <ForecastModelGrid models={data.forecastModels} />
          </SectionCard>

          {/* Interactive Claim Risk Analysis Table */}
          <SectionCard
            title="Claim Risk Analysis Register"
            subtitle="Search, filter, sort, paginate, and export claims flagged with high denial probability and recommended actions"
          >
            <ClaimRiskTable
              rows={data.riskAnalysisRows}
              onSelectClaim={setSelectedClaim}
            />
          </SectionCard>
        </div>
      ) : null}
    </AppShell>
  );
}
