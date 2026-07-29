import type { KpiMetric } from "./types";

export interface ProviderKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface ProviderRevenuePoint {
  id: string;
  providerName: string;
  revenue: number;
  encounters: number;
  collectionRate: number;
}

export interface MonthlyProviderCollectionsPoint {
  month: string;
  collections: number;
  target: number;
  charges: number;
}

export interface SpecialtyEncountersPoint {
  specialty: string;
  encounters: number;
  percentage: number;
  color: string;
}

export interface TopPerformingProviderPoint {
  providerName: string;
  charges: number;
  wrvu: number;
  wrvuTarget: number;
}

export interface ProductivityTrendPoint {
  month: string;
  wrvu: number;
  targetWrvu: number;
}

export interface ProviderPerformanceRow {
  id: string;
  providerName: string;
  npi: string;
  specialty: string;
  providerType: "Physician MD/DO" | "Nurse Practitioner NP" | "Physician Assistant PA" | "Specialist";
  practice: string;
  encounters: number;
  charges: number;
  collections: number;
  avgRevenuePerVisit: number;
  denialRate: number;
  collectionRate: number;
  outstandingAr: number;
  wrvu: number;
  wrvuTarget: number;
  avgDaysToBill: number;
}

export interface ProviderEncounterSummary {
  visitType: string;
  count: number;
  totalCharges: number;
  avgCharge: number;
}

export interface ProviderClaimRow {
  id: string;
  claimNumber: string;
  patient: string;
  serviceDate: string;
  billedAmount: number;
  paidAmount: number;
  status: "Paid" | "Pending" | "Denied" | "Appealed";
}

export interface ProviderDenialDetail {
  code: string;
  reason: string;
  category: string;
  count: number;
  amount: number;
  status: "Under Review" | "Resolved" | "Written Off";
}

export interface ProviderAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "Highest Revenue" | "Productivity Shift" | "High Denial Rate" | "Collection Efficiency" | "Provider Efficiency";
  estimatedImpact: number;
  confidence: number;
  providerName?: string;
  type: "positive" | "warning" | "critical" | "info";
}

export interface ProviderPerformanceDashboardData {
  kpis: {
    totalProviders: ProviderKpiMetric;
    totalEncounters: ProviderKpiMetric;
    totalCharges: ProviderKpiMetric;
    totalCollections: ProviderKpiMetric;
    avgRevenuePerProvider: ProviderKpiMetric;
    avgEncountersPerDay: ProviderKpiMetric;
    denialRate: ProviderKpiMetric;
    collectionEfficiency: ProviderKpiMetric;
  };
  revenueByProvider: ProviderRevenuePoint[];
  monthlyCollections: MonthlyProviderCollectionsPoint[];
  encountersBySpecialty: SpecialtyEncountersPoint[];
  topPerformingProviders: TopPerformingProviderPoint[];
  productivityTrend: ProductivityTrendPoint[];
  performanceRows: ProviderPerformanceRow[];
  aiInsights: ProviderAiInsight[];
  lastUpdated: string;
}

export function getMockProviderPerformanceDashboardData(): ProviderPerformanceDashboardData {
  return {
    kpis: {
      totalProviders: {
        id: "total-providers",
        label: "Total Providers",
        value: 42,
        previousValue: 40,
        format: "number",
        deltaPct: 5.0,
        trend: "up",
        helper: "42 active clinical providers",
      },
      totalEncounters: {
        id: "total-encounters",
        label: "Total Encounters",
        value: 8420,
        previousValue: 7950,
        format: "number",
        deltaPct: 5.9,
        trend: "up",
        helper: "+470 encounters vs prior period",
      },
      totalCharges: {
        id: "total-charges",
        label: "Total Charges",
        value: 12450000,
        previousValue: 11600000,
        format: "currency",
        deltaPct: 7.3,
        trend: "up",
        helper: "+$850k gross charges",
      },
      totalCollections: {
        id: "total-collections",
        label: "Total Collections",
        value: 11280000,
        previousValue: 10410000,
        format: "currency",
        deltaPct: 8.4,
        trend: "up",
        helper: "+$870k net collections",
      },
      avgRevenuePerProvider: {
        id: "avg-revenue-per-provider",
        label: "Avg Revenue per Provider",
        value: 268571,
        previousValue: 260250,
        format: "currency",
        deltaPct: 3.2,
        trend: "up",
        helper: "+$8.3k per provider average",
      },
      avgEncountersPerDay: {
        id: "avg-encounters-per-day",
        label: "Avg Encounters per Day",
        value: 18.5,
        previousValue: 17.2,
        format: "number",
        deltaPct: 7.6,
        trend: "up",
        target: 20.0,
        helper: "18.5 visits per provider / day",
      },
      denialRate: {
        id: "denial-rate",
        label: "Denial Rate",
        value: 4.6,
        previousValue: 5.4,
        format: "percent",
        deltaPct: -0.8,
        trend: "down",
        target: 4.0,
        helper: "0.8% reduction in claim denials",
      },
      collectionEfficiency: {
        id: "collection-efficiency",
        label: "Collection Efficiency",
        value: 94.8,
        previousValue: 92.5,
        format: "percent",
        deltaPct: 2.3,
        trend: "up",
        target: 95.0,
        helper: "+2.3% net collection ratio",
      },
    },
    revenueByProvider: [
      { id: "prv-1", providerName: "Dr. Eleanor Vance", revenue: 2850000, encounters: 1420, collectionRate: 97.2 },
      { id: "prv-2", providerName: "Dr. Marcus Thorne", revenue: 2420000, encounters: 1280, collectionRate: 95.8 },
      { id: "prv-3", providerName: "Dr. Sophia Patel", revenue: 1980000, encounters: 1150, collectionRate: 94.1 },
      { id: "prv-4", providerName: "Dr. Liam O'Connor", revenue: 1650000, encounters: 980, collectionRate: 96.0 },
      { id: "prv-5", providerName: "Dr. Rachel Green", revenue: 1320000, encounters: 890, collectionRate: 93.5 },
      { id: "prv-6", providerName: "Dr. Christopher Blake", revenue: 1060000, encounters: 700, collectionRate: 95.2 },
    ],
    monthlyCollections: [
      { month: "Jan", collections: 1750000, target: 1700000, charges: 1950000 },
      { month: "Feb", collections: 1820000, target: 1700000, charges: 2010000 },
      { month: "Mar", collections: 1940000, target: 1800000, charges: 2150000 },
      { month: "Apr", collections: 1880000, target: 1800000, charges: 2080000 },
      { month: "May", collections: 1920000, target: 1850000, charges: 2110000 },
      { month: "Jun", collections: 1970000, target: 1900000, charges: 2150000 },
    ],
    encountersBySpecialty: [
      { specialty: "Cardiology", encounters: 2840, percentage: 33.7, color: "var(--chart-1)" },
      { specialty: "Orthopedic Surgery", encounters: 2210, percentage: 26.2, color: "var(--chart-2)" },
      { specialty: "Neurology", encounters: 1650, percentage: 19.6, color: "var(--chart-3)" },
      { specialty: "Gastroenterology", encounters: 1120, percentage: 13.3, color: "var(--chart-4)" },
      { specialty: "Family Medicine", encounters: 600, percentage: 7.2, color: "var(--chart-5)" },
    ],
    topPerformingProviders: [
      { providerName: "Dr. Eleanor Vance", charges: 2980000, wrvu: 540, wrvuTarget: 480 },
      { providerName: "Dr. Marcus Thorne", charges: 2550000, wrvu: 490, wrvuTarget: 450 },
      { providerName: "Dr. Sophia Patel", charges: 2100000, wrvu: 440, wrvuTarget: 430 },
      { providerName: "Dr. Liam O'Connor", charges: 1720000, wrvu: 410, wrvuTarget: 400 },
      { providerName: "Dr. Rachel Green", charges: 1410000, wrvu: 380, wrvuTarget: 380 },
    ],
    productivityTrend: [
      { month: "Jan", wrvu: 430, targetWrvu: 420 },
      { month: "Feb", wrvu: 445, targetWrvu: 420 },
      { month: "Mar", wrvu: 468, targetWrvu: 430 },
      { month: "Apr", wrvu: 452, targetWrvu: 430 },
      { month: "May", wrvu: 465, targetWrvu: 440 },
      { month: "Jun", wrvu: 482, targetWrvu: 440 },
    ],
    performanceRows: [
      {
        id: "prv-1",
        providerName: "Dr. Eleanor Vance",
        npi: "1982736450",
        specialty: "Cardiology",
        providerType: "Physician MD/DO",
        practice: "Main Campus Clinic",
        encounters: 1420,
        charges: 2980000,
        collections: 2850000,
        avgRevenuePerVisit: 2007,
        denialRate: 3.2,
        collectionRate: 97.2,
        outstandingAr: 130000,
        wrvu: 540,
        wrvuTarget: 480,
        avgDaysToBill: 1.8,
      },
      {
        id: "prv-2",
        providerName: "Dr. Marcus Thorne",
        npi: "1873645092",
        specialty: "Orthopedic Surgery",
        providerType: "Physician MD/DO",
        practice: "North Orthopedics",
        encounters: 1280,
        charges: 2550000,
        collections: 2420000,
        avgRevenuePerVisit: 1890,
        denialRate: 4.1,
        collectionRate: 95.8,
        outstandingAr: 180000,
        wrvu: 490,
        wrvuTarget: 450,
        avgDaysToBill: 2.2,
      },
      {
        id: "prv-3",
        providerName: "Dr. Sophia Patel",
        npi: "1764509281",
        specialty: "Neurology",
        providerType: "Physician MD/DO",
        practice: "Ambulatory Care Group",
        encounters: 1150,
        charges: 2100000,
        collections: 1980000,
        avgRevenuePerVisit: 1721,
        denialRate: 6.8,
        collectionRate: 94.1,
        outstandingAr: 240000,
        wrvu: 440,
        wrvuTarget: 430,
        avgDaysToBill: 3.1,
      },
      {
        id: "prv-4",
        providerName: "Dr. Liam O'Connor",
        npi: "1654092817",
        specialty: "Gastroenterology",
        providerType: "Specialist",
        practice: "Satellite Care Center",
        encounters: 980,
        charges: 1720000,
        collections: 1650000,
        avgRevenuePerVisit: 1683,
        denialRate: 3.8,
        collectionRate: 96.0,
        outstandingAr: 110000,
        wrvu: 410,
        wrvuTarget: 400,
        avgDaysToBill: 2.0,
      },
      {
        id: "prv-5",
        providerName: "Dr. Rachel Green",
        npi: "1543081726",
        specialty: "Family Medicine",
        providerType: "Physician MD/DO",
        practice: "Main Campus Clinic",
        encounters: 890,
        charges: 1410000,
        collections: 1320000,
        avgRevenuePerVisit: 1483,
        denialRate: 5.2,
        collectionRate: 93.5,
        outstandingAr: 150000,
        wrvu: 380,
        wrvuTarget: 380,
        avgDaysToBill: 2.8,
      },
      {
        id: "prv-6",
        providerName: "Dr. Christopher Blake",
        npi: "1432070615",
        specialty: "Cardiology",
        providerType: "Nurse Practitioner NP",
        practice: "Main Campus Clinic",
        encounters: 700,
        charges: 1120000,
        collections: 1060000,
        avgRevenuePerVisit: 1514,
        denialRate: 3.5,
        collectionRate: 95.2,
        outstandingAr: 85000,
        wrvu: 340,
        wrvuTarget: 320,
        avgDaysToBill: 1.9,
      },
    ],
    aiInsights: [
      {
        id: "prv-ai-1",
        headline: "Dr. Eleanor Vance Generates $2.85M Net Revenue (112.5% of wRVU Target)",
        body: "Dr. Vance achieved an industry-leading 97.2% collection rate and 3.2% denial rate across 1,420 encounters, exceeding monthly wRVU targets by +60 units.",
        recommendation: "Document Dr. Vance's clinical documentation and coding workflow as a best-practice template for onboarding new cardiology providers.",
        category: "Highest Revenue",
        estimatedImpact: 240000,
        confidence: 97,
        providerName: "Dr. Eleanor Vance",
        type: "positive",
      },
      {
        id: "prv-ai-2",
        headline: "Dr. Marcus Thorne wRVU Productivity Increased +14.2% Quarter-over-Quarter",
        body: "Dr. Thorne performed 1,280 encounters with wRVU growing from 430 to 490 units following joint replacement block-schedule optimizations.",
        recommendation: "Maintain surgical suite block times in North Annex to sustain orthopedic encounter throughput.",
        category: "Productivity Shift",
        estimatedImpact: 175000,
        confidence: 94,
        providerName: "Dr. Marcus Thorne",
        type: "positive",
      },
      {
        id: "prv-ai-3",
        headline: "Dr. Sophia Patel Denial Rate Elevated at 6.8% ($240k AR Exposure)",
        body: "Neurology claims for Dr. Patel exhibit a 6.8% denial rate, primarily caused by CO-197 (missing pre-authorization for MRI diagnostics).",
        recommendation: "Enable pre-submission chart audit rule for Dr. Patel's neurology MRI pre-authorization attachments to reduce initial denials by ~$85k/mo.",
        category: "High Denial Rate",
        estimatedImpact: 85000,
        confidence: 91,
        providerName: "Dr. Sophia Patel",
        type: "critical",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockProviderDetails(providerId: string) {
  const encounterSummaries: ProviderEncounterSummary[] = [
    { visitType: "Level 4 Established Evaluation (99214)", count: 480, totalCharges: 168000, avgCharge: 350 },
    { visitType: "Comprehensive Initial Consultation (99205)", count: 240, totalCharges: 124800, avgCharge: 520 },
    { visitType: "Echocardiogram Diagnostic (93306)", count: 320, totalCharges: 592000, avgCharge: 1850 },
    { visitType: "Cardiac Catheterization (93458)", count: 180, totalCharges: 1260000, avgCharge: 7000 },
  ];

  const claimsHistory: ProviderClaimRow[] = [
    { id: "clm-p1", claimNumber: "CLM-2026-9041", patient: "Sarah Jenkins", serviceDate: "2026-07-24", billedAmount: 14500, paidAmount: 14500, status: "Paid" },
    { id: "clm-p2", claimNumber: "CLM-2026-9045", patient: "Emily Davis", serviceDate: "2026-07-11", billedAmount: 11800, paidAmount: 11800, status: "Paid" },
    { id: "clm-p3", claimNumber: "CLM-2026-9088", patient: "Arthur Dent", serviceDate: "2026-07-08", billedAmount: 8400, paidAmount: 0, status: "Denied" },
  ];

  const denialDetails: ProviderDenialDetail[] = [
    { code: "CO-197", reason: "Precertification/authorization absent", category: "Authorization", count: 18, amount: 84000, status: "Under Review" },
    { code: "CO-16", reason: "Lacks information needed for adjudication", category: "Technical", count: 12, amount: 32000, status: "Resolved" },
  ];

  return { encounterSummaries, claimsHistory, denialDetails };
}
