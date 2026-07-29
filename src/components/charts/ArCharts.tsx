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
import type {
  ArAgingCard,
  ArByDimension,
  ArTrendPointExtended,
  DenialByDimension,
  DenialReasonRow,
  DenialTrendPoint,
} from "@/lib/api/ar-dashboard";

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

/** 1 — AR aging distribution across the seven buckets. */
export function ArAgingDistributionChart({
  data,
  onSelect,
}: {
  data: ArAgingCard[];
  onSelect?: (row: ArAgingCard) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="bucket" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatCurrency(v)}
        />
        <Bar
          dataKey="amount"
          name="AR balance"
          radius={[6, 6, 0, 0]}
          maxBarSize={54}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        >
          {data.map((row) => (
            <Cell
              key={row.id}
              fill={
                row.tone === "risk"
                  ? "var(--chart-5)"
                  : row.tone === "watch"
                    ? "var(--chart-4)"
                    : "var(--chart-1)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 2 — AR trend split between insurance and patient responsibility. */
export function ArTrendChart({
  data,
  onSelect,
}: {
  data: ArTrendPointExtended[];
  onSelect?: (point: ArTrendPointExtended) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex ?? -1)];
          if (point && onSelect) onSelect(point);
        }}
      >
        <defs>
          <linearGradient id="arInsuranceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="arPatientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={money} width={64} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Area
          type="monotone"
          dataKey="insuranceAr"
          name="Insurance AR"
          stackId="ar"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#arInsuranceFill)"
        />
        <Area
          type="monotone"
          dataKey="patientAr"
          name="Patient AR"
          stackId="ar"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#arPatientFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 3 — Horizontal AR ranking for any dimension (insurance, provider, facility, CPT). */
export function ArByDimensionChart({
  data,
  colorIndex = 0,
  height = 340,
  onSelect,
}: {
  data: ArByDimension[];
  colorIndex?: number;
  height?: number;
  onSelect?: (row: ArByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={money} />
        <YAxis type="category" dataKey="name" {...axisProps} width={150} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatCurrency(v)}
        />
        <Bar
          dataKey="ar"
          name="AR balance"
          radius={[0, 6, 6, 0]}
          maxBarSize={22}
          fill={PALETTE[colorIndex % PALETTE.length]}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 4 — Outstanding claim count trend. */
export function OutstandingClaimsTrendChart({
  data,
  onSelect,
}: {
  data: ArTrendPointExtended[];
  onSelect?: (point: ArTrendPointExtended) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex ?? -1)];
          if (point && onSelect) onSelect(point);
        }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => formatNumber(v)} width={64} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number) => formatNumber(v)}
        />
        <Bar
          dataKey="outstandingClaims"
          name="Outstanding claims"
          fill="var(--chart-2)"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Days in AR trend against the 35-day enterprise goal. */
export function DaysInArTrendChart({
  data,
  goal = 35,
  onSelect,
}: {
  data: ArTrendPointExtended[];
  goal?: number;
  onSelect?: (point: ArTrendPointExtended) => void;
}) {
  const withGoal = data.map((point) => ({ ...point, goal }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={withGoal}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex ?? -1)];
          if (point && onSelect) onSelect(point);
        }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} width={48} domain={[30, "auto"]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} days`} />
        <Legend wrapperStyle={legendStyle} />
        <Line
          type="monotone"
          dataKey="daysInAr"
          name="Days in AR"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
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
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** 6 — Top 10 denial reasons by denied dollars. */
export function TopDenialReasonsChart({
  data,
  onSelect,
}: {
  data: DenialReasonRow[];
  onSelect?: (row: DenialReasonRow) => void;
}) {
  const rows = data.map((row) => ({ ...row, label: `${row.code}` }));
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={money} />
        <YAxis type="category" dataKey="label" {...axisProps} width={72} />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number, _name, item) => [
            formatCurrency(v),
            (item?.payload as DenialReasonRow)?.reason ?? "Denied amount",
          ]}
        />
        <Bar
          dataKey="amount"
          name="Denied amount"
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
          fill="var(--chart-5)"
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 7 — Denials by dimension (insurance / provider / CPT). */
export function DenialsByDimensionChart({
  data,
  colorIndex = 0,
  height = 300,
  onSelect,
}: {
  data: DenialByDimension[];
  colorIndex?: number;
  height?: number;
  onSelect?: (row: DenialByDimension) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="name" {...axisProps} interval={0} height={54} angle={-18} textAnchor="end" />
        <YAxis yAxisId="left" {...axisProps} tickFormatter={money} width={64} />
        <YAxis
          yAxisId="right"
          orientation="right"
          {...axisProps}
          width={44}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number, name) =>
            name === "Denial rate" ? formatPercent(v) : formatCurrency(v)
          }
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          yAxisId="left"
          dataKey="amount"
          name="Denied amount"
          radius={[6, 6, 0, 0]}
          maxBarSize={30}
          fill={PALETTE[colorIndex % PALETTE.length]}
          onClick={(_, index) => onSelect?.(data[index])}
          className={onSelect ? "cursor-pointer" : undefined}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="denialRate"
          name="Denial rate"
          stroke="var(--chart-4)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** 8 — Denial volume and rate over time. */
export function DenialTrendChart({
  data,
  onSelect,
}: {
  data: DenialTrendPoint[];
  onSelect?: (point: DenialTrendPoint) => void;
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
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis yAxisId="left" {...axisProps} tickFormatter={(v: number) => formatNumber(v)} width={56} />
        <YAxis
          yAxisId="right"
          orientation="right"
          {...axisProps}
          width={44}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={tooltipStyle}
          formatter={(v: number, name) =>
            name === "Denial rate" ? formatPercent(v) : formatNumber(v)
          }
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          yAxisId="left"
          dataKey="denials"
          name="Denials"
          fill="var(--chart-5)"
          radius={[6, 6, 0, 0]}
          maxBarSize={26}
        />
        <Bar
          yAxisId="left"
          dataKey="overturned"
          name="Overturned"
          fill="var(--chart-3)"
          radius={[6, 6, 0, 0]}
          maxBarSize={26}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="denialRate"
          name="Denial rate"
          stroke="var(--chart-4)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** 9 — Aging share donut used beside the distribution chart. */
export function ArAgingShareChart({ data }: { data: ArAgingCard[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={data}
          dataKey="amount"
          nameKey="bucket"
          innerRadius={64}
          outerRadius={104}
          paddingAngle={2}
        >
          {data.map((row, index) => (
            <Cell key={row.id} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
