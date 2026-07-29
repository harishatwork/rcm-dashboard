import type { ExecutiveKpi } from "./types";

/**
 * Reference dataset for the Revenue Dashboard.
 *
 * Every export below mirrors the shape a future `/metrics/revenue-dashboard`
 * endpoint should return, so wiring a real API is a one-line change in
 * `src/lib/api/client.ts` — no UI component needs to be touched.
 */

export interface RevenueKpi extends ExecutiveKpi {
  /** Same metric for the previous comparable period. */
  previousValue: number;
  /** Label of the comparison period, e.g. "Jun 2026". */
  previousLabel: string;
  /** 12 trailing points powering the card sparkline. */
  sparkline: number[];
  /** Long-form explanation surfaced in the card tooltip. */
  tooltip: string;
}

export interface RevenueTrendPoint {
  month: string;
  grossRevenue: number;
  netRevenue: number;
  collections: number;
}

export interface RevenueByDimension {
  id: string;
  name: string;
  revenue: number;
  meta?: string;
}

export interface InsuranceRevenueStack {
  name: string;
  primary: number;
  secondary: number;
  patient: number;
}

export interface WaterfallStep {
  label: string;
  value: number;
  kind: "start" | "increase" | "decrease" | "total";
}

export interface ForecastPointExtended {
  month: string;
  actual: number | null;
  forecast: number;
  low: number;
  high: number;
}

export interface RevenueSliceRow {
  id: string;
  name: string;
  revenue: number;
  sharePct: number;
  deltaPct: number;
}

export interface RevenueDistributionGroup {
  id: string;
  title: string;
  subtitle: string;
  drillPath: string;
  rows: RevenueSliceRow[];
}

export interface TopProviderRevenueRow {
  id: string;
  provider: string;
  specialty: string;
  charges: number;
  collections: number;
  adjustments: number;
  netRevenue: number;
  growthPct: number;
  rank: number;
}

export interface TopInsuranceRow {
  id: string;
  insurance: string;
  claims: number;
  payments: number;
  denials: number;
  avgPaymentDays: number;
  revenue: number;
}

export interface TopCptRow {
  id: string;
  cpt: string;
  description: string;
  charges: number;
  collections: number;
  revenue: number;
}

export interface FacilityRevenueRow {
  id: string;
  facility: string;
  charges: number;
  collections: number;
  revenue: number;
  outstandingBalance: number;
}

export type LeakageSeverity = "critical" | "warning" | "info";

export interface LeakageItem {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent" | "days";
  severity: LeakageSeverity;
  helper: string;
  drillPath: string;
}

export interface RevenueDashboard {
  kpis: RevenueKpi[];
  monthlyTrend: RevenueTrendPoint[];
  byProvider: RevenueByDimension[];
  byFacility: RevenueByDimension[];
  byLocation: RevenueByDimension[];
  bySpecialty: RevenueByDimension[];
  byInsurance: InsuranceRevenueStack[];
  waterfall: WaterfallStep[];
  forecast: ForecastPointExtended[];
  distribution: RevenueDistributionGroup[];
  topProviders: TopProviderRevenueRow[];
  topInsurance: TopInsuranceRow[];
  topCpt: TopCptRow[];
  facilityRevenue: FacilityRevenueRow[];
  leakage: LeakageItem[];
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

const monthlyTrend: RevenueTrendPoint[] = [
  { month: "Aug 25", grossRevenue: 4_180_000, netRevenue: 2_910_000, collections: 2_764_000 },
  { month: "Sep 25", grossRevenue: 4_050_000, netRevenue: 2_842_000, collections: 2_690_000 },
  { month: "Oct 25", grossRevenue: 4_390_000, netRevenue: 3_072_000, collections: 2_918_000 },
  { month: "Nov 25", grossRevenue: 4_210_000, netRevenue: 2_948_000, collections: 2_836_000 },
  { month: "Dec 25", grossRevenue: 4_620_000, netRevenue: 3_234_000, collections: 3_040_000 },
  { month: "Jan 26", grossRevenue: 4_480_000, netRevenue: 3_136_000, collections: 2_960_000 },
  { month: "Feb 26", grossRevenue: 4_310_000, netRevenue: 3_017_000, collections: 2_902_000 },
  { month: "Mar 26", grossRevenue: 4_870_000, netRevenue: 3_409_000, collections: 3_248_000 },
  { month: "Apr 26", grossRevenue: 4_760_000, netRevenue: 3_332_000, collections: 3_186_000 },
  { month: "May 26", grossRevenue: 5_020_000, netRevenue: 3_514_000, collections: 3_362_000 },
  { month: "Jun 26", grossRevenue: 5_140_000, netRevenue: 3_598_000, collections: 3_430_000 },
  { month: "Jul 26", grossRevenue: 5_390_000, netRevenue: 3_773_000, collections: 3_596_000 },
];

const spark = (key: keyof Omit<RevenueTrendPoint, "month">, factor = 1) =>
  monthlyTrend.map((p) => Math.round(p[key] * factor));

const kpis: RevenueKpi[] = [
  {
    id: "total-charges",
    label: "Total charges",
    value: 5_390_000,
    previousValue: 5_140_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 4.9,
    trend: "up",
    helper: "Gross charges posted in July 2026",
    tooltip:
      "Sum of all professional and facility charges posted to patient accounts for dates of service in the selected period.",
    sparkline: spark("grossRevenue"),
    drillPath: "/billing",
    drillHint: "Charge detail by facility, provider, CPT and posting date.",
  },
  {
    id: "gross-revenue",
    label: "Gross revenue",
    value: 5_186_000,
    previousValue: 4_942_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 4.9,
    trend: "up",
    helper: "Charges net of pre-billing write-offs",
    tooltip: "Total charges less charge-entry corrections and pre-submission write-offs.",
    sparkline: spark("grossRevenue", 0.962),
    drillPath: "/financial-analytics",
    drillHint: "Gross revenue bridge with correction and write-off drivers.",
  },
  {
    id: "net-revenue",
    label: "Net revenue",
    value: 3_773_000,
    previousValue: 3_598_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 4.9,
    trend: "up",
    helper: "Expected reimbursement after contractuals",
    tooltip:
      "Gross revenue less contractual allowances and expected adjustments — the realistic collectable amount.",
    sparkline: spark("netRevenue"),
    drillPath: "/financial-analytics",
    drillHint: "Net revenue by payer contract with expected vs. allowed variance.",
  },
  {
    id: "collections",
    label: "Collections",
    value: 3_596_000,
    previousValue: 3_430_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 4.8,
    trend: "up",
    target: 3_700_000,
    helper: "Cash posted in July 2026",
    tooltip: "Insurance and patient payments posted in the period, excluding refunds and takebacks.",
    sparkline: spark("collections"),
    drillPath: "/collections",
    drillHint: "Payment batches by payer, remittance type and posting user.",
  },
  {
    id: "total-adjustments",
    label: "Total adjustments",
    value: 1_413_000,
    previousValue: 1_344_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 5.1,
    trend: "up",
    helper: "Contractual and administrative write-offs",
    tooltip:
      "All credit adjustments applied to accounts: contractual allowances, small balance, bad debt and administrative write-offs.",
    sparkline: monthlyTrend.map((p) => p.grossRevenue - p.netRevenue),
    drillPath: "/financial-analytics",
    drillHint: "Adjustment codes ranked by dollars with approver and reason.",
  },
  {
    id: "outstanding-balance",
    label: "Outstanding balance",
    value: 8_942_000,
    previousValue: 9_186_000,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: -2.7,
    trend: "down",
    helper: "Total open A/R across payers and patients",
    tooltip: "Open accounts receivable at period end, including insurance and patient responsibility.",
    sparkline: [9_620, 9_540, 9_480, 9_410, 9_390, 9_320, 9_280, 9_240, 9_210, 9_190, 9_186, 8_942].map(
      (v) => v * 1000,
    ),
    drillPath: "/ar",
    drillHint: "Aged trial balance by payer, financial class and follow-up owner.",
  },
  {
    id: "revenue-per-encounter",
    label: "Avg revenue / encounter",
    value: 428,
    previousValue: 412,
    previousLabel: "Jun 2026",
    format: "currency",
    deltaPct: 3.9,
    trend: "up",
    helper: "Net revenue divided by billable encounters",
    tooltip:
      "Net revenue per completed billable encounter. Useful for spotting coding intensity and service-mix shifts.",
    sparkline: [381, 384, 392, 388, 399, 396, 401, 408, 410, 407, 412, 428],
    drillPath: "/provider-performance",
    drillHint: "Encounter yield by provider, visit type and E/M level.",
  },
  {
    id: "revenue-growth",
    label: "Revenue growth",
    value: 12.6,
    previousValue: 9.8,
    previousLabel: "Jun 2026",
    format: "percent",
    deltaPct: 2.8,
    trend: "up",
    helper: "Net revenue vs. same month last year",
    tooltip: "Year-over-year net revenue growth, normalised for the number of business days.",
    sparkline: [4.1, 4.8, 6.2, 5.7, 7.4, 7.1, 8.0, 9.2, 9.4, 9.6, 9.8, 12.6],
    drillPath: "/kpi-dashboard",
    drillHint: "Growth contribution by facility, specialty and payer.",
  },
  {
    id: "forecast-revenue",
    label: "Forecast revenue",
    value: 3_910_000,
    previousValue: 3_773_000,
    previousLabel: "Jul 2026 actual",
    format: "currency",
    deltaPct: 3.6,
    trend: "up",
    helper: "Modelled net revenue for Aug 2026",
    tooltip:
      "Statistical forecast blending scheduled volume, historical realisation rate and payer mix. 80% confidence band.",
    sparkline: [3_136, 3_017, 3_409, 3_332, 3_514, 3_598, 3_773, 3_830, 3_910, 3_985, 4_060, 4_140].map(
      (v) => v * 1000,
    ),
    drillPath: "/forecast",
    drillHint: "Forecast assumptions, confidence band and scenario comparison.",
  },
];

const byProvider: RevenueByDimension[] = [
  { id: "prov-1", name: "Dr. Amara Osei", revenue: 486_400, meta: "Cardiology" },
  { id: "prov-2", name: "Dr. Ethan Wallace", revenue: 442_900, meta: "Orthopedics" },
  { id: "prov-3", name: "Dr. Priya Raman", revenue: 401_300, meta: "Gastroenterology" },
  { id: "prov-4", name: "Dr. Marcus Feld", revenue: 372_800, meta: "General surgery" },
  { id: "prov-5", name: "Dr. Lena Kowalski", revenue: 338_500, meta: "Internal medicine" },
  { id: "prov-6", name: "Dr. Samuel Ortiz", revenue: 309_200, meta: "Pulmonology" },
  { id: "prov-7", name: "Dr. Hannah Byrne", revenue: 281_600, meta: "Endocrinology" },
  { id: "prov-8", name: "Dr. Nikhil Shah", revenue: 254_100, meta: "Neurology" },
];

const byFacility: RevenueByDimension[] = [
  { id: "fac-1", name: "Northside Medical", revenue: 1_284_000 },
  { id: "fac-2", name: "Lakeview Surgical", revenue: 986_400 },
  { id: "fac-3", name: "Westgate Clinic", revenue: 742_800 },
  { id: "fac-4", name: "Harbor Point", revenue: 512_300 },
  { id: "fac-5", name: "Cedar Ridge", revenue: 247_500 },
];

const byLocation: RevenueByDimension[] = [
  { id: "loc-1", name: "Chicago, IL", revenue: 1_142_000, meta: "4 sites" },
  { id: "loc-2", name: "Milwaukee, WI", revenue: 824_600, meta: "3 sites" },
  { id: "loc-3", name: "Indianapolis, IN", revenue: 671_300, meta: "2 sites" },
  { id: "loc-4", name: "Columbus, OH", revenue: 588_900, meta: "2 sites" },
  { id: "loc-5", name: "Detroit, MI", revenue: 431_200, meta: "1 site" },
  { id: "loc-6", name: "St. Louis, MO", revenue: 315_000, meta: "1 site" },
];

const bySpecialty: RevenueByDimension[] = [
  { id: "sp-1", name: "Cardiology", revenue: 892_000 },
  { id: "sp-2", name: "Orthopedics", revenue: 764_500 },
  { id: "sp-3", name: "General surgery", revenue: 588_200 },
  { id: "sp-4", name: "Internal medicine", revenue: 512_900 },
  { id: "sp-5", name: "Gastroenterology", revenue: 468_300 },
  { id: "sp-6", name: "Neurology", revenue: 314_100 },
  { id: "sp-7", name: "Other", revenue: 233_000 },
];

const byInsurance: InsuranceRevenueStack[] = [
  { name: "Blue Cross", primary: 742_000, secondary: 128_400, patient: 96_200 },
  { name: "Medicare", primary: 684_500, secondary: 92_800, patient: 61_400 },
  { name: "Aetna", primary: 512_300, secondary: 84_100, patient: 72_900 },
  { name: "UnitedHealth", primary: 468_900, secondary: 76_300, patient: 68_400 },
  { name: "Cigna", primary: 391_200, secondary: 61_700, patient: 54_800 },
  { name: "Medicaid", primary: 288_600, secondary: 34_200, patient: 12_100 },
];

const waterfall: WaterfallStep[] = [
  { label: "Gross charges", value: 5_390_000, kind: "start" },
  { label: "Contractual", value: -1_128_000, kind: "decrease" },
  { label: "Write-offs", value: -184_000, kind: "decrease" },
  { label: "Denial loss", value: -101_000, kind: "decrease" },
  { label: "Secondary", value: 142_000, kind: "increase" },
  { label: "Patient pay", value: 118_000, kind: "increase" },
  { label: "Refunds", value: -64_000, kind: "decrease" },
  { label: "Net revenue", value: 4_173_000, kind: "total" },
];

const forecast: ForecastPointExtended[] = [
  { month: "Jun 26", actual: 3_598_000, forecast: 3_598_000, low: 3_598_000, high: 3_598_000 },
  { month: "Jul 26", actual: 3_773_000, forecast: 3_773_000, low: 3_773_000, high: 3_773_000 },
  { month: "Aug 26", actual: null, forecast: 3_910_000, low: 3_742_000, high: 4_078_000 },
  { month: "Sep 26", actual: null, forecast: 3_985_000, low: 3_768_000, high: 4_202_000 },
  { month: "Oct 26", actual: null, forecast: 4_060_000, low: 3_794_000, high: 4_326_000 },
  { month: "Nov 26", actual: null, forecast: 4_112_000, low: 3_798_000, high: 4_426_000 },
  { month: "Dec 26", actual: null, forecast: 4_248_000, low: 3_884_000, high: 4_612_000 },
  { month: "Jan 27", actual: null, forecast: 4_186_000, low: 3_772_000, high: 4_600_000 },
];

const distribution: RevenueDistributionGroup[] = [
  {
    id: "payer",
    title: "Revenue by payer",
    subtitle: "Net revenue contribution, July 2026",
    drillPath: "/payers",
    rows: [
      { id: "p1", name: "Blue Cross Blue Shield", revenue: 966_600, sharePct: 25.6, deltaPct: 4.2 },
      { id: "p2", name: "Medicare", revenue: 838_700, sharePct: 22.2, deltaPct: 1.8 },
      { id: "p3", name: "Aetna", revenue: 669_300, sharePct: 17.7, deltaPct: -2.4 },
      { id: "p4", name: "UnitedHealth", revenue: 613_600, sharePct: 16.3, deltaPct: 3.1 },
      { id: "p5", name: "Cigna", revenue: 507_700, sharePct: 13.5, deltaPct: 2.6 },
      { id: "p6", name: "Medicaid", revenue: 334_900, sharePct: 8.9, deltaPct: -1.1 },
    ],
  },
  {
    id: "cpt",
    title: "Revenue by CPT",
    subtitle: "Top procedure codes by net revenue",
    drillPath: "/billing",
    rows: [
      { id: "c1", name: "99214 · Office visit, level 4", revenue: 486_200, sharePct: 12.9, deltaPct: 5.4 },
      { id: "c2", name: "93000 · ECG, routine", revenue: 312_800, sharePct: 8.3, deltaPct: 2.1 },
      { id: "c3", name: "45378 · Colonoscopy, dx", revenue: 288_400, sharePct: 7.6, deltaPct: 6.8 },
      { id: "c4", name: "29881 · Knee arthroscopy", revenue: 264_900, sharePct: 7.0, deltaPct: -1.4 },
      { id: "c5", name: "99213 · Office visit, level 3", revenue: 241_500, sharePct: 6.4, deltaPct: 1.2 },
      { id: "c6", name: "70553 · MRI brain w/wo", revenue: 198_300, sharePct: 5.3, deltaPct: 3.7 },
    ],
  },
  {
    id: "visit-type",
    title: "Revenue by visit type",
    subtitle: "Encounter class mix",
    drillPath: "/my-encounters",
    rows: [
      { id: "v1", name: "Office / outpatient", revenue: 1_486_000, sharePct: 39.4, deltaPct: 3.4 },
      { id: "v2", name: "Ambulatory surgery", revenue: 1_012_400, sharePct: 26.8, deltaPct: 6.1 },
      { id: "v3", name: "Inpatient consult", revenue: 604_800, sharePct: 16.0, deltaPct: -2.2 },
      { id: "v4", name: "Telehealth", revenue: 402_600, sharePct: 10.7, deltaPct: 11.4 },
      { id: "v5", name: "Diagnostic imaging", revenue: 267_200, sharePct: 7.1, deltaPct: 1.9 },
    ],
  },
  {
    id: "billing-company",
    title: "Revenue by billing company",
    subtitle: "Outsourced and in-house billing units",
    drillPath: "/administration",
    rows: [
      { id: "b1", name: "In-house central billing", revenue: 2_106_000, sharePct: 55.8, deltaPct: 4.6 },
      { id: "b2", name: "MedFirst RCM Partners", revenue: 842_300, sharePct: 22.3, deltaPct: 2.8 },
      { id: "b3", name: "Coastal Billing Group", revenue: 528_900, sharePct: 14.0, deltaPct: -3.5 },
      { id: "b4", name: "Apex Claims Services", revenue: 295_800, sharePct: 7.9, deltaPct: 0.9 },
    ],
  },
];

const topProviders: TopProviderRevenueRow[] = [
  { id: "tp-1", provider: "Dr. Amara Osei", specialty: "Cardiology", charges: 712_400, collections: 498_200, adjustments: 214_200, netRevenue: 486_400, growthPct: 8.4, rank: 1 },
  { id: "tp-2", provider: "Dr. Ethan Wallace", specialty: "Orthopedics", charges: 668_900, collections: 452_600, adjustments: 216_300, netRevenue: 442_900, growthPct: 6.1, rank: 2 },
  { id: "tp-3", provider: "Dr. Priya Raman", specialty: "Gastroenterology", charges: 594_200, collections: 411_800, adjustments: 182_400, netRevenue: 401_300, growthPct: 4.8, rank: 3 },
  { id: "tp-4", provider: "Dr. Marcus Feld", specialty: "General surgery", charges: 561_700, collections: 380_900, adjustments: 180_800, netRevenue: 372_800, growthPct: -1.7, rank: 4 },
  { id: "tp-5", provider: "Dr. Lena Kowalski", specialty: "Internal medicine", charges: 498_300, collections: 344_100, adjustments: 154_200, netRevenue: 338_500, growthPct: 2.9, rank: 5 },
  { id: "tp-6", provider: "Dr. Samuel Ortiz", specialty: "Pulmonology", charges: 452_800, collections: 315_400, adjustments: 137_400, netRevenue: 309_200, growthPct: 3.6, rank: 6 },
  { id: "tp-7", provider: "Dr. Hannah Byrne", specialty: "Endocrinology", charges: 411_500, collections: 287_300, adjustments: 124_200, netRevenue: 281_600, growthPct: -0.8, rank: 7 },
  { id: "tp-8", provider: "Dr. Nikhil Shah", specialty: "Neurology", charges: 372_600, collections: 259_800, adjustments: 112_800, netRevenue: 254_100, growthPct: 5.2, rank: 8 },
];

const topInsurance: TopInsuranceRow[] = [
  { id: "ti-1", insurance: "Blue Cross Blue Shield", claims: 4_812, payments: 986_600, denials: 214, avgPaymentDays: 21.4, revenue: 966_600 },
  { id: "ti-2", insurance: "Medicare", claims: 4_106, payments: 856_400, denials: 132, avgPaymentDays: 17.8, revenue: 838_700 },
  { id: "ti-3", insurance: "Aetna", claims: 3_284, payments: 682_900, denials: 298, avgPaymentDays: 28.6, revenue: 669_300 },
  { id: "ti-4", insurance: "UnitedHealth", claims: 3_012, payments: 628_100, denials: 246, avgPaymentDays: 26.1, revenue: 613_600 },
  { id: "ti-5", insurance: "Cigna", claims: 2_488, payments: 518_400, denials: 187, avgPaymentDays: 24.9, revenue: 507_700 },
  { id: "ti-6", insurance: "Medicaid", claims: 2_146, payments: 342_800, denials: 268, avgPaymentDays: 34.2, revenue: 334_900 },
];

const topCpt: TopCptRow[] = [
  { id: "cpt-1", cpt: "99214", description: "Office visit, established, level 4", charges: 694_000, collections: 492_800, revenue: 486_200 },
  { id: "cpt-2", cpt: "93000", description: "Electrocardiogram, routine with interpretation", charges: 446_800, collections: 318_400, revenue: 312_800 },
  { id: "cpt-3", cpt: "45378", description: "Colonoscopy, flexible, diagnostic", charges: 412_200, collections: 292_100, revenue: 288_400 },
  { id: "cpt-4", cpt: "29881", description: "Arthroscopy, knee, with meniscectomy", charges: 378_500, collections: 268_900, revenue: 264_900 },
  { id: "cpt-5", cpt: "99213", description: "Office visit, established, level 3", charges: 344_900, collections: 244_600, revenue: 241_500 },
  { id: "cpt-6", cpt: "70553", description: "MRI brain, with and without contrast", charges: 283_300, collections: 201_200, revenue: 198_300 },
  { id: "cpt-7", cpt: "36415", description: "Collection of venous blood, venipuncture", charges: 96_400, collections: 71_800, revenue: 70_600 },
];

const facilityRevenue: FacilityRevenueRow[] = [
  { id: "fr-1", facility: "Northside Medical Center", charges: 1_842_000, collections: 1_298_400, revenue: 1_284_000, outstandingBalance: 3_142_000 },
  { id: "fr-2", facility: "Lakeview Surgical", charges: 1_412_600, collections: 996_800, revenue: 986_400, outstandingBalance: 2_384_000 },
  { id: "fr-3", facility: "Westgate Clinic", charges: 1_064_200, collections: 750_300, revenue: 742_800, outstandingBalance: 1_698_000 },
  { id: "fr-4", facility: "Harbor Point Specialty", charges: 734_800, collections: 517_600, revenue: 512_300, outstandingBalance: 1_042_000 },
  { id: "fr-5", facility: "Cedar Ridge Family Care", charges: 336_400, collections: 249_900, revenue: 247_500, outstandingBalance: 676_000 },
];

const leakage: LeakageItem[] = [
  {
    id: "missing-charges",
    label: "Missing charges",
    value: 284_600,
    format: "currency",
    severity: "critical",
    helper: "412 encounters closed without a matching charge line",
    drillPath: "/unsigned-encounters",
  },
  {
    id: "unbilled-encounters",
    label: "Unbilled encounters",
    value: 1_284,
    format: "number",
    severity: "critical",
    helper: "Aged over 7 days from date of service",
    drillPath: "/billing",
  },
  {
    id: "high-adjustments",
    label: "High adjustments",
    value: 146_900,
    format: "currency",
    severity: "warning",
    helper: "Write-offs above contract expectation on 3 payers",
    drillPath: "/financial-analytics",
  },
  {
    id: "potential-loss",
    label: "Potential revenue loss",
    value: 612_400,
    format: "currency",
    severity: "critical",
    helper: "Aggregate exposure across all leakage categories",
    drillPath: "/financial-analytics",
  },
  {
    id: "late-filing",
    label: "Late filing risk",
    value: 98_300,
    format: "currency",
    severity: "warning",
    helper: "64 claims within 10 days of timely filing limit",
    drillPath: "/claims",
  },
  {
    id: "underpayments",
    label: "Underpayments",
    value: 82_600,
    format: "currency",
    severity: "info",
    helper: "Remittances paid below contracted allowable",
    drillPath: "/collections",
  },
];

export const revenueDashboard: RevenueDashboard = {
  kpis,
  monthlyTrend,
  byProvider,
  byFacility,
  byLocation,
  bySpecialty,
  byInsurance,
  waterfall,
  forecast,
  distribution,
  topProviders,
  topInsurance,
  topCpt,
  facilityRevenue,
  leakage,
  lastRefreshedAt: "2026-07-28T06:45:00.000Z",
  source: "Enterprise data warehouse · nightly ETL",
};

export const revenueTrendMonths = MONTHS;
