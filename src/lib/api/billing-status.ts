import type { ExecutiveKpi } from "./types";

/**
 * Reference dataset for the billing status dashboard.
 *
 * Replace with a `/metrics/billing-status` payload when the API lands —
 * the shapes below are the contract the UI depends on.
 */

export type BillingClaimStatus =
  | "paid"
  | "denied"
  | "rejected"
  | "pending"
  | "submitted"
  | "unbilled";

export interface FunnelStage {
  id: string;
  label: string;
  claims: number;
  amount: number;
  /** Share of the stage immediately above it. */
  conversionPct: number;
  drillPath: string;
  drillHint: string;
}

export interface StatusSlice {
  status: BillingClaimStatus;
  label: string;
  claims: number;
  amount: number;
}

export interface BillingSummaryRow {
  id: string;
  name: string;
  /** Secondary descriptor: plan type, specialty, region or CPT description. */
  detail: string;
  claims: number;
  billed: number;
  paid: number;
  denied: number;
  rejected: number;
  pending: number;
  firstPassRatePct: number;
}

export interface RecentClaimRow {
  id: string;
  patient: string;
  payer: string;
  provider: string;
  facility: string;
  cpt: string;
  serviceDate: string;
  submittedDate: string;
  amount: number;
  status: BillingClaimStatus;
  ageDays: number;
  note: string;
}

export interface BillingStatusDashboard {
  kpis: ExecutiveKpi[];
  funnel: FunnelStage[];
  statusMix: StatusSlice[];
  byInsurance: BillingSummaryRow[];
  byProvider: BillingSummaryRow[];
  byFacility: BillingSummaryRow[];
  byCpt: BillingSummaryRow[];
  recentClaims: RecentClaimRow[];
  lastRefreshedAt: string;
  source: string;
}

const kpis: ExecutiveKpi[] = [
  {
    id: "claims-submitted",
    label: "Claims submitted",
    value: 14_910,
    format: "number",
    deltaPct: 2.5,
    trend: "up",
    helper: "Claims transmitted to payers this cycle",
    drillPath: "/claims",
    drillHint: "Submission batches by clearinghouse, payer and transmission date",
  },
  {
    id: "claims-paid",
    label: "Claims paid",
    value: 11_684,
    format: "number",
    deltaPct: 3.1,
    trend: "up",
    helper: "Adjudicated with remittance posted",
    drillPath: "/collections",
    drillHint: "Remittance detail, payment velocity and underpayment variance",
  },
  {
    id: "claims-denied",
    label: "Claims denied",
    value: 1_192,
    format: "number",
    deltaPct: -4.2,
    trend: "down",
    helper: "Adjudicated with a denial reason code",
    drillPath: "/denials",
    drillHint: "Denials by CARC/RARC code, payer and recoverable value",
  },
  {
    id: "claims-rejected",
    label: "Claims rejected",
    value: 486,
    format: "number",
    deltaPct: -6.8,
    trend: "down",
    helper: "Front-end rejections before adjudication",
    drillPath: "/claims",
    drillHint: "Clearinghouse edits, scrubber failures and rework owner",
  },
  {
    id: "claims-pending",
    label: "Claims pending",
    value: 1_548,
    format: "number",
    deltaPct: 1.4,
    trend: "up",
    helper: "In payer adjudication, no response yet",
    drillPath: "/ar",
    drillHint: "Aging of in-flight claims and no-response follow-up queue",
  },
  {
    id: "claims-unbilled",
    label: "Claims unbilled",
    value: 934,
    format: "number",
    deltaPct: -9.3,
    trend: "down",
    helper: "Charges captured but not yet released",
    drillPath: "/unsigned-encounters",
    drillHint: "Coding holds, missing documentation and charge-review edits",
  },
  {
    id: "first-pass-acceptance",
    label: "First pass acceptance rate",
    value: 96.7,
    format: "percent",
    deltaPct: 0.6,
    trend: "up",
    target: 98,
    helper: "Accepted by the payer without rework",
    drillPath: "/claims",
    drillHint: "Acceptance by payer, scrubber rule and biller",
  },
];

const funnel: FunnelStage[] = [
  { id: "captured", label: "Charges captured", claims: 16_780, amount: 3_142_000, conversionPct: 100, drillPath: "/billing", drillHint: "Charge capture volume by department and posting lag" },
  { id: "billed", label: "Claims billed", claims: 15_846, amount: 2_968_000, conversionPct: 94.4, drillPath: "/billing", drillHint: "Charge release, coding holds and billing edits" },
  { id: "submitted", label: "Claims submitted", claims: 14_910, amount: 2_804_000, conversionPct: 94.1, drillPath: "/claims", drillHint: "Transmission batches and clearinghouse acknowledgements" },
  { id: "accepted", label: "Accepted by payer", claims: 14_424, amount: 2_712_000, conversionPct: 96.7, drillPath: "/claims", drillHint: "First pass acceptance and front-end rejection reasons" },
  { id: "adjudicated", label: "Adjudicated", claims: 12_876, amount: 2_418_000, conversionPct: 89.3, drillPath: "/claims", drillHint: "Adjudication turnaround by payer and claim type" },
  { id: "paid", label: "Paid", claims: 11_684, amount: 2_063_000, conversionPct: 90.7, drillPath: "/collections", drillHint: "Payment posting, contractual variance and patient responsibility" },
];

const statusMix: StatusSlice[] = [
  { status: "paid", label: "Paid", claims: 11_684, amount: 2_063_000 },
  { status: "pending", label: "Pending", claims: 1_548, amount: 384_000 },
  { status: "denied", label: "Denied", claims: 1_192, amount: 296_400 },
  { status: "unbilled", label: "Unbilled", claims: 934, amount: 174_000 },
  { status: "rejected", label: "Rejected", claims: 486, amount: 118_600 },
  { status: "submitted", label: "Awaiting response", claims: 962, amount: 231_800 },
];

const byInsurance: BillingSummaryRow[] = [
  { id: "INS-01", name: "Blue Cross Blue Shield", detail: "Commercial PPO", claims: 3_420, billed: 704_000, paid: 512_400, denied: 214, rejected: 82, pending: 296, firstPassRatePct: 97.6 },
  { id: "INS-02", name: "UnitedHealthcare", detail: "Commercial HMO", claims: 2_980, billed: 618_000, paid: 438_900, denied: 268, rejected: 104, pending: 341, firstPassRatePct: 96.5 },
  { id: "INS-03", name: "Medicare", detail: "Government", claims: 3_140, billed: 512_000, paid: 396_700, denied: 142, rejected: 46, pending: 218, firstPassRatePct: 98.5 },
  { id: "INS-04", name: "Aetna", detail: "Commercial PPO", claims: 1_960, billed: 402_000, paid: 284_500, denied: 246, rejected: 118, pending: 264, firstPassRatePct: 94.0 },
  { id: "INS-05", name: "Cigna", detail: "Commercial POS", claims: 1_540, billed: 306_000, paid: 212_300, denied: 158, rejected: 74, pending: 202, firstPassRatePct: 95.2 },
  { id: "INS-06", name: "Humana", detail: "Medicare Advantage", claims: 980, billed: 172_000, paid: 118_200, denied: 96, rejected: 38, pending: 142, firstPassRatePct: 96.1 },
  { id: "INS-07", name: "Medicaid", detail: "Government", claims: 890, billed: 90_000, paid: 62_400, denied: 68, rejected: 24, pending: 85, firstPassRatePct: 97.3 },
];

const byProvider: BillingSummaryRow[] = [
  { id: "PRV-1042", name: "Dr. Elena Marsh", detail: "Cardiology", claims: 1_286, billed: 412_800, paid: 318_400, denied: 74, rejected: 21, pending: 118, firstPassRatePct: 98.4 },
  { id: "PRV-1188", name: "Dr. Samuel Oyelaran", detail: "Orthopedics", claims: 1_142, billed: 388_500, paid: 296_100, denied: 88, rejected: 32, pending: 132, firstPassRatePct: 97.2 },
  { id: "PRV-1273", name: "Dr. Priya Raghavan", detail: "Gastroenterology", claims: 1_318, billed: 341_200, paid: 262_700, denied: 96, rejected: 41, pending: 148, firstPassRatePct: 96.9 },
  { id: "PRV-1319", name: "Dr. Marcus Feld", detail: "General Surgery", claims: 864, billed: 327_900, paid: 248_300, denied: 82, rejected: 36, pending: 106, firstPassRatePct: 95.8 },
  { id: "PRV-1401", name: "Dr. Ana Beltrán", detail: "Internal Medicine", claims: 1_642, billed: 289_400, paid: 221_800, denied: 118, rejected: 52, pending: 174, firstPassRatePct: 96.8 },
  { id: "PRV-1466", name: "Dr. Kevin Doyle", detail: "Pulmonology", claims: 1_048, billed: 264_100, paid: 198_500, denied: 104, rejected: 48, pending: 141, firstPassRatePct: 95.4 },
];

const byFacility: BillingSummaryRow[] = [
  { id: "FAC-01", name: "Northside Medical Center", detail: "Multi-specialty, 240 beds", claims: 5_820, billed: 1_146_000, paid: 842_600, denied: 412, rejected: 168, pending: 604, firstPassRatePct: 97.1 },
  { id: "FAC-02", name: "Lakeview Surgical", detail: "Ambulatory surgery center", claims: 3_640, billed: 812_000, paid: 596_400, denied: 318, rejected: 124, pending: 386, firstPassRatePct: 96.6 },
  { id: "FAC-03", name: "Westgate Clinic", detail: "Primary care network", claims: 3_180, billed: 486_000, paid: 358_200, denied: 264, rejected: 108, pending: 342, firstPassRatePct: 96.9 },
  { id: "FAC-04", name: "Riverbend Imaging", detail: "Diagnostic imaging", claims: 1_486, billed: 248_000, paid: 178_400, denied: 132, rejected: 58, pending: 148, firstPassRatePct: 95.7 },
  { id: "FAC-05", name: "Harbor Behavioral Health", detail: "Behavioral health", claims: 784, billed: 112_000, paid: 87_400, denied: 66, rejected: 28, pending: 68, firstPassRatePct: 94.8 },
];

const byCpt: BillingSummaryRow[] = [
  { id: "99214", name: "99214", detail: "Office visit, established, moderate", claims: 3_412, billed: 486_200, paid: 372_400, denied: 186, rejected: 62, pending: 318, firstPassRatePct: 98.2 },
  { id: "93000", name: "93000", detail: "Electrocardiogram, complete", claims: 1_984, billed: 214_800, paid: 168_900, denied: 92, rejected: 34, pending: 164, firstPassRatePct: 97.8 },
  { id: "29881", name: "29881", detail: "Knee arthroscopy with meniscectomy", claims: 486, billed: 398_400, paid: 292_600, denied: 74, rejected: 28, pending: 62, firstPassRatePct: 95.1 },
  { id: "45378", name: "45378", detail: "Colonoscopy, diagnostic", claims: 742, billed: 312_600, paid: 236_800, denied: 68, rejected: 26, pending: 84, firstPassRatePct: 96.4 },
  { id: "70553", name: "70553", detail: "MRI brain with and without contrast", claims: 398, billed: 268_400, paid: 191_200, denied: 82, rejected: 36, pending: 71, firstPassRatePct: 93.9 },
  { id: "99213", name: "99213", detail: "Office visit, established, low", claims: 2_864, billed: 296_100, paid: 228_400, denied: 142, rejected: 48, pending: 246, firstPassRatePct: 98.0 },
  { id: "36415", name: "36415", detail: "Routine venipuncture", claims: 2_140, billed: 42_800, paid: 33_600, denied: 46, rejected: 18, pending: 108, firstPassRatePct: 98.6 },
];

const recentClaims: RecentClaimRow[] = [
  { id: "CLM-880412", patient: "R. Whitfield", payer: "Aetna", provider: "Dr. Elena Marsh", facility: "Northside Medical Center", cpt: "93000", serviceDate: "2026-07-18", submittedDate: "2026-07-21", amount: 1_240, status: "denied", ageDays: 7, note: "CO-97 bundled service — appeal drafted" },
  { id: "CLM-880398", patient: "M. Okafor", payer: "UnitedHealthcare", provider: "Dr. Samuel Oyelaran", facility: "Lakeview Surgical", cpt: "29881", serviceDate: "2026-07-16", submittedDate: "2026-07-19", amount: 8_240, status: "pending", ageDays: 9, note: "Awaiting payer adjudication response" },
  { id: "CLM-880374", patient: "J. Alvarez", payer: "Blue Cross Blue Shield", provider: "Dr. Priya Raghavan", facility: "Northside Medical Center", cpt: "45378", serviceDate: "2026-07-15", submittedDate: "2026-07-17", amount: 3_150, status: "paid", ageDays: 11, note: "Paid at contracted allowable" },
  { id: "CLM-880351", patient: "T. Nguyen", payer: "Cigna", provider: "Dr. Ana Beltrán", facility: "Westgate Clinic", cpt: "99214", serviceDate: "2026-07-14", submittedDate: "2026-07-16", amount: 428, status: "rejected", ageDays: 12, note: "Subscriber ID mismatch at clearinghouse" },
  { id: "CLM-880337", patient: "S. Brennan", payer: "Medicare", provider: "Dr. Marcus Feld", facility: "Lakeview Surgical", cpt: "70553", serviceDate: "2026-07-13", submittedDate: "2026-07-15", amount: 2_890, status: "paid", ageDays: 13, note: "Remittance posted, zero variance" },
  { id: "CLM-880319", patient: "D. Kaminski", payer: "Humana", provider: "Dr. Kevin Doyle", facility: "Riverbend Imaging", cpt: "70553", serviceDate: "2026-07-12", submittedDate: "", amount: 2_310, status: "unbilled", ageDays: 16, note: "Held for missing radiology report" },
  { id: "CLM-880294", patient: "P. Sundaram", payer: "Medicaid", provider: "Dr. Ana Beltrán", facility: "Westgate Clinic", cpt: "36415", serviceDate: "2026-07-11", submittedDate: "2026-07-13", amount: 235, status: "paid", ageDays: 17, note: "Auto-posted from 835 file" },
  { id: "CLM-880271", patient: "L. Fontaine", payer: "Aetna", provider: "Dr. Elena Marsh", facility: "Northside Medical Center", cpt: "99213", serviceDate: "2026-07-10", submittedDate: "2026-07-12", amount: 396, status: "submitted", ageDays: 18, note: "Acknowledged by clearinghouse" },
  { id: "CLM-880248", patient: "G. Petrova", payer: "Blue Cross Blue Shield", provider: "Dr. Samuel Oyelaran", facility: "Lakeview Surgical", cpt: "29881", serviceDate: "2026-07-09", submittedDate: "2026-07-11", amount: 9_480, status: "pending", ageDays: 19, note: "Medical records requested by payer" },
  { id: "CLM-880226", patient: "H. Castillo", payer: "UnitedHealthcare", provider: "Dr. Priya Raghavan", facility: "Northside Medical Center", cpt: "45378", serviceDate: "2026-07-08", submittedDate: "2026-07-10", amount: 3_640, status: "denied", ageDays: 20, note: "CO-50 medical necessity — records attached" },
  { id: "CLM-880203", patient: "A. Lindqvist", payer: "Medicare", provider: "Dr. Kevin Doyle", facility: "Riverbend Imaging", cpt: "93000", serviceDate: "2026-07-07", submittedDate: "2026-07-09", amount: 812, status: "paid", ageDays: 21, note: "Paid within 14 days of submission" },
  { id: "CLM-880189", patient: "C. Mbeki", payer: "Cigna", provider: "Dr. Marcus Feld", facility: "Harbor Behavioral Health", cpt: "99214", serviceDate: "2026-07-06", submittedDate: "", amount: 512, status: "unbilled", ageDays: 22, note: "Charge review edit — provider credentialing" },
];

export const billingStatusDashboard: BillingStatusDashboard = {
  kpis,
  funnel,
  statusMix,
  byInsurance,
  byProvider,
  byFacility,
  byCpt,
  recentClaims,
  lastRefreshedAt: "2026-07-28T06:15:00Z",
  source: "Clearinghouse 837/835 feed + PM charge ledger",
};
