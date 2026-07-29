export type Trend = "up" | "down" | "flat";

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent" | "days";
  deltaPct: number;
  trend: Trend;
  target?: number;
  helper: string;
}

export interface RevenuePoint {
  month: string;
  billed: number;
  collected: number;
  adjustments: number;
}

export interface AgingBucket {
  bucket: string;
  amount: number;
  claims: number;
}

export type ClaimStatus = "paid" | "pending" | "denied" | "appealed" | "submitted";

export interface Claim {
  id: string;
  patient: string;
  payer: string;
  serviceDate: string;
  submittedDate: string;
  amount: number;
  paidAmount: number;
  status: ClaimStatus;
  ageDays: number;
  facility: string;
}

export interface DenialReason {
  code: string;
  reason: string;
  count: number;
  amount: number;
  recoverablePct: number;
  category: "clinical" | "technical" | "eligibility" | "coding" | "authorization";
}

export interface PayerPerformance {
  id: string;
  name: string;
  claims: number;
  collectedAmount: number;
  denialRate: number;
  avgDaysToPay: number;
  cleanClaimRate: number;
  contractStatus: "active" | "renewal" | "negotiating";
}

export interface ClaimQuery {
  search?: string;
  status?: ClaimStatus | "all";
}

export interface Provider {
  id: string;
  name: string;
  npi: string;
  specialty: string;
  practiceId: string;
}

export interface Practice {
  id: string;
  name: string;
  region: string;
  providerCount: number;
}

export type EncounterStatus = "signed" | "unsigned" | "coded" | "billed";

export interface Encounter {
  id: string;
  patient: string;
  providerId: string;
  serviceDate: string;
  visitType: string;
  cptCode: string;
  wrvu: number;
  charge: number;
  status: EncounterStatus;
  daysOpen: number;
}

export interface ProductivityMetric {
  month: string;
  wrvu: number;
  encounters: number;
  targetWrvu: number;
}

export interface ForecastPoint {
  month: string;
  projected: number;
  low: number;
  high: number;
  actual?: number;
}

export interface PatientBalance {
  id: string;
  patient: string;
  payer: string;
  practice: string;
  insuranceBalance: number;
  patientBalance: number;
  lastStatement: string;
  ageDays: number;
}

/* ---------------------------------------------------------------------------
 * Executive home dashboard
 * ------------------------------------------------------------------------ */

/** A headline KPI with a drill-down target for detailed analysis. */
export interface ExecutiveKpi extends KpiMetric {
  /** Route the drill-down opens once detail views ship. */
  drillPath: string;
  /** Short description of what the drill-down will contain. */
  drillHint: string;
}

export interface SnapshotItem {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent" | "days";
  helper: string;
  drillPath: string;
}

export type AlertSeverity = "critical" | "warning" | "info";

export interface CriticalAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  impact: number;
  drillPath: string;
}

export interface AiInsight {
  id: string;
  headline: string;
  body: string;
  confidence: number;
  drillPath: string;
}

export interface CollectionsPoint {
  month: string;
  collected: number;
  goal: number;
}

export interface ClaimsTrendPoint {
  month: string;
  submitted: number;
  paid: number;
  denied: number;
  pending: number;
}

export interface ArTrendPoint {
  month: string;
  arBalance: number;
  daysInAr: number;
}

export type ActivityKind = "payment" | "denial" | "submission" | "adjustment" | "user";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  amount?: number;
  timestamp: string;
  drillPath: string;
}

export interface ExecutiveDashboard {
  kpis: ExecutiveKpi[];
  snapshot: SnapshotItem[];
  alerts: CriticalAlert[];
  insights: AiInsight[];
  collectionsTrend: CollectionsPoint[];
  claimsTrend: ClaimsTrendPoint[];
  arTrend: ArTrendPoint[];
  activity: ActivityEvent[];
  /** ISO timestamp of the last successful data refresh. */
  lastRefreshedAt: string;
  /** Source system that produced the current snapshot. */
  source: string;
}
