import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { DataGrid, type DataGridColumn } from "@/components/common";
import { useDrillDown } from "./DrillDownProvider";
import type {
  GrowthIndicator,
  ProviderPerformanceRow,
  TopPayerRow,
} from "@/lib/api/kpi-dashboard";

/** Indicators where a decrease is the healthy direction. */
const INVERTED = new Set(["outstanding", "adjustments"]);

function DeltaCell({ value, inverted }: { value: number; inverted?: boolean }) {
  const flat = Math.abs(value) < 0.05;
  const good = inverted ? value < 0 : value > 0;
  const Icon = flat ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
        flat ? "text-muted-foreground" : good ? "text-success" : "text-destructive",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {`${value > 0 ? "+" : ""}${value.toFixed(1)}%`}
    </span>
  );
}

function indicatorValue(indicator: GrowthIndicator) {
  if (indicator.format === "currency") return formatCurrency(indicator.current, true);
  if (indicator.format === "percent") return formatPercent(indicator.current);
  return formatNumber(indicator.current);
}

/** MoM / QoQ / YoY growth matrix across the seven headline KPIs. */
export function GrowthIndicatorTable({ rows }: { rows: GrowthIndicator[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <caption className="sr-only">Growth indicators by comparison basis</caption>
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2.5 pr-4 text-left font-semibold">Metric</th>
            <th scope="col" className="py-2.5 px-4 text-right font-semibold">Current</th>
            <th scope="col" className="py-2.5 px-4 text-right font-semibold">MoM</th>
            <th scope="col" className="py-2.5 px-4 text-right font-semibold">QoQ</th>
            <th scope="col" className="py-2.5 pl-4 text-right font-semibold">YoY</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const inverted = INVERTED.has(row.id);
            return (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-3 pr-4 text-left font-medium">{row.label}</th>
                <td className="py-3 px-4 text-right font-semibold tabular-nums">
                  {indicatorValue(row)}
                </td>
                <td className="py-3 px-4 text-right"><DeltaCell value={row.mom} inverted={inverted} /></td>
                <td className="py-3 px-4 text-right"><DeltaCell value={row.qoq} inverted={inverted} /></td>
                <td className="py-3 pl-4 text-right"><DeltaCell value={row.yoy} inverted={inverted} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const providerColumns: DataGridColumn<ProviderPerformanceRow>[] = [
  { key: "name", header: "Provider", sortValue: (r) => r.name, render: (r) => (
    <div className="min-w-0">
      <p className="truncate font-medium">{r.name}</p>
      <p className="truncate text-xs text-muted-foreground">{r.specialty}</p>
    </div>
  ) },
  { key: "charges", header: "Charges", align: "right", sortValue: (r) => r.charges, render: (r) => formatCurrency(r.charges) },
  { key: "collections", header: "Collections", align: "right", sortValue: (r) => r.collections, render: (r) => formatCurrency(r.collections) },
  { key: "ncr", header: "NCR", align: "right", sortValue: (r) => r.netCollectionRate, render: (r) => formatPercent(r.netCollectionRate) },
  { key: "encounters", header: "Encounters", align: "right", sortValue: (r) => r.encounters, render: (r) => formatNumber(r.encounters) },
  { key: "growth", header: "Growth", align: "right", sortValue: (r) => r.growthPct, render: (r) => <DeltaCell value={r.growthPct} /> },
];

const payerColumns: DataGridColumn<TopPayerRow>[] = [
  { key: "name", header: "Payer", sortValue: (r) => r.name, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "collections", header: "Collections", align: "right", sortValue: (r) => r.collections, render: (r) => formatCurrency(r.collections) },
  { key: "claims", header: "Claims", align: "right", sortValue: (r) => r.claims, render: (r) => formatNumber(r.claims) },
  { key: "ncr", header: "NCR", align: "right", sortValue: (r) => r.netCollectionRate, render: (r) => formatPercent(r.netCollectionRate) },
  { key: "days", header: "Avg days to pay", align: "right", sortValue: (r) => r.avgDaysToPay, render: (r) => `${r.avgDaysToPay} d` },
  { key: "growth", header: "Growth", align: "right", sortValue: (r) => r.growthPct, render: (r) => <DeltaCell value={r.growthPct} /> },
];

/** Ranked provider contribution table with drill-down. */
export function TopProvidersTable({
  rows,
  isLoading,
}: {
  rows: ProviderPerformanceRow[];
  isLoading?: boolean;
}) {
  const openDrillDown = useDrillDown();
  return (
    <DataGrid
      columns={providerColumns}
      rows={rows}
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      onRowClick={(row) =>
        openDrillDown({
          title: row.name,
          hint: "Provider-level charges, collections, payer mix and wRVU productivity",
          path: "/provider-performance",
          value: formatCurrency(row.collections),
        })
      }
    />
  );
}

/** Ranked payer contribution table with drill-down. */
export function TopPayersTable({ rows, isLoading }: { rows: TopPayerRow[]; isLoading?: boolean }) {
  const openDrillDown = useDrillDown();
  return (
    <DataGrid
      columns={payerColumns}
      rows={rows}
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      onRowClick={(row) =>
        openDrillDown({
          title: row.name,
          hint: "Payer yield, denial reasons, contracted allowables and payment velocity",
          path: "/payers",
          value: formatCurrency(row.collections),
        })
      }
    />
  );
}
