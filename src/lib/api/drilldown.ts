import type { KpiMetric } from "./types";

export type DrillLevel = 1 | 2 | 3 | 4;

export type EntityType =
  | "revenue"
  | "collections"
  | "ar"
  | "denials"
  | "payor"
  | "provider"
  | "patient"
  | "operational"
  | "leakage"
  | "forecast"
  | "claim";

export interface DrillDownBreadcrumb {
  level: DrillLevel;
  entityType: EntityType;
  entityId: string;
  label: string;
}

export interface DrillDownNode {
  id: string;
  level: DrillLevel;
  entityType: EntityType;
  entityId: string;
  title: string;
  subtitle: string;
  value?: string | number;
  format?: "currency" | "percent" | "number" | "days";
  deltaPct?: number;
  trend?: "up" | "down" | "flat";
  parentId?: string;
  summaryData: {
    label: string;
    value: string;
    note?: string;
  }[];
  kpiMetrics: KpiMetric[];
  chartData: {
    name: string;
    value: number;
    target?: number;
    category?: string;
  }[];
  tableData: {
    id: string;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    amount?: number;
    status?: string;
  }[];
  timelineData: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
    actor: string;
    type: "info" | "warning" | "success" | "critical";
  }[];
  notesHistory: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
}

export interface DrillDownDetailResponse {
  breadcrumbs: DrillDownBreadcrumb[];
  node: DrillDownNode;
  parentLink?: { level: DrillLevel; entityType: EntityType; entityId: string; label: string };
  childLinks?: { level: DrillLevel; entityType: EntityType; entityId: string; label: string }[];
  preservedFilters: {
    dateRange: string;
    practice: string;
    provider: string;
    payor: string;
    location: string;
    specialty: string;
  };
}

export function getMockDrillDownDetailData(
  entityType: EntityType = "revenue",
  entityId: string = "root",
  level: DrillLevel = 1,
): DrillDownDetailResponse {
  const levelLabels: Record<DrillLevel, string> = {
    1: "Level 1: Executive Dashboard KPI",
    2: "Level 2: Category Summary View",
    3: "Level 3: Detailed Analysis & Drivers",
    4: "Level 4: Transaction & Claim Details",
  };

  const breadcrumbs: DrillDownBreadcrumb[] = [
    { level: 1, entityType: "revenue", entityId: "exec-101", label: "Executive Dashboard" },
  ];

  if (level >= 2) {
    breadcrumbs.push({
      level: 2,
      entityType,
      entityId: `${entityType}-sum`,
      label: `${entityType.toUpperCase()} Summary View`,
    });
  }

  if (level >= 3) {
    breadcrumbs.push({
      level: 3,
      entityType,
      entityId: `${entityType}-analysis`,
      label: `${entityType.toUpperCase()} Detailed Drivers`,
    });
  }

  if (level >= 4) {
    breadcrumbs.push({
      level: 4,
      entityType: "claim",
      entityId: entityId.startsWith("CLM") ? entityId : "CLM-2026-8801",
      label: `Claim #${entityId.startsWith("CLM") ? entityId : "CLM-2026-8801"} Details`,
    });
  }

  return {
    breadcrumbs,
    preservedFilters: {
      dateRange: "Last 30 Days (Jul 1 - Jul 29, 2026)",
      practice: "Main Campus Health System",
      provider: "Dr. Sarah Jenkins, MD",
      payor: "UnitedHealth Commercial PPO",
      location: "Building A - 3rd Floor",
      specialty: "Orthopedic Surgery",
    },
    parentLink:
      level > 1
        ? {
            level: (level - 1) as DrillLevel,
            entityType,
            entityId: `parent-${level - 1}`,
            label: `Return to Level ${level - 1}`,
          }
        : undefined,
    childLinks:
      level < 4
        ? [
            {
              level: (level + 1) as DrillLevel,
              entityType: level === 3 ? "claim" : entityType,
              entityId: level === 3 ? "CLM-2026-8801" : `${entityType}-detail`,
              label: `Drill Down to Level ${level + 1} (${level === 3 ? "Claim Item" : "Detailed Analysis"})`,
            },
          ]
        : undefined,
    node: {
      id: `node-${level}-${entityType}-${entityId}`,
      level,
      entityType,
      entityId,
      title: `${entityType.toUpperCase()} — ${levelLabels[level]}`,
      subtitle: `Context preserved across Date Range, Practice, Provider, and Payor filters. Target ID: ${entityId}`,
      value: level === 4 ? "$14,500" : level === 3 ? "$340,000" : "$4,850,000",
      format: "currency",
      deltaPct: 8.4,
      trend: "up",
      summaryData: [
        { label: "Entity Category", value: entityType.toUpperCase(), note: "Primary operational domain" },
        { label: "Navigation Depth", value: `Level ${level} of 4`, note: "Structured hierarchical drill path" },
        { label: "Assigned Facility", value: "Main Campus Health System", note: "Primary practice location" },
        { label: "Payer Classification", value: "UnitedHealth Commercial PPO", note: "Contracted rate schedule" },
      ],
      kpiMetrics: [
        {
          id: "m-1",
          label: "Billed Volume",
          value: 4180000,
          format: "currency",
          deltaPct: 6.2,
          trend: "up",
          helper: "+$240k vs prev period",
        },
        {
          id: "m-2",
          label: "Net Collections",
          value: 3820000,
          format: "currency",
          deltaPct: 7.8,
          trend: "up",
          helper: "+$280k collected",
        },
        {
          id: "m-3",
          label: "Denial Exposure",
          value: 4.2,
          format: "percent",
          deltaPct: -0.8,
          trend: "down",
          target: 4.0,
          helper: "-0.8% denial reduction",
        },
        {
          id: "m-4",
          label: "Days in A/R",
          value: 32.8,
          format: "days",
          deltaPct: -3.4,
          trend: "down",
          target: 30.0,
          helper: "-3.4 days in A/R",
        },
      ],
      chartData: [
        { name: "Week 1", value: 120000, target: 110000, category: "Baseline" },
        { name: "Week 2", value: 135000, target: 125000, category: "Baseline" },
        { name: "Week 3", value: 142000, target: 130000, category: "Baseline" },
        { name: "Week 4", value: 158000, target: 140000, category: "Baseline" },
      ],
      tableData: [
        {
          id: "tbl-1",
          col1: "CLM-2026-8801",
          col2: "Sarah Jenkins (Patient)",
          col3: "UnitedHealth PPO",
          col4: "CPT 29881 (Knee Arthroscopy)",
          amount: 14500,
          status: "Under Review",
        },
        {
          id: "tbl-2",
          col1: "CLM-2026-8802",
          col2: "Arthur Dent (Patient)",
          col3: "Medicare Part B",
          col4: "CPT 99214 (Office Visit)",
          amount: 3200,
          status: "Paid",
        },
        {
          id: "tbl-3",
          col1: "CLM-2026-8803",
          col2: "Eleanor Rigby (Patient)",
          col3: "Blue Cross Blue Shield",
          col4: "CPT 73721 (MRI Lower Joint)",
          amount: 8400,
          status: "Denied (CO-197)",
        },
      ],
      timelineData: [
        {
          id: "t-1",
          timestamp: "Today at 09:14 AM",
          title: "Claim Submitted to Clearinghouse",
          description: "837P electronic claim payload transmitted to Availity gateway.",
          actor: "Billing System",
          type: "info",
        },
        {
          id: "t-2",
          timestamp: "Yesterday at 04:30 PM",
          title: "Pre-Submission Scrubbing Audit Passed",
          description: "Automated pre-authorization rules verified mandatory PDF attachment.",
          actor: "Scrubbing Engine",
          type: "success",
        },
        {
          id: "t-3",
          timestamp: "Jul 27, 2026",
          title: "Denial Risk Warning Flagged",
          description: "Machine learning engine predicted 78% denial probability due to CPT modifier.",
          actor: "AI Risk Engine",
          type: "warning",
        },
      ],
      notesHistory: [
        {
          id: "n-1",
          author: "Dana Whitfield (Practice Admin)",
          timestamp: "Today at 10:00 AM",
          text: "Verified prior authorization approval document attached in EHR. Clearinghouse re-submission scheduled.",
        },
        {
          id: "n-2",
          author: "Priya Raman (Billing Manager)",
          timestamp: "Yesterday at 05:15 PM",
          text: "Contacted UnitedHealth provider relations representative regarding delayed 835 ERA remittance.",
        },
      ],
    },
  };
}
