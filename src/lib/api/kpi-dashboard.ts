import type { ExecutiveKpi } from "./types";

/**
 * Reference dataset for the high-level KPI dashboard.
 *
 * Swappable for a real `/metrics/kpi-dashboard` payload without any UI change.
 */

export interface MonthlyKpiPoint {
  /** Short month label, e.g. "Aug 25". */
  month: string;
  /** Period key, e.g. "2025-08". */
  period: string;
  quarter: string;
  charges: number;
  claimsSubmitted: number;
  collections: number;
  adjustments: number;
  outstandingBalance: number;
  grossCollectionRate: number;
  netCollectionRate: number;
  /** Board-approved collections target for the month. */
  collectionsTarget: number;
  chargesTarget: number;
}

export type ComparisonBasis = "mom" | "qoq" | "yoy";

export interface ComparisonPoint {
  label: string;
  current: number;
  prior: number;
}

export interface GrowthIndicator {
  id: string;
  label: string;
  /** Percent change for each comparison basis. */
  mom: number;
  qoq: number;
  yoy: number;
  format: "currency" | "number" | "percent";
  current: number;
}

export interface ProviderPerformanceRow {
  id: string;
  name: string;
  specialty: string;
  charges: number;
  collections: number;
  netCollectionRate: number;
  encounters: number;
  growthPct: number;
}

export interface TopPayerRow {
  id: string;
  name: string;
  collections: number;
  charges: number;
  claims: number;
  netCollectionRate: number;
  avgDaysToPay: number;
  growthPct: number;
}

export interface RevenueSlice {
  name: string;
  value: number;
}

export interface KpiDashboard {
  kpis: ExecutiveKpi[];
  monthly: MonthlyKpiPoint[];
  comparisons: Record<ComparisonBasis, ComparisonPoint[]>;
  growth: GrowthIndicator[];
  topProviders: ProviderPerformanceRow[];
  topPayers: TopPayerRow[];
  revenueByPayer: RevenueSlice[];
  revenueByServiceLine: RevenueSlice[];
  lastRefreshedAt: string;
  source: string;
}

const monthly: MonthlyKpiPoint[] = [
  { month: "Aug 25", period: "2025-08", quarter: "Q3 25", charges: 2_180_000, claimsSubmitted: 12_140, collections: 1_552_000, adjustments: 431_000, outstandingBalance: 8_940_000, grossCollectionRate: 71.2, netCollectionRate: 92.4, collectionsTarget: 1_580_000, chargesTarget: 2_200_000 },
  { month: "Sep 25", period: "2025-09", quarter: "Q3 25", charges: 2_240_000, claimsSubmitted: 12_480, collections: 1_598_000, adjustments: 442_000, outstandingBalance: 8_880_000, grossCollectionRate: 71.3, netCollectionRate: 92.8, collectionsTarget: 1_610_000, chargesTarget: 2_240_000 },
  { month: "Oct 25", period: "2025-10", quarter: "Q4 25", charges: 2_310_000, claimsSubmitted: 12_920, collections: 1_664_000, adjustments: 455_000, outstandingBalance: 8_810_000, grossCollectionRate: 72.0, netCollectionRate: 93.1, collectionsTarget: 1_650_000, chargesTarget: 2_280_000 },
  { month: "Nov 25", period: "2025-11", quarter: "Q4 25", charges: 2_268_000, claimsSubmitted: 12_610, collections: 1_631_000, adjustments: 448_000, outstandingBalance: 8_760_000, grossCollectionRate: 71.9, netCollectionRate: 92.6, collectionsTarget: 1_680_000, chargesTarget: 2_300_000 },
  { month: "Dec 25", period: "2025-12", quarter: "Q4 25", charges: 2_395_000, claimsSubmitted: 13_180, collections: 1_722_000, adjustments: 468_000, outstandingBalance: 8_690_000, grossCollectionRate: 71.9, netCollectionRate: 93.4, collectionsTarget: 1_710_000, chargesTarget: 2_340_000 },
  { month: "Jan 26", period: "2026-01", quarter: "Q1 26", charges: 2_412_000, claimsSubmitted: 13_240, collections: 1_744_000, adjustments: 471_000, outstandingBalance: 8_640_000, grossCollectionRate: 72.3, netCollectionRate: 93.6, collectionsTarget: 1_740_000, chargesTarget: 2_380_000 },
  { month: "Feb 26", period: "2026-02", quarter: "Q1 26", charges: 2_356_000, claimsSubmitted: 12_980, collections: 1_708_000, adjustments: 462_000, outstandingBalance: 8_720_000, grossCollectionRate: 72.5, netCollectionRate: 93.2, collectionsTarget: 1_760_000, chargesTarget: 2_400_000 },
  { month: "Mar 26", period: "2026-03", quarter: "Q1 26", charges: 2_530_000, claimsSubmitted: 13_760, collections: 1_842_000, adjustments: 489_000, outstandingBalance: 8_580_000, grossCollectionRate: 72.8, netCollectionRate: 94.0, collectionsTarget: 1_790_000, chargesTarget: 2_450_000 },
  { month: "Apr 26", period: "2026-04", quarter: "Q2 26", charges: 2_588_000, claimsSubmitted: 14_020, collections: 1_889_000, adjustments: 496_000, outstandingBalance: 8_520_000, grossCollectionRate: 73.0, netCollectionRate: 94.2, collectionsTarget: 1_830_000, chargesTarget: 2_500_000 },
  { month: "May 26", period: "2026-05", quarter: "Q2 26", charges: 2_641_000, claimsSubmitted: 14_260, collections: 1_936_000, adjustments: 503_000, outstandingBalance: 8_460_000, grossCollectionRate: 73.3, netCollectionRate: 94.5, collectionsTarget: 1_870_000, chargesTarget: 2_540_000 },
  { month: "Jun 26", period: "2026-06", quarter: "Q2 26", charges: 2_712_000, claimsSubmitted: 14_540, collections: 1_988_000, adjustments: 512_000, outstandingBalance: 8_390_000, grossCollectionRate: 73.3, netCollectionRate: 94.8, collectionsTarget: 1_910_000, chargesTarget: 2_580_000 },
  { month: "Jul 26", period: "2026-07", quarter: "Q3 26", charges: 2_804_000, claimsSubmitted: 14_910, collections: 2_063_000, adjustments: 524_000, outstandingBalance: 8_310_000, grossCollectionRate: 73.6, netCollectionRate: 95.1, collectionsTarget: 1_950_000, chargesTarget: 2_620_000 },
];

const kpis: ExecutiveKpi[] = [
  {
    id: "monthly-charges",
    label: "Monthly charges",
    value: 2_804_000,
    format: "currency",
    deltaPct: 3.4,
    trend: "up",
    target: 2_620_000,
    helper: "Gross charges posted in July 2026",
    drillPath: "/revenue",
    drillHint: "Charges by facility, provider, service line and CPT",
  },
  {
    id: "claims-submitted",
    label: "Claims submitted",
    value: 14_910,
    format: "number",
    deltaPct: 2.5,
    trend: "up",
    helper: "Clean and corrected claims sent to payers",
    drillPath: "/claims",
    drillHint: "Submission batches, clean-claim rate and rejections",
  },
  {
    id: "collections",
    label: "Collections",
    value: 2_063_000,
    format: "currency",
    deltaPct: 3.8,
    trend: "up",
    target: 1_950_000,
    helper: "Cash posted, insurance plus patient",
    drillPath: "/collections",
    drillHint: "Payment batches, posting lag and payer mix",
  },
  {
    id: "adjustments",
    label: "Adjustments",
    value: 524_000,
    format: "currency",
    deltaPct: 2.3,
    trend: "up",
    helper: "Contractual and administrative write-offs",
    drillPath: "/financial-analytics",
    drillHint: "Write-off reasons and contractual variance",
  },
  {
    id: "outstanding-balance",
    label: "Outstanding balance",
    value: 8_310_000,
    format: "currency",
    deltaPct: -1.0,
    trend: "down",
    helper: "Open insurance and patient responsibility",
    drillPath: "/ar",
    drillHint: "Balance by payer, aging bucket and owner",
  },
  {
    id: "gross-collection-rate",
    label: "Gross collection rate",
    value: 73.6,
    format: "percent",
    deltaPct: 0.4,
    trend: "up",
    helper: "Collections divided by gross charges",
    drillPath: "/financial-analytics",
    drillHint: "GCR by payer, contract and service line",
  },
  {
    id: "net-collection-rate",
    label: "Net collection rate",
    value: 95.1,
    format: "percent",
    deltaPct: 0.3,
    trend: "up",
    target: 96,
    helper: "Collections against allowed amount",
    drillPath: "/financial-analytics",
    drillHint: "NCR variance against contracted allowables",
  },
];

const comparisons: Record<ComparisonBasis, ComparisonPoint[]> = {
  mom: [
    { label: "Charges", current: 2_804_000, prior: 2_712_000 },
    { label: "Collections", current: 2_063_000, prior: 1_988_000 },
    { label: "Adjustments", current: 524_000, prior: 512_000 },
    { label: "Outstanding", current: 8_310_000, prior: 8_390_000 },
  ],
  qoq: [
    { label: "Charges", current: 2_804_000, prior: 2_647_000 },
    { label: "Collections", current: 2_063_000, prior: 1_937_667 },
    { label: "Adjustments", current: 524_000, prior: 503_667 },
    { label: "Outstanding", current: 8_310_000, prior: 8_456_667 },
  ],
  yoy: [
    { label: "Charges", current: 2_804_000, prior: 2_146_000 },
    { label: "Collections", current: 2_063_000, prior: 1_521_000 },
    { label: "Adjustments", current: 524_000, prior: 426_000 },
    { label: "Outstanding", current: 8_310_000, prior: 9_020_000 },
  ],
};

const growth: GrowthIndicator[] = [
  { id: "charges", label: "Monthly charges", current: 2_804_000, format: "currency", mom: 3.4, qoq: 5.9, yoy: 30.7 },
  { id: "claims", label: "Claims submitted", current: 14_910, format: "number", mom: 2.5, qoq: 4.6, yoy: 22.8 },
  { id: "collections", label: "Collections", current: 2_063_000, format: "currency", mom: 3.8, qoq: 6.5, yoy: 35.6 },
  { id: "adjustments", label: "Adjustments", current: 524_000, format: "currency", mom: 2.3, qoq: 4.0, yoy: 23.0 },
  { id: "outstanding", label: "Outstanding balance", current: 8_310_000, format: "currency", mom: -1.0, qoq: -1.7, yoy: -7.9 },
  { id: "gcr", label: "Gross collection rate", current: 73.6, format: "percent", mom: 0.4, qoq: 1.0, yoy: 3.4 },
  { id: "ncr", label: "Net collection rate", current: 95.1, format: "percent", mom: 0.3, qoq: 1.2, yoy: 2.9 },
];

const topProviders: ProviderPerformanceRow[] = [
  { id: "PRV-1042", name: "Dr. Elena Marsh", specialty: "Cardiology", charges: 412_800, collections: 318_400, netCollectionRate: 96.4, encounters: 486, growthPct: 8.2 },
  { id: "PRV-1188", name: "Dr. Samuel Oyelaran", specialty: "Orthopedics", charges: 388_500, collections: 296_100, netCollectionRate: 95.8, encounters: 412, growthPct: 6.9 },
  { id: "PRV-1273", name: "Dr. Priya Raghavan", specialty: "Gastroenterology", charges: 341_200, collections: 262_700, netCollectionRate: 95.1, encounters: 458, growthPct: 5.4 },
  { id: "PRV-1319", name: "Dr. Marcus Feld", specialty: "General Surgery", charges: 327_900, collections: 248_300, netCollectionRate: 94.6, encounters: 298, growthPct: 4.1 },
  { id: "PRV-1401", name: "Dr. Ana Beltrán", specialty: "Internal Medicine", charges: 289_400, collections: 221_800, netCollectionRate: 94.2, encounters: 612, growthPct: 3.6 },
  { id: "PRV-1466", name: "Dr. Kevin Doyle", specialty: "Pulmonology", charges: 264_100, collections: 198_500, netCollectionRate: 93.4, encounters: 389, growthPct: 2.8 },
];

const topPayers: TopPayerRow[] = [
  { id: "PAY-01", name: "Blue Cross Blue Shield", collections: 512_400, charges: 704_000, claims: 3_420, netCollectionRate: 96.1, avgDaysToPay: 24, growthPct: 5.2 },
  { id: "PAY-02", name: "UnitedHealthcare", collections: 438_900, charges: 618_000, claims: 2_980, netCollectionRate: 95.2, avgDaysToPay: 27, growthPct: 4.4 },
  { id: "PAY-03", name: "Medicare", collections: 396_700, charges: 512_000, claims: 3_140, netCollectionRate: 97.3, avgDaysToPay: 19, growthPct: 3.1 },
  { id: "PAY-04", name: "Aetna", collections: 284_500, charges: 402_000, claims: 1_960, netCollectionRate: 94.0, avgDaysToPay: 31, growthPct: -1.8 },
  { id: "PAY-05", name: "Cigna", collections: 212_300, charges: 306_000, claims: 1_540, netCollectionRate: 93.4, avgDaysToPay: 33, growthPct: 2.2 },
  { id: "PAY-06", name: "Humana", collections: 118_200, charges: 172_000, claims: 980, netCollectionRate: 92.8, avgDaysToPay: 35, growthPct: 1.4 },
];

const revenueByPayer: RevenueSlice[] = topPayers.map((p) => ({ name: p.name, value: p.collections }));

const revenueByServiceLine: RevenueSlice[] = [
  { name: "Surgical services", value: 642_000 },
  { name: "Cardiology", value: 428_000 },
  { name: "Primary care", value: 386_000 },
  { name: "Imaging", value: 298_000 },
  { name: "Behavioral health", value: 184_000 },
  { name: "Other outpatient", value: 125_000 },
];

export const kpiDashboard: KpiDashboard = {
  kpis,
  monthly,
  comparisons,
  growth,
  topProviders,
  topPayers,
  revenueByPayer,
  revenueByServiceLine,
  lastRefreshedAt: "2026-07-28T06:15:00Z",
  source: "PM ledger + clearinghouse remittance sync",
};
