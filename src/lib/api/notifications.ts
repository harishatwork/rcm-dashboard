import type { KpiMetric } from "./types";

export type NotificationCategory =
  | "Financial Alerts"
  | "AR Alerts"
  | "Denial Alerts"
  | "Claims Alerts"
  | "Payment Alerts"
  | "Operational Alerts"
  | "System Notifications"
  | "User Activity"
  | "Scheduled Reports"
  | "AI Recommendations";

export type NotificationPriority = "Critical" | "High" | "Medium" | "Low";

export interface NotificationItem {
  id: string;
  title: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  description: string;
  dateTime: string;
  sourceModule: string;
  status: "Read" | "Unread";
  assignedUser?: string;
  archived: boolean;
  suggestedAction?: string;
  level: "critical" | "warning" | "info" | "success";
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  categories: Record<NotificationCategory, boolean>;
}

export interface AiNotificationRecommendation {
  id: string;
  headline: string;
  body: string;
  category: "High Denial Rate" | "Large AR Balance" | "Revenue Drop" | "Slow-Paying Payor" | "Forecast Risk" | "Operational Bottleneck";
  suggestedAction: string;
  estimatedImpact: number;
  confidence: number;
  type: "positive" | "warning" | "critical" | "info";
}

export interface NotificationsKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface NotificationsDashboardData {
  kpis: {
    totalNotifications: NotificationsKpiMetric;
    unreadNotifications: NotificationsKpiMetric;
    criticalAlerts: NotificationsKpiMetric;
    todayNotifications: NotificationsKpiMetric;
  };
  notifications: NotificationItem[];
  preferences: NotificationPreferences;
  aiRecommendations: AiNotificationRecommendation[];
  lastUpdated: string;
}

export function getMockNotificationsData(): NotificationsDashboardData {
  return {
    kpis: {
      totalNotifications: {
        id: "total-notifications",
        label: "Total Notifications",
        value: 54,
        previousValue: 46,
        format: "number",
        deltaPct: 17.4,
        trend: "up",
        helper: "Across all facilities & modules",
      },
      unreadNotifications: {
        id: "unread-notifications",
        label: "Unread Notifications",
        value: 12,
        previousValue: 18,
        format: "number",
        deltaPct: -33.3,
        trend: "down",
        target: 0,
        helper: "12 unread items requiring review",
      },
      criticalAlerts: {
        id: "critical-alerts",
        label: "Critical Alerts",
        value: 5,
        previousValue: 8,
        format: "number",
        deltaPct: -37.5,
        trend: "down",
        target: 0,
        helper: "High-priority revenue exposure",
      },
      todayNotifications: {
        id: "today-notifications",
        label: "Today's Notifications",
        value: 18,
        previousValue: 14,
        format: "number",
        deltaPct: 28.6,
        trend: "up",
        helper: "Logged in past 24 hours",
      },
    },
    notifications: [
      {
        id: "notif-1",
        title: "Denial Spike — Aetna CO-197 Missing Pre-Auth",
        category: "Denial Alerts",
        priority: "Critical",
        description: "CO-197 denials up 18% week over week across Main Campus Cardiology ($140k exposure).",
        dateTime: "Today at 09:14 AM",
        sourceModule: "Denials Dashboard",
        status: "Unread",
        assignedUser: "Billing Manager",
        archived: false,
        suggestedAction: "Enable pre-submission pre-authorization scrub rule for Aetna claims.",
        level: "critical",
      },
      {
        id: "notif-2",
        title: "A/R Aging Threshold Breached (90+ Days)",
        category: "AR Alerts",
        priority: "Critical",
        description: "$412k moved into 90+ day A/R bucket overnight following clearinghouse adjudication delay.",
        dateTime: "Today at 08:30 AM",
        sourceModule: "AR Management",
        status: "Unread",
        assignedUser: "Marcus Vance",
        archived: false,
        suggestedAction: "Dispatch automated secondary claim re-submission batch.",
        level: "critical",
      },
      {
        id: "notif-3",
        title: "Clearinghouse 835/837 Sync Completed",
        category: "System Notifications",
        priority: "Low",
        description: "4,182 claim remittance records successfully ingested into the central RCM data lake.",
        dateTime: "Today at 06:00 AM",
        sourceModule: "Integration Engine",
        status: "Unread",
        assignedUser: "System",
        archived: false,
        suggestedAction: "Review daily payment reconciliation ledger.",
        level: "success",
      },
      {
        id: "notif-4",
        title: "UnitedHealth Medicare Contract Renewal Reminder",
        category: "Financial Alerts",
        priority: "High",
        description: "Commercial PPO agreement renews in 21 days. Projected revenue at risk: $2.4M.",
        dateTime: "Yesterday at 04:45 PM",
        sourceModule: "Contracting",
        status: "Read",
        assignedUser: "Executive Team",
        archived: false,
        suggestedAction: "Schedule payer contract rate negotiation review.",
        level: "warning",
      },
      {
        id: "notif-5",
        title: "Weekly Automated Collections Summary Ready",
        category: "Scheduled Reports",
        priority: "Medium",
        description: "Automated PDF report generated and emailed to leadership distribution list.",
        dateTime: "Yesterday at 08:00 AM",
        sourceModule: "Reports Catalog",
        status: "Read",
        assignedUser: "System",
        archived: false,
        suggestedAction: "Open report preview in Reports Center.",
        level: "info",
      },
      {
        id: "notif-6",
        title: "Lobby Wait Time Threshold Exceeded at North Annex",
        category: "Operational Alerts",
        priority: "High",
        description: "Average patient wait duration reached 19.2 minutes (Target: < 15.0 min).",
        dateTime: "Jul 27, 2026",
        sourceModule: "Operational Dashboard",
        status: "Read",
        assignedUser: "Clinic Operations",
        archived: false,
        suggestedAction: "Deploy mobile pre-registration check-in links.",
        level: "warning",
      },
    ],
    preferences: {
      emailEnabled: true,
      inAppEnabled: true,
      smsEnabled: false,
      pushEnabled: false,
      categories: {
        "Financial Alerts": true,
        "AR Alerts": true,
        "Denial Alerts": true,
        "Claims Alerts": true,
        "Payment Alerts": true,
        "Operational Alerts": true,
        "System Notifications": false,
        "User Activity": true,
        "Scheduled Reports": true,
        "AI Recommendations": true,
      },
    },
    aiRecommendations: [
      {
        id: "ai-notif-1",
        headline: "High Denial Rate Detected: UnitedHealth Medicare Adv (6.8%)",
        body: "UnitedHealth claims exhibit a 6.8% denial rate ($380k exposure) caused by missing pre-authorization keys on MRI procedures.",
        category: "High Denial Rate",
        suggestedAction: "Enable automated pre-authorization validation rule for UnitedHealth MRI claims.",
        estimatedImpact: 140000,
        confidence: 96,
        type: "critical",
      },
      {
        id: "ai-notif-2",
        headline: "Large Outstanding AR Balance: Medicaid 90+ Day Bucket ($260k)",
        body: "Medicaid state plan 90+ day A/R balance increased by +$45k over the past 14 days due to unfulfilled eligibility documentation.",
        category: "Large AR Balance",
        suggestedAction: "Initiate bulk secondary eligibility verification workflow.",
        estimatedImpact: 95000,
        confidence: 93,
        type: "warning",
      },
      {
        id: "ai-notif-3",
        headline: "Slow-Paying Payor Alert: Humana Commercial (Avg 44 Days to Pay)",
        body: "Humana payment velocity slowed by +6 days compared to Q1 baseline, delaying $180k in net collections.",
        category: "Slow-Paying Payor",
        suggestedAction: "Submit electronic inquiry to Humana clearinghouse representative.",
        estimatedImpact: 72000,
        confidence: 90,
        type: "info",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
