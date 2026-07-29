import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
import { formatCurrency } from "@/lib/format";
import type {
  ForecastPointExtended,
  InsuranceRevenueStack,
  RevenueByDimension,
  RevenueTrendPoint,
  WaterfallStep,
} from "@/lib/api/revenue-dashboard";

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

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const money = (v: number) => formatCurrency(v, true);
const legendStyle = { fontSize: 12, paddingTop: 8 };

/** 1 — Monthly revenue trend (line). */
export function MonthlyRevenueTrendChart({
  data,
  onSelect,
}: {
  data: RevenueTrendPoint[];
  onSelect?: (point: RevenueTrendPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex ?? -1)];
          if (point && onSelect) onSelect(point);
        }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Line type="monotone" dataKey="grossRevenue" name="Gross revenue" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="netRevenue" name="Net revenue" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="collections" name="Collections" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="5 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** 2 — Revenue by provider (horizontal bar). */
export function RevenueByProviderChart({
  data,
  onSelect,
}: {
  data: RevenueByDimension[];
  onSelect?: (row: RevenueByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={money} />
        <YAxis type="category" dataKey="name" {...axisProps} width={132} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => [formatCurrency(v), "Net revenue"]}
        />
        <Bar
          dataKey="revenue"
          radius={[4, 8, 8, 4]}
          maxBarSize={22}
          fill="var(--chart-1)"
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 3 & 4 — Revenue by facility / location (column). */
export function RevenueColumnChart({
  data,
  colorIndex = 2,
  onSelect,
}: {
  data: RevenueByDimension[];
  colorIndex?: number;
  onSelect?: (row: RevenueByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="name" {...axisProps} interval={0} height={48} tickMargin={8} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => [formatCurrency(v), "Net revenue"]}
        />
        <Bar
          dataKey="revenue"
          radius={[10, 10, 4, 4]}
          maxBarSize={54}
          fill={PALETTE[colorIndex % PALETTE.length]}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Revenue by specialty (donut). */
export function RevenueBySpecialtyChart({
  data,
  onSelect,
}: {
  data: RevenueByDimension[];
  onSelect?: (row: RevenueByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="name"
          innerRadius="55%"
          outerRadius="82%"
          paddingAngle={2}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        >
          {data.map((entry, index) => (
            <Cell key={entry.id} fill={PALETTE[index % PALETTE.length]} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** 6 — Revenue by insurance (stacked bar). */
export function RevenueByInsuranceChart({
  data,
  onSelect,
}: {
  data: InsuranceRevenueStack[];
  onSelect?: (row: InsuranceRevenueStack) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="name" {...axisProps} interval={0} height={44} tickMargin={8} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatCurrency(v)}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          dataKey="primary"
          name="Primary payment"
          stackId="ins"
          fill="var(--chart-1)"
          maxBarSize={54}
          onClick={(_, index) => onSelect?.(data[index])}
        />
        <Bar dataKey="secondary" name="Secondary payment" stackId="ins" fill="var(--chart-3)" maxBarSize={54} />
        <Bar dataKey="patient" name="Patient responsibility" stackId="ins" fill="var(--chart-4)" radius={[10, 10, 0, 0]} maxBarSize={54} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface WaterfallDatum extends WaterfallStep {
  base: number;
  span: number;
}

function toWaterfall(steps: WaterfallStep[]): WaterfallDatum[] {
  let running = 0;
  return steps.map((step) => {
    if (step.kind === "start" || step.kind === "total") {
      const datum = { ...step, base: 0, span: Math.abs(step.value) };
      if (step.kind === "start") running = step.value;
      return datum;
    }
    const start = running;
    running += step.value;
    return { ...step, base: Math.min(start, running), span: Math.abs(step.value) };
  });
}

/** 7 — Revenue waterfall. */
export function RevenueWaterfallChart({
  steps,
  onSelect,
}: {
  steps: WaterfallStep[];
  onSelect?: (step: WaterfallStep) => void;
}) {
  const data = toWaterfall(steps);
  const color = (kind: WaterfallStep["kind"]) =>
    kind === "increase"
      ? "var(--chart-3)"
      : kind === "decrease"
        ? "var(--chart-5)"
        : "var(--chart-1)";

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} interval={0} height={48} tickMargin={8} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(_v: number, _n, item) =>
            [formatCurrency((item?.payload as WaterfallDatum).value), "Impact"] as [string, string]
          }
        />
        <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
        <Bar
          dataKey="span"
          stackId="wf"
          radius={[8, 8, 8, 8]}
          maxBarSize={48}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={color(entry.kind)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 8 — Revenue forecast with confidence band. */
export function RevenueForecastChart({ data }: { data: ForecastPointExtended[] }) {
  const banded = data.map((p) => ({ ...p, band: [p.low, p.high] as [number, number] }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={banded} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number | number[], name) =>
            Array.isArray(value)
              ? [`${formatCurrency(value[0])} – ${formatCurrency(value[1])}`, "Confidence band"]
              : [formatCurrency(value), String(name)]
          }
        />
        <Legend wrapperStyle={legendStyle} />
        <Area
          dataKey="band"
          name="80% confidence"
          stroke="none"
          fill="var(--chart-1)"
          fillOpacity={0.14}
          isAnimationActive={false}
        />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} connectNulls={false} />
        <Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** Compact sparkline used inside KPI cards. */
export function KpiSparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const data = points.map((value, index) => ({ index, value }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={positive ? "var(--chart-3)" : "var(--chart-5)"}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
