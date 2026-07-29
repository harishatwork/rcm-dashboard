import type { KpiMetric } from "./types";

export interface PatientKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface PatientVisitsTrendPoint {
  month: string;
  newPatients: number;
  returningPatients: number;
  totalVisits: number;
}

export interface NewVsReturningPoint {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RevenueByPatientTypePoint {
  patientType: string;
  revenue: number;
  avgRevenuePerPatient: number;
}

export interface TopSpecialtyVolumePoint {
  specialty: string;
  patientVolume: number;
  visits: number;
}

export interface MonthlyPatientGrowthPoint {
  month: string;
  netGrowth: number;
  totalActivePatients: number;
}

export interface PatientSummaryRow {
  id: string;
  patientId: string;
  patientName: string;
  lastVisit: string;
  provider: string;
  specialty: string;
  location: string;
  totalVisits: number;
  totalCharges: number;
  totalPayments: number;
  outstandingBalance: number;
  lastPaymentDate: string;
  age: number;
  gender: string;
  patientType: "New" | "Existing";
  satisfactionScore: number;
}

export interface PatientVisitHistoryRow {
  id: string;
  visitDate: string;
  visitType: string;
  provider: string;
  chiefComplaint: string;
  cptCode: string;
  chargeAmount: number;
  status: "Completed" | "No-Show" | "Cancelled" | "Scheduled";
}

export interface PatientBillingHistoryRow {
  id: string;
  claimNumber: string;
  serviceDate: string;
  billedAmount: number;
  insurancePaid: number;
  adjustments: number;
  patientBalance: number;
  status: "Paid" | "Pending" | "Denied" | "Patient Statement";
}

export interface PatientPaymentHistoryRow {
  id: string;
  paymentDate: string;
  paymentMethod: "Credit Card" | "Check" | "Cash" | "HSA/FSA" | "Portal";
  amount: number;
  receiptNumber: string;
  status: "Settled" | "Processing" | "Refunded";
}

export interface PatientAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "Growth Trend" | "High-Value Patient" | "Outstanding Balance" | "No-Show Pattern" | "Retention Opportunity";
  estimatedImpact: number;
  confidence: number;
  patientId?: string;
  type: "positive" | "warning" | "critical" | "info";
}

export interface PatientAnalyticsDashboardData {
  kpis: {
    totalPatients: PatientKpiMetric;
    newPatients: PatientKpiMetric;
    returningPatients: PatientKpiMetric;
    patientCollections: PatientKpiMetric;
    avgRevenuePerPatient: PatientKpiMetric;
    avgVisitsPerPatient: PatientKpiMetric;
    noShowRate: PatientKpiMetric;
    patientSatisfactionScore: PatientKpiMetric;
  };
  visitsTrend: PatientVisitsTrendPoint[];
  newVsReturning: NewVsReturningPoint[];
  revenueByPatientType: RevenueByPatientTypePoint[];
  topSpecialtiesVolume: TopSpecialtyVolumePoint[];
  monthlyPatientGrowth: MonthlyPatientGrowthPoint[];
  patientSummaryRows: PatientSummaryRow[];
  aiInsights: PatientAiInsight[];
  lastUpdated: string;
}

export function getMockPatientAnalyticsData(): PatientAnalyticsDashboardData {
  return {
    kpis: {
      totalPatients: {
        id: "total-patients",
        label: "Total Patients",
        value: 18450,
        previousValue: 17200,
        format: "number",
        deltaPct: 7.3,
        trend: "up",
        helper: "+1,250 active patients YTD",
      },
      newPatients: {
        id: "new-patients",
        label: "New Patients",
        value: 2840,
        previousValue: 2510,
        format: "number",
        deltaPct: 13.1,
        trend: "up",
        helper: "15.4% of active patient base",
      },
      returningPatients: {
        id: "returning-patients",
        label: "Returning Patients",
        value: 15610,
        previousValue: 14690,
        format: "number",
        deltaPct: 6.3,
        trend: "up",
        helper: "84.6% retention rate",
      },
      patientCollections: {
        id: "patient-collections",
        label: "Patient Collections",
        value: 3420000,
        previousValue: 3110000,
        format: "currency",
        deltaPct: 10.0,
        trend: "up",
        helper: "+$310k vs prior period",
      },
      avgRevenuePerPatient: {
        id: "avg-revenue-per-patient",
        label: "Avg Revenue per Patient",
        value: 185.36,
        previousValue: 180.81,
        format: "currency",
        deltaPct: 2.5,
        trend: "up",
        helper: "+$4.55 per patient encounter",
      },
      avgVisitsPerPatient: {
        id: "avg-visits-per-patient",
        label: "Avg Visits per Patient",
        value: 3.4,
        previousValue: 3.2,
        format: "number",
        deltaPct: 6.2,
        trend: "up",
        helper: "3.4 encounters / year average",
      },
      noShowRate: {
        id: "no-show-rate",
        label: "No-Show Rate",
        value: 4.2,
        previousValue: 5.6,
        format: "percent",
        deltaPct: -1.4,
        trend: "down",
        target: 4.0,
        helper: "1.4% improvement in attendance",
      },
      patientSatisfactionScore: {
        id: "patient-satisfaction-score",
        label: "Satisfaction Score",
        value: 4.8,
        previousValue: 4.6,
        format: "number",
        deltaPct: 4.3,
        trend: "up",
        target: 4.9,
        helper: "Out of 5.0 rating scale",
      },
    },
    visitsTrend: [
      { month: "Jan", newPatients: 420, returningPatients: 2400, totalVisits: 2820 },
      { month: "Feb", newPatients: 450, returningPatients: 2480, totalVisits: 2930 },
      { month: "Mar", newPatients: 510, returningPatients: 2650, totalVisits: 3160 },
      { month: "Apr", newPatients: 460, returningPatients: 2580, totalVisits: 3040 },
      { month: "May", newPatients: 480, returningPatients: 2690, totalVisits: 3170 },
      { month: "Jun", newPatients: 520, returningPatients: 2810, totalVisits: 3330 },
    ],
    newVsReturning: [
      { label: "Returning Patients", count: 15610, percentage: 84.6, color: "var(--chart-1)" },
      { label: "New Patients", count: 2840, percentage: 15.4, color: "var(--chart-2)" },
    ],
    revenueByPatientType: [
      { patientType: "Commercial PPO", revenue: 1450000, avgRevenuePerPatient: 220 },
      { patientType: "Medicare Advantage", revenue: 980000, avgRevenuePerPatient: 195 },
      { patientType: "Commercial HMO", revenue: 540000, avgRevenuePerPatient: 165 },
      { patientType: "Self-Pay", revenue: 310000, avgRevenuePerPatient: 140 },
      { patientType: "Medicaid", revenue: 140000, avgRevenuePerPatient: 110 },
    ],
    topSpecialtiesVolume: [
      { specialty: "Cardiology", patientVolume: 5200, visits: 16800 },
      { specialty: "Orthopedic Surgery", patientVolume: 4100, visits: 12400 },
      { specialty: "Neurology", patientVolume: 3400, visits: 9800 },
      { specialty: "Gastroenterology", patientVolume: 3100, visits: 8900 },
      { specialty: "Family Medicine", patientVolume: 2650, visits: 7200 },
    ],
    monthlyPatientGrowth: [
      { month: "Jan", netGrowth: 180, totalActivePatients: 17380 },
      { month: "Feb", netGrowth: 210, totalActivePatients: 17590 },
      { month: "Mar", netGrowth: 260, totalActivePatients: 17850 },
      { month: "Apr", netGrowth: 190, totalActivePatients: 18040 },
      { month: "May", netGrowth: 200, totalActivePatients: 18240 },
      { month: "Jun", netGrowth: 210, totalActivePatients: 18450 },
    ],
    patientSummaryRows: [
      {
        id: "p-101",
        patientId: "PT-2026-101",
        patientName: "Sarah Jenkins",
        lastVisit: "2026-07-24",
        provider: "Dr. Eleanor Vance",
        specialty: "Cardiology",
        location: "Main Campus",
        totalVisits: 6,
        totalCharges: 18500,
        totalPayments: 17800,
        outstandingBalance: 700,
        lastPaymentDate: "2026-07-20",
        age: 48,
        gender: "Female",
        patientType: "Existing",
        satisfactionScore: 4.9,
      },
      {
        id: "p-102",
        patientId: "PT-2026-102",
        patientName: "Robert Chen",
        lastVisit: "2026-07-22",
        provider: "Dr. Marcus Thorne",
        specialty: "Orthopedic Surgery",
        location: "North Annex",
        totalVisits: 4,
        totalCharges: 24200,
        totalPayments: 22100,
        outstandingBalance: 2100,
        lastPaymentDate: "2026-07-15",
        age: 56,
        gender: "Male",
        patientType: "Existing",
        satisfactionScore: 4.8,
      },
      {
        id: "p-103",
        patientId: "PT-2026-103",
        patientName: "Maria Garcia",
        lastVisit: "2026-07-19",
        provider: "Dr. Sophia Patel",
        specialty: "Neurology",
        location: "Ambulatory Suite",
        totalVisits: 2,
        totalCharges: 9400,
        totalPayments: 9400,
        outstandingBalance: 0,
        lastPaymentDate: "2026-07-19",
        age: 34,
        gender: "Female",
        patientType: "New",
        satisfactionScore: 5.0,
      },
      {
        id: "p-104",
        patientId: "PT-2026-104",
        patientName: "James Wilson",
        lastVisit: "2026-07-15",
        provider: "Dr. Liam O'Connor",
        specialty: "Gastroenterology",
        location: "Satellite Lab",
        totalVisits: 5,
        totalCharges: 14800,
        totalPayments: 13200,
        outstandingBalance: 1600,
        lastPaymentDate: "2026-07-08",
        age: 62,
        gender: "Male",
        patientType: "Existing",
        satisfactionScore: 4.6,
      },
      {
        id: "p-105",
        patientId: "PT-2026-105",
        patientName: "Emily Davis",
        lastVisit: "2026-07-11",
        provider: "Dr. Eleanor Vance",
        specialty: "Cardiology",
        location: "Main Campus",
        totalVisits: 1,
        totalCharges: 4200,
        totalPayments: 3800,
        outstandingBalance: 400,
        lastPaymentDate: "2026-07-11",
        age: 29,
        gender: "Female",
        patientType: "New",
        satisfactionScore: 4.7,
      },
      {
        id: "p-106",
        patientId: "PT-2026-106",
        patientName: "David Miller",
        lastVisit: "2026-07-08",
        provider: "Dr. Marcus Thorne",
        specialty: "Orthopedic Surgery",
        location: "North Annex",
        totalVisits: 8,
        totalCharges: 38900,
        totalPayments: 35500,
        outstandingBalance: 3400,
        lastPaymentDate: "2026-06-28",
        age: 67,
        gender: "Male",
        patientType: "Existing",
        satisfactionScore: 4.9,
      },
    ],
    aiInsights: [
      {
        id: "pat-ai-1",
        headline: "Cardiology & Orthopedics Drive +13.1% Surge in New Patient Acquisition",
        body: "New patient volume reached 2,840 (up +13.1%), heavily driven by outpatient cardiology referrals and joint replacement consultation bookings.",
        recommendation: "Expand online scheduling availability for Dr. Vance and Dr. Thorne to capitalize on high new patient conversion rates.",
        category: "Growth Trend",
        estimatedImpact: 210000,
        confidence: 95,
        type: "positive",
      },
      {
        id: "pat-ai-2",
        headline: "High-Value Chronic Care Cohort Generates $185+ Revenue Per Encounter",
        body: "Patients with 4+ visits per year generate $185.36 avg revenue per encounter with 98% patient satisfaction scores.",
        recommendation: "Enroll eligible cardiac and orthopedic patients into automated care-coordination portals to boost 12-month retention.",
        category: "High-Value Patient",
        estimatedImpact: 145000,
        confidence: 91,
        type: "positive",
      },
      {
        id: "pat-ai-3",
        headline: "Friday Afternoon Slots Account for 64% of 4.2% No-Show Volume",
        body: "No-show rate stands at 4.2%, with appointment slots between 2:00 PM – 5:00 PM on Fridays exhibiting double the average attendance drop.",
        recommendation: "Implement automated SMS reminders 2 hours prior and double-confirm Friday afternoon slots 24 hours in advance.",
        category: "No-Show Pattern",
        estimatedImpact: 85000,
        confidence: 88,
        type: "warning",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockPatientProfile(patientId: string) {
  const visits: PatientVisitHistoryRow[] = [
    { id: "v-1", visitDate: "2026-07-24", visitType: "Follow-up Consultation", provider: "Dr. Eleanor Vance", chiefComplaint: "Palpitations & shortness of breath", cptCode: "99214", chargeAmount: 350, status: "Completed" },
    { id: "v-2", visitDate: "2026-05-12", visitType: "Echocardiogram Diagnostic", provider: "Dr. Eleanor Vance", chiefComplaint: "Routine cardiac evaluation", cptCode: "93306", chargeAmount: 1850, status: "Completed" },
    { id: "v-3", visitDate: "2026-02-18", visitType: "New Patient Initial Evaluation", provider: "Dr. Eleanor Vance", chiefComplaint: "Elevated blood pressure referral", cptCode: "99205", chargeAmount: 520, status: "Completed" },
  ];

  const billings: PatientBillingHistoryRow[] = [
    { id: "b-1", claimNumber: "CLM-2026-9041", serviceDate: "2026-07-24", billedAmount: 350, insurancePaid: 280, adjustments: 30, patientBalance: 40, status: "Patient Statement" },
    { id: "b-2", claimNumber: "CLM-2026-4410", serviceDate: "2026-05-12", billedAmount: 1850, insurancePaid: 1620, adjustments: 130, patientBalance: 100, status: "Paid" },
    { id: "b-3", claimNumber: "CLM-2026-1102", serviceDate: "2026-02-18", billedAmount: 520, insurancePaid: 440, adjustments: 30, patientBalance: 50, status: "Paid" },
  ];

  const payments: PatientPaymentHistoryRow[] = [
    { id: "pm-1", paymentDate: "2026-07-20", paymentMethod: "Credit Card", amount: 100, receiptNumber: "RCP-88401", status: "Settled" },
    { id: "pm-2", paymentDate: "2026-03-01", paymentMethod: "HSA/FSA", amount: 50, receiptNumber: "RCP-77390", status: "Settled" },
  ];

  return { visits, billings, payments };
}
