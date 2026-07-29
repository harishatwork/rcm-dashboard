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
import { formatCurrency, formatNumber } from "@/lib/format";
import type {
  CashFlowForecastPoint,
  CollectionsByDimension,
  CollectionsTrendPoint,
  DailyCollectionsPoint,
  MonthlyComparisonPoint,
  PaymentMethodSlice,
} from "@/lib/api/collections-dashboard";

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

/** 1 — Collection trend over 12 months versus target. */
export function CollectionTrendChart({
  data,
  onSelect,
}: {
  data: CollectionsTrendPoint[];
  onSelect?: (point: CollectionsTrendPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex ?? -1)];
          if (point && onSelect) onSelect(point);
        }}
      >
        <defs>
          <linearGradient id="collectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Area
          type="monotone"
          dataKey="collections"
          name="Collections"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#collectionsFill)"
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="var(--chart-4)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** 2 — Insurance versus patient collections (stacked columns). */
export function InsuranceVsPatientChart({
  data,
  onSelect,
}: {
  data: CollectionsTrendPoint[];
  onSelect?: (point: CollectionsTrendPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatCurrency(v)}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          dataKey="insurance"
          name="Insurance"
          stackId="mix"
          fill="var(--chart-1)"
          maxBarSize={28}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
        <Bar
          dataKey="patient"
          name="Patient"
          stackId="mix"
          fill="var(--chart-3)"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 3 — Collections by dimension (horizontal bar) for provider / payer / CPT. */
export function CollectionsByDimensionChart({
  data,
  colorIndex = 0,
  height = 320,
  onSelect,
}: {
  data: CollectionsByDimension[];
  colorIndex?: number;
  height?: number;
  onSelect?: (row: CollectionsByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={money} />
        <YAxis type="category" dataKey="name" {...axisProps} width={140} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => [formatCurrency(v), "Collections"]}
        />
        <Bar
          dataKey="collections"
          radius={[4, 8, 8, 4]}
          maxBarSize={22}
          fill={PALETTE[colorIndex % PALETTE.length]}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 4 — Collections by facility (columns). */
export function CollectionsColumnChart({
  data,
  colorIndex = 2,
  onSelect,
}: {
  data: CollectionsByDimension[];
  colorIndex?: number;
  onSelect?: (row: CollectionsByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="name" {...axisProps} interval={0} tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 13)}…` : v)} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => [formatCurrency(v), "Collections"]}
        />
        <Bar
          dataKey="collections"
          radius={[8, 8, 4, 4]}
          maxBarSize={48}
          fill={PALETTE[colorIndex % PALETTE.length]}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Payment method distribution (donut). */
export function PaymentMethodChart({
  data,
  onSelect,
}: {
  data: PaymentMethodSlice[];
  onSelect?: (slice: PaymentMethodSlice) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number, _n, item) => [
            `${formatCurrency(v)} · ${formatNumber((item?.payload as PaymentMethodSlice)?.transactions ?? 0)} transactions`,
            (item?.payload as PaymentMethodSlice)?.method ?? "",
          ]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={data}
          dataKey="amount"
          nameKey="method"
          innerRadius={64}
          outerRadius={104}
          paddingAngle={2}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        >
          {data.map((slice, index) => (
            <Cell key={slice.id} fill={PALETTE[index % PALETTE.length]} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** 6 — Cash flow forecast with an 80% confidence band. */
export function CashFlowForecastChart({ data }: { data: CashFlowForecastPoint[] }) {
  const banded = data.map((point) => ({ ...point, band: point.high - point.low }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={banded} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number, name) =>
            name === "Confidence band" ? [formatCurrency(v), name] : [formatCurrency(v), name]
          }
        />
        <Legend wrapperStyle={legendStyle} />
        <Area dataKey="low" stackId="band" stroke="none" fill="transparent" name="Lower bound" />
        <Area
          dataKey="band"
          stackId="band"
          stroke="none"
          fill="var(--chart-2)"
          fillOpacity={0.16}
          name="Confidence band"
        />
        <Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="5 4" dot={false} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** 7 — Monthly collections comparison, current versus prior year. */
export function MonthlyComparisonChart({
  data,
  onSelect,
}: {
  data: MonthlyComparisonPoint[];
  onSelect?: (point: MonthlyComparisonPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatCurrency(v)}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          dataKey="currentYear"
          name="2026"
          fill="var(--chart-1)"
          radius={[6, 6, 0, 0]}
          maxBarSize={26}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
        <Bar dataKey="priorYear" name="2025" fill="var(--chart-4)" radius={[6, 6, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 8 — Daily collections trend with a rolling average. */
export function DailyCollectionsChart({
  data,
  onSelect,
}: {
  data: DailyCollectionsPoint[];
  onSelect?: (point: DailyCollectionsPoint) => void;
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
        <XAxis dataKey="label" {...axisProps} minTickGap={16} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Line type="monotone" dataKey="collections" name="Daily cash" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="rollingAvg" name="5-day average" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
