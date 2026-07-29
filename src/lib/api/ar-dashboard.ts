import type { RevenueKpi } from "./revenue-dashboard";
import type { ClaimStatus } from "./types";

/**
 * Reference dataset for the Accounts Receivable Dashboard.
 *
 * Mirrors the shape a future `/metrics/ar-dashboard` endpoint should return so
 * wiring a real API is a one-line change in `src/lib/api/client.ts`.
 */

export type ArKpi = RevenueKpi;

export interface ArAgingCard {
  id: string;
  bucket: string;
  amount: number;
  claims: number;
  sharePct: number;
  deltaPct: number;
  trend: "up" | "down" | "flat";
  tone: "healthy" | "watch" | "risk";
}

export interface ArTrendPointExtended {
  month: string;
  ar: number;
  insuranceAr: number;
  patientAr: number;
  daysInAr: number;
  outstandingClaims: number;
}

export interface ArByDimension {
  id: string;
  name: string;
  ar: number;
  meta?: string;
}

export interface DenialReasonRow {
  id: string;
  code: string;
  reason: string;
  denials: number;
  amount: number;
  recoverablePct: number;
}

export interface DenialByDimension {
  id: string;
  name: string;
  denials: number;
  amount: number;
  denialRate: number;
}

export interface DenialTrendPoint {
  month: string;
  denials: number;
  denialRate: number;
  overturned: number;
}

export interface OutstandingClaimRow {
  id: string;
  patient: string;
  provider: string;
  insurance: string;
  dos: string;
  arDays: number;
  outstanding: number;
  status: ClaimStatus;
}

export interface InsuranceArRow {
  id: string;
  insurance: string;
  ar: number;
  claims: number;
  avgDays: number;
  denialPct: number;
}

export interface ProviderArRow {
  id: string;
  provider: string;
  charges: number;
  collections: number;
  outstanding: number;
  avgDays: number;
}

export interface ArActionItem {
  id: string;
  primary: string;
  secondary: string;
  value: number;
  format: "currency" | "number" | "days";
  severity: "critical" | "warning" | "info";
}

export interface ArActionGroup {
  id: string;
  title: string;
  subtitle: string;
  drillPath: string;
  items: ArActionItem[];
}

export interface ArDashboard {
  kpis: ArKpi[];
  aging: ArAgingCard[];
  trend: ArTrendPointExtended[];
  byInsurance: ArByDimension[];
  byProvider: ArByDimension[];
  byFacility: ArByDimension[];
  byCpt: ArByDimension[];
  denialReasons: DenialReasonRow[];
  denialsByInsurance: DenialByDimension[];
  denialsByProvider: DenialByDimension[];
  denialsByCpt: DenialByDimension[];
  denialTrend: DenialTrendPoint[];
  outstandingClaims: OutstandingClaimRow[];
  insuranceAr: InsuranceArRow[];
  providerAr: ProviderArRow[];
  actions: ArActionGroup[];
  lastRefreshedAt: string;
  source: string;
}

const MONTHS = [
  "Aug 25",
  "Sep 25",
  "Oct 25",
  "Nov 25",
  "Dec 25",
  "Jan 26",
  "Feb 26",
  "Mar 26",
  "Apr 26",
  "May 26",
  "Jun 26",
  "Jul 26",
];

const kpis: ArKpi[] = [
  {
    id: "current-ar",
    label: "Current AR",
    value: 14_820_000,
    format: "currency",
    deltaPct: -3.4,
    trend: "down",
    helper: "Total outstanding receivable balance",
    previousValue: 15_342_000,
    previousLabel: "Jun 2026",
    sparkline: [15.9, 15.7, 15.6, 15.5, 15.4, 15.6, 15.5, 15.3, 15.2, 15.1, 15.34, 14.82].map(
      (v) => v * 1_000_000,
    ),
    tooltip:
      "Sum of all unpaid insurance and patient balances across every practice and facility as of the last posting run.",
    drillPath: "/financial-analytics",
    drillHint: "Breaks AR down by insurance, provider, patient and claim.",
  },
  {
    id: "days-in-ar",
    label: "Days in AR",
    value: 38.4,
    format: "days",
    deltaPct: -5.2,
    trend: "down",
    helper: "Rolling 90-day charge based calculation",
    previousValue: 40.5,
    previousLabel: "Jun 2026",
    sparkline: [45.1, 44.6, 43.8, 43.2, 42.6, 42.0, 41.7, 41.2, 40.9, 40.7, 40.5, 38.4],
    tooltip: "Ending AR divided by average daily charges over the trailing 90 days.",
    drillPath: "/kpi-dashboard",
    drillHint: "Days in AR by payer class and service line.",
  },
  {
    id: "avg-ar-days",
    label: "Average AR days",
    value: 42.7,
    format: "days",
    deltaPct: -2.1,
    trend: "down",
    helper: "Weighted average age of open claims",
    previousValue: 43.6,
    previousLabel: "Jun 2026",
    sparkline: [48.2, 47.6, 47.1, 46.4, 45.8, 45.3, 44.9, 44.5, 44.1, 43.9, 43.6, 42.7],
    tooltip: "Dollar-weighted average age of every open claim in the receivable.",
    drillPath: "/claims",
    drillHint: "Average age by aging bucket and payer.",
  },
  {
    id: "patient-ar",
    label: "Patient AR",
    value: 2_460_000,
    format: "currency",
    deltaPct: 4.8,
    trend: "up",
    helper: "Self-pay and post-adjudication balances",
    previousValue: 2_347_000,
    previousLabel: "Jun 2026",
    sparkline: [2.05, 2.09, 2.12, 2.17, 2.2, 2.24, 2.26, 2.28, 2.31, 2.33, 2.35, 2.46].map(
      (v) => v * 1_000_000,
    ),
    tooltip: "Balances that are the patient's responsibility after payer adjudication.",
    drillPath: "/patients",
    drillHint: "Patient balances by statement cycle and risk band.",
  },
  {
    id: "insurance-ar",
    label: "Insurance AR",
    value: 12_360_000,
    format: "currency",
    deltaPct: -4.8,
    trend: "down",
    helper: "Open payer balances awaiting adjudication",
    previousValue: 12_995_000,
    previousLabel: "Jun 2026",
    sparkline: [13.8, 13.6, 13.5, 13.3, 13.2, 13.4, 13.3, 13.1, 13.0, 12.9, 13.0, 12.36].map(
      (v) => v * 1_000_000,
    ),
    tooltip: "Outstanding balances still assigned to a primary, secondary or tertiary payer.",
    drillPath: "/payers",
    drillHint: "Insurance AR by payer, plan and aging bucket.",
  },
  {
    id: "outstanding-claims",
    label: "Outstanding claims",
    value: 18_942,
    format: "number",
    deltaPct: -2.6,
    trend: "down",
    helper: "Open claims with a remaining balance",
    previousValue: 19_448,
    previousLabel: "Jun 2026",
    sparkline: [
      21_100, 20_860, 20_640, 20_410, 20_180, 20_020, 19_880, 19_720, 19_610, 19_520, 19_448,
      18_942,
    ],
    tooltip: "Count of claims with any unpaid balance, including partially paid claims.",
    drillPath: "/claims",
    drillHint: "Claim workqueue filtered to open balances.",
  },
  {
    id: "outstanding-balance",
    label: "Outstanding balance",
    value: 9_640_000,
    format: "currency",
    deltaPct: -1.9,
    trend: "down",
    helper: "Expected reimbursement still collectible",
    previousValue: 9_827_000,
    previousLabel: "Jun 2026",
    sparkline: [10.6, 10.5, 10.4, 10.3, 10.2, 10.1, 10.05, 9.98, 9.92, 9.88, 9.83, 9.64].map(
      (v) => v * 1_000_000,
    ),
    tooltip: "Net expected value of open AR after contractual allowances and write-off reserves.",
    drillPath: "/revenue",
    drillHint: "Expected value modelling by contract and payer.",
  },
  {
    id: "collection-efficiency",
    label: "Collection efficiency",
    value: 96.4,
    format: "percent",
    deltaPct: 1.3,
    trend: "up",
    helper: "Net collections over net collectible revenue",
    previousValue: 95.2,
    previousLabel: "Jun 2026",
    sparkline: [93.1, 93.5, 93.8, 94.1, 94.4, 94.6, 94.8, 95.0, 95.1, 95.1, 95.2, 96.4],
    tooltip: "Net collection rate: cash collected divided by net collectible revenue.",
    drillPath: "/collections",
    drillHint: "Efficiency by payer, provider and posting period.",
  },
];

const aging: ArAgingCard[] = [
  {
    id: "0-30",
    bucket: "0–30",
    amount: 6_410_000,
    claims: 8_120,
    sharePct: 43.3,
    deltaPct: 2.4,
    trend: "up",
    tone: "healthy",
  },
  {
    id: "31-60",
    bucket: "31–60",
    amount: 3_180_000,
    claims: 4_060,
    sharePct: 21.5,
    deltaPct: -1.8,
    trend: "down",
    tone: "healthy",
  },
  {
    id: "61-90",
    bucket: "61–90",
    amount: 1_940_000,
    claims: 2_410,
    sharePct: 13.1,
    deltaPct: -3.2,
    trend: "down",
    tone: "watch",
  },
  {
    id: "91-120",
    bucket: "91–120",
    amount: 1_260_000,
    claims: 1_580,
    sharePct: 8.5,
    deltaPct: 1.1,
    trend: "up",
    tone: "watch",
  },
  {
    id: "121-180",
    bucket: "121–180",
    amount: 940_000,
    claims: 1_190,
    sharePct: 6.3,
    deltaPct: 4.6,
    trend: "up",
    tone: "risk",
  },
  {
    id: "181-360",
    bucket: "181–360",
    amount: 710_000,
    claims: 1_040,
    sharePct: 4.8,
    deltaPct: -2.2,
    trend: "down",
    tone: "risk",
  },
  {
    id: "365-plus",
    bucket: "365+",
    amount: 380_000,
    claims: 542,
    sharePct: 2.5,
    deltaPct: 6.9,
    trend: "up",
    tone: "risk",
  },
];

const trend: ArTrendPointExtended[] = MONTHS.map((month, index) => {
  const ar = 15_900_000 - index * 95_000 + (index % 3) * 120_000;
  const patientAr = 2_050_000 + index * 34_000;
  return {
    month,
    ar,
    insuranceAr: ar - patientAr,
    patientAr,
    daysInAr: Number((45.1 - index * 0.55 + (index % 2 ? 0.2 : 0)).toFixed(1)),
    outstandingClaims: 21_100 - index * 180 - (index % 4) * 40,
  };
});

const byInsurance: ArByDimension[] = [
  { id: "bcbs", name: "Blue Cross Blue Shield", ar: 3_420_000, meta: "4,180 claims" },
  { id: "medicare", name: "Medicare", ar: 2_910_000, meta: "3,640 claims" },
  { id: "united", name: "UnitedHealthcare", ar: 2_140_000, meta: "2,510 claims" },
  { id: "aetna", name: "Aetna", ar: 1_580_000, meta: "1,920 claims" },
  { id: "cigna", name: "Cigna", ar: 1_190_000, meta: "1,480 claims" },
  { id: "medicaid", name: "Medicaid", ar: 1_120_000, meta: "2,240 claims" },
  { id: "humana", name: "Humana", ar: 810_000, meta: "1,010 claims" },
  { id: "selfpay", name: "Self-pay", ar: 1_650_000, meta: "1,962 accounts" },
];

const byProvider: ArByDimension[] = [
  { id: "p1", name: "Dr. Amara Osei", ar: 1_640_000, meta: "Cardiology" },
  { id: "p2", name: "Dr. Daniel Reyes", ar: 1_410_000, meta: "Orthopedics" },
  { id: "p3", name: "Dr. Priya Raman", ar: 1_280_000, meta: "Internal medicine" },
  { id: "p4", name: "Dr. Helen Whitmore", ar: 1_120_000, meta: "Oncology" },
  { id: "p5", name: "Dr. Marcus Feld", ar: 980_000, meta: "Gastroenterology" },
  { id: "p6", name: "Dr. Sofia Marchetti", ar: 870_000, meta: "Neurology" },
  { id: "p7", name: "Dr. Ken Tanaka", ar: 760_000, meta: "Pulmonology" },
  { id: "p8", name: "Dr. Nina Alvarez", ar: 690_000, meta: "Endocrinology" },
];

const byFacility: ArByDimension[] = [
  { id: "f1", name: "Riverside Health Group", ar: 4_120_000, meta: "3 locations" },
  { id: "f2", name: "Northside Medical Center", ar: 3_460_000, meta: "2 locations" },
  { id: "f3", name: "Lakeview Surgical", ar: 2_780_000, meta: "ASC" },
  { id: "f4", name: "Harbor Point Clinic", ar: 2_140_000, meta: "Multi-specialty" },
  { id: "f5", name: "Summit Family Practice", ar: 1_420_000, meta: "Primary care" },
  { id: "f6", name: "Cedar Grove Imaging", ar: 900_000, meta: "Diagnostics" },
];

const byCpt: ArByDimension[] = [
  { id: "99214", name: "99214 · Office visit, level 4", ar: 1_280_000, meta: "6,420 units" },
  { id: "99213", name: "99213 · Office visit, level 3", ar: 1_040_000, meta: "7,180 units" },
  { id: "93000", name: "93000 · Electrocardiogram", ar: 820_000, meta: "3,110 units" },
  { id: "70553", name: "70553 · MRI brain w/ + w/o", ar: 760_000, meta: "640 units" },
  { id: "45378", name: "45378 · Colonoscopy, diagnostic", ar: 690_000, meta: "820 units" },
  { id: "27447", name: "27447 · Total knee arthroplasty", ar: 640_000, meta: "180 units" },
  { id: "96413", name: "96413 · Chemotherapy infusion", ar: 580_000, meta: "1,240 units" },
  { id: "80053", name: "80053 · Metabolic panel", ar: 410_000, meta: "9,320 units" },
];

const denialReasons: DenialReasonRow[] = [
  {
    id: "co-97",
    code: "CO-97",
    reason: "Service bundled into another procedure",
    denials: 1_284,
    amount: 742_000,
    recoverablePct: 38,
  },
  {
    id: "co-16",
    code: "CO-16",
    reason: "Missing or invalid information",
    denials: 1_142,
    amount: 618_000,
    recoverablePct: 74,
  },
  {
    id: "co-197",
    code: "CO-197",
    reason: "Precertification / authorization absent",
    denials: 986,
    amount: 894_000,
    recoverablePct: 52,
  },
  {
    id: "co-45",
    code: "CO-45",
    reason: "Charge exceeds fee schedule",
    denials: 874,
    amount: 386_000,
    recoverablePct: 12,
  },
  {
    id: "co-29",
    code: "CO-29",
    reason: "Timely filing limit expired",
    denials: 742,
    amount: 512_000,
    recoverablePct: 9,
  },
  {
    id: "co-109",
    code: "CO-109",
    reason: "Not covered by this payer",
    denials: 668,
    amount: 341_000,
    recoverablePct: 44,
  },
  {
    id: "co-11",
    code: "CO-11",
    reason: "Diagnosis inconsistent with procedure",
    denials: 604,
    amount: 296_000,
    recoverablePct: 61,
  },
  {
    id: "co-18",
    code: "CO-18",
    reason: "Duplicate claim or service",
    denials: 548,
    amount: 214_000,
    recoverablePct: 22,
  },
  {
    id: "pr-204",
    code: "PR-204",
    reason: "Service not covered under plan",
    denials: 421,
    amount: 188_000,
    recoverablePct: 18,
  },
  {
    id: "co-27",
    code: "CO-27",
    reason: "Coverage terminated at date of service",
    denials: 368,
    amount: 164_000,
    recoverablePct: 31,
  },
];

const denialsByInsurance: DenialByDimension[] = [
  { id: "bcbs", name: "Blue Cross Blue Shield", denials: 1_620, amount: 842_000, denialRate: 7.4 },
  { id: "united", name: "UnitedHealthcare", denials: 1_410, amount: 764_000, denialRate: 9.1 },
  { id: "medicare", name: "Medicare", denials: 1_180, amount: 512_000, denialRate: 4.8 },
  { id: "aetna", name: "Aetna", denials: 940, amount: 468_000, denialRate: 8.2 },
  { id: "cigna", name: "Cigna", denials: 780, amount: 392_000, denialRate: 8.9 },
  { id: "medicaid", name: "Medicaid", denials: 690, amount: 214_000, denialRate: 6.1 },
  { id: "humana", name: "Humana", denials: 520, amount: 186_000, denialRate: 7.8 },
];

const denialsByProvider: DenialByDimension[] = [
  { id: "p1", name: "Dr. Amara Osei", denials: 412, amount: 214_000, denialRate: 6.2 },
  { id: "p2", name: "Dr. Daniel Reyes", denials: 386, amount: 246_000, denialRate: 8.4 },
  { id: "p3", name: "Dr. Priya Raman", denials: 341, amount: 162_000, denialRate: 5.1 },
  { id: "p4", name: "Dr. Helen Whitmore", denials: 318, amount: 208_000, denialRate: 9.6 },
  { id: "p5", name: "Dr. Marcus Feld", denials: 264, amount: 138_000, denialRate: 6.8 },
  { id: "p6", name: "Dr. Sofia Marchetti", denials: 221, amount: 118_000, denialRate: 5.9 },
];

const denialsByCpt: DenialByDimension[] = [
  { id: "70553", name: "70553 · MRI brain", denials: 384, amount: 268_000, denialRate: 14.2 },
  { id: "27447", name: "27447 · Knee arthroplasty", denials: 264, amount: 312_000, denialRate: 11.8 },
  { id: "96413", name: "96413 · Chemo infusion", denials: 246, amount: 196_000, denialRate: 9.4 },
  { id: "45378", name: "45378 · Colonoscopy", denials: 218, amount: 142_000, denialRate: 8.1 },
  { id: "99214", name: "99214 · Office visit L4", denials: 194, amount: 86_000, denialRate: 3.6 },
  { id: "93000", name: "93000 · ECG", denials: 152, amount: 48_000, denialRate: 4.2 },
];

const denialTrend: DenialTrendPoint[] = MONTHS.map((month, index) => ({
  month,
  denials: 1_020 - index * 18 + (index % 3) * 42,
  denialRate: Number((8.9 - index * 0.16 + (index % 2 ? 0.12 : 0)).toFixed(2)),
  overturned: 480 + index * 22 - (index % 4) * 18,
}));

const outstandingClaims: OutstandingClaimRow[] = [
  { id: "CLM-884210", patient: "R. Delgado", provider: "Dr. Amara Osei", insurance: "Blue Cross Blue Shield", dos: "2026-02-11", arDays: 167, outstanding: 18_420, status: "appealed" },
  { id: "CLM-884377", patient: "M. Okafor", provider: "Dr. Daniel Reyes", insurance: "UnitedHealthcare", dos: "2026-03-04", arDays: 146, outstanding: 24_180, status: "denied" },
  { id: "CLM-884512", patient: "J. Whitfield", provider: "Dr. Helen Whitmore", insurance: "Medicare", dos: "2026-04-18", arDays: 101, outstanding: 12_640, status: "pending" },
  { id: "CLM-884690", patient: "S. Nakamura", provider: "Dr. Priya Raman", insurance: "Aetna", dos: "2026-05-02", arDays: 87, outstanding: 9_310, status: "submitted" },
  { id: "CLM-884733", patient: "A. Boateng", provider: "Dr. Marcus Feld", insurance: "Cigna", dos: "2026-05-19", arDays: 70, outstanding: 7_880, status: "pending" },
  { id: "CLM-884812", patient: "L. Fontaine", provider: "Dr. Sofia Marchetti", insurance: "Medicaid", dos: "2026-05-28", arDays: 61, outstanding: 4_240, status: "denied" },
  { id: "CLM-884944", patient: "T. Alvarez", provider: "Dr. Ken Tanaka", insurance: "Humana", dos: "2026-06-06", arDays: 52, outstanding: 6_120, status: "submitted" },
  { id: "CLM-885021", patient: "K. Mbeki", provider: "Dr. Nina Alvarez", insurance: "Blue Cross Blue Shield", dos: "2026-06-14", arDays: 44, outstanding: 3_760, status: "pending" },
  { id: "CLM-885188", patient: "D. Kowalski", provider: "Dr. Amara Osei", insurance: "Medicare", dos: "2026-06-22", arDays: 36, outstanding: 5_480, status: "submitted" },
  { id: "CLM-885240", patient: "P. Sundaram", provider: "Dr. Daniel Reyes", insurance: "UnitedHealthcare", dos: "2026-06-29", arDays: 29, outstanding: 11_950, status: "pending" },
  { id: "CLM-885361", patient: "H. Lindqvist", provider: "Dr. Priya Raman", insurance: "Aetna", dos: "2026-07-03", arDays: 25, outstanding: 2_910, status: "submitted" },
  { id: "CLM-885472", patient: "C. Baptiste", provider: "Dr. Helen Whitmore", insurance: "Cigna", dos: "2026-07-09", arDays: 19, outstanding: 8_640, status: "pending" },
  { id: "CLM-885519", patient: "G. Petrov", provider: "Dr. Marcus Feld", insurance: "Medicare", dos: "2026-07-12", arDays: 16, outstanding: 3_180, status: "submitted" },
  { id: "CLM-885604", patient: "E. Nakagawa", provider: "Dr. Ken Tanaka", insurance: "Self-pay", dos: "2026-07-16", arDays: 12, outstanding: 1_420, status: "pending" },
];

const insuranceAr: InsuranceArRow[] = [
  { id: "bcbs", insurance: "Blue Cross Blue Shield", ar: 3_420_000, claims: 4_180, avgDays: 34.2, denialPct: 7.4 },
  { id: "medicare", insurance: "Medicare", ar: 2_910_000, claims: 3_640, avgDays: 28.6, denialPct: 4.8 },
  { id: "united", insurance: "UnitedHealthcare", ar: 2_140_000, claims: 2_510, avgDays: 46.8, denialPct: 9.1 },
  { id: "selfpay", insurance: "Self-pay", ar: 1_650_000, claims: 1_962, avgDays: 68.4, denialPct: 0 },
  { id: "aetna", insurance: "Aetna", ar: 1_580_000, claims: 1_920, avgDays: 41.3, denialPct: 8.2 },
  { id: "cigna", insurance: "Cigna", ar: 1_190_000, claims: 1_480, avgDays: 44.1, denialPct: 8.9 },
  { id: "medicaid", insurance: "Medicaid", ar: 1_120_000, claims: 2_240, avgDays: 52.7, denialPct: 6.1 },
  { id: "humana", insurance: "Humana", ar: 810_000, claims: 1_010, avgDays: 39.5, denialPct: 7.8 },
];

const providerAr: ProviderArRow[] = [
  { id: "p1", provider: "Dr. Amara Osei", charges: 6_840_000, collections: 5_120_000, outstanding: 1_640_000, avgDays: 36.4 },
  { id: "p2", provider: "Dr. Daniel Reyes", charges: 6_120_000, collections: 4_540_000, outstanding: 1_410_000, avgDays: 43.8 },
  { id: "p3", provider: "Dr. Priya Raman", charges: 5_480_000, collections: 4_180_000, outstanding: 1_280_000, avgDays: 38.1 },
  { id: "p4", provider: "Dr. Helen Whitmore", charges: 5_010_000, collections: 3_760_000, outstanding: 1_120_000, avgDays: 47.2 },
  { id: "p5", provider: "Dr. Marcus Feld", charges: 4_260_000, collections: 3_240_000, outstanding: 980_000, avgDays: 40.6 },
  { id: "p6", provider: "Dr. Sofia Marchetti", charges: 3_880_000, collections: 2_960_000, outstanding: 870_000, avgDays: 35.9 },
  { id: "p7", provider: "Dr. Ken Tanaka", charges: 3_420_000, collections: 2_610_000, outstanding: 760_000, avgDays: 42.3 },
  { id: "p8", provider: "Dr. Nina Alvarez", charges: 3_010_000, collections: 2_290_000, outstanding: 690_000, avgDays: 37.7 },
];

const actions: ArActionGroup[] = [
  {
    id: "high-ar",
    title: "High AR accounts",
    subtitle: "Largest open balances by guarantor account",
    drillPath: "/patients",
    items: [
      { id: "acct-1", primary: "Riverside Health Group · ACC-90412", secondary: "42 open claims · UnitedHealthcare", value: 184_600, format: "currency", severity: "critical" },
      { id: "acct-2", primary: "M. Okafor · ACC-77210", secondary: "9 open claims · UnitedHealthcare", value: 96_400, format: "currency", severity: "critical" },
      { id: "acct-3", primary: "J. Whitfield · ACC-71988", secondary: "6 open claims · Medicare", value: 74_800, format: "currency", severity: "warning" },
      { id: "acct-4", primary: "K. Mbeki · ACC-68031", secondary: "11 open claims · Blue Cross Blue Shield", value: 61_200, format: "currency", severity: "warning" },
    ],
  },
  {
    id: "oldest-claims",
    title: "Oldest claims",
    subtitle: "Open claims with the highest AR age",
    drillPath: "/claims",
    items: [
      { id: "old-1", primary: "CLM-871004 · R. Delgado", secondary: "Blue Cross Blue Shield · appealed", value: 412, format: "days", severity: "critical" },
      { id: "old-2", primary: "CLM-872190 · S. Nakamura", secondary: "Aetna · denied", value: 368, format: "days", severity: "critical" },
      { id: "old-3", primary: "CLM-874661 · A. Boateng", secondary: "Cigna · pending", value: 311, format: "days", severity: "warning" },
      { id: "old-4", primary: "CLM-876820 · D. Kowalski", secondary: "Medicare · submitted", value: 264, format: "days", severity: "warning" },
    ],
  },
  {
    id: "timely-filing",
    title: "Nearing timely filing limit",
    subtitle: "Claims that must be filed or appealed within 30 days",
    drillPath: "/denials",
    items: [
      { id: "tf-1", primary: "UnitedHealthcare · 90-day limit", secondary: "68 claims · 7 days remaining", value: 214_800, format: "currency", severity: "critical" },
      { id: "tf-2", primary: "Aetna · 120-day limit", secondary: "41 claims · 12 days remaining", value: 138_400, format: "currency", severity: "critical" },
      { id: "tf-3", primary: "Cigna · 180-day limit", secondary: "34 claims · 21 days remaining", value: 96_200, format: "currency", severity: "warning" },
      { id: "tf-4", primary: "Medicare · 365-day limit", secondary: "22 claims · 28 days remaining", value: 54_900, format: "currency", severity: "info" },
    ],
  },
  {
    id: "high-risk",
    title: "High risk accounts",
    subtitle: "Balances with the lowest predicted recovery",
    drillPath: "/collections",
    items: [
      { id: "hr-1", primary: "Self-pay 181+ cohort", secondary: "612 accounts · 18% predicted recovery", value: 384_000, format: "currency", severity: "critical" },
      { id: "hr-2", primary: "Terminated coverage (CO-27)", secondary: "368 claims · eligibility gap at DOS", value: 164_000, format: "currency", severity: "warning" },
      { id: "hr-3", primary: "Timely filing denials (CO-29)", secondary: "742 claims · 9% recoverable", value: 512_000, format: "currency", severity: "warning" },
      { id: "hr-4", primary: "Bad debt referral candidates", secondary: "218 accounts · 3 statements sent", value: 128_600, format: "currency", severity: "info" },
    ],
  },
];

export const arDashboard: ArDashboard = {
  kpis,
  aging,
  trend,
  byInsurance,
  byProvider,
  byFacility,
  byCpt,
  denialReasons,
  denialsByInsurance,
  denialsByProvider,
  denialsByCpt,
  denialTrend,
  outstandingClaims,
  insuranceAr,
  providerAr,
  actions,
  lastRefreshedAt: "2026-07-28T06:40:00.000Z",
  source: "RCM data warehouse · nightly AR snapshot",
};
