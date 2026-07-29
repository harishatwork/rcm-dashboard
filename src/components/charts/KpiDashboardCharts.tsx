import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { ComparisonPoint, MonthlyKpiPoint, RevenueSlice } from "@/lib/api/kpi-dashboard";

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

export const SLICE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

/** Charges, collections and adjustments across the trailing 12 months. */
export function MonthlyTrendChart({ data }: { data: MonthlyKpiPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="kpiChargesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="kpiCollectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatCurrency(v, true)} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Area type="monotone" dataKey="charges" name="Charges" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#kpiChargesFill)" />
        <Area type="monotone" dataKey="collections" name="Collections" stroke="var(--chart-3)" strokeWidth={2.5} fill="url(#kpiCollectionsFill)" />
        <Area type="monotone" dataKey="adjustments" name="Adjustments" stroke="var(--chart-4)" strokeWidth={2} fillOpacity={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Actual collections plotted against the board-approved monthly target. */
export function TargetVsActualChart({ data }: { data: MonthlyKpiPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatCurrency(v, true)} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="collections" name="Actual collections" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Line
          type="monotone"
          dataKey="collectionsTarget"
          name="Target"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          strokeDasharray="6 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** Current period versus the comparison basis (MoM, QoQ or YoY). */
export function PeriodComparisonChart({
  data,
  priorLabel,
}: {
  data: ComparisonPoint[];
  priorLabel: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatCurrency(v, true)} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="prior" name={priorLabel} fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={34} />
        <Bar dataKey="current" name="Current period" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Collection-rate quality trend (GCR vs. NCR). */
export function CollectionRateChart({ data }: { data: MonthlyKpiPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} domain={[60, 100]} tickFormatter={(v: number) => `${v}%`} width={48} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatPercent(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Line type="monotone" dataKey="grossCollectionRate" name="Gross collection rate" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="netCollectionRate" name="Net collection rate" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** Claim submission volume by month. */
export function ClaimsSubmittedChart({ data }: { data: MonthlyKpiPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatNumber(v)} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [formatNumber(value), "Claims submitted"]}
        />
        <Bar dataKey="claimsSubmitted" name="Claims submitted" fill="var(--chart-5)" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Donut breakdown of revenue distribution. */
export function RevenueDistributionChart({ data }: { data: RevenueSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [
            `${formatCurrency(value)} · ${formatPercent((value / total) * 100)}`,
            name,
          ]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={100}
          paddingAngle={2}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {data.map((slice, index) => (
            <Cell key={slice.name} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
