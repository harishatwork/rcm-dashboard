import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Clock,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { ResponsiveTable } from "./RevenueTables";
import { useDrillDown } from "./DrillDownProvider";
import { COLLECTIONS_DRILL_HIERARCHY } from "./CollectionsKpiGrid";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import type { DataGridColumn } from "@/components/common";
import { formatCurrency, formatDate, formatMetric, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  CollectionsBreakdownGroup,
  CollectionsInsight,
  InsuranceCollectionsRow,
  ProviderCollectionsRow,
  RecentPaymentRow,
} from "@/lib/api/collections-dashboard";

interface TableStateProps {
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

function DeltaCell({ value }: { value: number }) {
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

/* ------------------------------ Breakdown cards ----------------------------- */

export function CollectionsBreakdownCard({ group }: { group: CollectionsBreakdownGroup }) {
  const openDrillDown = useDrillDown();
  const max = Math.max(...group.rows.map((row) => row.collections), 1);

  return (
    <section className="surface-card flex h-full flex-col p-5">
      <header className="mb-4">
        <h3 className="text-sm font-bold">{group.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{group.subtitle}</p>
      </header>
      <ul className="flex-1 space-y-3">
        {group.rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() =>
                openDrillDown({
                  title: row.name,
                  hint: `${group.title} detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
                  path: group.drillPath,
                  value: formatCurrency(row.collections),
                })
              }
              className="w-full rounded-lg p-1.5 text-left transition-colors hover:bg-secondary/60"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-sm font-medium">{row.name}</span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(row.collections, true)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(row.collections / max) * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{formatPercent(row.sharePct)} of total</span>
                <DeltaCell value={row.deltaPct} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------- Tables ---------------------------------- */

const providerColumns: DataGridColumn<ProviderCollectionsRow>[] = [
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
  { key: "claims", header: "Claims", align: "right", sortValue: (r) => r.claims, render: (r) => formatNumber(r.claims) },
  {
    key: "collections",
    header: "Collections",
    align: "right",
    sortValue: (r) => r.collections,
    render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.collections)}</span>,
  },
  { key: "avgPayment", header: "Average payment", align: "right", sortValue: (r) => r.avgPayment, render: (r) => formatCurrency(r.avgPayment) },
  { key: "collectionPct", header: "Collection %", align: "right", sortValue: (r) => r.collectionPct, render: (r) => formatPercent(r.collectionPct) },
  {
    key: "outstandingBalance",
    header: "Outstanding balance",
    align: "right",
    sortValue: (r) => r.outstandingBalance,
    render: (r) => formatCurrency(r.outstandingBalance),
  },
];

export function ProviderCollectionsTable({
  rows,
  isLoading,
  error,
  onRetry,
}: TableStateProps & { rows: ProviderCollectionsRow[] }) {
  const openDrillDown = useDrillDown();
  return (
    <ResponsiveTable
      columns={providerColumns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="provider"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No collections"
      emptyMessage="No provider collections were posted for the selected filters."
      onRowClick={(row) =>
        openDrillDown({
          title: row.provider,
          hint: `Provider collections detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
          path: "/provider-performance",
          value: formatCurrency(row.collections),
        })
      }
    />
  );
}

const insuranceColumns: DataGridColumn<InsuranceCollectionsRow>[] = [
  { key: "insurance", header: "Insurance", sortValue: (r) => r.insurance, render: (r) => <span className="font-semibold">{r.insurance}</span> },
  { key: "claims", header: "Claims", align: "right", sortValue: (r) => r.claims, render: (r) => formatNumber(r.claims) },
  {
    key: "collections",
    header: "Collections",
    align: "right",
    sortValue: (r) => r.collections,
    render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.collections)}</span>,
  },
  { key: "avgDays", header: "Average days", align: "right", sortValue: (r) => r.avgDays, render: (r) => `${r.avgDays}d` },
  { key: "denials", header: "Denials", align: "right", sortValue: (r) => r.denials, render: (r) => formatNumber(r.denials) },
  { key: "outstanding", header: "Outstanding", align: "right", sortValue: (r) => r.outstanding, render: (r) => formatCurrency(r.outstanding) },
];

export function InsuranceCollectionsTable({
  rows,
  isLoading,
  error,
  onRetry,
}: TableStateProps & { rows: InsuranceCollectionsRow[] }) {
  const openDrillDown = useDrillDown();
  return (
    <ResponsiveTable
      columns={insuranceColumns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="insurance"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No collections"
      emptyMessage="No payer remittances were posted for the selected filters."
      onRowClick={(row) =>
        openDrillDown({
          title: row.insurance,
          hint: `Payer collections detail. ${COLLECTIONS_DRILL_HIERARCHY}`,
          path: "/payers",
          value: formatCurrency(row.collections),
        })
      }
    />
  );
}

const paymentColumns: DataGridColumn<RecentPaymentRow>[] = [
  {
    key: "paymentDate",
    header: "Payment date",
    sortValue: (r) => r.paymentDate,
    render: (r) => <span className="font-medium">{formatDate(r.paymentDate)}</span>,
  },
  { key: "patient", header: "Patient", sortValue: (r) => r.patient, render: (r) => r.patient },
  { key: "insurance", header: "Insurance", sortValue: (r) => r.insurance, render: (r) => r.insurance },
  { key: "method", header: "Payment method", sortValue: (r) => r.method, render: (r) => r.method },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    sortValue: (r) => r.amount,
    render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span>,
  },
  {
    key: "eraNumber",
    header: "ERA number",
    sortValue: (r) => r.eraNumber,
    render: (r) => <span className="font-mono text-xs">{r.eraNumber}</span>,
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    sortValue: (r) => r.status,
    render: (r) => <StatusBadge status={r.status === "reconciled" ? "paid" : r.status} />,
  },
];

export function RecentPaymentsTable({
  rows,
  isLoading,
  error,
  onRetry,
}: TableStateProps & { rows: RecentPaymentRow[] }) {
  const openDrillDown = useDrillDown();
  return (
    <ResponsiveTable
      columns={paymentColumns}
      rows={rows}
      getRowKey={(row) => row.id}
      titleKey="patient"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No payments posted"
      emptyMessage="No payments were posted in the selected period."
      onRowClick={(row) =>
        openDrillDown({
          title: `${row.patient} · ${row.eraNumber}`,
          hint: `Payment and ERA detail for this remittance. ${COLLECTIONS_DRILL_HIERARCHY}`,
          path: "/claims",
          value: formatCurrency(row.amount),
        })
      }
    />
  );
}

/* ------------------------------ Insights panel ------------------------------ */

const INSIGHT_ICONS: Record<string, typeof Wallet> = {
  "highest-paying-insurance": Banknote,
  "slowest-paying-insurance": Clock,
  "fastest-growing-provider": TrendingUp,
  "highest-reimbursement-cpt": Sparkles,
  "largest-outstanding": Wallet,
};

const TONE_STYLES: Record<CollectionsInsight["tone"], string> = {
  positive: "bg-status-paid-soft text-status-paid",
  negative: "bg-status-denied-soft text-status-denied",
  neutral: "bg-status-info-soft text-status-info",
};

export function CollectionsInsightsPanel({
  items,
  isLoading,
  error,
  onRetry,
}: TableStateProps & { items: CollectionsInsight[] }) {
  const openDrillDown = useDrillDown();

  return (
    <section className="surface-card p-5" aria-label="Collections insights">
      <header className="mb-4">
        <h2 className="text-sm font-bold">Insights</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Automated highlights from the current collections period.
        </p>
      </header>

      {error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingSkeleton variant="list" />
      ) : items.length === 0 ? (
        <EmptyState title="No insights" description="Insights appear once collections are posted." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = INSIGHT_ICONS[item.id] ?? Sparkles;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    openDrillDown({
                      title: item.name,
                      hint: `${item.label}: ${item.helper}. ${COLLECTIONS_DRILL_HIERARCHY}`,
                      path: item.drillPath,
                      value: formatMetric(item.value, item.format),
                    })
                  }
                  className="w-full rounded-xl border border-border p-4 text-left transition-colors hover:bg-secondary/60"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        TONE_STYLES[item.tone],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold tabular-nums">
                        {item.tone === "positive" ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-status-paid" />
                        ) : item.tone === "negative" ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-status-denied" />
                        ) : null}
                        {formatMetric(item.value, item.format)}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.helper}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
