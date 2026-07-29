import { AlertTriangle, ChevronRight, Clock, Info, ShieldAlert } from "lucide-react";
import { ResponsiveTable } from "./RevenueTables";
import { useDrillDown } from "./DrillDownProvider";
import { AR_DRILL_HIERARCHY } from "./ArKpiGrid";
import { StatusBadge } from "@/components/data/StatusBadge";
import type { DataGridColumn } from "@/components/common";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  ArActionGroup,
  ArActionItem,
  InsuranceArRow,
  OutstandingClaimRow,
  ProviderArRow,
} from "@/lib/api/ar-dashboard";

interface TableStateProps {
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

function AgeCell({ days }: { days: number }) {
  return (
    <span
      className={cn(
        "font-semibold",
        days > 120 ? "text-status-denied" : days > 60 ? "text-status-pending" : "text-foreground",
      )}
    >
      {formatNumber(days)}
    </span>
  );
}

/* --------------------------- Outstanding claims --------------------------- */

export function OutstandingClaimsTable({ rows, ...state }: { rows: OutstandingClaimRow[] } & TableStateProps) {
  const openDrillDown = useDrillDown();

  const columns: DataGridColumn<OutstandingClaimRow>[] = [
    { key: "id", header: "Claim", render: (r) => <span className="font-semibold">{r.id}</span> },
    { key: "patient", header: "Patient", render: (r) => r.patient },
    { key: "provider", header: "Provider", render: (r) => r.provider },
    { key: "insurance", header: "Insurance", render: (r) => r.insurance },
    {
      key: "dos",
      header: "DOS",
      sortValue: (r) => r.dos,
      render: (r) => formatDate(r.dos),
    },
    {
      key: "arDays",
      header: "AR days",
      align: "right",
      sortValue: (r) => r.arDays,
      render: (r) => <AgeCell days={r.arDays} />,
    },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortValue: (r) => r.outstanding,
      render: (r) => formatCurrency(r.outstanding),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="id"
      emptyTitle="No outstanding claims"
      emptyMessage="No open claims match the current filters."
      onRowClick={(row) =>
        openDrillDown({
          title: `${row.id} · ${row.patient}`,
          hint: `Claim level AR detail with adjudication and payment history. ${AR_DRILL_HIERARCHY}`,
          path: "/claims",
          value: formatCurrency(row.outstanding),
        })
      }
      {...state}
    />
  );
}

/* ------------------------------ Insurance AR ------------------------------ */

export function InsuranceArTable({ rows, ...state }: { rows: InsuranceArRow[] } & TableStateProps) {
  const openDrillDown = useDrillDown();

  const columns: DataGridColumn<InsuranceArRow>[] = [
    {
      key: "insurance",
      header: "Insurance",
      render: (r) => <span className="font-semibold">{r.insurance}</span>,
    },
    {
      key: "ar",
      header: "AR",
      align: "right",
      sortValue: (r) => r.ar,
      render: (r) => formatCurrency(r.ar),
    },
    {
      key: "claims",
      header: "Claims",
      align: "right",
      sortValue: (r) => r.claims,
      render: (r) => formatNumber(r.claims),
    },
    {
      key: "avgDays",
      header: "Average days",
      align: "right",
      sortValue: (r) => r.avgDays,
      render: (r) => <AgeCell days={r.avgDays} />,
    },
    {
      key: "denialPct",
      header: "Denial %",
      align: "right",
      sortValue: (r) => r.denialPct,
      render: (r) => formatPercent(r.denialPct),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="insurance"
      emptyTitle="No payer balances"
      emptyMessage="No insurance AR matches the current filters."
      onRowClick={(row) =>
        openDrillDown({
          title: row.insurance,
          hint: `Payer AR detail with aging, denial and turnaround analysis. ${AR_DRILL_HIERARCHY}`,
          path: "/payers",
          value: formatCurrency(row.ar),
        })
      }
      {...state}
    />
  );
}

/* ------------------------------- Provider AR ------------------------------ */

export function ProviderArTable({ rows, ...state }: { rows: ProviderArRow[] } & TableStateProps) {
  const openDrillDown = useDrillDown();

  const columns: DataGridColumn<ProviderArRow>[] = [
    {
      key: "provider",
      header: "Provider",
      render: (r) => <span className="font-semibold">{r.provider}</span>,
    },
    {
      key: "charges",
      header: "Charges",
      align: "right",
      sortValue: (r) => r.charges,
      render: (r) => formatCurrency(r.charges),
    },
    {
      key: "collections",
      header: "Collections",
      align: "right",
      sortValue: (r) => r.collections,
      render: (r) => formatCurrency(r.collections),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortValue: (r) => r.outstanding,
      render: (r) => formatCurrency(r.outstanding),
    },
    {
      key: "avgDays",
      header: "Average days",
      align: "right",
      sortValue: (r) => r.avgDays,
      render: (r) => <AgeCell days={r.avgDays} />,
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="provider"
      emptyTitle="No provider balances"
      emptyMessage="No provider AR matches the current filters."
      onRowClick={(row) =>
        openDrillDown({
          title: row.provider,
          hint: `Provider AR detail with charge, collection and aging composition. ${AR_DRILL_HIERARCHY}`,
          path: "/provider-performance",
          value: formatCurrency(row.outstanding),
        })
      }
      {...state}
    />
  );
}

/* ------------------------------ Action panel ------------------------------ */

const SEVERITY_ICON = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
} as const;

const SEVERITY_STYLE = {
  critical: "bg-status-denied-soft text-status-denied",
  warning: "bg-status-pending-soft text-status-pending",
  info: "bg-status-info-soft text-status-info",
} as const;

function actionValue(item: ArActionItem) {
  if (item.format === "currency") return formatCurrency(item.value, true);
  if (item.format === "days") return `${formatNumber(item.value)} days`;
  return formatNumber(item.value);
}

export function ArActionPanel({
  groups,
  isLoading,
}: {
  groups: ArActionGroup[];
  isLoading?: boolean;
}) {
  const openDrillDown = useDrillDown();

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card h-64 animate-pulse p-5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <section key={group.id} className="surface-card flex h-full flex-col p-5">
          <header className="mb-4 flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{group.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{group.subtitle}</p>
            </div>
          </header>
          <ul className="flex-1 space-y-2">
            {group.items.map((item) => {
              const Icon = SEVERITY_ICON[item.severity];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      openDrillDown({
                        title: item.primary,
                        hint: `${group.title} — ${item.secondary}. ${AR_DRILL_HIERARCHY}`,
                        path: group.drillPath,
                        value: actionValue(item),
                      })
                    }
                    className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary/60"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        SEVERITY_STYLE[item.severity],
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{item.primary}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.secondary}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                      {actionValue(item)}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
