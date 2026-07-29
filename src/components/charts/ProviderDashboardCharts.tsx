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
  MonthlyProviderCollectionsPoint,
  ProductivityTrendPoint,
  ProviderRevenuePoint,
  SpecialtyEncountersPoint,
  TopPerformingProviderPoint,
} from "@/lib/api/provider-performance-dashboard";

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

/** 1 — Revenue by Provider (Horizontal Bar Chart) */
export function RevenueByProviderChart({
  data,
  onSelectProvider,
}: {
  data: ProviderRevenuePoint[];
  onSelectProvider?: (provider: ProviderRevenuePoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={moneyFormatter} />
        <YAxis type="category" dataKey="providerName" width={140} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Bar
          dataKey="revenue"
          name="Total Net Revenue"
          radius={[0, 6, 6, 0]}
          maxBarSize={28}
          onClick={(entry: any, idx: number) => onSelectProvider?.(data[idx])}
          className={onSelectProvider ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 2 — Monthly Provider Collections (Line Chart) */
export function MonthlyProviderCollectionsChart({ data }: { data: MonthlyProviderCollectionsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="collectionsGrad" x1="0" y1="0" x2="0" y2="1">
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
          dataKey="collections"
          name="Monthly Net Collections"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#collectionsGrad)"
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Monthly Target"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 3 — Encounters by Specialty (Donut Chart) */
export function EncountersBySpecialtyChart({ data }: { data: SpecialtyEncountersPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} encounters (${item.payload.percentage}%)`,
            item.payload.specialty,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          formatter={(val: string, entry: any) => entry.payload.specialty}
        />
        <Pie
          data={data}
          dataKey="encounters"
          nameKey="specialty"
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

/** 4 — Top Performing Providers (Bar Chart) */
export function TopPerformingProvidersChart({
  data,
  onSelectProvider,
}: {
  data: TopPerformingProviderPoint[];
  onSelectProvider?: (row: TopPerformingProviderPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="providerName" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar
          dataKey="charges"
          name="Gross Charges"
          fill="var(--chart-1)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
          onClick={(entry: any, idx: number) => onSelectProvider?.(data[idx])}
          className={onSelectProvider ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Provider Productivity Trend (Area Chart) */
export function ProviderProductivityTrendChart({ data }: { data: ProductivityTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="wrvuGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} wRVU`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="wrvu"
          name="Actual wRVU Units"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#wrvuGrad)"
        />
        <Line
          type="monotone"
          dataKey="targetWrvu"
          name="Target wRVU Baseline"
          stroke="var(--chart-5)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
