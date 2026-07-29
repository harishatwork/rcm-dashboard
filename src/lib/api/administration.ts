import type { KpiMetric } from "./types";
import type { AppRole } from "../rbac";

export interface AdminKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  practice: string;
  status: "Active" | "Disabled" | "Invited";
  lastLogin: string;
  mfaEnabled: boolean;
  createdAt: string;
}

export type PermissionCategory =
  | "Dashboard Access"
  | "Financial Data"
  | "Claims"
  | "AR"
  | "Denials"
  | "Reports"
  | "Administration"
  | "User Management";

export interface RolePermissionDefinition {
  roleId: AppRole | string;
  roleName: string;
  description: string;
  isCustom?: boolean;
  permissions: Record<PermissionCategory, boolean>;
}

export interface MasterDataItem {
  id: string;
  name: string;
  code: string;
  category: "Practices" | "Providers" | "Payors" | "Locations" | "Specialties" | "Departments";
  status: "Active" | "Inactive";
  details: string;
  npi?: string;
  address?: string;
}

export interface AdminNotificationConfig {
  emailTemplates: { id: string; name: string; subject: string; trigger: string }[];
  alertThresholds: { denialRatePct: number; arOver90DaysPct: number; dailyRevenueDropPct: number };
  escalationRules: { level: string; delayHours: number; notifyRole: string }[];
  defaultEscalationUser: string;
}

export interface SystemIntegrationItem {
  id: string;
  name: string;
  category: "Clearinghouse" | "EHR Sync" | "Patient Billing" | "Analytics Lake";
  status: "Connected" | "Action Needed" | "Disconnected";
  lastSync: string;
  apiKeyMasked: string;
  endpointUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "Success" | "Failed" | "Warning";
}

export interface AdministrationPortalData {
  kpis: {
    totalUsers: AdminKpiMetric;
    activeUsers: AdminKpiMetric;
    userRoles: AdminKpiMetric;
    connectedPractices: AdminKpiMetric;
    apiIntegrations: AdminKpiMetric;
    systemHealth: AdminKpiMetric;
  };
  users: AdminUser[];
  rolePermissions: RolePermissionDefinition[];
  masterData: MasterDataItem[];
  notificationConfig: AdminNotificationConfig;
  integrations: SystemIntegrationItem[];
  auditLogs: AuditLogEntry[];
  lastUpdated: string;
}

export function getMockAdministrationData(): AdministrationPortalData {
  return {
    kpis: {
      totalUsers: {
        id: "total-users",
        label: "Total Users",
        value: 24,
        previousValue: 20,
        format: "number",
        deltaPct: 20.0,
        trend: "up",
        helper: "Provisioned workspace members",
      },
      activeUsers: {
        id: "active-users",
        label: "Active Users",
        value: 21,
        previousValue: 18,
        format: "number",
        deltaPct: 16.7,
        trend: "up",
        helper: "LoggedIn in past 30 days",
      },
      userRoles: {
        id: "user-roles",
        label: "User Roles",
        value: 4,
        previousValue: 4,
        format: "number",
        deltaPct: 0.0,
        trend: "flat",
        helper: "Active RBAC role groups",
      },
      connectedPractices: {
        id: "connected-practices",
        label: "Connected Practices",
        value: 8,
        previousValue: 7,
        format: "number",
        deltaPct: 14.3,
        trend: "up",
        helper: "Reporting clinical facilities",
      },
      apiIntegrations: {
        id: "api-integrations",
        label: "API Integrations",
        value: 6,
        previousValue: 5,
        format: "number",
        deltaPct: 20.0,
        trend: "up",
        helper: "Active 837/835 & EHR feeds",
      },
      systemHealth: {
        id: "system-health",
        label: "System Health",
        value: 99.9,
        previousValue: 99.8,
        format: "percent",
        deltaPct: 0.1,
        trend: "up",
        target: 99.9,
        helper: "API & Data Pipeline Uptime",
      },
    },
    users: [
      {
        id: "u-101",
        name: "Dana Whitfield",
        email: "dana.whitfield@northstar.health",
        role: "practice-admin",
        practice: "Main Campus Health",
        status: "Active",
        lastLogin: "Today at 09:42 AM",
        mfaEnabled: true,
        createdAt: "2025-11-12",
      },
      {
        id: "u-102",
        name: "Marcus Reyes",
        email: "marcus.reyes@northstar.health",
        role: "executive",
        practice: "All Practices",
        status: "Active",
        lastLogin: "Today at 08:15 AM",
        mfaEnabled: true,
        createdAt: "2025-11-14",
      },
      {
        id: "u-103",
        name: "Priya Raman",
        email: "priya.raman@northstar.health",
        role: "billing-manager",
        practice: "North Annex Surgery",
        status: "Active",
        lastLogin: "Yesterday at 04:30 PM",
        mfaEnabled: true,
        createdAt: "2025-12-01",
      },
      {
        id: "u-104",
        name: "Dr. Alan Cho",
        email: "alan.cho@northstar.health",
        role: "provider",
        practice: "Ambulatory Suite",
        status: "Invited",
        lastLogin: "Never",
        mfaEnabled: false,
        createdAt: "2026-01-10",
      },
      {
        id: "u-105",
        name: "Sarah Jenkins",
        email: "sarah.jenkins@northstar.health",
        role: "billing-manager",
        practice: "Main Campus Health",
        status: "Active",
        lastLogin: "Jul 28, 2026",
        mfaEnabled: true,
        createdAt: "2026-02-15",
      },
    ],
    rolePermissions: [
      {
        roleId: "practice-admin",
        roleName: "Practice Administrator",
        description: "Full access to facility dashboards, user provisioning, master data, and configuration.",
        permissions: {
          "Dashboard Access": true,
          "Financial Data": true,
          Claims: true,
          AR: true,
          Denials: true,
          Reports: true,
          Administration: true,
          "User Management": true,
        },
      },
      {
        roleId: "executive",
        roleName: "Executive Leadership",
        description: "Executive dashboards, financial analytics, forecasting, and high-level reports.",
        permissions: {
          "Dashboard Access": true,
          "Financial Data": true,
          Claims: false,
          AR: true,
          Denials: true,
          Reports: true,
          Administration: false,
          "User Management": false,
        },
      },
      {
        roleId: "billing-manager",
        roleName: "Billing Manager",
        description: "Operational workqueues, claim editing, A/R recovery, denial appeals, and reporting.",
        permissions: {
          "Dashboard Access": true,
          "Financial Data": true,
          Claims: true,
          AR: true,
          Denials: true,
          Reports: true,
          Administration: false,
          "User Management": false,
        },
      },
      {
        roleId: "provider",
        roleName: "Clinical Provider",
        description: "Personal provider productivity, encounter stats, RVU tracking, and unsigned chart lists.",
        permissions: {
          "Dashboard Access": true,
          "Financial Data": false,
          Claims: false,
          AR: false,
          Denials: false,
          Reports: false,
          Administration: false,
          "User Management": false,
        },
      },
    ],
    masterData: [
      { id: "m-1", name: "Main Campus Health System", code: "PRAC-001", category: "Practices", status: "Active", details: "Multi-specialty primary medical center", address: "100 Medical Center Way" },
      { id: "m-2", name: "North Annex Ambulatory Surgery", code: "PRAC-002", category: "Practices", status: "Active", details: "Outpatient surgical & orthopedic facility", address: "450 Northside Ave" },
      { id: "m-3", name: "Dr. Sarah Jenkins, MD", code: "PROV-101", category: "Providers", status: "Active", details: "Orthopedic Surgery Specialist", npi: "1982736450" },
      { id: "m-4", name: "Dr. Marcus Brody, MD", code: "PROV-102", category: "Providers", status: "Active", details: "Cardiology Specialist", npi: "1872635491" },
      { id: "m-5", name: "UnitedHealth Commercial PPO", code: "PAY-001", category: "Payors", status: "Active", details: "Commercial Managed Care Payer" },
      { id: "m-6", name: "Medicare State Plan", code: "PAY-002", category: "Payors", status: "Active", details: "Government Medicare Part B" },
      { id: "m-7", name: "Building A - 3rd Floor Suite", code: "LOC-001", category: "Locations", status: "Active", details: "Main Outpatient Clinic" },
      { id: "m-8", name: "Cardiology & Vascular Medicine", code: "SPEC-001", category: "Specialties", status: "Active", details: "Invasive & Non-invasive Cardiology" },
      { id: "m-9", name: "Orthopedic Surgery", code: "SPEC-002", category: "Specialties", status: "Active", details: "Joint replacement & trauma surgery" },
      { id: "m-10", name: "Revenue Cycle Management", code: "DEPT-001", category: "Departments", status: "Active", details: "Central Billing & Coding Department" },
    ],
    notificationConfig: {
      emailTemplates: [
        { id: "t-1", name: "Denial Spike Alert Template", subject: "[RCM ALERT] High Denial Spike Detected", trigger: "Denial rate > 8%" },
        { id: "t-2", name: "A/R Threshold Exceeded", subject: "[RCM ALERT] A/R Aging Exceeded 90 Days", trigger: "A/R > 15%" },
        { id: "t-3", name: "Weekly Executive Digest", subject: "Weekly Healthcare RCM Executive Digest", trigger: "Every Monday at 08:00 AM" },
      ],
      alertThresholds: {
        denialRatePct: 8.0,
        arOver90DaysPct: 15.0,
        dailyRevenueDropPct: 10.0,
      },
      escalationRules: [
        { level: "Level 1 (Initial Alert)", delayHours: 0, notifyRole: "Billing Manager" },
        { level: "Level 2 (Unresolved > 24h)", delayHours: 24, notifyRole: "Practice Administrator" },
        { level: "Level 3 (Critical > 48h)", delayHours: 48, notifyRole: "Executive Leadership" },
      ],
      defaultEscalationUser: "dana.whitfield@northstar.health",
    },
    integrations: [
      { id: "int-1", name: "Availity Clearinghouse (837/835 Feed)", category: "Clearinghouse", status: "Connected", lastSync: "12 minutes ago", apiKeyMasked: "av_live_98...f34a", endpointUrl: "https://api.availity.com/v1/claims" },
      { id: "int-2", name: "Epic Systems EHR Encounters Feed", category: "EHR Sync", status: "Connected", lastSync: "4 minutes ago", apiKeyMasked: "ep_live_41...89bc", endpointUrl: "https://fhir.northstar.health/r4" },
      { id: "int-3", name: "Waystar Patient Billing Portal", category: "Patient Billing", status: "Action Needed", lastSync: "2 hours ago", apiKeyMasked: "ws_live_72...33d1", endpointUrl: "https://api.waystar.com/v2/statements" },
      { id: "int-4", name: "Snowflake Analytics Warehouse", category: "Analytics Lake", status: "Connected", lastSync: "1 hour ago", apiKeyMasked: "sf_live_12...99e8", endpointUrl: "https://xy12345.snowflakecomputing.com" },
    ],
    auditLogs: [
      { id: "log-1", timestamp: "Today at 09:42 AM", user: "Dana Whitfield", role: "Practice Admin", action: "User Role Updated", resource: "Priya Raman (Billing Manager)", ipAddress: "192.168.1.45", status: "Success" },
      { id: "log-2", timestamp: "Today at 08:15 AM", user: "Marcus Reyes", role: "Executive", action: "Report Exported", resource: "Monthly Collections Summary.pdf", ipAddress: "192.168.1.12", status: "Success" },
      { id: "log-3", timestamp: "Yesterday at 04:30 PM", user: "Priya Raman", role: "Billing Manager", action: "Scrub Rule Modified", resource: "Aetna Pre-Auth Rule #402", ipAddress: "192.168.1.88", status: "Success" },
      { id: "log-4", timestamp: "Jul 27, 2026", user: "System Automator", role: "Service Account", action: "API Key Rotated", resource: "Availity Integration", ipAddress: "10.0.4.1", status: "Success" },
      { id: "log-5", timestamp: "Jul 26, 2026", user: "Unknown User", role: "Guest", action: "Failed Login Attempt", resource: "admin@northstar.health", ipAddress: "198.51.100.42", status: "Failed" },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
