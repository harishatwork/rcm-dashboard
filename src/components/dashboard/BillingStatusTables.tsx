import { useState } from "react";
import { DataGrid, type DataGridColumn } from "@/components/common";
import { StatusBadge } from "@/components/data/StatusBadge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDrillDown } from "./DrillDownProvider";
import type { BillingSummaryRow, RecentClaimRow } from "@/lib/api/billing-status";

function firstPassTone(rate: number) {
  if (rate >= 97) return "text-status-paid";
  if (rate >= 95) return "text-status-pending";
  return "text-status-denied";
}

function summaryColumns(entityHeader: string): DataGridColumn<BillingSummaryRow>[] {
  return [
    {
      key: "name",
      header: entityHeader,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
        </div>
      ),
    },
    { key: "claims", header: "Claims", align: "right", sortValue: (r) => r.claims, render: (r) => formatNumber(r.claims) },
    { key: "billed", header: "Billed", align: "right", sortValue: (r) => r.billed, render: (r) => formatCurrency(r.billed) },
    { key: "paid", header: "Paid", align: "right", sortValue: (r) => r.paid, render: (r) => formatCurrency(r.paid) },
    { key: "denied", header: "Denied", align: "right", sortValue: (r) => r.denied, render: (r) => formatNumber(r.denied) },
    { key: "rejected", header: "Rejected", align: "right", sortValue: (r) => r.rejected, render: (r) => formatNumber(r.rejected) },
    { key: "pending", header: "Pending", align: "right", sortValue: (r) => r.pending, render: (r) => formatNumber(r.pending) },
    {
      key: "fpar",
      header: "First pass",
      align: "right",
      sortValue: (r) => r.firstPassRatePct,
      render: (r) => (
        <span className={cn("font-semibold tabular-nums", firstPassTone(r.firstPassRatePct))}>
          {formatPercent(r.firstPassRatePct)}
        </span>
      ),
    },
  ];
}

/** Billing outcome summary for one dimension (insurance, provider, facility, CPT). */
export function BillingSummaryTable({
  rows,
  entityHeader,
  drillPath,
  drillHint,
  isLoading,
}: {
  rows: BillingSummaryRow[];
  entityHeader: string;
  drillPath: string;
  drillHint: string;
  isLoading?: boolean;
}) {
  const openDrillDown = useDrillDown();
  return (
    <DataGrid
      columns={summaryColumns(entityHeader)}
      rows={rows}
      getRowKey={(row) => row.id}
      isLoading={isLoading}
      onRowClick={(row) =>
        openDrillDown({
          title: `${row.name} — billing detail`,
          hint: drillHint,
          path: drillPath,
          value: `${formatNumber(row.claims)} claims · ${formatCurrency(row.billed)} billed`,
        })
      }
    />
  );
}

const STATUS_FILTERS = ["all", "paid", "pending", "denied", "rejected", "unbilled"] as const;

/** Most recent claim activity with status filtering and drill-down. */
export function RecentClaimsTable({
  rows,
  isLoading,
}: {
  rows: RecentClaimRow[];
  isLoading?: boolean;
}) {
  const openDrillDown = useDrillDown();
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const filtered = status === "all" ? rows : rows.filter((row) => row.status === status);

  const columns: DataGridColumn<RecentClaimRow>[] = [
    {
      key: "id",
      header: "Claim",
      sortValue: (r) => r.id,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.id}</p>
          <p className="truncate text-xs text-muted-foreground">{r.patient}</p>
        </div>
      ),
    },
    { key: "payer", header: "Payer", sortValue: (r) => r.payer, render: (r) => r.payer },
    {
      key: "provider",
      header: "Provider / facility",
      sortValue: (r) => r.provider,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate">{r.provider}</p>
          <p className="truncate text-xs text-muted-foreground">{r.facility}</p>
        </div>
      ),
    },
    { key: "cpt", header: "CPT", sortValue: (r) => r.cpt, render: (r) => <span className="tabular-nums">{r.cpt}</span> },
    {
      key: "submitted",
      header: "Submitted",
      sortValue: (r) => r.submittedDate,
      render: (r) => (
        <span className="text-muted-foreground">
          {r.submittedDate ? formatDate(r.submittedDate) : "Not submitted"}
        </span>
      ),
    },
    { key: "age", header: "Age", align: "right", sortValue: (r) => r.ageDays, render: (r) => `${r.ageDays} d` },
    { key: "amount", header: "Billed", align: "right", sortValue: (r) => r.amount, render: (r) => formatCurrency(r.amount) },
    { key: "status", header: "Status", align: "right", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-4">
      <ToggleGroup
        type="single"
        size="sm"
        variant="outline"
        value={status}
        onValueChange={(value) => value && setStatus(value as (typeof STATUS_FILTERS)[number])}
        aria-label="Filter recent claims by status"
        className="flex-wrap justify-start"
      >
        {STATUS_FILTERS.map((option) => (
          <ToggleGroupItem key={option} value={option} className="capitalize">
            {option === "all" ? "All" : option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <DataGrid
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyTitle="No claims in this status"
        emptyMessage="No recent claim activity matches the selected status."
        paginated
        initialPageSize={8}
        onRowClick={(row) =>
          openDrillDown({
            title: `${row.id} — ${row.patient}`,
            hint: `${row.note}. Full claim detail will show line items, remittance history, edits and appeal notes.`,
            path: "/claims",
            value: `${formatCurrency(row.amount)} · ${row.status}`,
          })
        }
      />
    </div>
  );
}
