import type { KpiMetric } from "./types";

export interface DenialKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface DenialTrendPoint {
  month: string;
  deniedCharges: number;
  deniedClaims: number;
  initialDenialRate: number;
  finalDenialRate: number;
}

export interface DenialPayorPoint {
  id: string;
  payor: string;
  deniedCharges: number;
  deniedClaims: number;
  appealSuccessRate: number;
}

export interface DenialCategoryPoint {
  category: "clinical" | "technical" | "eligibility" | "coding" | "authorization";
  label: string;
  deniedCharges: number;
  claimCount: number;
  percentage: number;
  color: string;
}

export interface DenialFinancialImpactPoint {
  month: string;
  totalBilled: number;
  deniedCharges: number;
  recoveredRevenue: number;
}

export interface TopDenialReasonRow {
  code: string;
  reason: string;
  category: string;
  count: number;
  amount: number;
  recoverablePct: number;
  avgDaysToAppeal: number;
}

export type AppealStatus = "not_appealed" | "under_review" | "appealed" | "recovered" | "written_off";

export interface DenialClaimRow {
  id: string;
  claimNumber: string;
  patient: string;
  provider: string;
  payor: string;
  practice: string;
  specialty: string;
  location: string;
  claimAmount: number;
  deniedAmount: number;
  denialCategory: string;
  denialReason: string;
  appealStatus: AppealStatus;
  daysSinceDenial: number;
  denialDate: string;
}

export interface DenialAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: string;
  estimatedImpact: number;
  confidence: number;
  actionType: "workflow" | "payer_appeal" | "pre_auth" | "coding_rule";
}

export interface DenialsDashboardData {
  kpis: {
    totalDeniedClaims: DenialKpiMetric;
    deniedCharges: DenialKpiMetric;
    denialRate: DenialKpiMetric;
    initialDenialRate: DenialKpiMetric;
    appealsSubmitted: DenialKpiMetric;
    appealSuccessRate: DenialKpiMetric;
    recoveredRevenue: DenialKpiMetric;
  };
  denialTrend: DenialTrendPoint[];
  denialsByPayor: DenialPayorPoint[];
  denialCategories: DenialCategoryPoint[];
  financialImpact: DenialFinancialImpactPoint[];
  topDenialReasons: TopDenialReasonRow[];
  claims: DenialClaimRow[];
  aiInsights: DenialAiInsight[];
  lastUpdated: string;
}

export function getMockDenialsDashboardData(): DenialsDashboardData {
  return {
    kpis: {
      totalDeniedClaims: {
        id: "total-denied-claims",
        label: "Total Denied Claims",
        value: 1420,
        previousValue: 1510,
        format: "number",
        deltaPct: -6.0,
        trend: "down",
        target: 1200,
        helper: "vs 1,510 prior month",
      },
      deniedCharges: {
        id: "denied-charges",
        label: "Denied Charges",
        value: 1850400,
        previousValue: 1980000,
        format: "currency",
        deltaPct: -6.5,
        trend: "down",
        helper: "vs $1.98M prior month",
      },
      denialRate: {
        id: "denial-rate",
        label: "Denial Rate",
        value: 7.4,
        previousValue: 8.2,
        format: "percent",
        deltaPct: -0.8,
        trend: "down",
        target: 5.0,
        helper: "vs 8.2% prior month",
      },
      initialDenialRate: {
        id: "initial-denial-rate",
        label: "Initial Denial Rate",
        value: 9.1,
        previousValue: 9.8,
        format: "percent",
        deltaPct: -0.7,
        trend: "down",
        helper: "vs 9.8% prior month",
      },
      appealsSubmitted: {
        id: "appeals-submitted",
        label: "Appeals Submitted",
        value: 940,
        previousValue: 880,
        format: "number",
        deltaPct: 6.8,
        trend: "up",
        helper: "66.2% of eligible claims",
      },
      appealSuccessRate: {
        id: "appeal-success-rate",
        label: "Appeal Success Rate",
        value: 68.5,
        previousValue: 63.2,
        format: "percent",
        deltaPct: 5.3,
        trend: "up",
        target: 75.0,
        helper: "+5.3% vs benchmark",
      },
      recoveredRevenue: {
        id: "recovered-revenue",
        label: "Recovered Revenue",
        value: 1265000,
        previousValue: 1124000,
        format: "currency",
        deltaPct: 12.5,
        trend: "up",
        helper: "vs $1.12M prior month",
      },
    },
    denialTrend: [
      { month: "Jan", deniedCharges: 320000, deniedClaims: 245, initialDenialRate: 9.8, finalDenialRate: 3.4 },
      { month: "Feb", deniedCharges: 310000, deniedClaims: 238, initialDenialRate: 9.5, finalDenialRate: 3.2 },
      { month: "Mar", deniedCharges: 345000, deniedClaims: 260, initialDenialRate: 10.2, finalDenialRate: 3.6 },
      { month: "Apr", deniedCharges: 295000, deniedClaims: 220, initialDenialRate: 8.9, finalDenialRate: 2.9 },
      { month: "May", deniedCharges: 285000, deniedClaims: 215, initialDenialRate: 8.5, finalDenialRate: 2.7 },
      { month: "Jun", deniedCharges: 295400, deniedClaims: 242, initialDenialRate: 9.1, finalDenialRate: 2.8 },
    ],
    denialsByPayor: [
      { id: "p1", payor: "Blue Cross Blue Shield", deniedCharges: 540000, deniedClaims: 380, appealSuccessRate: 72.4 },
      { id: "p2", payor: "Medicare", deniedCharges: 420000, deniedClaims: 340, appealSuccessRate: 64.1 },
      { id: "p3", payor: "Aetna", deniedCharges: 310000, deniedClaims: 240, appealSuccessRate: 70.8 },
      { id: "p4", payor: "UnitedHealthcare", deniedCharges: 290000, deniedClaims: 230, appealSuccessRate: 62.5 },
      { id: "p5", payor: "Humana", deniedCharges: 180000, deniedClaims: 140, appealSuccessRate: 68.0 },
      { id: "p6", payor: "Cigna", deniedCharges: 110400, deniedClaims: 90, appealSuccessRate: 75.2 },
    ],
    denialCategories: [
      { category: "authorization", label: "Prior Authorization", deniedCharges: 610000, claimCount: 420, percentage: 33.0, color: "var(--chart-1)" },
      { category: "eligibility", label: "Eligibility & Coverage", deniedCharges: 445000, claimCount: 350, percentage: 24.0, color: "var(--chart-2)" },
      { category: "coding", label: "Coding & Documentation", deniedCharges: 370000, claimCount: 290, percentage: 20.0, color: "var(--chart-3)" },
      { category: "technical", label: "Technical / Timely Filing", deniedCharges: 240000, claimCount: 210, percentage: 13.0, color: "var(--chart-4)" },
      { category: "clinical", label: "Clinical Necessity", deniedCharges: 185400, claimCount: 150, percentage: 10.0, color: "var(--chart-5)" },
    ],
    financialImpact: [
      { month: "Jan", totalBilled: 4200000, deniedCharges: 320000, recoveredRevenue: 210000 },
      { month: "Feb", totalBilled: 4100000, deniedCharges: 310000, recoveredRevenue: 205000 },
      { month: "Mar", totalBilled: 4500000, deniedCharges: 345000, recoveredRevenue: 228000 },
      { month: "Apr", totalBilled: 3950000, deniedCharges: 295000, recoveredRevenue: 202000 },
      { month: "May", totalBilled: 4050000, deniedCharges: 285000, recoveredRevenue: 198000 },
      { month: "Jun", totalBilled: 4300000, deniedCharges: 295400, recoveredRevenue: 222000 },
    ],
    topDenialReasons: [
      { code: "CO-197", reason: "Precertification/authorization/notification absent", category: "authorization", count: 320, amount: 480000, recoverablePct: 82, avgDaysToAppeal: 4 },
      { code: "CO-27", reason: "Expenses incurred after coverage terminated", category: "eligibility", count: 240, amount: 310000, recoverablePct: 45, avgDaysToAppeal: 7 },
      { code: "CO-50", reason: "These are non-covered services because this is not deemed medical necessity", category: "clinical", count: 180, amount: 260000, recoverablePct: 65, avgDaysToAppeal: 9 },
      { code: "CO-16", reason: "Claim/service lacks information needed for adjudication", category: "technical", count: 210, amount: 220000, recoverablePct: 91, avgDaysToAppeal: 3 },
      { code: "CO-97", reason: "The benefit for this service is included in the payment for another service", category: "coding", count: 150, amount: 180000, recoverablePct: 58, avgDaysToAppeal: 6 },
      { code: "CO-29", reason: "The time limit for filing has expired", category: "technical", count: 110, amount: 140000, recoverablePct: 30, avgDaysToAppeal: 12 },
    ],
    claims: [
      {
        id: "CLM-9041",
        claimNumber: "CLM-2026-9041",
        patient: "Sarah Jenkins",
        provider: "Dr. Eleanor Vance",
        payor: "Blue Cross Blue Shield",
        practice: "Main Campus Clinic",
        specialty: "Cardiology",
        location: "Main Campus",
        claimAmount: 14500,
        deniedAmount: 14500,
        denialCategory: "Prior Authorization",
        denialReason: "CO-197: Precertification/authorization absent",
        appealStatus: "under_review",
        daysSinceDenial: 5,
        denialDate: "2026-07-24",
      },
      {
        id: "CLM-9042",
        claimNumber: "CLM-2026-9042",
        patient: "Robert Chen",
        provider: "Dr. Marcus Thorne",
        payor: "Medicare",
        practice: "North Orthopedics",
        specialty: "Orthopedic Surgery",
        location: "North Annex",
        claimAmount: 28400,
        deniedAmount: 28400,
        denialCategory: "Clinical Necessity",
        denialReason: "CO-50: Not deemed medical necessity",
        appealStatus: "appealed",
        daysSinceDenial: 12,
        denialDate: "2026-07-17",
      },
      {
        id: "CLM-9043",
        claimNumber: "CLM-2026-9043",
        patient: "Maria Garcia",
        provider: "Dr. Sophia Patel",
        payor: "Aetna",
        practice: "Ambulatory Care Group",
        specialty: "Neurology",
        location: "Ambulatory Suite",
        claimAmount: 8900,
        deniedAmount: 8900,
        denialCategory: "Eligibility & Coverage",
        denialReason: "CO-27: Coverage terminated prior to service date",
        appealStatus: "not_appealed",
        daysSinceDenial: 18,
        denialDate: "2026-07-11",
      },
      {
        id: "CLM-9044",
        claimNumber: "CLM-2026-9044",
        patient: "James Wilson",
        provider: "Dr. Liam O'Connor",
        payor: "UnitedHealthcare",
        practice: "Satellite Care Center",
        specialty: "Gastroenterology",
        location: "Satellite Lab",
        claimAmount: 6200,
        deniedAmount: 6200,
        denialCategory: "Technical / Timely Filing",
        denialReason: "CO-16: Lacks information needed for adjudication",
        appealStatus: "recovered",
        daysSinceDenial: 25,
        denialDate: "2026-07-04",
      },
      {
        id: "CLM-9045",
        claimNumber: "CLM-2026-9045",
        patient: "Emily Davis",
        provider: "Dr. Eleanor Vance",
        payor: "Humana",
        practice: "Main Campus Clinic",
        specialty: "Cardiology",
        location: "Main Campus",
        claimAmount: 11800,
        deniedAmount: 11800,
        denialCategory: "Coding & Documentation",
        denialReason: "CO-97: Included in payment for another service",
        appealStatus: "written_off",
        daysSinceDenial: 42,
        denialDate: "2026-06-17",
      },
      {
        id: "CLM-9046",
        claimNumber: "CLM-2026-9046",
        patient: "David Miller",
        provider: "Dr. Marcus Thorne",
        payor: "Cigna",
        practice: "North Orthopedics",
        specialty: "Orthopedic Surgery",
        location: "North Annex",
        claimAmount: 32000,
        deniedAmount: 32000,
        denialCategory: "Prior Authorization",
        denialReason: "CO-197: Precertification/authorization absent",
        appealStatus: "under_review",
        daysSinceDenial: 8,
        denialDate: "2026-07-21",
      },
      {
        id: "CLM-9047",
        claimNumber: "CLM-2026-9047",
        patient: "Jennifer Taylor",
        provider: "Dr. Sophia Patel",
        payor: "Blue Cross Blue Shield",
        practice: "Ambulatory Care Group",
        specialty: "Neurology",
        location: "Ambulatory Suite",
        claimAmount: 5400,
        deniedAmount: 5400,
        denialCategory: "Technical / Timely Filing",
        denialReason: "CO-29: Filing time limit expired",
        appealStatus: "not_appealed",
        daysSinceDenial: 30,
        denialDate: "2026-06-29",
      },
      {
        id: "CLM-9048",
        claimNumber: "CLM-2026-9048",
        patient: "Alexander White",
        provider: "Dr. Liam O'Connor",
        payor: "Medicare",
        practice: "Satellite Care Center",
        specialty: "Gastroenterology",
        location: "Satellite Lab",
        claimAmount: 19200,
        deniedAmount: 19200,
        denialCategory: "Prior Authorization",
        denialReason: "CO-197: Precertification/authorization absent",
        appealStatus: "recovered",
        daysSinceDenial: 14,
        denialDate: "2026-07-15",
      },
    ],
    aiInsights: [
      {
        id: "ai-1",
        headline: "High-Yield Prior Auth Recovery for BCBS Cardiology Claims",
        body: "BCBS prior-authorization denials (CO-197) spiked 14% over the last 30 days, creating $480,000 in at-risk revenue. 82% of these claims possess valid clinical pre-notes.",
        recommendation: "Deploy automated pre-authorization verification for CPT codes 93458 and 93459 in Cardiology to prevent ~$140k/month in future initial denials.",
        category: "Authorization",
        estimatedImpact: 140000,
        confidence: 94,
        actionType: "pre_auth",
      },
      {
        id: "ai-2",
        headline: "Expedite Appeals for Technical Info Deficiencies (CO-16)",
        body: "Claims denied under CO-16 have a 91% historical recovery rate with average turn-around of only 3 days when supplemental charts are attached immediately.",
        recommendation: "Enable auto-attachment rule in billing queue to submit clinical notes automatically upon initial CO-16 denial notice.",
        category: "Technical",
        estimatedImpact: 98000,
        confidence: 89,
        actionType: "workflow",
      },
      {
        id: "ai-3",
        headline: "Audit Timely Filing Risk for Orthopedic Claims",
        body: "CO-29 (Timely Filing) denials increased to $140,000. 12 claims are within 5 days of absolute appeal deadline.",
        recommendation: "Prioritize 12 aging orthopedic claims for rapid filing override before final deadline expiration.",
        category: "Timely Filing",
        estimatedImpact: 65000,
        confidence: 91,
        actionType: "payer_appeal",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
