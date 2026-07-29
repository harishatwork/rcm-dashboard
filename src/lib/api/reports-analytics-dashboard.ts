import type { KpiMetric } from "./types";

export interface ReportKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface ReportCategoryTile {
  id: string;
  category: string;
  slug: string;
  name: string;
  description: string;
  reportCount: number;
  iconName: string;
  color: string;
}

export interface ReportUsageTrendPoint {
  date: string;
  executions: number;
  exports: number;
  views: number;
}

export interface ReportsByCategoryPoint {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MostViewedReportPoint {
  reportName: string;
  views: number;
  category: string;
}

export interface ReportGenerationTrendPoint {
  month: string;
  manualRuns: number;
  scheduledRuns: number;
}

export interface UserRoleActivityPoint {
  role: string;
  views: number;
  exports: number;
  schedules: number;
}

export interface ReportLibraryRow {
  id: string;
  reportName: string;
  category: string;
  categorySlug: string;
  description: string;
  lastGenerated: string;
  generatedBy: string;
  schedule: string;
  format: "PDF" | "Excel" | "CSV";
  status: "Active" | "Completed" | "Processing";
}

export interface ScheduledReportRow {
  id: string;
  reportName: string;
  frequency: string;
  nextRun: string;
  lastRun: string;
  deliveryMethod: "Email PDF" | "SFTP CSV" | "In-App Notification";
  status: "Active" | "Paused" | "Running";
  emailRecipients: string;
}

export interface ReportAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "Frequently Accessed" | "Underutilized" | "Usage Trend" | "Peak Reporting" | "Suggested Report";
  estimatedImpact: number;
  confidence: number;
  type: "positive" | "warning" | "critical" | "info";
}

export interface ReportsAnalyticsDashboardData {
  kpis: {
    totalReports: ReportKpiMetric;
    scheduledReports: ReportKpiMetric;
    reportsGeneratedToday: ReportKpiMetric;
    exportCount: ReportKpiMetric;
    dashboardViews: ReportKpiMetric;
    activeUsers: ReportKpiMetric;
    mostAccessedReport: ReportKpiMetric;
    avgGenerationTime: ReportKpiMetric;
  };
  categories: ReportCategoryTile[];
  usageTrend: ReportUsageTrendPoint[];
  reportsByCategory: ReportsByCategoryPoint[];
  mostViewedReports: MostViewedReportPoint[];
  generationTrend: ReportGenerationTrendPoint[];
  activityByRole: UserRoleActivityPoint[];
  libraryRows: ReportLibraryRow[];
  scheduledRows: ScheduledReportRow[];
  aiInsights: ReportAiInsight[];
  lastUpdated: string;
}

export const CATEGORY_SLUGS: Record<string, { slug: string; name: string; title: string }> = {
  "financial": { slug: "financial", name: "Financial Reports", title: "Financial Analytics & Revenue Yield" },
  "accounts-receivable": { slug: "accounts-receivable", name: "Accounts Receivable Reports", title: "Accounts Receivable & Aging Analysis" },
  "claims": { slug: "claims", name: "Claims Reports", title: "Claims Processing & Submission Analytics" },
  "denials": { slug: "denials", name: "Denials Reports", title: "Denials Management & Appeal Analytics" },
  "payments": { slug: "payments", name: "Payments Reports", title: "Payments, ERA & Remittance Analytics" },
  "patients": { slug: "patients", name: "Patient Reports", title: "Patient Financials & Volume Analytics" },
  "providers": { slug: "providers", name: "Provider Reports", title: "Provider Performance & wRVU Scorecards" },
  "operations": { slug: "operations", name: "Operational Reports", title: "Operational Flow & Practice Capacity" },
};

export const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  "Financial Reports": "financial",
  "Accounts Receivable Reports": "accounts-receivable",
  "Claims Reports": "claims",
  "Denials Reports": "denials",
  "Payments Reports": "payments",
  "Patient Reports": "patients",
  "Provider Reports": "providers",
  "Operational Reports": "operations",
};

export function getMockReportsAnalyticsDashboardData(): ReportsAnalyticsDashboardData {
  return {
    kpis: {
      totalReports: {
        id: "total-reports",
        label: "Total Reports",
        value: 48,
        previousValue: 42,
        format: "number",
        deltaPct: 14.3,
        trend: "up",
        helper: "48 catalog reports available",
      },
      scheduledReports: {
        id: "scheduled-reports",
        label: "Scheduled Reports",
        value: 18,
        previousValue: 15,
        format: "number",
        deltaPct: 20.0,
        trend: "up",
        helper: "18 automated recurring runs",
      },
      reportsGeneratedToday: {
        id: "reports-generated-today",
        label: "Reports Generated Today",
        value: 142,
        previousValue: 118,
        format: "number",
        deltaPct: 20.3,
        trend: "up",
        helper: "+24 manual & automated runs",
      },
      exportCount: {
        id: "export-count",
        label: "Export Count",
        value: 1280,
        previousValue: 1120,
        format: "number",
        deltaPct: 14.3,
        trend: "up",
        helper: "CSV, Excel & PDF downloads",
      },
      dashboardViews: {
        id: "dashboard-views",
        label: "Dashboard Views",
        value: 12450,
        previousValue: 10890,
        format: "number",
        deltaPct: 14.3,
        trend: "up",
        helper: "12,450 page impressions",
      },
      activeUsers: {
        id: "active-users",
        label: "Active Users",
        value: 86,
        previousValue: 78,
        format: "number",
        deltaPct: 10.3,
        trend: "up",
        helper: "86 unique active analysts",
      },
      mostAccessedReport: {
        id: "most-accessed-report",
        label: "Most Accessed Report",
        value: 340,
        previousValue: 290,
        format: "number",
        deltaPct: 17.2,
        trend: "up",
        helper: "Monthly Collections Summary",
      },
      avgGenerationTime: {
        id: "avg-generation-time",
        label: "Avg Generation Time",
        value: 1.4,
        previousValue: 1.8,
        format: "number",
        deltaPct: -22.2,
        trend: "down",
        target: 2.0,
        helper: "1.4s query response average",
      },
    },
    categories: [
      { id: "cat-1", category: "Financial Reports", slug: "financial", name: "Financial Reports", description: "Collections, Net Revenue Yield, Gross Margin & Payer Contract Performance", reportCount: 8, iconName: "DollarSign", color: "var(--chart-1)" },
      { id: "cat-2", category: "Accounts Receivable Reports", slug: "accounts-receivable", name: "Accounts Receivable Reports", description: "A/R Aging Buckets, Days in A/R, Unbilled Claims & Payer Balances", reportCount: 7, iconName: "PiggyBank", color: "var(--chart-2)" },
      { id: "cat-3", category: "Claims Reports", slug: "claims", name: "Claims Reports", description: "First-Pass Acceptance Rate, Submission Lag, Clean Claims & Clearinghouse Errors", reportCount: 6, iconName: "FileCheck", color: "var(--chart-3)" },
      { id: "cat-4", category: "Denials Reports", slug: "denials", name: "Denials Reports", description: "Denial Reason Breakdown, Appeal Success Rates, CARC/RARC Analysis", reportCount: 6, iconName: "ShieldAlert", color: "var(--chart-4)" },
      { id: "cat-5", category: "Payments Reports", slug: "payments", name: "Payments Reports", description: "Payment Remittance (ERA), Unallocated Funds, Patient Copay Collections", reportCount: 5, iconName: "CreditCard", color: "var(--chart-5)" },
      { id: "cat-6", category: "Patient Reports", slug: "patients", name: "Patient Reports", description: "Patient Volume & Acquisition, Demographics, Visit Frequency & Satisfaction", reportCount: 5, iconName: "Users", color: "var(--chart-1)" },
      { id: "cat-7", category: "Provider Reports", slug: "providers", name: "Provider Reports", description: "Provider Productivity (wRVU), Encounter Volume, Charge Capture & Scorecards", reportCount: 6, iconName: "Stethoscope", color: "var(--chart-2)" },
      { id: "cat-8", category: "Operational Reports", slug: "operations", name: "Operational Reports", description: "Lobby Wait Times, Appointment Completion Rate, Provider Schedule Capacity", reportCount: 5, iconName: "Activity", color: "var(--chart-3)" },
    ],
    usageTrend: [
      { date: "Mon", executions: 210, exports: 140, views: 1850 },
      { date: "Tue", executions: 245, exports: 165, views: 2100 },
      { date: "Wed", executions: 280, exports: 190, views: 2450 },
      { date: "Thu", executions: 260, exports: 175, views: 2200 },
      { date: "Fri", executions: 295, exports: 210, views: 2600 },
      { date: "Sat", executions: 110, exports: 65, views: 890 },
      { date: "Sun", executions: 85, exports: 40, views: 620 },
    ],
    reportsByCategory: [
      { category: "Financial", count: 340, percentage: 28.3, color: "var(--chart-1)" },
      { category: "Denials", count: 280, percentage: 23.3, color: "var(--chart-2)" },
      { category: "Accounts Receivable", count: 220, percentage: 18.3, color: "var(--chart-3)" },
      { category: "Provider", count: 180, percentage: 15.0, color: "var(--chart-4)" },
      { category: "Operational", count: 180, percentage: 15.0, color: "var(--chart-5)" },
    ],
    mostViewedReports: [
      { reportName: "Monthly Collections Summary", views: 340, category: "Financial Reports" },
      { reportName: "Denials Detail & Appeal Register", views: 280, category: "Denials Reports" },
      { reportName: "A/R Aging Analysis by Payer", views: 220, category: "Accounts Receivable Reports" },
      { reportName: "Payer Performance Scorecard", views: 195, category: "Claims Reports" },
      { reportName: "Provider wRVU Productivity Register", views: 180, category: "Provider Reports" },
    ],
    generationTrend: [
      { month: "Jan", manualRuns: 850, scheduledRuns: 420 },
      { month: "Feb", manualRuns: 910, scheduledRuns: 450 },
      { month: "Mar", manualRuns: 980, scheduledRuns: 490 },
      { month: "Apr", manualRuns: 940, scheduledRuns: 480 },
      { month: "May", manualRuns: 1020, scheduledRuns: 510 },
      { month: "Jun", manualRuns: 1120, scheduledRuns: 560 },
    ],
    activityByRole: [
      { role: "Practice Admin", views: 4200, exports: 520, schedules: 8 },
      { role: "Billing Manager", views: 3800, exports: 460, schedules: 6 },
      { role: "Executive", views: 2800, exports: 180, schedules: 3 },
      { role: "Provider", views: 1650, exports: 120, schedules: 1 },
    ],
    libraryRows: [
      /* Financial Reports */
      {
        id: "rep-1",
        reportName: "Monthly Collections Summary",
        category: "Financial Reports",
        categorySlug: "financial",
        description: "Billed charges, net collections, and adjustments broken down by practice and month.",
        lastGenerated: "Today at 08:30 AM",
        generatedBy: "System Automated",
        schedule: "Daily at 08:00 AM",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-1b",
        reportName: "Net Revenue Realization & Yield Report",
        category: "Financial Reports",
        categorySlug: "financial",
        description: "Comprehensive yield ratios comparing gross expected contract reimbursement vs net received revenue.",
        lastGenerated: "Yesterday at 04:15 PM",
        generatedBy: "David Chen",
        schedule: "Monthly (1st)",
        format: "PDF",
        status: "Completed",
      },
      {
        id: "rep-1c",
        reportName: "Executive Gross Margin & EBITDA Summary",
        category: "Financial Reports",
        categorySlug: "financial",
        description: "High-level executive financial ledger tracking operating expenses, collections, and profit margins.",
        lastGenerated: "Jul 28, 2026",
        generatedBy: "System Automated",
        schedule: "Monthly (1st)",
        format: "Excel",
        status: "Active",
      },

      /* Accounts Receivable Reports */
      {
        id: "rep-3",
        reportName: "A/R Aging Analysis by Payer",
        category: "Accounts Receivable Reports",
        categorySlug: "accounts-receivable",
        description: "Outstanding balances categorized by aging buckets (0-30, 31-60, 61-90, 91-120, 120+).",
        lastGenerated: "Yesterday at 05:00 PM",
        generatedBy: "Marcus Vance",
        schedule: "Weekly (Fri)",
        format: "CSV",
        status: "Active",
      },
      {
        id: "rep-3b",
        reportName: "Unbilled Claims & Lag Register",
        category: "Accounts Receivable Reports",
        categorySlug: "accounts-receivable",
        description: "Encounters missing medical coding or provider signature preventing claim submission.",
        lastGenerated: "Today at 07:00 AM",
        generatedBy: "System Automated",
        schedule: "Daily at 07:00 AM",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-3c",
        reportName: "Days in A/R & Collector Productivity",
        category: "Accounts Receivable Reports",
        categorySlug: "accounts-receivable",
        description: "Average days outstanding per insurance payer and collection agent workqueue throughput.",
        lastGenerated: "Jul 26, 2026",
        generatedBy: "Rachel Adams",
        schedule: "Weekly (Mon)",
        format: "PDF",
        status: "Completed",
      },

      /* Claims Reports */
      {
        id: "rep-4",
        reportName: "Payer Performance Scorecard",
        category: "Claims Reports",
        categorySlug: "claims",
        description: "Clean claim rate, average days to pay, and denial percentage per insurance contract.",
        lastGenerated: "Jul 25, 2026",
        generatedBy: "System Automated",
        schedule: "Monthly (1st)",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-4b",
        reportName: "First-Pass Acceptance Rate & Scrubber Errors",
        category: "Claims Reports",
        categorySlug: "claims",
        description: "Clearinghouse rejection log identifying missing NPIs, invalid eligibility, and formatting errors.",
        lastGenerated: "Today at 09:00 AM",
        generatedBy: "System Automated",
        schedule: "Daily at 08:30 AM",
        format: "CSV",
        status: "Active",
      },
      {
        id: "rep-4c",
        reportName: "Claim Submission Volume & Lag Audit",
        category: "Claims Reports",
        categorySlug: "claims",
        description: "Audit trail measuring days elapsed between patient visit date and electronic claim creation.",
        lastGenerated: "Jul 27, 2026",
        generatedBy: "Jessica Miller",
        schedule: "Weekly (Wed)",
        format: "PDF",
        status: "Completed",
      },

      /* Denials Reports */
      {
        id: "rep-2",
        reportName: "Denials Detail & Appeal Register",
        category: "Denials Reports",
        categorySlug: "denials",
        description: "Comprehensive denial log with CARC reason codes, recoverable revenue, and appeal status.",
        lastGenerated: "Today at 09:15 AM",
        generatedBy: "Sarah Jenkins",
        schedule: "Weekly (Mon)",
        format: "PDF",
        status: "Active",
      },
      {
        id: "rep-2b",
        reportName: "Top CARC/RARC Denial Root Cause Analysis",
        category: "Denials Reports",
        categorySlug: "denials",
        description: "Root cause classification of claim rejections by registration, prior auth, and coding error.",
        lastGenerated: "Yesterday at 02:00 PM",
        generatedBy: "System Automated",
        schedule: "Monthly (1st)",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-2c",
        reportName: "Overturned Appeals & Recovered Revenue",
        category: "Denials Reports",
        categorySlug: "denials",
        description: "Total dollar recovery performance achieved through level 1 & level 2 payer appeal submissions.",
        lastGenerated: "Jul 28, 2026",
        generatedBy: "Brian Foster",
        schedule: "Weekly (Fri)",
        format: "CSV",
        status: "Completed",
      },

      /* Payments Reports */
      {
        id: "rep-5a",
        reportName: "ERA Remittance & Payment Batch Summary",
        category: "Payments Reports",
        categorySlug: "payments",
        description: "Electronic Remittance Advice (835) posting logs, bank deposits, and payment reconciliation.",
        lastGenerated: "Today at 06:30 AM",
        generatedBy: "System Automated",
        schedule: "Daily at 06:00 AM",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-5b",
        reportName: "Unallocated Funds & Patient Copay Posting",
        category: "Payments Reports",
        categorySlug: "payments",
        description: "Patient payments requiring manual assignment to active claim invoices.",
        lastGenerated: "Yesterday at 04:00 PM",
        generatedBy: "Emily Watson",
        schedule: "Daily at 05:00 PM",
        format: "CSV",
        status: "Completed",
      },

      /* Patient Reports */
      {
        id: "rep-6a",
        reportName: "Patient Financial Liability & Self-Pay Balances",
        category: "Patient Reports",
        categorySlug: "patients",
        description: "Outstanding patient copays, deductibles, and payment plan breakdown across practices.",
        lastGenerated: "Today at 08:00 AM",
        generatedBy: "System Automated",
        schedule: "Weekly (Mon)",
        format: "PDF",
        status: "Active",
      },
      {
        id: "rep-6b",
        reportName: "Patient Volume & Acquisition Analytics",
        category: "Patient Reports",
        categorySlug: "patients",
        description: "New patient registration trends, insured vs uninsured breakdown, and visit frequency.",
        lastGenerated: "Jul 27, 2026",
        generatedBy: "Amanda Ross",
        schedule: "Monthly (1st)",
        format: "Excel",
        status: "Completed",
      },

      /* Provider Reports */
      {
        id: "rep-5",
        reportName: "Provider wRVU Productivity Register",
        category: "Provider Reports",
        categorySlug: "providers",
        description: "wRVU output, encounter volume, and charge capture benchmarked against physician targets.",
        lastGenerated: "Jul 24, 2026",
        generatedBy: "Dr. Eleanor Vance",
        schedule: "Ad-hoc",
        format: "PDF",
        status: "Completed",
      },
      {
        id: "rep-7b",
        reportName: "Physician Charge Capture & Coding Compliance",
        category: "Provider Reports",
        categorySlug: "providers",
        description: "Evaluation and management (E/M) coding distribution and documentation integrity audit.",
        lastGenerated: "Jul 25, 2026",
        generatedBy: "System Automated",
        schedule: "Monthly (15th)",
        format: "Excel",
        status: "Active",
      },

      /* Operational Reports */
      {
        id: "rep-6",
        reportName: "Operational Wait Times & Flow",
        category: "Operational Reports",
        categorySlug: "operations",
        description: "Lobby wait times, appointment completion rates, and provider capacity utilization by location.",
        lastGenerated: "Jul 22, 2026",
        generatedBy: "System Automated",
        schedule: "Daily at 06:00 PM",
        format: "Excel",
        status: "Active",
      },
      {
        id: "rep-8b",
        reportName: "Facility Capacity & Appointment No-Show Rate",
        category: "Operational Reports",
        categorySlug: "operations",
        description: "Slot utilization efficiency, missed appointments, and telehealth conversion rates.",
        lastGenerated: "Yesterday at 06:00 PM",
        generatedBy: "System Automated",
        schedule: "Daily at 06:00 PM",
        format: "PDF",
        status: "Active",
      },
    ],
    scheduledRows: [
      {
        id: "sch-1",
        reportName: "Monthly Collections Summary",
        frequency: "Daily at 08:00 AM",
        nextRun: "Tomorrow at 08:00 AM",
        lastRun: "Today at 08:00 AM",
        deliveryMethod: "Email PDF",
        status: "Active",
        emailRecipients: "executive-team@rcmanalytics.org",
      },
      {
        id: "sch-2",
        reportName: "Denials Detail & Appeal Register",
        frequency: "Weekly on Monday at 07:00 AM",
        nextRun: "Aug 03, 2026 at 07:00 AM",
        lastRun: "Jul 27, 2026 at 07:00 AM",
        deliveryMethod: "Email PDF",
        status: "Active",
        emailRecipients: "billing-managers@rcmanalytics.org",
      },
      {
        id: "sch-3",
        reportName: "A/R Aging Analysis by Payer",
        frequency: "Weekly on Friday at 05:00 PM",
        nextRun: "Jul 31, 2026 at 05:00 PM",
        lastRun: "Jul 24, 2026 at 05:00 PM",
        deliveryMethod: "SFTP CSV",
        status: "Active",
        emailRecipients: "sftp://reports.rcmanalytics.org/ar/",
      },
      {
        id: "sch-4",
        reportName: "Payer Performance Scorecard",
        frequency: "Monthly on 1st at 06:00 AM",
        nextRun: "Aug 01, 2026 at 06:00 AM",
        lastRun: "Jul 01, 2026 at 06:00 AM",
        deliveryMethod: "Email PDF",
        status: "Paused",
        emailRecipients: "contracting@rcmanalytics.org",
      },
    ],
    aiInsights: [
      {
        id: "rep-ai-1",
        headline: "Monthly Collections Summary Generated 340 Times (98% Export Rate)",
        body: "The Monthly Collections Summary represents the most active report in the library, with peak downloads occurring during month-end executive closing cycles.",
        recommendation: "Pin Monthly Collections Summary to the Executive Overview dashboard for 1-click access.",
        category: "Frequently Accessed",
        estimatedImpact: 120000,
        confidence: 98,
        type: "positive",
      },
      {
        id: "rep-ai-2",
        headline: "ERA Payment Reconciliation Report Access Underutilized (2 Runs/Mo)",
        body: "Despite high unallocated ERA payment volumes ($420k), the ERA Reconciliation report is accessed less than twice per month.",
        recommendation: "Automate a weekly Monday morning email dispatch of unallocated ERA balances to the billing workqueue team.",
        category: "Underutilized",
        estimatedImpact: 85000,
        confidence: 92,
        type: "warning",
      },
      {
        id: "rep-ai-3",
        headline: "Peak Report Export Activity Concentrated Between 08:00 AM – 09:30 AM Mondays",
        body: "Over 42% of all weekly report PDF/Excel exports occur on Monday mornings, causing brief database query spikes.",
        recommendation: "Pre-calculate and cache Monday morning report snapshots at 06:00 AM to deliver instant load times.",
        category: "Peak Reporting",
        estimatedImpact: 65000,
        confidence: 94,
        type: "info",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
