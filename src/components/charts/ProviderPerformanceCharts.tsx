import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

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

export interface ProviderChartPoint {
  id: string;
  name: string;
  shortName: string;
  wrvu: number;
  target: number;
  encounters: number;
  charges: number;
  denialRate: number;
}

/** wRVU productivity per provider benchmarked against target. */
export function ProviderProductivityChart({ data }: { data: ProviderChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="shortName" {...axisProps} interval={0} height={40} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatNumber(v)} width={52} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatNumber(value), name]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="wrvu" name="wRVU" radius={[6, 6, 0, 0]} maxBarSize={34}>
          {data.map((point) => (
            <Cell
              key={point.id}
              fill={point.wrvu >= point.target ? "var(--chart-3)" : "var(--chart-4)"}
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="target"
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

/** Charge capture per provider, sorted by contribution. */
export function ProviderChargesChart({ data }: { data: ProviderChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
      <BarChart
        data={[...data].sort((a, b) => b.charges - a.charges)}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis
          type="number"
          {...axisProps}
          tickFormatter={(v: number) => formatCurrency(v, true)}
        />
        <YAxis type="category" dataKey="shortName" {...axisProps} width={92} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [formatCurrency(value), "Charges"]}
        />
        <Bar dataKey="charges" fill="var(--chart-1)" radius={[0, 6, 6, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Denial exposure plotted against productivity to surface outliers. */
export function ProviderDenialScatterChart({ data }: { data: ProviderChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis
          type="number"
          dataKey="wrvu"
          name="wRVU"
          {...axisProps}
          tickFormatter={(v: number) => formatNumber(v)}
        />
        <YAxis
          type="number"
          dataKey="denialRate"
          name="Denial rate"
          {...axisProps}
          width={52}
          tickFormatter={(v: number) => formatPercent(v, 0)}
        />
        <ZAxis type="number" dataKey="encounters" range={[80, 320]} name="Encounters" />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ strokeDasharray: "4 4" }}
          formatter={(value: number, name: string) =>
            name === "Denial rate" ? [formatPercent(value), name] : [formatNumber(value), name]
          }
        />
        <Scatter data={data} fill="var(--chart-2)" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
