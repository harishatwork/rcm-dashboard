import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type {
  BillingClaimStatus,
  BillingSummaryRow,
  FunnelStage,
  StatusSlice,
} from "@/lib/api/billing-status";

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "var(--card)",
  boxShadow: "var(--shadow-e2)",
  fontSize: "12px",
  color: "var(--foreground)",
};

const legendStyle = { fontSize: "12px", paddingTop: "8px" };

const STATUS_COLOR: Record<BillingClaimStatus, string> = {
  paid: "var(--status-paid)",
  pending: "var(--status-pending)",
  denied: "var(--status-denied)",
  rejected: "var(--status-rejected)",
  submitted: "var(--status-info)",
  unbilled: "var(--muted-foreground)",
};

/**
 * Claim lifecycle funnel.
 *
 * Rendered as proportional bars rather than a chart library funnel so each
 * stage stays keyboard reachable and can open its own drill-down.
 */
export function ClaimStatusFunnel({
  stages,
  onSelect,
}: {
  stages: FunnelStage[];
  onSelect?: (stage: FunnelStage) => void;
}) {
  const top = stages[0]?.claims ?? 1;

  return (
    <ol className="space-y-2.5">
      {stages.map((stage, index) => {
        const width = Math.max(12, Math.round((stage.claims / top) * 100));
        const dropOff = index === 0 ? 0 : 100 - stage.conversionPct;
        return (
          <li key={stage.id}>
            <button
              type="button"
              onClick={() => onSelect?.(stage)}
              aria-label={`${stage.label} — open drill-down`}
              className="group w-full rounded-xl px-1 py-1 text-left transition-colors hover:bg-accent/40 focus-visible:bg-accent/40"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="text-sm font-medium">{stage.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(stage.claims)} claims · {formatCurrency(stage.amount, true)}
                  {index > 0 ? (
                    <span className={cn("ml-2 font-semibold", dropOff > 8 ? "text-destructive" : "text-success")}>
                      {formatPercent(stage.conversionPct)} pass-through
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="mt-1.5 h-7 w-full overflow-hidden rounded-lg bg-secondary">
                <div
                  className="h-full rounded-lg bg-primary/85 transition-all duration-700 ease-out group-hover:bg-primary"
                  style={{ width: `${width}%`, opacity: 1 - index * 0.09 }}
                />
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Donut of claim volume by status. */
export function ClaimStatusPie({
  data,
  metric = "claims",
}: {
  data: StatusSlice[];
  metric?: "claims" | "amount";
}) {
  const total = data.reduce((sum, slice) => sum + slice[metric], 0);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [
            metric === "claims"
              ? `${formatNumber(value)} claims · ${formatPercent((value / total) * 100)}`
              : `${formatCurrency(value)} · ${formatPercent((value / total) * 100)}`,
            name,
          ]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={data}
          dataKey={metric}
          nameKey="label"
          innerRadius={62}
          outerRadius={100}
          paddingAngle={2}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {data.map((slice) => (
            <Cell key={slice.status} fill={STATUS_COLOR[slice.status]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Billed versus paid dollars for any billing summary dimension. */
export function BillingSummaryChart({ rows }: { rows: BillingSummaryRow[] }) {
  const data = rows.map((row) => ({
    name: row.name,
    Billed: row.billed,
    Paid: row.paid,
    Outstanding: Math.max(0, row.billed - row.paid),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis
          dataKey="name"
          {...axisProps}
          interval={0}
          height={48}
          tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 13)}\u2026` : v)}
        />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatCurrency(v, true)} width={64} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [formatCurrency(value), name]} />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="Paid" stackId="mix" fill="var(--status-paid)" maxBarSize={44} />
        <Bar dataKey="Outstanding" stackId="mix" fill="var(--status-pending)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
