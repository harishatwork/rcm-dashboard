import { executiveDashboard } from "./executive";
import { kpiDashboard, type KpiDashboard } from "./kpi-dashboard";
import { billingStatusDashboard, type BillingStatusDashboard } from "./billing-status";
import { revenueDashboard, type RevenueDashboard } from "./revenue-dashboard";
import { collectionsDashboard, type CollectionsDashboard } from "./collections-dashboard";
import { arDashboard, type ArDashboard } from "./ar-dashboard";
import { getMockDenialsDashboardData, type DenialsDashboardData } from "./denials-dashboard";
import { getMockInsuranceDashboardData, type InsuranceDashboardData } from "./insurance-dashboard";
import { getMockPatientAnalyticsData, type PatientAnalyticsDashboardData } from "./patient-analytics";
import { getMockProviderPerformanceDashboardData, type ProviderPerformanceDashboardData } from "./provider-performance-dashboard";
import { getMockOperationalDashboardData, type OperationalDashboardData } from "./operational-dashboard";
import { getMockReportsAnalyticsDashboardData, type ReportsAnalyticsDashboardData } from "./reports-analytics-dashboard";
import { getMockPredictiveAnalyticsDashboardData, type PredictiveAnalyticsDashboardData } from "./predictive-analytics";
import { getMockNotificationsData, type NotificationsDashboardData } from "./notifications";
import { getMockAdministrationData, type AdministrationPortalData } from "./administration";
import { getMockDrillDownDetailData, type DrillDownDetailResponse, type EntityType, type DrillLevel } from "./drilldown";
import { getMockPersonalizationData, savePersonalizationData, type PersonalizationData } from "./personalization";
import type {
  AgingBucket,
  ExecutiveDashboard,
  Encounter,
  ForecastPoint,
  PatientBalance,
  ProductivityMetric,
  Claim,
  ClaimQuery,
  DenialReason,
  KpiMetric,
  PayerPerformance,
  Practice,
  Provider,
  RevenuePoint,
} from "./types";

/**
 * Data access layer.
 *
 * Every function below is the single seam between the UI and the backend.
 * To connect a real API, replace the body of each function with a `fetch`
 * (or a server function) call that returns the same typed shape — no UI
 * component needs to change.
 */

const API_BASE_URL = import.meta.env.VITE_RCM_API_URL ?? "";

async function request<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE_URL) {
    // No API configured yet — serve the in-memory reference dataset.
    await new Promise((resolve) => setTimeout(resolve, 220));
    return fallback;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

const kpis: KpiMetric[] = [
  {
    id: "net-collections",
    label: "Net collections",
    value: 18_420_500,
    format: "currency",
    deltaPct: 6.4,
    trend: "up",
    helper: "Rolling 12 months vs. prior period",
  },
  {
    id: "days-in-ar",
    label: "Days in A/R",
    value: 34.2,
    format: "days",
    deltaPct: -8.1,
    trend: "down",
    target: 32,
    helper: "Target 32 days",
  },
  {
    id: "clean-claim",
    label: "Clean claim rate",
    value: 94.8,
    format: "percent",
    deltaPct: 1.9,
    trend: "up",
    target: 96,
    helper: "First-pass acceptance",
  },
  {
    id: "denial-rate",
    label: "Denial rate",
    value: 6.3,
    format: "percent",
    deltaPct: -1.2,
    trend: "down",
    target: 5,
    helper: "Of all submitted claims",
  },
];

const revenueTrend: RevenuePoint[] = [
  { month: "Aug", billed: 2_180_000, collected: 1_742_000, adjustments: 312_000 },
  { month: "Sep", billed: 2_310_000, collected: 1_868_000, adjustments: 298_000 },
  { month: "Oct", billed: 2_255_000, collected: 1_811_000, adjustments: 336_000 },
  { month: "Nov", billed: 2_480_000, collected: 2_042_000, adjustments: 305_000 },
  { month: "Dec", billed: 2_640_000, collected: 2_138_000, adjustments: 348_000 },
  { month: "Jan", billed: 2_512_000, collected: 2_090_000, adjustments: 291_000 },
  { month: "Feb", billed: 2_705_000, collected: 2_284_000, adjustments: 276_000 },
  { month: "Mar", billed: 2_890_000, collected: 2_431_000, adjustments: 318_000 },
];

const aging: AgingBucket[] = [
  { bucket: "0–30", amount: 4_120_000, claims: 3_412 },
  { bucket: "31–60", amount: 2_360_000, claims: 1_884 },
  { bucket: "61–90", amount: 1_180_000, claims: 962 },
  { bucket: "91–120", amount: 640_000, claims: 501 },
  { bucket: "120+", amount: 415_000, claims: 388 },
];

const claims: Claim[] = [
  {
    id: "CLM-284193",
    patient: "R. Whitfield",
    payer: "Aetna",
    serviceDate: "2026-06-14",
    submittedDate: "2026-06-17",
    amount: 12_480,
    paidAmount: 11_960,
    status: "paid",
    ageDays: 12,
    facility: "Northside Medical Center",
  },
  {
    id: "CLM-284207",
    patient: "M. Okafor",
    payer: "UnitedHealthcare",
    serviceDate: "2026-06-18",
    submittedDate: "2026-06-20",
    amount: 8_240,
    paidAmount: 0,
    status: "denied",
    ageDays: 38,
    facility: "Lakeview Surgical",
  },
  {
    id: "CLM-284255",
    patient: "J. Alvarez",
    payer: "Blue Cross Blue Shield",
    serviceDate: "2026-06-21",
    submittedDate: "2026-06-22",
    amount: 21_150,
    paidAmount: 0,
    status: "pending",
    ageDays: 34,
    facility: "Northside Medical Center",
  },
  {
    id: "CLM-284301",
    patient: "T. Nguyen",
    payer: "Cigna",
    serviceDate: "2026-06-25",
    submittedDate: "2026-06-26",
    amount: 4_760,
    paidAmount: 4_320,
    status: "paid",
    ageDays: 9,
    facility: "Westgate Clinic",
  },
  {
    id: "CLM-284366",
    patient: "S. Brennan",
    payer: "Medicare",
    serviceDate: "2026-06-29",
    submittedDate: "2026-07-01",
    amount: 15_890,
    paidAmount: 0,
    status: "appealed",
    ageDays: 27,
    facility: "Lakeview Surgical",
  },
  {
    id: "CLM-284402",
    patient: "D. Kaminski",
    payer: "Humana",
    serviceDate: "2026-07-02",
    submittedDate: "2026-07-03",
    amount: 6_310,
    paidAmount: 0,
    status: "submitted",
    ageDays: 25,
    facility: "Westgate Clinic",
  },
  {
    id: "CLM-284471",
    patient: "P. Sundaram",
    payer: "Medicaid",
    serviceDate: "2026-07-05",
    submittedDate: "2026-07-06",
    amount: 3_215,
    paidAmount: 2_980,
    status: "paid",
    ageDays: 22,
    facility: "Northside Medical Center",
  },
  {
    id: "CLM-284519",
    patient: "L. Fontaine",
    payer: "Aetna",
    serviceDate: "2026-07-08",
    submittedDate: "2026-07-09",
    amount: 9_940,
    paidAmount: 0,
    status: "denied",
    ageDays: 19,
    facility: "Lakeview Surgical",
  },
  {
    id: "CLM-284577",
    patient: "A. Rahman",
    payer: "UnitedHealthcare",
    serviceDate: "2026-07-11",
    submittedDate: "2026-07-12",
    amount: 17_600,
    paidAmount: 0,
    status: "pending",
    ageDays: 16,
    facility: "Northside Medical Center",
  },
  {
    id: "CLM-284620",
    patient: "K. Osei",
    payer: "Cigna",
    serviceDate: "2026-07-15",
    submittedDate: "2026-07-16",
    amount: 5_480,
    paidAmount: 5_110,
    status: "paid",
    ageDays: 12,
    facility: "Westgate Clinic",
  },
  {
    id: "CLM-284688",
    patient: "H. Lindqvist",
    payer: "Blue Cross Blue Shield",
    serviceDate: "2026-07-18",
    submittedDate: "2026-07-19",
    amount: 28_320,
    paidAmount: 0,
    status: "appealed",
    ageDays: 9,
    facility: "Lakeview Surgical",
  },
  {
    id: "CLM-284712",
    patient: "C. Moreau",
    payer: "Medicare",
    serviceDate: "2026-07-21",
    submittedDate: "2026-07-22",
    amount: 7_050,
    paidAmount: 0,
    status: "submitted",
    ageDays: 6,
    facility: "Westgate Clinic",
  },
];

const denials: DenialReason[] = [
  {
    code: "CO-197",
    reason: "Pre-authorization absent",
    count: 412,
    amount: 1_842_000,
    recoverablePct: 68,
    category: "authorization",
  },
  {
    code: "CO-16",
    reason: "Missing or invalid information",
    count: 388,
    amount: 1_120_000,
    recoverablePct: 84,
    category: "technical",
  },
  {
    code: "CO-27",
    reason: "Coverage terminated at service date",
    count: 265,
    amount: 964_000,
    recoverablePct: 31,
    category: "eligibility",
  },
  {
    code: "CO-50",
    reason: "Not deemed medically necessary",
    count: 214,
    amount: 1_356_000,
    recoverablePct: 44,
    category: "clinical",
  },
  {
    code: "CO-4",
    reason: "Procedure/modifier inconsistency",
    count: 187,
    amount: 512_000,
    recoverablePct: 91,
    category: "coding",
  },
  {
    code: "CO-29",
    reason: "Timely filing limit exceeded",
    count: 96,
    amount: 388_000,
    recoverablePct: 12,
    category: "technical",
  },
];

const payers: PayerPerformance[] = [
  {
    id: "aetna",
    name: "Aetna",
    claims: 4_812,
    collectedAmount: 3_940_000,
    denialRate: 5.4,
    avgDaysToPay: 28,
    cleanClaimRate: 95.6,
    contractStatus: "active",
  },
  {
    id: "uhc",
    name: "UnitedHealthcare",
    claims: 5_240,
    collectedAmount: 4_612_000,
    denialRate: 7.8,
    avgDaysToPay: 36,
    cleanClaimRate: 92.1,
    contractStatus: "negotiating",
  },
  {
    id: "bcbs",
    name: "Blue Cross Blue Shield",
    claims: 6_105,
    collectedAmount: 5_180_000,
    denialRate: 6.1,
    avgDaysToPay: 31,
    cleanClaimRate: 94.4,
    contractStatus: "active",
  },
  {
    id: "cigna",
    name: "Cigna",
    claims: 2_980,
    collectedAmount: 2_140_000,
    denialRate: 4.9,
    avgDaysToPay: 26,
    cleanClaimRate: 96.3,
    contractStatus: "renewal",
  },
  {
    id: "medicare",
    name: "Medicare",
    claims: 7_412,
    collectedAmount: 6_305_000,
    denialRate: 3.8,
    avgDaysToPay: 22,
    cleanClaimRate: 97.1,
    contractStatus: "active",
  },
  {
    id: "medicaid",
    name: "Medicaid",
    claims: 3_366,
    collectedAmount: 1_884_000,
    denialRate: 9.2,
    avgDaysToPay: 41,
    cleanClaimRate: 89.7,
    contractStatus: "active",
  },
];

const practices: Practice[] = [
  { id: "northside", name: "Northside Medical Center", region: "Midwest", providerCount: 84 },
  { id: "westgate", name: "Westgate Clinic", region: "West", providerCount: 42 },
  { id: "lakeview", name: "Lakeview Surgical", region: "Northeast", providerCount: 37 },
  { id: "harborcare", name: "Harborcare Physicians", region: "Southeast", providerCount: 51 },
  { id: "summit", name: "Summit Family Health", region: "Mountain", providerCount: 29 },
];

const providers: Provider[] = [
  { id: "npi-1023", name: "Dr. Amara Osei", npi: "1023847561", specialty: "Cardiology", practiceId: "northside" },
  { id: "npi-1187", name: "Dr. Daniel Reyes", npi: "1187459023", specialty: "Orthopedics", practiceId: "lakeview" },
  { id: "npi-1246", name: "Dr. Priya Nair", npi: "1246730915", specialty: "Internal Medicine", practiceId: "westgate" },
  { id: "npi-1355", name: "Dr. Erik Lindqvist", npi: "1355902874", specialty: "General Surgery", practiceId: "lakeview" },
  { id: "npi-1421", name: "Dr. Chloe Moreau", npi: "1421068392", specialty: "Family Medicine", practiceId: "summit" },
  { id: "npi-1590", name: "Dr. Marcus Bell", npi: "1590284763", specialty: "Oncology", practiceId: "harborcare" },
  { id: "npi-1688", name: "Dr. Hana Sato", npi: "1688473029", specialty: "Radiology", practiceId: "northside" },
];

const encounters: Encounter[] = [
  { id: "ENC-90412", patient: "R. Whitfield", providerId: "npi-1023", serviceDate: "2026-07-20", visitType: "Follow-up", cptCode: "99214", wrvu: 1.92, charge: 285, status: "signed", daysOpen: 0 },
  { id: "ENC-90418", patient: "M. Okafor", providerId: "npi-1023", serviceDate: "2026-07-21", visitType: "New patient", cptCode: "99204", wrvu: 2.6, charge: 410, status: "unsigned", daysOpen: 6 },
  { id: "ENC-90423", patient: "J. Alvarez", providerId: "npi-1023", serviceDate: "2026-07-22", visitType: "Procedure", cptCode: "93306", wrvu: 3.4, charge: 1_240, status: "coded", daysOpen: 1 },
  { id: "ENC-90431", patient: "T. Nguyen", providerId: "npi-1023", serviceDate: "2026-07-23", visitType: "Follow-up", cptCode: "99213", wrvu: 1.3, charge: 195, status: "unsigned", daysOpen: 4 },
  { id: "ENC-90447", patient: "S. Brennan", providerId: "npi-1023", serviceDate: "2026-07-24", visitType: "Consult", cptCode: "99244", wrvu: 3.02, charge: 520, status: "billed", daysOpen: 0 },
  { id: "ENC-90455", patient: "D. Kaminski", providerId: "npi-1023", serviceDate: "2026-07-24", visitType: "Follow-up", cptCode: "99214", wrvu: 1.92, charge: 285, status: "unsigned", daysOpen: 3 },
  { id: "ENC-90462", patient: "P. Sundaram", providerId: "npi-1023", serviceDate: "2026-07-25", visitType: "Telehealth", cptCode: "99442", wrvu: 1.0, charge: 145, status: "signed", daysOpen: 0 },
  { id: "ENC-90470", patient: "L. Fontaine", providerId: "npi-1023", serviceDate: "2026-07-26", visitType: "Procedure", cptCode: "93000", wrvu: 0.17, charge: 96, status: "unsigned", daysOpen: 2 },
  { id: "ENC-90488", patient: "A. Rahman", providerId: "npi-1023", serviceDate: "2026-07-27", visitType: "New patient", cptCode: "99205", wrvu: 3.5, charge: 615, status: "coded", daysOpen: 1 },
];

const productivity: ProductivityMetric[] = [
  { month: "Feb", wrvu: 412, encounters: 214, targetWrvu: 420 },
  { month: "Mar", wrvu: 448, encounters: 231, targetWrvu: 420 },
  { month: "Apr", wrvu: 396, encounters: 205, targetWrvu: 420 },
  { month: "May", wrvu: 471, encounters: 246, targetWrvu: 430 },
  { month: "Jun", wrvu: 489, encounters: 252, targetWrvu: 430 },
  { month: "Jul", wrvu: 462, encounters: 238, targetWrvu: 430 },
];

const forecast: ForecastPoint[] = [
  { month: "May", projected: 2_640_000, low: 2_540_000, high: 2_740_000, actual: 2_688_000 },
  { month: "Jun", projected: 2_720_000, low: 2_610_000, high: 2_830_000, actual: 2_754_000 },
  { month: "Jul", projected: 2_810_000, low: 2_690_000, high: 2_930_000, actual: 2_796_000 },
  { month: "Aug", projected: 2_885_000, low: 2_730_000, high: 3_040_000 },
  { month: "Sep", projected: 2_960_000, low: 2_780_000, high: 3_140_000 },
  { month: "Oct", projected: 3_040_000, low: 2_830_000, high: 3_250_000 },
  { month: "Nov", projected: 3_115_000, low: 2_870_000, high: 3_360_000 },
  { month: "Dec", projected: 3_210_000, low: 2_920_000, high: 3_500_000 },
];

const patientBalances: PatientBalance[] = [
  { id: "PT-40182", patient: "R. Whitfield", payer: "Aetna", practice: "Northside Medical Center", insuranceBalance: 1_240, patientBalance: 320, lastStatement: "2026-07-08", ageDays: 19 },
  { id: "PT-40219", patient: "M. Okafor", payer: "UnitedHealthcare", practice: "Lakeview Surgical", insuranceBalance: 8_240, patientBalance: 1_120, lastStatement: "2026-06-28", ageDays: 46 },
  { id: "PT-40254", patient: "J. Alvarez", payer: "Blue Cross Blue Shield", practice: "Northside Medical Center", insuranceBalance: 21_150, patientBalance: 0, lastStatement: "2026-07-02", ageDays: 34 },
  { id: "PT-40288", patient: "T. Nguyen", payer: "Cigna", practice: "Westgate Clinic", insuranceBalance: 0, patientBalance: 440, lastStatement: "2026-07-12", ageDays: 15 },
  { id: "PT-40311", patient: "S. Brennan", payer: "Medicare", practice: "Lakeview Surgical", insuranceBalance: 15_890, patientBalance: 610, lastStatement: "2026-07-05", ageDays: 27 },
  { id: "PT-40347", patient: "D. Kaminski", payer: "Humana", practice: "Westgate Clinic", insuranceBalance: 6_310, patientBalance: 285, lastStatement: "2026-07-10", ageDays: 25 },
  { id: "PT-40390", patient: "P. Sundaram", payer: "Medicaid", practice: "Northside Medical Center", insuranceBalance: 235, patientBalance: 0, lastStatement: "2026-07-14", ageDays: 22 },
  { id: "PT-40422", patient: "L. Fontaine", payer: "Aetna", practice: "Lakeview Surgical", insuranceBalance: 9_940, patientBalance: 780, lastStatement: "2026-07-16", ageDays: 19 },
];

export const rcmApi = {
  getArDashboard: () => request<ArDashboard>("/metrics/ar-dashboard", arDashboard),
  getCollectionsDashboard: () =>
    request<CollectionsDashboard>("/metrics/collections-dashboard", collectionsDashboard),
  getRevenueDashboard: () =>
    request<RevenueDashboard>("/metrics/revenue-dashboard", revenueDashboard),
  getBillingStatus: () =>
    request<BillingStatusDashboard>("/metrics/billing-status", billingStatusDashboard),
  getKpiDashboard: () => request<KpiDashboard>("/metrics/kpi-dashboard", kpiDashboard),
  getExecutiveDashboard: () =>
    request<ExecutiveDashboard>("/metrics/executive-dashboard", executiveDashboard),
  getKpis: () => request<KpiMetric[]>("/metrics/kpis", kpis),
  getEncounters: () => request<Encounter[]>("/encounters", encounters),
  getProductivity: () => request<ProductivityMetric[]>("/metrics/productivity", productivity),
  getForecast: () => request<ForecastPoint[]>("/metrics/forecast", forecast),
  getPatientBalances: () => request<PatientBalance[]>("/patients/balances", patientBalances),
  getRevenueTrend: () => request<RevenuePoint[]>("/metrics/revenue-trend", revenueTrend),
  getAging: () => request<AgingBucket[]>("/metrics/ar-aging", aging),
  getClaims: async (query: ClaimQuery = {}) => {
    const data = await request<Claim[]>("/claims", claims);
    const search = query.search?.trim().toLowerCase();
    return data.filter((claim) => {
      const matchesStatus =
        !query.status || query.status === "all" || claim.status === query.status;
      const matchesSearch =
        !search ||
        [claim.id, claim.patient, claim.payer, claim.facility].some((field) =>
          field.toLowerCase().includes(search),
        );
      return matchesStatus && matchesSearch;
    });
  },
  getDenials: () => request<DenialReason[]>("/denials", denials),
  getDenialsDashboard: () =>
    request<DenialsDashboardData>("/metrics/denials-dashboard", getMockDenialsDashboardData()),
  getInsuranceDashboard: () =>
    request<InsuranceDashboardData>("/metrics/insurance-dashboard", getMockInsuranceDashboardData()),
  getPatientAnalyticsDashboard: () =>
    request<PatientAnalyticsDashboardData>("/metrics/patient-analytics", getMockPatientAnalyticsData()),
  getProviderPerformanceDashboard: () =>
    request<ProviderPerformanceDashboardData>("/metrics/provider-performance-dashboard", getMockProviderPerformanceDashboardData()),
  getOperationalDashboard: () =>
    request<OperationalDashboardData>("/metrics/operational-dashboard", getMockOperationalDashboardData()),
  getReportsAnalyticsDashboard: () =>
    request<ReportsAnalyticsDashboardData>("/metrics/reports-analytics-dashboard", getMockReportsAnalyticsDashboardData()),
  getPredictiveAnalyticsDashboard: () =>
    request<PredictiveAnalyticsDashboardData>("/metrics/predictive-analytics-dashboard", getMockPredictiveAnalyticsDashboardData()),
  getNotificationsData: () =>
    request<NotificationsDashboardData>("/notifications", getMockNotificationsData()),
  getAdministrationData: () =>
    request<AdministrationPortalData>("/administration", getMockAdministrationData()),
  getDrillDownData: (entityType: EntityType = "revenue", entityId: string = "root", level: DrillLevel = 1) =>
    request<DrillDownDetailResponse>(`/drilldown?entityType=${entityType}&entityId=${entityId}&level=${level}`, getMockDrillDownDetailData(entityType, entityId, level)),
  getPersonalizationData: () =>
    request<PersonalizationData>("/personalization", getMockPersonalizationData()),
  savePersonalizationData: (data: PersonalizationData) =>
    request<PersonalizationData>("/personalization/save", savePersonalizationData(data)),
  getPayers: () => request<PayerPerformance[]>("/payers", payers),
  getProviders: () => request<Provider[]>("/providers", providers),
  getPractices: () => request<Practice[]>("/practices", practices),
};
