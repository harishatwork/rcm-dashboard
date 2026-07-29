import type { ReactNode } from "react";
import { AlertTriangle, ChevronRight, Info, ShieldAlert } from "lucide-react";
import { DataGrid, type DataGridColumn } from "@/components/common";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { StatusBadge } from "@/components/data/StatusBadge";
import { useDrillDown } from "./DrillDownProvider";
import { formatCurrency, formatMetric, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type {
  FacilityRevenueRow,
  LeakageItem,
  RevenueDistributionGroup,
  TopCptRow,
  TopInsuranceRow,
  TopProviderRevenueRow,
} from "@/lib/api/revenue-dashboard";

const DRILL_HIERARCHY =
  "Hierarchy: Revenue → Insurance → Provider → Patient → Encounter → Claim → CPT → Payment details.";

interface ResponsiveTableProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  /** Column key rendered as the card title on mobile. */
  titleKey: string;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

/**
 * Renders the shared DataGrid on tablet and desktop, and collapses to a
 * stacked card list on mobile so no horizontal scrolling is required.
 */
export function ResponsiveTable<T>({
  columns,
  rows,
  getRowKey,
  titleKey,
  isLoading,
  error,
  onRetry,
  onRowClick,
  emptyTitle = "No records",
  emptyMessage = "No revenue records match the current filters.",
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <DataGrid
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onRowClick={onRowClick}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        paginated
        initialPageSize={10}
      />
    );
  }

  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (isLoading) return <LoadingSkeleton variant="list" />;
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyMessage} />;

  const title = columns.find((c) => c.key === titleKey) ?? columns[0];
  const rest = columns.filter((c) => c.key !== title.key);

  return (
    <ul className="space-y-3">
      {rows.map((row, index) => (
        <li key={getRowKey(row, index)}>
          <button
            type="button"
            onClick={() => onRowClick?.(row)}
            className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/60"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-semibold">{title.render(row)}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {rest.map((col) => (
                <div key={col.key} className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {col.header}
                  </dt>
                  <dd className="truncate text-sm font-medium">{col.render(row)}</dd>
                </div>
              ))}
            </dl>
          </button>
        </li>
      ))}
    </ul>
  );
}

function GrowthCell({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "font-semibold",
        value > 0 ? "text-status-paid" : value < 0 ? "text-status-denied" : "text-muted-foreground",
      )}
    >
      {value > 0 ? "+" : ""}
      {formatPercent(value)}
    </span>
  );
}

/* ---------------------------------- Tables --------------------------------- */

export function TopProvidersRevenueTable({
  rows,
  isLoading,
  error,
  onRetry,
}: {
  rows: TopProviderRevenueRow[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const openDrillDown = useDrillDown();
  const columns: DataGridColumn<TopProviderRevenueRow>[] = [
    {
      key: "provider",
      header: "Provider",
      sortValue: (r) => r.provider,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.provider}</p>
          <p className="truncate text-xs text-muted-foreground">{r.specialty}</p>
        </div>
      ),
    },
    { key: "charges", header: "Charges", align: "right", sortValue: (r) => r.charges, render: (r) => formatCurrency(r.charges) },
    { key: "collections", header: "Collections", align: "right", sortValue: (r) => r.collections, render: (r) => formatCurrency(r.collections) },
    { key: "adjustments", header: "Adjustment", align: "right", sortValue: (r) => r.adjustments, render: (r) => formatCurrency(r.adjustments) },
    { key: "net", header: "Net revenue", align: "right", sortValue: (r) => r.netRevenue, render: (r) => <span className="font-semibold">{formatCurrency(r.netRevenue)}</span> },
    { key: "growth", header: "Growth %", align: "right", sortValue: (r) => r.growthPct, render: (r) => <GrowthCell value={r.growthPct} /> },
    { key: "rank", header: "Ranking", align: "right", sortValue: (r) => r.rank, render: (r) => <span className="font-mono text-xs">#{r.rank}</span> },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      titleKey="provider"
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No provider revenue"
      onRowClick={(r) =>
        openDrillDown({
          title: r.provider,
          hint: `Provider revenue detail for ${r.specialty}. ${DRILL_HIERARCHY}`,
          path: "/provider-performance",
          value: formatCurrency(r.netRevenue),
        })
      }
    />
  );
}

export function TopInsuranceTable({
  rows,
  isLoading,
  error,
  onRetry,
}: {
  rows: TopInsuranceRow[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const openDrillDown = useDrillDown();
  const columns: DataGridColumn<TopInsuranceRow>[] = [
    { key: "insurance", header: "Insurance", sortValue: (r) => r.insurance, render: (r) => <span className="font-semibold">{r.insurance}</span> },
    { key: "claims", header: "Claims", align: "right", sortValue: (r) => r.claims, render: (r) => formatNumber(r.claims) },
    { key: "payments", header: "Payments", align: "right", sortValue: (r) => r.payments, render: (r) => formatCurrency(r.payments) },
    { key: "denials", header: "Denials", align: "right", sortValue: (r) => r.denials, render: (r) => formatNumber(r.denials) },
    { key: "days", header: "Avg payment time", align: "right", sortValue: (r) => r.avgPaymentDays, render: (r) => `${r.avgPaymentDays.toFixed(1)} days` },
    { key: "revenue", header: "Revenue", align: "right", sortValue: (r) => r.revenue, render: (r) => <span className="font-semibold">{formatCurrency(r.revenue)}</span> },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      titleKey="insurance"
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No payer revenue"
      onRowClick={(r) =>
        openDrillDown({
          title: r.insurance,
          hint: `Payer revenue detail with remittance timing and denial impact. ${DRILL_HIERARCHY}`,
          path: "/payers",
          value: formatCurrency(r.revenue),
        })
      }
    />
  );
}

export function TopCptTable({
  rows,
  isLoading,
  error,
  onRetry,
}: {
  rows: TopCptRow[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const openDrillDown = useDrillDown();
  const columns: DataGridColumn<TopCptRow>[] = [
    { key: "cpt", header: "CPT", sortValue: (r) => r.cpt, render: (r) => <span className="font-mono text-xs font-semibold">{r.cpt}</span> },
    { key: "description", header: "Description", sortValue: (r) => r.description, render: (r) => <span className="text-muted-foreground">{r.description}</span> },
    { key: "charges", header: "Charges", align: "right", sortValue: (r) => r.charges, render: (r) => formatCurrency(r.charges) },
    { key: "collections", header: "Collections", align: "right", sortValue: (r) => r.collections, render: (r) => formatCurrency(r.collections) },
    { key: "revenue", header: "Revenue", align: "right", sortValue: (r) => r.revenue, render: (r) => <span className="font-semibold">{formatCurrency(r.revenue)}</span> },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      titleKey="cpt"
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No CPT revenue"
      onRowClick={(r) =>
        openDrillDown({
          title: `CPT ${r.cpt}`,
          hint: `${r.description}. Charge, payment and adjustment detail per claim line. ${DRILL_HIERARCHY}`,
          path: "/billing",
          value: formatCurrency(r.revenue),
        })
      }
    />
  );
}

export function FacilityRevenueTable({
  rows,
  isLoading,
  error,
  onRetry,
}: {
  rows: FacilityRevenueRow[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const openDrillDown = useDrillDown();
  const columns: DataGridColumn<FacilityRevenueRow>[] = [
    { key: "facility", header: "Facility", sortValue: (r) => r.facility, render: (r) => <span className="font-semibold">{r.facility}</span> },
    { key: "charges", header: "Charges", align: "right", sortValue: (r) => r.charges, render: (r) => formatCurrency(r.charges) },
    { key: "collections", header: "Collections", align: "right", sortValue: (r) => r.collections, render: (r) => formatCurrency(r.collections) },
    { key: "revenue", header: "Revenue", align: "right", sortValue: (r) => r.revenue, render: (r) => <span className="font-semibold">{formatCurrency(r.revenue)}</span> },
    { key: "outstanding", header: "Outstanding balance", align: "right", sortValue: (r) => r.outstandingBalance, render: (r) => formatCurrency(r.outstandingBalance) },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={rows}
      titleKey="facility"
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No facility revenue"
      onRowClick={(r) =>
        openDrillDown({
          title: r.facility,
          hint: `Facility revenue and open A/R composition. ${DRILL_HIERARCHY}`,
          path: "/ar",
          value: formatCurrency(r.revenue),
        })
      }
    />
  );
}

/* ------------------------------ Distribution ------------------------------- */

export function RevenueDistributionCard({ group }: { group: RevenueDistributionGroup }) {
  const openDrillDown = useDrillDown();
  const max = Math.max(...group.rows.map((r) => r.revenue), 1);

  return (
    <section className="surface-card animate-rise p-5">
      <div className="mb-4 min-w-0">
        <h3 className="truncate text-sm font-bold">{group.title}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">{group.subtitle}</p>
      </div>
      <ul className="space-y-3">
        {group.rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() =>
                openDrillDown({
                  title: row.name,
                  hint: `${group.title} contribution detail. ${DRILL_HIERARCHY}`,
                  path: group.drillPath,
                  value: formatCurrency(row.revenue),
                })
              }
              className="w-full rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary/70"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                <span className="min-w-0 truncate text-sm">{row.name}</span>
                <span className="text-sm font-semibold">{formatCurrency(row.revenue)}</span>
              </div>
              <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${(row.revenue / max) * 100}%` }}
                  />
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.sharePct.toFixed(1)}% ·{" "}
                  <span className={row.deltaPct >= 0 ? "text-status-paid" : "text-status-denied"}>
                    {row.deltaPct >= 0 ? "+" : ""}
                    {row.deltaPct.toFixed(1)}%
                  </span>
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------- Leakage ---------------------------------- */

const SEVERITY: Record<LeakageItem["severity"], { badge: string; icon: ReactNode; ring: string }> = {
  critical: {
    badge: "denied",
    icon: <ShieldAlert className="h-4 w-4 text-status-denied" />,
    ring: "border-status-denied/40",
  },
  warning: {
    badge: "warning",
    icon: <AlertTriangle className="h-4 w-4 text-status-pending" />,
    ring: "border-status-pending/40",
  },
  info: {
    badge: "submitted",
    icon: <Info className="h-4 w-4 text-status-info" />,
    ring: "border-status-info/40",
  },
};

export function RevenueLeakagePanel({
  items,
  isLoading,
  error,
  onRetry,
}: {
  items: LeakageItem[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const openDrillDown = useDrillDown();

  return (
    <section className="surface-card animate-rise p-5" aria-label="Revenue leakage summary">
      <div className="mb-4 min-w-0">
        <h2 className="truncate text-base font-bold">Revenue leakage</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Exposure detected across capture, billing and reimbursement.
        </p>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingSkeleton variant="list" />
      ) : items.length === 0 ? (
        <EmptyState title="No leakage detected" description="All revenue capture checks passed." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const severity = SEVERITY[item.severity];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    openDrillDown({
                      title: item.label,
                      hint: `${item.helper}. ${DRILL_HIERARCHY}`,
                      path: item.drillPath,
                      value: formatMetric(item.value, item.format),
                    })
                  }
                  className={cn(
                    "w-full rounded-xl border bg-card p-4 text-left transition-colors hover:bg-secondary/60",
                    severity.ring,
                  )}
                >
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                    <span className="mt-0.5 shrink-0">{severity.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.helper}</p>
                    </div>
                    <StatusBadge status={severity.badge} />
                  </div>
                  <p className="mt-3 font-display text-xl font-extrabold">
                    {formatMetric(item.value, item.format)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
