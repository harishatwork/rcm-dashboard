import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { AgingBucket, RevenuePoint } from "@/lib/api/types";

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

export function RevenueTrendChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="billedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="collectedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
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
        <Area
          type="monotone"
          dataKey="billed"
          name="Billed"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#billedFill)"
        />
        <Area
          type="monotone"
          dataKey="collected"
          name="Collected"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#collectedFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AgingChart({ data }: { data: AgingBucket[] }) {
  const palette = ["var(--chart-3)", "var(--chart-2)", "var(--chart-1)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="bucket" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatCurrency(v, true)} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(value: number) => [formatCurrency(value), "Outstanding"]}
        />
        <Bar dataKey="amount" radius={[10, 10, 4, 4]} maxBarSize={54}>
          {data.map((entry, index) => (
            <Cell key={entry.bucket} fill={palette[index % palette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
