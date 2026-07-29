import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { ArTrendPoint, ClaimsTrendPoint, CollectionsPoint } from "@/lib/api/types";

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

/** Collections vs. monthly cash goal. */
export function CollectionsTrendChart({ data }: { data: CollectionsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="collectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
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
        <Area
          type="monotone"
          dataKey="collected"
          name="Collected"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#collectionsFill)"
        />
        <Line
          type="monotone"
          dataKey="goal"
          name="Goal"
          stroke="var(--chart-4)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Submitted / paid / denied / pending claim volume by month. */
export function ClaimsTrendChart({ data }: { data: ClaimsTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatNumber(v)} width={56} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatNumber(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="paid" name="Paid" stackId="a" fill="var(--chart-3)" maxBarSize={40} />
        <Bar dataKey="pending" name="Pending" stackId="a" fill="var(--chart-1)" maxBarSize={40} />
        <Bar
          dataKey="denied"
          name="Denied"
          stackId="a"
          fill="var(--chart-5)"
          radius={[8, 8, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** A/R balance with days-in-A/R overlay. */
export function ArTrendChart({ data }: { data: ArTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis
          yAxisId="balance"
          {...axisProps}
          tickFormatter={(v: number) => formatCurrency(v, true)}
          width={64}
        />
        <YAxis
          yAxisId="days"
          orientation="right"
          {...axisProps}
          tickFormatter={(v: number) => `${v}d`}
          width={44}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [
            name === "Days in A/R" ? `${value.toFixed(1)} days` : formatCurrency(value),
            name,
          ]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Line
          yAxisId="balance"
          type="monotone"
          dataKey="arBalance"
          name="A/R balance"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          yAxisId="days"
          type="monotone"
          dataKey="daysInAr"
          name="Days in A/R"
          stroke="var(--chart-4)"
          strokeWidth={2.5}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export { formatPercent };
