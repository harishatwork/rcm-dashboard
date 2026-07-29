import type { KpiMetric } from "./types";

export interface PredictiveKpiMetric extends KpiMetric {
  previousValue: number;
  confidencePct: number;
}

export interface RevenueForecastPoint {
  date: string;
  month: string;
  actual?: number;
  projected: number;
  upperConfidence: number;
  lowerConfidence: number;
}

export interface CollectionForecastVsActualPoint {
  month: string;
  actual?: number;
  forecast: number;
  target: number;
}

export interface PredictedArTrendPoint {
  period: "Current" | "30 Days" | "60 Days" | "90 Days";
  actualAr?: number;
  projectedAr: number;
}

export interface HighRiskPayorPoint {
  payorName: string;
  atRiskAmount: number;
  predictedDenialRate: number;
  color: string;
}

export interface ClaimRiskDistributionPoint {
  riskLevel: "High Risk" | "Medium Risk" | "Low Risk";
  count: number;
  percentage: number;
  color: string;
}

export interface ClaimRiskAnalysisRow {
  id: string;
  claimNumber: string;
  patient: string;
  payor: string;
  claimAmount: number;
  riskScore: number; // 0 - 100
  denialProbability: number; // percentage e.g. 78
  expectedCollectionDate: string;
  recommendedAction: string;
  riskLevel: "High Risk" | "Medium Risk" | "Low Risk";
}

export interface ForecastModelComparison {
  id: string;
  modelName: string;
  description: string;
  actualValue: number;
  forecastValue: number;
  varianceValue: number;
  variancePct: number;
  isPositiveVariance: boolean;
  unit: "currency" | "percent" | "days";
}

export interface PredictiveAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "30/90 Day Revenue" | "High-Risk Claims" | "Payor Risk" | "Cash Flow Bottleneck" | "Actionable Optimization";
  estimatedImpact: number;
  confidence: number;
  type: "positive" | "warning" | "critical" | "info";
}

export interface PredictiveAnalyticsDashboardData {
  kpis: {
    predictedRevenue: PredictiveKpiMetric;
    expectedCollections: PredictiveKpiMetric;
    predictedDenialRate: PredictiveKpiMetric;
    forecastedAr: PredictiveKpiMetric;
    cashFlowForecast: PredictiveKpiMetric;
    highRiskClaims: PredictiveKpiMetric;
    highRiskPayors: PredictiveKpiMetric;
    collectionProbability: PredictiveKpiMetric;
  };
  revenueForecast: RevenueForecastPoint[];
  collectionForecastVsActual: CollectionForecastVsActualPoint[];
  predictedArTrend: PredictedArTrendPoint[];
  highRiskPayors: HighRiskPayorPoint[];
  claimRiskDistribution: ClaimRiskDistributionPoint[];
  riskAnalysisRows: ClaimRiskAnalysisRow[];
  forecastModels: ForecastModelComparison[];
  aiInsights: PredictiveAiInsight[];
  lastUpdated: string;
}

export function getMockPredictiveAnalyticsDashboardData(): PredictiveAnalyticsDashboardData {
  return {
    kpis: {
      predictedRevenue: {
        id: "predicted-revenue",
        label: "Predicted Revenue (Next 90 Days)",
        value: 14850000,
        previousValue: 13900000,
        format: "currency",
        deltaPct: 6.8,
        trend: "up",
        confidencePct: 96,
        helper: "+$950k projected 90-day growth",
      },
      expectedCollections: {
        id: "expected-collections",
        label: "Expected Collections",
        value: 13240000,
        previousValue: 12410000,
        format: "currency",
        deltaPct: 6.7,
        trend: "up",
        confidencePct: 94,
        helper: "+$830k anticipated net cash",
      },
      predictedDenialRate: {
        id: "predicted-denial-rate",
        label: "Predicted Denial Rate",
        value: 4.2,
        previousValue: 4.9,
        format: "percent",
        deltaPct: -0.7,
        trend: "down",
        target: 4.0,
        confidencePct: 91,
        helper: "0.7% projected denial drop",
      },
      forecastedAr: {
        id: "forecasted-ar",
        label: "Forecasted Accounts Receivable",
        value: 3820000,
        previousValue: 4180000,
        format: "currency",
        deltaPct: -8.6,
        trend: "down",
        confidencePct: 93,
        helper: "$360k A/R balance reduction",
      },
      cashFlowForecast: {
        id: "cash-flow-forecast",
        label: "Cash Flow Forecast (Monthly)",
        value: 4620000,
        previousValue: 4150000,
        format: "currency",
        deltaPct: 11.3,
        trend: "up",
        confidencePct: 95,
        helper: "+$470k monthly cash buffer",
      },
      highRiskClaims: {
        id: "high-risk-claims",
        label: "High-Risk Claims",
        value: 142,
        previousValue: 168,
        format: "number",
        deltaPct: -15.5,
        trend: "down",
        confidencePct: 88,
        helper: "142 claims ($840k at risk)",
      },
      highRiskPayors: {
        id: "high-risk-payors",
        label: "High-Risk Payors",
        value: 3,
        previousValue: 3,
        format: "number",
        deltaPct: 0.0,
        trend: "flat",
        confidencePct: 92,
        helper: "UnitedHealth, Medicaid, BCBS",
      },
      collectionProbability: {
        id: "collection-probability",
        label: "Collection Probability",
        value: 94.6,
        previousValue: 92.1,
        format: "percent",
        deltaPct: 2.5,
        trend: "up",
        target: 95.0,
        confidencePct: 97,
        helper: "+2.5% projected recovery likelihood",
      },
    },
    revenueForecast: [
      { date: "May", month: "May 2026", actual: 4100000, projected: 4100000, upperConfidence: 4200000, lowerConfidence: 4000000 },
      { date: "Jun", month: "Jun 2026", actual: 4350000, projected: 4350000, upperConfidence: 4450000, lowerConfidence: 4250000 },
      { date: "Jul", month: "Jul 2026", actual: 4500000, projected: 4500000, upperConfidence: 4620000, lowerConfidence: 4380000 },
      { date: "Aug", month: "Aug 2026 (F)", projected: 4720000, upperConfidence: 4920000, lowerConfidence: 4520000 },
      { date: "Sep", month: "Sep 2026 (F)", projected: 4980000, upperConfidence: 5210000, lowerConfidence: 4750000 },
      { date: "Oct", month: "Oct 2026 (F)", projected: 5150000, upperConfidence: 5420000, lowerConfidence: 4880000 },
    ],
    collectionForecastVsActual: [
      { month: "Jan", actual: 3850000, forecast: 3800000, target: 3750000 },
      { month: "Feb", actual: 3980000, forecast: 3950000, target: 3850000 },
      { month: "Mar", actual: 4120000, forecast: 4100000, target: 4000000 },
      { month: "Apr", actual: 4080000, forecast: 4150000, target: 4000000 },
      { month: "May", actual: 4250000, forecast: 4200000, target: 4100000 },
      { month: "Jun", actual: 4410000, forecast: 4380000, target: 4250000 },
    ],
    predictedArTrend: [
      { period: "Current", actualAr: 4250000, projectedAr: 4250000 },
      { period: "30 Days", projectedAr: 3980000 },
      { period: "60 Days", projectedAr: 3850000 },
      { period: "90 Days", projectedAr: 3620000 },
    ],
    highRiskPayors: [
      { payorName: "UnitedHealth Medicare Adv", atRiskAmount: 380000, predictedDenialRate: 6.8, color: "var(--chart-1)" },
      { payorName: "Medicaid State Plan", atRiskAmount: 260000, predictedDenialRate: 5.9, color: "var(--chart-2)" },
      { payorName: "Blue Cross Blue Shield", atRiskAmount: 180000, predictedDenialRate: 4.8, color: "var(--chart-3)" },
      { payorName: "Aetna Commercial", atRiskAmount: 120000, predictedDenialRate: 3.9, color: "var(--chart-4)" },
      { payorName: "Humana Choice", atRiskAmount: 85000, predictedDenialRate: 3.2, color: "var(--chart-5)" },
    ],
    claimRiskDistribution: [
      { riskLevel: "Low Risk", count: 7420, percentage: 75.4, color: "var(--chart-1)" },
      { riskLevel: "Medium Risk", count: 1820, percentage: 18.5, color: "var(--chart-2)" },
      { riskLevel: "High Risk", count: 600, percentage: 6.1, color: "var(--chart-4)" },
    ],
    riskAnalysisRows: [
      {
        id: "risk-1",
        claimNumber: "CLM-2026-9041",
        patient: "Sarah Jenkins",
        payor: "UnitedHealth Medicare Adv",
        claimAmount: 14500,
        riskScore: 88,
        denialProbability: 78,
        expectedCollectionDate: "2026-08-14",
        recommendedAction: "Attach Prior Authorization PDF before clearinghouse submission",
        riskLevel: "High Risk",
      },
      {
        id: "risk-2",
        claimNumber: "CLM-2026-9088",
        patient: "Arthur Dent",
        payor: "Medicaid State Plan",
        claimAmount: 8400,
        riskScore: 82,
        denialProbability: 72,
        expectedCollectionDate: "2026-08-18",
        recommendedAction: "Verify patient active eligibility ID and dual-coverage order",
        riskLevel: "High Risk",
      },
      {
        id: "risk-3",
        claimNumber: "CLM-2026-9112",
        patient: "Eleanor Rigby",
        payor: "Blue Cross Blue Shield",
        claimAmount: 12800,
        riskScore: 68,
        denialProbability: 48,
        expectedCollectionDate: "2026-08-10",
        recommendedAction: "Update CPT modifier 25 for dual evaluation & procedure",
        riskLevel: "Medium Risk",
      },
      {
        id: "risk-4",
        claimNumber: "CLM-2026-9145",
        patient: "Clara Oswald",
        payor: "Aetna Commercial",
        claimAmount: 6200,
        riskScore: 62,
        denialProbability: 38,
        expectedCollectionDate: "2026-08-08",
        recommendedAction: "Confirm rendering NPI matches facility credentialing group",
        riskLevel: "Medium Risk",
      },
      {
        id: "risk-5",
        claimNumber: "CLM-2026-9180",
        patient: "Marcus Brody",
        payor: "Humana Choice",
        claimAmount: 19400,
        riskScore: 45,
        denialProbability: 18,
        expectedCollectionDate: "2026-08-05",
        recommendedAction: "Standard claim validation rules passed",
        riskLevel: "Low Risk",
      },
    ],
    forecastModels: [
      {
        id: "mdl-1",
        modelName: "Revenue Forecast (90-Day)",
        description: "Projected gross billing & net revenue yield model based on trailing 6-month encounter trends.",
        actualValue: 13900000,
        forecastValue: 14850000,
        varianceValue: 950000,
        variancePct: 6.8,
        isPositiveVariance: true,
        unit: "currency",
      },
      {
        id: "mdl-2",
        modelName: "Cash Flow Forecast (Monthly)",
        description: "Expected cash collections inflow accounting for clearinghouse adjudication velocity.",
        actualValue: 4150000,
        forecastValue: 4620000,
        varianceValue: 470000,
        variancePct: 11.3,
        isPositiveVariance: true,
        unit: "currency",
      },
      {
        id: "mdl-3",
        modelName: "Denial Forecast",
        description: "AI machine learning prediction model evaluating initial claim rejection likelihood.",
        actualValue: 4.9,
        forecastValue: 4.2,
        varianceValue: -0.7,
        variancePct: -14.3,
        isPositiveVariance: true,
        unit: "percent",
      },
      {
        id: "mdl-4",
        modelName: "Collection Forecast Ratio",
        description: "Anticipated net collection ratio calculated across commercial, Medicare, and self-pay payors.",
        actualValue: 92.1,
        forecastValue: 94.6,
        varianceValue: 2.5,
        variancePct: 2.7,
        isPositiveVariance: true,
        unit: "percent",
      },
      {
        id: "mdl-5",
        modelName: "AR Aging Forecast (Days in A/R)",
        description: "Forecasted mean days in A/R following pre-submission claim scrub rule deployments.",
        actualValue: 36.2,
        forecastValue: 32.8,
        varianceValue: -3.4,
        variancePct: -9.4,
        isPositiveVariance: true,
        unit: "days",
      },
    ],
    aiInsights: [
      {
        id: "pred-ai-1",
        headline: "Projected +6.8% Revenue Surge ($14.85M) Over Next 90 Days",
        body: "Machine learning trend analysis projects strong revenue growth driven by Orthopedic surgical block expansions and Cardiology diagnostic volume.",
        recommendation: "Maintain staffing allocation in North Annex surgical suites to support projected encounter velocity.",
        category: "30/90 Day Revenue",
        estimatedImpact: 950000,
        confidence: 96,
        type: "positive",
      },
      {
        id: "pred-ai-2",
        headline: "142 Claims Flagged with High Denial Risk ($840k Total Value)",
        body: "Automated claim auditing rules identified 142 submitted claims exhibiting a >70% probability of denial due to missing pre-authorization attachments.",
        recommendation: "Run pre-submission claim scrub rules for UnitedHealth Medicare Advantage diagnostic procedures to intercept denials before submission.",
        category: "High-Risk Claims",
        estimatedImpact: 340000,
        confidence: 92,
        type: "critical",
      },
      {
        id: "pred-ai-3",
        headline: "UnitedHealth Medicare Advantage Denial Exposure Projected at $380k",
        body: "Historical remittance patterns indicate potential payment delays of 14+ days for UnitedHealth claims lacking secondary authorization keys.",
        recommendation: "Enable automated pre-billing authorization verification for all UnitedHealth cardiac catheterization claims.",
        category: "Payor Risk",
        estimatedImpact: 180000,
        confidence: 94,
        type: "warning",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
