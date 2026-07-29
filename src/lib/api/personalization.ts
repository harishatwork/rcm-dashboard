export interface UserProfilePreferences {
  displayName: string;
  email: string;
  avatarUrl?: string;
  timeZone: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  currency: "USD ($)" | "EUR (€)" | "GBP (£)";
  language: string;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  density: "compact" | "comfortable";
  sidebarDefault: "expanded" | "collapsed";
  defaultLandingDashboard: string;
}

export interface DashboardWidgetOrder {
  widgetId: string;
  title: string;
  category: string;
  visible: boolean;
  orderIndex: number;
}

export interface SavedView {
  id: string;
  name: string;
  dashboardPath: string;
  filters: {
    dateRange: string;
    practice: string;
    provider: string;
    payor: string;
  };
  sorting: string;
  isDefault: boolean;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  type: "Dashboard" | "Report" | "Saved View" | "Filter Preset";
  path: string;
  category: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  type: "Dashboard" | "Report" | "Claim" | "Filter";
  timestamp: string;
  path: string;
  detail: string;
}

export interface PersonalizationData {
  profile: UserProfilePreferences;
  appearance: AppearanceSettings;
  widgets: DashboardWidgetOrder[];
  savedViews: SavedView[];
  favorites: FavoriteItem[];
  recentActivity: RecentActivityItem[];
}

const STORAGE_KEY = "rcm_user_personalization_v1";

export function getMockPersonalizationData(): PersonalizationData {
  const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback if JSON parse fails
    }
  }

  const defaultData: PersonalizationData = {
    profile: {
      displayName: "Dana Whitfield",
      email: "dana.whitfield@northstar.health",
      timeZone: "America/New_York (EST)",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      currency: "USD ($)",
      language: "English (US)",
    },
    appearance: {
      theme: "light",
      density: "comfortable",
      sidebarDefault: "expanded",
      defaultLandingDashboard: "/kpi-dashboard",
    },
    widgets: [
      { widgetId: "w-1", title: "Executive Revenue Summary Cards", category: "KPIs", visible: true, orderIndex: 1 },
      { widgetId: "w-2", title: "Revenue Trend Line Chart", category: "Charts", visible: true, orderIndex: 2 },
      { widgetId: "w-3", title: "Denial Rates by Payor Donut Chart", category: "Charts", visible: true, orderIndex: 3 },
      { widgetId: "w-4", title: "High-Risk Claims Action Register", category: "Tables", visible: true, orderIndex: 4 },
      { widgetId: "w-5", title: "AI Intelligence Recommendations Panel", category: "AI Insights", visible: true, orderIndex: 5 },
    ],
    savedViews: [
      {
        id: "sv-1",
        name: "Northside Surgical Executive View",
        dashboardPath: "/revenue",
        filters: { dateRange: "Last 30 Days", practice: "Main Campus Health", provider: "All", payor: "All" },
        sorting: "Billed Amount Desc",
        isDefault: true,
        createdAt: "2026-07-15",
      },
      {
        id: "sv-2",
        name: "UnitedHealth Denial Audit Preset",
        dashboardPath: "/denials",
        filters: { dateRange: "Quarter to Date", practice: "All", provider: "All", payor: "UnitedHealth" },
        sorting: "Denial Probability Desc",
        isDefault: false,
        createdAt: "2026-07-20",
      },
    ],
    favorites: [
      { id: "fav-1", title: "Executive KPI Dashboard", type: "Dashboard", path: "/kpi-dashboard", category: "Overview" },
      { id: "fav-2", title: "Monthly Collections Summary", type: "Report", path: "/reports", category: "Financial" },
      { id: "fav-3", title: "UnitedHealth Denial Audit Preset", type: "Saved View", path: "/denials", category: "Preset" },
      { id: "fav-4", title: "Predictive Analytics Forecast", type: "Dashboard", path: "/predictive-analytics", category: "Planning" },
    ],
    recentActivity: [
      { id: "rec-1", title: "Executive KPI Dashboard", type: "Dashboard", timestamp: "10 minutes ago", path: "/kpi-dashboard", detail: "Viewed 8 core revenue KPIs" },
      { id: "rec-2", title: "Predictive Analytics Forecast", type: "Dashboard", timestamp: "45 minutes ago", path: "/predictive-analytics", detail: "Reviewed 90-day revenue model" },
      { id: "rec-3", title: "Monthly Collections Summary", type: "Report", timestamp: "2 hours ago", path: "/reports", detail: "Exported PDF report file" },
      { id: "rec-4", title: "Claim #CLM-2026-9041", type: "Claim", timestamp: "Yesterday", path: "/claims", detail: "Applied pre-authorization scrub rule" },
    ],
  };

  return defaultData;
}

export function savePersonalizationData(data: PersonalizationData): PersonalizationData {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}
