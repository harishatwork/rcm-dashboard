import type { KpiMetric } from "./types";

export interface InsuranceKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface InsurancePaymentsTrendPoint {
  month: string;
  totalPayments: number;
  insuranceAr: number;
  target: number;
}

export interface PayorPaymentsPoint {
  id: string;
  payor: string;
  totalPayments: number;
  claimsCount: number;
  collectionRate: number;
}

export interface ClaimStatusDistributionPoint {
  status: "paid" | "pending" | "denied" | "appealed" | "submitted";
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyClaimsVolumePoint {
  month: string;
  submitted: number;
  paid: number;
  denied: number;
}

export interface TopPayorRevenuePoint {
  payor: string;
  revenue: number;
  cleanClaimRate: number;
  avgPaymentDays: number;
}

export interface InsurancePerformanceRow {
  id: string;
  insuranceCompany: string;
  financialClass: string;
  claimsSubmitted: number;
  claimsPaid: number;
  claimsDenied: number;
  totalPayments: number;
  avgPaymentDays: number;
  collectionRate: number;
  outstandingBalance: number;
  cleanClaimRate: number;
  contractStatus: "active" | "renewal" | "negotiating";
}

export interface PayorClaimDetail {
  id: string;
  claimNumber: string;
  patient: string;
  serviceDate: string;
  billedAmount: number;
  paidAmount: number;
  status: "paid" | "pending" | "denied" | "appealed";
  denialReason?: string;
}

export interface PaymentRemittanceDetail {
  id: string;
  remittanceDate: string;
  checkEftNumber: string;
  allowedAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  patientResponsibility: number;
  paymentMethod: "EFT" | "Check" | "Virtual Card";
}

export interface InsuranceAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "Best Performer" | "Slow Payor" | "Collection Trend" | "High Balance" | "Contract Strategy";
  estimatedImpact: number;
  confidence: number;
  payorName?: string;
  type: "positive" | "warning" | "critical" | "info";
}

export interface InsuranceDashboardData {
  kpis: {
    totalInsurancePayments: InsuranceKpiMetric;
    insuranceAr: InsuranceKpiMetric;
    claimsSubmitted: InsuranceKpiMetric;
    claimsPaid: InsuranceKpiMetric;
    firstPassAcceptanceRate: InsuranceKpiMetric;
    avgPaymentTime: InsuranceKpiMetric;
    avgReimbursement: InsuranceKpiMetric;
    collectionRate: InsuranceKpiMetric;
  };
  paymentsTrend: InsurancePaymentsTrendPoint[];
  paymentsByCompany: PayorPaymentsPoint[];
  claimsStatusDistribution: ClaimStatusDistributionPoint[];
  monthlySubmittedVsPaid: MonthlyClaimsVolumePoint[];
  topCompaniesByRevenue: TopPayorRevenuePoint[];
  performanceRows: InsurancePerformanceRow[];
  aiInsights: InsuranceAiInsight[];
  lastUpdated: string;
}

export function getMockInsuranceDashboardData(): InsuranceDashboardData {
  return {
    kpis: {
      totalInsurancePayments: {
        id: "total-insurance-payments",
        label: "Total Insurance Payments",
        value: 14850000,
        previousValue: 13400000,
        format: "currency",
        deltaPct: 10.8,
        trend: "up",
        helper: "+$1.45M vs prior period",
      },
      insuranceAr: {
        id: "insurance-ar",
        label: "Insurance A/R",
        value: 4920000,
        previousValue: 5250000,
        format: "currency",
        deltaPct: -6.3,
        trend: "down",
        helper: "-$330k reduction in balance",
      },
      claimsSubmitted: {
        id: "claims-submitted",
        label: "Claims Submitted",
        value: 24500,
        previousValue: 23100,
        format: "number",
        deltaPct: 6.1,
        trend: "up",
        helper: "24,500 total submitted",
      },
      claimsPaid: {
        id: "claims-paid",
        label: "Claims Paid",
        value: 21800,
        previousValue: 20200,
        format: "number",
        deltaPct: 7.9,
        trend: "up",
        helper: "89.0% paid claim ratio",
      },
      firstPassAcceptanceRate: {
        id: "first-pass-acceptance-rate",
        label: "First Pass Acceptance Rate",
        value: 94.2,
        previousValue: 91.8,
        format: "percent",
        deltaPct: 2.4,
        trend: "up",
        target: 95.0,
        helper: "+2.4% vs industry benchmark",
      },
      avgPaymentTime: {
        id: "avg-payment-time",
        label: "Average Payment Time",
        value: 24.5,
        previousValue: 28.2,
        format: "days",
        deltaPct: -13.1,
        trend: "down",
        target: 21.0,
        helper: "3.7 days faster than prior period",
      },
      avgReimbursement: {
        id: "avg-reimbursement",
        label: "Average Reimbursement",
        value: 681,
        previousValue: 663,
        format: "currency",
        deltaPct: 2.7,
        trend: "up",
        helper: "+$18 per paid claim",
      },
      collectionRate: {
        id: "collection-rate",
        label: "Collection Rate",
        value: 96.4,
        previousValue: 94.1,
        format: "percent",
        deltaPct: 2.3,
        trend: "up",
        target: 96.0,
        helper: "Exceeds 96% target threshold",
      },
    },
    paymentsTrend: [
      { month: "Jan", totalPayments: 2200000, insuranceAr: 5400000, target: 2100000 },
      { month: "Feb", totalPayments: 2350000, insuranceAr: 5200000, target: 2100000 },
      { month: "Mar", totalPayments: 2500000, insuranceAr: 5100000, target: 2200000 },
      { month: "Apr", totalPayments: 2400000, insuranceAr: 5050000, target: 2200000 },
      { month: "May", totalPayments: 2600000, insuranceAr: 4980000, target: 2300000 },
      { month: "Jun", totalPayments: 2800000, insuranceAr: 4920000, target: 2400000 },
    ],
    paymentsByCompany: [
      { id: "ins-1", payor: "Blue Cross Blue Shield", totalPayments: 4850000, claimsCount: 7200, collectionRate: 97.2 },
      { id: "ins-2", payor: "Medicare", totalPayments: 3950000, claimsCount: 6100, collectionRate: 98.1 },
      { id: "ins-3", payor: "UnitedHealthcare", totalPayments: 2450000, claimsCount: 3900, collectionRate: 94.5 },
      { id: "ins-4", payor: "Aetna", totalPayments: 1820000, claimsCount: 2800, collectionRate: 95.8 },
      { id: "ins-5", payor: "Humana", totalPayments: 1120000, claimsCount: 1800, collectionRate: 93.4 },
      { id: "ins-6", payor: "Cigna", totalPayments: 660000, claimsCount: 1100, collectionRate: 96.1 },
    ],
    claimsStatusDistribution: [
      { status: "paid", label: "Paid Claims", count: 21800, percentage: 89.0, color: "var(--chart-2)" },
      { status: "pending", label: "Pending Adjudication", count: 1250, percentage: 5.1, color: "var(--chart-1)" },
      { status: "denied", label: "Initial Denials", count: 850, percentage: 3.5, color: "var(--chart-5)" },
      { status: "appealed", label: "Under Appeal", count: 420, percentage: 1.7, color: "var(--chart-4)" },
      { status: "submitted", label: "Newly Submitted", count: 180, percentage: 0.7, color: "var(--chart-3)" },
    ],
    monthlySubmittedVsPaid: [
      { month: "Jan", submitted: 3800, paid: 3450, denied: 180 },
      { month: "Feb", submitted: 3900, paid: 3520, denied: 165 },
      { month: "Mar", submitted: 4200, paid: 3800, denied: 195 },
      { month: "Apr", submitted: 4000, paid: 3600, denied: 140 },
      { month: "May", submitted: 4250, paid: 3780, denied: 135 },
      { month: "Jun", submitted: 4350, paid: 3850, denied: 140 },
    ],
    topCompaniesByRevenue: [
      { payor: "Blue Cross Blue Shield", revenue: 4850000, cleanClaimRate: 96.5, avgPaymentDays: 21 },
      { payor: "Medicare", revenue: 3950000, cleanClaimRate: 98.2, avgPaymentDays: 16 },
      { payor: "UnitedHealthcare", revenue: 2450000, cleanClaimRate: 92.4, avgPaymentDays: 32 },
      { payor: "Aetna", revenue: 1820000, cleanClaimRate: 95.1, avgPaymentDays: 24 },
      { payor: "Humana", revenue: 1120000, cleanClaimRate: 91.8, avgPaymentDays: 36 },
    ],
    performanceRows: [
      {
        id: "ins-1",
        insuranceCompany: "Blue Cross Blue Shield",
        financialClass: "Commercial PPO",
        claimsSubmitted: 7420,
        claimsPaid: 7200,
        claimsDenied: 220,
        totalPayments: 4850000,
        avgPaymentDays: 21,
        collectionRate: 97.2,
        outstandingBalance: 320000,
        cleanClaimRate: 96.5,
        contractStatus: "active",
      },
      {
        id: "ins-2",
        insuranceCompany: "Medicare",
        financialClass: "Medicare Advantage",
        claimsSubmitted: 6210,
        claimsPaid: 6100,
        claimsDenied: 110,
        totalPayments: 3950000,
        avgPaymentDays: 16,
        collectionRate: 98.1,
        outstandingBalance: 180000,
        cleanClaimRate: 98.2,
        contractStatus: "active",
      },
      {
        id: "ins-3",
        insuranceCompany: "UnitedHealthcare",
        financialClass: "Commercial HMO",
        claimsSubmitted: 4180,
        claimsPaid: 3900,
        claimsDenied: 280,
        totalPayments: 2450000,
        avgPaymentDays: 32,
        collectionRate: 94.5,
        outstandingBalance: 640000,
        cleanClaimRate: 92.4,
        contractStatus: "renewal",
      },
      {
        id: "ins-4",
        insuranceCompany: "Aetna",
        financialClass: "Commercial PPO",
        claimsSubmitted: 2940,
        claimsPaid: 2800,
        claimsDenied: 140,
        totalPayments: 1820000,
        avgPaymentDays: 24,
        collectionRate: 95.8,
        outstandingBalance: 290000,
        cleanClaimRate: 95.1,
        contractStatus: "active",
      },
      {
        id: "ins-5",
        insuranceCompany: "Humana",
        financialClass: "Medicare Advantage",
        claimsSubmitted: 1950,
        claimsPaid: 1800,
        claimsDenied: 150,
        totalPayments: 1120000,
        avgPaymentDays: 36,
        collectionRate: 93.4,
        outstandingBalance: 410000,
        cleanClaimRate: 91.8,
        contractStatus: "negotiating",
      },
      {
        id: "ins-6",
        insuranceCompany: "Cigna",
        financialClass: "Commercial PPO",
        claimsSubmitted: 1150,
        claimsPaid: 1100,
        claimsDenied: 50,
        totalPayments: 660000,
        avgPaymentDays: 22,
        collectionRate: 96.1,
        outstandingBalance: 95000,
        cleanClaimRate: 96.0,
        contractStatus: "active",
      },
    ],
    aiInsights: [
      {
        id: "ins-ai-1",
        headline: "Medicare Leads Performance with 16-Day Turnaround & 98.1% Collection Rate",
        body: "Medicare is the highest-performing payor with average payment days of 16 days and a clean claim rate of 98.2%, generating $3.95M in net payments.",
        recommendation: "Benchmark Medicare claim submission templates to replicate electronic remittance advice (ERA) auto-posting rules across other payors.",
        category: "Best Performer",
        estimatedImpact: 180000,
        confidence: 96,
        payorName: "Medicare",
        type: "positive",
      },
      {
        id: "ins-ai-2",
        headline: "Humana & UnitedHealthcare Turnaround Exceeds 32+ Days with $1.05M in AR",
        body: "Humana averages 36 payment days while UnitedHealthcare averages 32 days. Combined outstanding balance across both payors stands at $1,050,000.",
        recommendation: "Escalate delayed adjudication claims (>30 days) to payer provider relations representatives before upcoming contract renewal negotiations.",
        category: "Slow Payor",
        estimatedImpact: 320000,
        confidence: 92,
        payorName: "Humana",
        type: "warning",
      },
      {
        id: "ins-ai-3",
        headline: "High Outstanding Balance Alert: UnitedHealthcare $640k Outstanding",
        body: "UnitedHealthcare carries $640,000 in outstanding balance, primarily driven by commercial HMO prior authorization verification delays.",
        recommendation: "Conduct joint operating committee (JOC) review with UnitedHealthcare network team to resolve $240k in pending authorization holds.",
        category: "High Balance",
        estimatedImpact: 240000,
        confidence: 94,
        payorName: "UnitedHealthcare",
        type: "critical",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockPayorDetails(payorId: string) {
  const claims: PayorClaimDetail[] = [
    { id: "CLM-801", claimNumber: "CLM-2026-8011", patient: "Michael Scott", serviceDate: "2026-07-12", billedAmount: 4200, paidAmount: 4200, status: "paid" },
    { id: "CLM-802", claimNumber: "CLM-2026-8012", patient: "Pam Beesly", serviceDate: "2026-07-14", billedAmount: 8900, paidAmount: 8400, status: "paid" },
    { id: "CLM-803", claimNumber: "CLM-2026-8013", patient: "Jim Halpert", serviceDate: "2026-07-18", billedAmount: 14500, paidAmount: 0, status: "denied", denialReason: "CO-197: Pre-auth absent" },
    { id: "CLM-804", claimNumber: "CLM-2026-8014", patient: "Dwight Schrute", serviceDate: "2026-07-20", billedAmount: 3400, paidAmount: 0, status: "pending" },
    { id: "CLM-805", claimNumber: "CLM-2026-8015", patient: "Angela Martin", serviceDate: "2026-07-22", billedAmount: 6200, paidAmount: 5800, status: "appealed", denialReason: "CO-16: Info requested" },
  ];

  const remittances: PaymentRemittanceDetail[] = [
    { id: "REM-901", remittanceDate: "2026-07-24", checkEftNumber: "EFT-8840291", allowedAmount: 26500, paidAmount: 24800, adjustmentAmount: 1200, patientResponsibility: 500, paymentMethod: "EFT" },
    { id: "REM-902", remittanceDate: "2026-07-18", checkEftNumber: "EFT-8839120", allowedAmount: 19400, paidAmount: 18200, adjustmentAmount: 900, patientResponsibility: 300, paymentMethod: "EFT" },
    { id: "REM-903", remittanceDate: "2026-07-10", checkEftNumber: "CHK-004921", allowedAmount: 12800, paidAmount: 11900, adjustmentAmount: 650, patientResponsibility: 250, paymentMethod: "Check" },
  ];

  return { claims, remittances };
}
