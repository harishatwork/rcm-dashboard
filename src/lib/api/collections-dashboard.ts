import type { RevenueKpi } from "./revenue-dashboard";

/**
 * Reference dataset for the Collections Dashboard.
 *
 * Mirrors the shape a future `/metrics/collections-dashboard` endpoint should
 * return so wiring a real API is a one-line change in `src/lib/api/client.ts`.
 */

export type CollectionsKpi = RevenueKpi;

export interface CollectionsTrendPoint {
  month: string;
  collections: number;
  insurance: number;
  patient: number;
  target: number;
}

export interface DailyCollectionsPoint {
  /** ISO date. */
  date: string;
  label: string;
  collections: number;
  rollingAvg: number;
}

export interface MonthlyComparisonPoint {
  month: string;
  currentYear: number;
  priorYear: number;
}

export interface CollectionsByDimension {
  id: string;
  name: string;
  collections: number;
  meta?: string;
}

export interface PaymentMethodSlice {
  id: string;
  method: string;
  amount: number;
  transactions: number;
}

export interface CashFlowForecastPoint {
  month: string;
  actual: number | null;
  forecast: number;
  low: number;
  high: number;
}

export interface CollectionsBreakdownRow {
  id: string;
  name: string;
  collections: number;
  sharePct: number;
  deltaPct: number;
}

export interface CollectionsBreakdownGroup {
  id: string;
  title: string;
  subtitle: string;
  drillPath: string;
  rows: CollectionsBreakdownRow[];
}

export interface ProviderCollectionsRow {
  id: string;
  provider: string;
  specialty: string;
  claims: number;
  collections: number;
  avgPayment: number;
  collectionPct: number;
  outstandingBalance: number;
}

export interface InsuranceCollectionsRow {
  id: string;
  insurance: string;
  claims: number;
  collections: number;
  avgDays: number;
  denials: number;
  outstanding: number;
}

export type PaymentStatus = "posted" | "pending" | "reconciled" | "rejected";

export interface RecentPaymentRow {
  id: string;
  paymentDate: string;
  patient: string;
  insurance: string;
  method: "EFT" | "Check" | "Credit card" | "Virtual card" | "Patient portal";
  amount: number;
  eraNumber: string;
  status: PaymentStatus;
}

export interface CollectionsInsight {
  id: string;
  label: string;
  name: string;
  value: number;
  format: "currency" | "number" | "percent" | "days";
  helper: string;
  tone: "positive" | "negative" | "neutral";
  drillPath: string;
}

export interface CollectionsDashboard {
  kpis: CollectionsKpi[];
  trend: CollectionsTrendPoint[];
  daily: DailyCollectionsPoint[];
  monthlyComparison: MonthlyComparisonPoint[];
  byProvider: CollectionsByDimension[];
  byPayer: CollectionsByDimension[];
  byFacility: CollectionsByDimension[];
  byCpt: CollectionsByDimension[];
  paymentMethods: PaymentMethodSlice[];
  cashFlowForecast: CashFlowForecastPoint[];
  breakdown: CollectionsBreakdownGroup[];
  providerRows: ProviderCollectionsRow[];
  insuranceRows: InsuranceCollectionsRow[];
  recentPayments: RecentPaymentRow[];
  insights: CollectionsInsight[];
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

const kpis: CollectionsKpi[] = [
  {
    id: "total-collections",
    label: "Total Collections",
    value: 2_864_500,
    format: "currency",
    deltaPct: 6.4,
    trend: "up",
    helper: "All cash posted in the period",
    previousValue: 2_692_100,
    previousLabel: "Jun 2026",
    sparkline: [2340, 2410, 2380, 2465, 2520, 2488, 2570, 2611, 2648, 2705, 2692, 2864],
    tooltip: "Total cash posted from insurance remittances and patient payments across all facilities.",
    drillPath: "/financial-analytics",
    drillHint: "Cash posting detail by batch, deposit date and remittance source.",
  },
  {
    id: "insurance-collections",
    label: "Insurance Collections",
    value: 2_398_700,
    format: "currency",
    deltaPct: 5.8,
    trend: "up",
    helper: "Payer remittances posted",
    previousValue: 2_267_400,
    previousLabel: "Jun 2026",
    sparkline: [1960, 2020, 1998, 2064, 2118, 2090, 2156, 2192, 2224, 2270, 2267, 2398],
    tooltip: "Payments received from commercial, government and managed-care payers.",
    drillPath: "/payers",
    drillHint: "Insurance cash detail by payer, plan and remittance batch.",
  },
  {
    id: "patient-collections",
    label: "Patient Collections",
    value: 465_800,
    format: "currency",
    deltaPct: 9.7,
    trend: "up",
    helper: "Self-pay and residual balances",
    previousValue: 424_700,
    previousLabel: "Jun 2026",
    sparkline: [380, 390, 382, 401, 402, 398, 414, 419, 424, 435, 424, 465],
    tooltip: "Copay, coinsurance, deductible and self-pay cash collected from patients.",
    drillPath: "/patients",
    drillHint: "Patient cash detail by statement cycle, plan and payment channel.",
  },
  {
    id: "collection-rate",
    label: "Collection Rate",
    value: 94.6,
    format: "percent",
    deltaPct: 1.2,
    trend: "up",
    helper: "Cash collected vs. expected",
    previousValue: 93.5,
    previousLabel: "Jun 2026",
    sparkline: [91.2, 91.8, 91.4, 92.1, 92.6, 92.3, 93, 93.2, 93.4, 93.8, 93.5, 94.6],
    tooltip: "Cash collected divided by expected reimbursement based on contracted allowables.",
    drillPath: "/financial-analytics",
    drillHint: "Collection rate variance by payer contract and service line.",
  },
  {
    id: "gross-collection-rate",
    label: "Gross Collection Rate",
    value: 41.8,
    format: "percent",
    deltaPct: -0.6,
    trend: "down",
    helper: "Collections / gross charges",
    previousValue: 42.1,
    previousLabel: "Jun 2026",
    sparkline: [43.4, 43.1, 42.8, 42.9, 42.6, 42.4, 42.5, 42.3, 42.2, 42.4, 42.1, 41.8],
    tooltip: "Total collections divided by gross charges. Moves with the payer and fee-schedule mix.",
    drillPath: "/revenue",
    drillHint: "Gross collection rate by fee schedule, payer and specialty.",
  },
  {
    id: "net-collection-rate",
    label: "Net Collection Rate",
    value: 97.1,
    format: "percent",
    deltaPct: 0.8,
    trend: "up",
    helper: "Collections / allowed amount",
    previousValue: 96.3,
    previousLabel: "Jun 2026",
    sparkline: [95, 95.3, 95.1, 95.6, 95.9, 95.7, 96, 96.1, 96.2, 96.5, 96.3, 97.1],
    tooltip: "Collections divided by allowed amount net of contractual adjustments — the truest yield measure.",
    drillPath: "/financial-analytics",
    drillHint: "Net collection rate leakage by payer, provider and CPT.",
  },
  {
    id: "avg-days-to-payment",
    label: "Average Days to Payment",
    value: 27.4,
    format: "days",
    deltaPct: -4.1,
    trend: "down",
    helper: "Submission to cash posting",
    previousValue: 28.6,
    previousLabel: "Jun 2026",
    sparkline: [34.2, 33.6, 33.1, 32.4, 31.8, 31.2, 30.6, 30.1, 29.4, 28.9, 28.6, 27.4],
    tooltip: "Mean calendar days from claim submission to cash posting. Lower is better.",
    drillPath: "/ar",
    drillHint: "Days-to-payment distribution by payer, claim type and clearinghouse.",
  },
  {
    id: "avg-reimbursement-claim",
    label: "Average Reimbursement per Claim",
    value: 418,
    format: "currency",
    deltaPct: 2.3,
    trend: "up",
    helper: "Across 6,853 paid claims",
    previousValue: 409,
    previousLabel: "Jun 2026",
    sparkline: [386, 392, 389, 396, 399, 397, 402, 405, 407, 412, 409, 418],
    tooltip: "Average cash received per paid claim across all payers and service lines.",
    drillPath: "/claims",
    drillHint: "Reimbursement per claim by payer contract, modifier and place of service.",
  },
  {
    id: "avg-reimbursement-cpt",
    label: "Average Reimbursement per CPT",
    value: 162,
    format: "currency",
    deltaPct: 1.4,
    trend: "up",
    helper: "Weighted across billed CPTs",
    previousValue: 160,
    previousLabel: "Jun 2026",
    sparkline: [150, 152, 151, 154, 155, 154, 157, 158, 159, 161, 160, 162],
    tooltip: "Weighted average payment per CPT line item, useful for fee-schedule negotiation.",
    drillPath: "/revenue",
    drillHint: "Reimbursement per CPT versus contracted allowable and Medicare benchmark.",
  },
  {
    id: "avg-reimbursement-provider",
    label: "Average Reimbursement per Provider",
    value: 129_750,
    format: "currency",
    deltaPct: 3.6,
    trend: "up",
    helper: "22 billing providers",
    previousValue: 125_240,
    previousLabel: "Jun 2026",
    sparkline: [108, 111, 110, 114, 117, 116, 120, 122, 123, 126, 125, 129],
    tooltip: "Average cash collected per credentialed billing provider in the period.",
    drillPath: "/provider-performance",
    drillHint: "Provider-level cash yield versus wRVU production and panel size.",
  },
  {
    id: "cash-flow-forecast",
    label: "Cash Flow Forecast",
    value: 3_040_000,
    format: "currency",
    deltaPct: 6.1,
    trend: "up",
    helper: "Projected Aug 2026 cash",
    previousValue: 2_864_500,
    previousLabel: "Jul 2026 actual",
    sparkline: [2520, 2488, 2570, 2611, 2648, 2705, 2692, 2864, 2905, 2960, 3000, 3040],
    tooltip: "Projected cash for the next month from the A/R aging model with an 80% confidence band.",
    drillPath: "/forecast",
    drillHint: "Forecast drivers, confidence band and scenario assumptions.",
  },
  {
    id: "payment-variance",
    label: "Payment Variance",
    value: -84_300,
    format: "currency",
    deltaPct: -12.4,
    trend: "down",
    helper: "Paid below contracted allowable",
    previousValue: -96_200,
    previousLabel: "Jun 2026",
    sparkline: [-142, -136, -131, -124, -118, -112, -108, -104, -99, -97, -96, -84],
    tooltip: "Difference between expected contract allowable and actual payment. Negative means underpayment.",
    drillPath: "/denials",
    drillHint: "Underpayment variance by payer contract term and CPT.",
  },
];

const trend: CollectionsTrendPoint[] = [
  { month: MONTHS[0], collections: 2_340_000, insurance: 1_965_000, patient: 375_000, target: 2_400_000 },
  { month: MONTHS[1], collections: 2_410_000, insurance: 2_022_000, patient: 388_000, target: 2_420_000 },
  { month: MONTHS[2], collections: 2_380_000, insurance: 1_998_000, patient: 382_000, target: 2_440_000 },
  { month: MONTHS[3], collections: 2_465_000, insurance: 2_069_000, patient: 396_000, target: 2_460_000 },
  { month: MONTHS[4], collections: 2_520_000, insurance: 2_113_000, patient: 407_000, target: 2_500_000 },
  { month: MONTHS[5], collections: 2_488_000, insurance: 2_086_000, patient: 402_000, target: 2_520_000 },
  { month: MONTHS[6], collections: 2_570_000, insurance: 2_157_000, patient: 413_000, target: 2_560_000 },
  { month: MONTHS[7], collections: 2_611_000, insurance: 2_190_000, patient: 421_000, target: 2_600_000 },
  { month: MONTHS[8], collections: 2_648_000, insurance: 2_221_000, patient: 427_000, target: 2_640_000 },
  { month: MONTHS[9], collections: 2_705_000, insurance: 2_270_000, patient: 435_000, target: 2_680_000 },
  { month: MONTHS[10], collections: 2_692_100, insurance: 2_267_400, patient: 424_700, target: 2_720_000 },
  { month: MONTHS[11], collections: 2_864_500, insurance: 2_398_700, patient: 465_800, target: 2_760_000 },
];

const daily: DailyCollectionsPoint[] = [
  { date: "2026-07-01", label: "Jul 1", collections: 96_400, rollingAvg: 92_100 },
  { date: "2026-07-02", label: "Jul 2", collections: 108_200, rollingAvg: 93_400 },
  { date: "2026-07-06", label: "Jul 6", collections: 141_800, rollingAvg: 97_600 },
  { date: "2026-07-07", label: "Jul 7", collections: 88_600, rollingAvg: 98_200 },
  { date: "2026-07-08", label: "Jul 8", collections: 112_900, rollingAvg: 99_800 },
  { date: "2026-07-09", label: "Jul 9", collections: 124_500, rollingAvg: 101_900 },
  { date: "2026-07-10", label: "Jul 10", collections: 132_700, rollingAvg: 104_200 },
  { date: "2026-07-13", label: "Jul 13", collections: 158_300, rollingAvg: 108_400 },
  { date: "2026-07-14", label: "Jul 14", collections: 94_100, rollingAvg: 108_900 },
  { date: "2026-07-15", label: "Jul 15", collections: 121_600, rollingAvg: 110_200 },
  { date: "2026-07-16", label: "Jul 16", collections: 136_900, rollingAvg: 112_400 },
  { date: "2026-07-17", label: "Jul 17", collections: 149_200, rollingAvg: 115_100 },
  { date: "2026-07-20", label: "Jul 20", collections: 167_400, rollingAvg: 119_600 },
  { date: "2026-07-21", label: "Jul 21", collections: 102_800, rollingAvg: 120_100 },
  { date: "2026-07-22", label: "Jul 22", collections: 128_400, rollingAvg: 121_800 },
  { date: "2026-07-23", label: "Jul 23", collections: 143_600, rollingAvg: 123_900 },
  { date: "2026-07-24", label: "Jul 24", collections: 156_100, rollingAvg: 126_400 },
  { date: "2026-07-27", label: "Jul 27", collections: 172_900, rollingAvg: 130_200 },
];

const monthlyComparison: MonthlyComparisonPoint[] = [
  { month: "Jan", currentYear: 2_488_000, priorYear: 2_218_000 },
  { month: "Feb", currentYear: 2_570_000, priorYear: 2_284_000 },
  { month: "Mar", currentYear: 2_611_000, priorYear: 2_396_000 },
  { month: "Apr", currentYear: 2_648_000, priorYear: 2_442_000 },
  { month: "May", currentYear: 2_705_000, priorYear: 2_501_000 },
  { month: "Jun", currentYear: 2_692_100, priorYear: 2_538_000 },
  { month: "Jul", currentYear: 2_864_500, priorYear: 2_589_000 },
];

const byProvider: CollectionsByDimension[] = [
  { id: "pr-1", name: "Dr. Elaine Foster", collections: 318_400, meta: "Cardiology" },
  { id: "pr-2", name: "Dr. Marcus Reed", collections: 294_100, meta: "Orthopedics" },
  { id: "pr-3", name: "Dr. Priya Raman", collections: 268_900, meta: "Internal medicine" },
  { id: "pr-4", name: "Dr. Alan Whitcomb", collections: 241_600, meta: "Gastroenterology" },
  { id: "pr-5", name: "Dr. Sofia Marin", collections: 226_300, meta: "Neurology" },
  { id: "pr-6", name: "Dr. Ethan Brooks", collections: 208_500, meta: "Pulmonology" },
  { id: "pr-7", name: "Dr. Nadia Haddad", collections: 189_700, meta: "Endocrinology" },
  { id: "pr-8", name: "Dr. Owen Pierce", collections: 174_200, meta: "Family medicine" },
];

const byPayer: CollectionsByDimension[] = [
  { id: "py-1", name: "Blue Cross Blue Shield", collections: 684_200, meta: "Commercial" },
  { id: "py-2", name: "UnitedHealthcare", collections: 546_800, meta: "Commercial" },
  { id: "py-3", name: "Medicare", collections: 498_300, meta: "Government" },
  { id: "py-4", name: "Aetna", collections: 371_500, meta: "Commercial" },
  { id: "py-5", name: "Cigna", collections: 288_900, meta: "Commercial" },
  { id: "py-6", name: "Humana", collections: 214_600, meta: "Medicare Advantage" },
  { id: "py-7", name: "Medicaid", collections: 148_400, meta: "Government" },
  { id: "py-8", name: "Self-pay", collections: 111_800, meta: "Patient" },
];

const byFacility: CollectionsByDimension[] = [
  { id: "fa-1", name: "Northside Medical Center", collections: 986_400, meta: "Hospital outpatient" },
  { id: "fa-2", name: "Lakeview Surgical", collections: 742_800, meta: "ASC" },
  { id: "fa-3", name: "Westgate Clinic", collections: 611_300, meta: "Office" },
  { id: "fa-4", name: "Riverbend Imaging", collections: 328_700, meta: "Diagnostic" },
  { id: "fa-5", name: "Summit Specialty Care", collections: 195_300, meta: "Office" },
];

const byCpt: CollectionsByDimension[] = [
  { id: "cpt-1", name: "99214", collections: 386_200, meta: "Office visit, established" },
  { id: "cpt-2", name: "45378", collections: 312_500, meta: "Diagnostic colonoscopy" },
  { id: "cpt-3", name: "93306", collections: 268_400, meta: "Echocardiography" },
  { id: "cpt-4", name: "29881", collections: 241_900, meta: "Knee arthroscopy" },
  { id: "cpt-5", name: "99213", collections: 214_700, meta: "Office visit, established" },
  { id: "cpt-6", name: "70553", collections: 186_300, meta: "MRI brain w/ and w/o" },
  { id: "cpt-7", name: "97110", collections: 132_800, meta: "Therapeutic exercise" },
  { id: "cpt-8", name: "36415", collections: 78_400, meta: "Venipuncture" },
];

const paymentMethods: PaymentMethodSlice[] = [
  { id: "eft", method: "EFT / ACH", amount: 2_012_300, transactions: 4_186 },
  { id: "check", method: "Check", amount: 386_400, transactions: 812 },
  { id: "credit-card", method: "Credit card", amount: 268_900, transactions: 3_204 },
  { id: "virtual-card", method: "Virtual card", amount: 118_600, transactions: 486 },
  { id: "portal", method: "Patient portal", amount: 78_300, transactions: 1_942 },
];

const cashFlowForecast: CashFlowForecastPoint[] = [
  { month: "May 26", actual: 2_705_000, forecast: 2_690_000, low: 2_610_000, high: 2_770_000 },
  { month: "Jun 26", actual: 2_692_100, forecast: 2_745_000, low: 2_650_000, high: 2_840_000 },
  { month: "Jul 26", actual: 2_864_500, forecast: 2_820_000, low: 2_710_000, high: 2_930_000 },
  { month: "Aug 26", actual: null, forecast: 3_040_000, low: 2_880_000, high: 3_200_000 },
  { month: "Sep 26", actual: null, forecast: 3_112_000, low: 2_915_000, high: 3_309_000 },
  { month: "Oct 26", actual: null, forecast: 3_186_000, low: 2_948_000, high: 3_424_000 },
  { month: "Nov 26", actual: null, forecast: 3_248_000, low: 2_972_000, high: 3_524_000 },
  { month: "Dec 26", actual: null, forecast: 3_330_000, low: 3_010_000, high: 3_650_000 },
];

function share(rows: { collections: number }[], value: number) {
  const total = rows.reduce((sum, row) => sum + row.collections, 0);
  return Number(((value / total) * 100).toFixed(1));
}

function toBreakdown(
  id: string,
  title: string,
  subtitle: string,
  drillPath: string,
  source: { id: string; name: string; collections: number }[],
  deltas: number[],
): CollectionsBreakdownGroup {
  return {
    id,
    title,
    subtitle,
    drillPath,
    rows: source.slice(0, 5).map((row, index) => ({
      id: row.id,
      name: row.name,
      collections: row.collections,
      sharePct: share(source, row.collections),
      deltaPct: deltas[index] ?? 0,
    })),
  };
}

const bySpecialty = [
  { id: "sp-1", name: "Cardiology", collections: 612_800 },
  { id: "sp-2", name: "Orthopedics", collections: 548_300 },
  { id: "sp-3", name: "Gastroenterology", collections: 431_600 },
  { id: "sp-4", name: "Internal medicine", collections: 386_400 },
  { id: "sp-5", name: "Neurology", collections: 298_100 },
];

const byBillingCompany = [
  { id: "bc-1", name: "Meridian RCM Services", collections: 1_486_200 },
  { id: "bc-2", name: "In-house billing team", collections: 842_600 },
  { id: "bc-3", name: "Apex Claims Partners", collections: 361_400 },
  { id: "bc-4", name: "Coastal Billing Group", collections: 118_900 },
  { id: "bc-5", name: "Legacy AR vendor", collections: 55_400 },
];

const byLocation = [
  { id: "lo-1", name: "Chicago metro", collections: 1_042_600 },
  { id: "lo-2", name: "Milwaukee", collections: 668_400 },
  { id: "lo-3", name: "Indianapolis", collections: 512_300 },
  { id: "lo-4", name: "Rockford", collections: 386_900 },
  { id: "lo-5", name: "Madison", collections: 254_300 },
];

const breakdown: CollectionsBreakdownGroup[] = [
  toBreakdown("provider", "Collections by provider", "Top five billing providers", "/provider-performance", byProvider, [6.2, 4.1, 8.4, -2.1, 3.6]),
  toBreakdown("insurance", "Collections by insurance", "Top five payers by cash posted", "/payers", byPayer, [5.4, 7.8, 1.2, -3.6, 4.9]),
  toBreakdown("facility", "Collections by facility", "Cash posted per service location", "/ar", byFacility, [4.8, 9.1, 2.4, -1.8, 6.2]),
  toBreakdown("specialty", "Collections by specialty", "Service line contribution", "/financial-analytics", bySpecialty, [5.1, 3.4, 7.6, -0.9, 2.8]),
  toBreakdown("billing-company", "Collections by billing company", "Outsourced and in-house performance", "/billing", byBillingCompany, [3.9, 6.7, -4.2, 1.4, -11.6]),
  toBreakdown("location", "Collections by location", "Geographic cash distribution", "/financial-analytics", byLocation, [5.8, 4.2, 6.9, -2.4, 3.1]),
];

const providerRows: ProviderCollectionsRow[] = [
  { id: "pr-1", provider: "Dr. Elaine Foster", specialty: "Cardiology", claims: 742, collections: 318_400, avgPayment: 429, collectionPct: 96.4, outstandingBalance: 84_200 },
  { id: "pr-2", provider: "Dr. Marcus Reed", specialty: "Orthopedics", claims: 684, collections: 294_100, avgPayment: 430, collectionPct: 95.1, outstandingBalance: 112_600 },
  { id: "pr-3", provider: "Dr. Priya Raman", specialty: "Internal medicine", claims: 812, collections: 268_900, avgPayment: 331, collectionPct: 97.2, outstandingBalance: 61_400 },
  { id: "pr-4", provider: "Dr. Alan Whitcomb", specialty: "Gastroenterology", claims: 596, collections: 241_600, avgPayment: 405, collectionPct: 92.8, outstandingBalance: 134_800 },
  { id: "pr-5", provider: "Dr. Sofia Marin", specialty: "Neurology", claims: 521, collections: 226_300, avgPayment: 434, collectionPct: 94.6, outstandingBalance: 78_900 },
  { id: "pr-6", provider: "Dr. Ethan Brooks", specialty: "Pulmonology", claims: 488, collections: 208_500, avgPayment: 427, collectionPct: 93.4, outstandingBalance: 96_300 },
  { id: "pr-7", provider: "Dr. Nadia Haddad", specialty: "Endocrinology", claims: 462, collections: 189_700, avgPayment: 411, collectionPct: 95.8, outstandingBalance: 54_100 },
  { id: "pr-8", provider: "Dr. Owen Pierce", specialty: "Family medicine", claims: 706, collections: 174_200, avgPayment: 247, collectionPct: 96.9, outstandingBalance: 42_700 },
  { id: "pr-9", provider: "Dr. Lena Vogel", specialty: "Rheumatology", claims: 398, collections: 162_800, avgPayment: 409, collectionPct: 91.6, outstandingBalance: 118_400 },
  { id: "pr-10", provider: "Dr. Samuel Ortiz", specialty: "Urology", claims: 364, collections: 148_900, avgPayment: 409, collectionPct: 94.2, outstandingBalance: 67_500 },
];

const insuranceRows: InsuranceCollectionsRow[] = [
  { id: "py-1", insurance: "Blue Cross Blue Shield", claims: 1_684, collections: 684_200, avgDays: 24, denials: 96, outstanding: 318_400 },
  { id: "py-2", insurance: "UnitedHealthcare", claims: 1_412, collections: 546_800, avgDays: 31, denials: 148, outstanding: 402_100 },
  { id: "py-3", insurance: "Medicare", claims: 1_286, collections: 498_300, avgDays: 18, denials: 42, outstanding: 164_800 },
  { id: "py-4", insurance: "Aetna", claims: 942, collections: 371_500, avgDays: 36, denials: 164, outstanding: 288_600 },
  { id: "py-5", insurance: "Cigna", claims: 768, collections: 288_900, avgDays: 29, denials: 88, outstanding: 196_400 },
  { id: "py-6", insurance: "Humana", claims: 604, collections: 214_600, avgDays: 42, denials: 112, outstanding: 241_900 },
  { id: "py-7", insurance: "Medicaid", claims: 512, collections: 148_400, avgDays: 47, denials: 74, outstanding: 132_600 },
  { id: "py-8", insurance: "Self-pay", claims: 486, collections: 111_800, avgDays: 52, denials: 0, outstanding: 208_300 },
];

const recentPayments: RecentPaymentRow[] = [
  { id: "pay-9841", paymentDate: "2026-07-27", patient: "R. Whitfield", insurance: "Aetna", method: "EFT", amount: 12_480, eraNumber: "ERA-2026-84119", status: "posted" },
  { id: "pay-9840", paymentDate: "2026-07-27", patient: "M. Okafor", insurance: "UnitedHealthcare", method: "EFT", amount: 8_960, eraNumber: "ERA-2026-84118", status: "posted" },
  { id: "pay-9839", paymentDate: "2026-07-26", patient: "J. Alvarez", insurance: "Blue Cross Blue Shield", method: "Check", amount: 4_215, eraNumber: "ERA-2026-84102", status: "pending" },
  { id: "pay-9838", paymentDate: "2026-07-26", patient: "T. Nguyen", insurance: "Cigna", method: "EFT", amount: 6_740, eraNumber: "ERA-2026-84097", status: "reconciled" },
  { id: "pay-9837", paymentDate: "2026-07-25", patient: "S. Brennan", insurance: "Medicare", method: "EFT", amount: 15_320, eraNumber: "ERA-2026-84061", status: "posted" },
  { id: "pay-9836", paymentDate: "2026-07-25", patient: "D. Kaminski", insurance: "Humana", method: "Virtual card", amount: 2_180, eraNumber: "ERA-2026-84058", status: "pending" },
  { id: "pay-9835", paymentDate: "2026-07-24", patient: "L. Fernandez", insurance: "Self-pay", method: "Patient portal", amount: 420, eraNumber: "—", status: "posted" },
  { id: "pay-9834", paymentDate: "2026-07-24", patient: "K. Ashworth", insurance: "Blue Cross Blue Shield", method: "EFT", amount: 9_845, eraNumber: "ERA-2026-84031", status: "reconciled" },
  { id: "pay-9833", paymentDate: "2026-07-23", patient: "P. Delgado", insurance: "Medicaid", method: "Check", amount: 1_960, eraNumber: "ERA-2026-83998", status: "rejected" },
  { id: "pay-9832", paymentDate: "2026-07-23", patient: "H. Lindqvist", insurance: "UnitedHealthcare", method: "EFT", amount: 7_305, eraNumber: "ERA-2026-83994", status: "posted" },
  { id: "pay-9831", paymentDate: "2026-07-22", patient: "A. Boateng", insurance: "Medicare", method: "EFT", amount: 11_240, eraNumber: "ERA-2026-83961", status: "posted" },
  { id: "pay-9830", paymentDate: "2026-07-22", patient: "C. Iverson", insurance: "Aetna", method: "Credit card", amount: 640, eraNumber: "—", status: "posted" },
];

const insights: CollectionsInsight[] = [
  {
    id: "highest-paying-insurance",
    label: "Highest paying insurance",
    name: "Blue Cross Blue Shield",
    value: 684_200,
    format: "currency",
    helper: "23.9% of total cash · 24 day average turnaround",
    tone: "positive",
    drillPath: "/payers",
  },
  {
    id: "slowest-paying-insurance",
    label: "Slowest paying insurance",
    name: "Self-pay balances",
    value: 52,
    format: "days",
    helper: "Humana leads payers at 42 days · statements drive the lag",
    tone: "negative",
    drillPath: "/ar",
  },
  {
    id: "fastest-growing-provider",
    label: "Fastest growing provider",
    name: "Dr. Priya Raman",
    value: 8.4,
    format: "percent",
    helper: "Collections up month over month on higher panel volume",
    tone: "positive",
    drillPath: "/provider-performance",
  },
  {
    id: "highest-reimbursement-cpt",
    label: "Highest reimbursement CPT",
    name: "29881 · Knee arthroscopy",
    value: 1_284,
    format: "currency",
    helper: "Average payment per line · 188 lines paid this period",
    tone: "neutral",
    drillPath: "/revenue",
  },
  {
    id: "largest-outstanding",
    label: "Largest outstanding collection",
    name: "UnitedHealthcare",
    value: 402_100,
    format: "currency",
    helper: "148 denied claims contributing · 31 day average to pay",
    tone: "negative",
    drillPath: "/collections",
  },
];

export const collectionsDashboard: CollectionsDashboard = {
  kpis,
  trend,
  daily,
  monthlyComparison,
  byProvider,
  byPayer,
  byFacility,
  byCpt,
  paymentMethods,
  cashFlowForecast,
  breakdown,
  providerRows,
  insuranceRows,
  recentPayments,
  insights,
  lastRefreshedAt: "2026-07-28T06:45:00.000Z",
  source: "Enterprise data warehouse · nightly ETL",
};
