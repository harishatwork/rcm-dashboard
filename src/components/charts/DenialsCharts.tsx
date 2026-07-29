import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type {
  DenialCategoryPoint,
  DenialFinancialImpactPoint,
  DenialPayorPoint,
  DenialTrendPoint,
} from "@/lib/api/denials-dashboard";

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

const moneyFormatter = (v: number) => formatCurrency(v, true);

/** 1 — Denial Trend Chart (Line Chart of Denied Charges & Claim Volume) */
export function DenialTrendChart({ data }: { data: DenialTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="deniedChargesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="initialRateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis yAxisId="left" {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <YAxis yAxisId="right" orientation="right" {...axisProps} tickFormatter={(v) => `${v}%`} width={48} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => {
            if (name === "Denied Charges") return [formatCurrency(value), name];
            if (name === "Initial Denial Rate") return [`${value}%`, name];
            return [formatNumber(value), name];
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="deniedCharges"
          name="Denied Charges"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#deniedChargesGrad)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="initialDenialRate"
          name="Initial Denial Rate"
          stroke="var(--chart-5)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "var(--chart-5)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 2 — Denials by Payor (Horizontal Bar Chart) */
export function DenialsByPayorChart({ data }: { data: DenialPayorPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={moneyFormatter} />
        <YAxis type="category" dataKey="payor" width={140} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => {
            if (name === "Denied Charges") return [formatCurrency(value), name];
            return [formatNumber(value), name];
          }}
        />
        <Bar dataKey="deniedCharges" name="Denied Charges" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 3 — Denial Categories Distribution (Donut Chart) */
export function DenialCategoriesChart({ data }: { data: DenialCategoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatCurrency(value)} (${item.payload.percentage}%)`,
            item.payload.label,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          formatter={(val: string, entry: any) => entry.payload.label}
        />
        <Pie
          data={data}
          dataKey="deniedCharges"
          nameKey="label"
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** 4 — Financial Impact (Stacked Column Chart) */
export function DenialFinancialImpactChart({ data }: { data: DenialFinancialImpactPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="recoveredRevenue" name="Recovered Revenue" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} maxBarSize={48} />
        <Bar dataKey="deniedCharges" name="Uncollected Denied" stackId="a" fill="var(--chart-5)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
