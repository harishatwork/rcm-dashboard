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
import { formatCurrency, formatNumber } from "@/lib/format";
import type {
  ClaimRiskDistributionPoint,
  CollectionForecastVsActualPoint,
  HighRiskPayorPoint,
  PredictedArTrendPoint,
  RevenueForecastPoint,
} from "@/lib/api/predictive-analytics";

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

/** 1 — Revenue Forecast (Line Chart with Upper/Lower Confidence Bands) */
export function RevenueForecastChart({ data }: { data: RevenueForecastPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="upperConfidence"
          name="Upper Bound (95% CI)"
          stroke="none"
          fill="url(#confidenceGrad)"
        />
        <Area
          type="monotone"
          dataKey="lowerConfidence"
          name="Lower Bound (95% CI)"
          stroke="none"
          fill="var(--card)"
        />
        <Line
          type="monotone"
          dataKey="projected"
          name="Projected Revenue (ML Forecast)"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Historical Actual Revenue"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          strokeDasharray="4 4"
          dot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 2 — Collection Forecast vs Actual (Area Chart) */
export function CollectionForecastVsActualChart({ data }: { data: CollectionForecastVsActualPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="actualCollectionsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="actual"
          name="Actual Collections"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#actualCollectionsGrad)"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecasted Target Baseline"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 3 — Predicted AR Trend (Line Chart) */
export function PredictedArTrendChart({ data }: { data: PredictedArTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="period" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="projectedAr"
          name="Projected A/R Exposure"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          dot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="actualAr"
          name="Current A/R Baseline"
          stroke="var(--chart-5)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** 4 — High-Risk Payors (Horizontal Bar Chart) */
export function HighRiskPayorsChart({
  data,
  onSelectPayor,
}: {
  data: HighRiskPayorPoint[];
  onSelectPayor?: (row: HighRiskPayorPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={moneyFormatter} />
        <YAxis type="category" dataKey="payorName" width={160} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Bar
          dataKey="atRiskAmount"
          name="At-Risk Revenue ($)"
          radius={[0, 6, 6, 0]}
          maxBarSize={28}
          onClick={(entry: any, idx: number) => onSelectPayor?.(data[idx])}
          className={onSelectPayor ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Claim Risk Distribution (Donut Chart) */
export function ClaimRiskDistributionChart({ data }: { data: ClaimRiskDistributionPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} claims (${item.payload.percentage}%)`,
            item.payload.riskLevel,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          formatter={(val: string, entry: any) => entry.payload.riskLevel}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="riskLevel"
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
