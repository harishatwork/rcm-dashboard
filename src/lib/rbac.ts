import type { ComponentType } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileText,
  Gauge,
  LineChart,
  PiggyBank,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

/** Roles supported by the workspace. */
export type AppRole = "practice-admin" | "executive" | "billing-manager" | "provider";

export interface RoleDefinition {
  id: AppRole;
  label: string;
  description: string;
  initials: string;
}

export const ROLES: RoleDefinition[] = [
  {
    id: "practice-admin",
    label: "Practice Administrator",
    description: "Full operational access across revenue, billing and administration",
    initials: "PA",
  },
  {
    id: "executive",
    label: "Executive",
    description: "Financial performance, forecasting and enterprise reporting",
    initials: "EX",
  },
  {
    id: "billing-manager",
    label: "Billing Manager",
    description: "Claims, collections, A/R and denial workqueues",
    initials: "BM",
  },
  {
    id: "provider",
    label: "Provider",
    description: "Personal revenue, encounters and productivity",
    initials: "PR",
  },
];

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Single source of truth for every navigable destination. */
export const NAV = {
  dashboard: { to: "/", label: "Dashboard", icon: BarChart3 },
  kpiDashboard: { to: "/kpi-dashboard", label: "KPI Dashboard", icon: Gauge },
  revenue: { to: "/revenue", label: "Revenue", icon: TrendingUp },
  billing: { to: "/billing", label: "Billing", icon: CreditCard },
  claims: { to: "/claims", label: "Claims", icon: FileText },
  collections: { to: "/collections", label: "Collections", icon: Wallet },
  ar: { to: "/ar", label: "AR", icon: PiggyBank },
  denials: { to: "/denials", label: "Denials", icon: ShieldAlert },
  insuranceDashboard: { to: "/insurance-dashboard", label: "Insurance Dashboard", icon: ShieldCheck },
  operationalDashboard: { to: "/operational-dashboard", label: "Operational Dashboard", icon: Activity },
  providerPerformance: {
    to: "/provider-performance",
    label: "Provider Performance",
    icon: Stethoscope,
  },
  patients: { to: "/patients", label: "Patients", icon: Users },
  patientAnalytics: { to: "/patient-analytics", label: "Patient Analytics", icon: Users },
  reports: { to: "/reports", label: "Reports", icon: ClipboardList },
  notifications: { to: "/notifications", label: "Notifications", icon: Bell },
  drilldown: { to: "/drilldown", label: "Drill-down Analytics", icon: ArrowUpRight },
  administration: { to: "/administration", label: "Administration", icon: ShieldCheck },
  settings: { to: "/settings", label: "Settings", icon: Settings2 },
  personalization: { to: "/personalization", label: "Personalization", icon: UserCog },
  forecast: { to: "/forecast", label: "Forecast", icon: LineChart },
  predictiveAnalytics: { to: "/predictive-analytics", label: "Predictive Analytics", icon: LineChart },
  financialAnalytics: {
    to: "/financial-analytics",
    label: "Financial Analytics",
    icon: Building2,
  },
  myRevenue: { to: "/my-revenue", label: "My Revenue", icon: TrendingUp },
  myEncounters: { to: "/my-encounters", label: "My Encounters", icon: CalendarClock },
  myProductivity: { to: "/my-productivity", label: "My Productivity", icon: Gauge },
  unsignedEncounters: {
    to: "/unsigned-encounters",
    label: "Unsigned Encounters",
    icon: FileSignature,
  },
  accountSecurity: { to: "/account-security", label: "Account security", icon: Activity },
} satisfies Record<string, NavItem>;

/**
 * Menus per role. A role only ever renders the groups listed here —
 * unauthorized destinations are never emitted into the DOM.
 */
export const ROLE_NAV: Record<AppRole, NavGroup[]> = {
  "practice-admin": [
    { label: "Overview", items: [NAV.dashboard, NAV.kpiDashboard, NAV.revenue, NAV.insuranceDashboard, NAV.operationalDashboard] },
    {
      label: "Revenue cycle",
      items: [NAV.billing, NAV.collections, NAV.ar, NAV.denials],
    },
    { label: "Performance", items: [NAV.providerPerformance, NAV.patients, NAV.patientAnalytics, NAV.predictiveAnalytics, NAV.reports, NAV.notifications, NAV.drilldown] },
    { label: "Workspace", items: [NAV.administration, NAV.settings, NAV.personalization] },
  ],
  executive: [
    { label: "Overview", items: [NAV.dashboard, NAV.kpiDashboard, NAV.revenue, NAV.insuranceDashboard, NAV.operationalDashboard] },
    { label: "Planning", items: [NAV.forecast, NAV.predictiveAnalytics, NAV.financialAnalytics] },
    { label: "Insights", items: [NAV.reports] },
  ],
  "billing-manager": [
    { label: "Overview", items: [NAV.kpiDashboard, NAV.insuranceDashboard, NAV.operationalDashboard] },
    { label: "Workqueues", items: [NAV.billing, NAV.claims, NAV.collections] },
    { label: "Recovery", items: [NAV.ar, NAV.denials] },
    { label: "Insights", items: [NAV.reports] },
  ],
  provider: [
    { label: "Overview", items: [NAV.dashboard, NAV.myRevenue] },
    { label: "My practice", items: [NAV.myEncounters, NAV.myProductivity] },
    { label: "Action needed", items: [NAV.unsignedEncounters] },
  ],
};

/** Routes every signed-in role can open regardless of menu visibility. */
const ALWAYS_ALLOWED = ["/account-security", "/login", "/forgot-password", "/reset-password"];

export function navForRole(role: AppRole): NavGroup[] {
  return ROLE_NAV[role];
}

export function allowedPathsForRole(role: AppRole): string[] {
  return [...ROLE_NAV[role].flatMap((group) => group.items.map((item) => item.to)), ...ALWAYS_ALLOWED];
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return allowedPathsForRole(role).some((allowed) => path === allowed || path.startsWith(`${allowed}/`));
}

export function roleLabel(role: AppRole): string {
  return ROLES.find((r) => r.id === role)?.label ?? role;
}
