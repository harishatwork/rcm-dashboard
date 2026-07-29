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
  MonthlyPatientGrowthPoint,
  NewVsReturningPoint,
  PatientVisitsTrendPoint,
  RevenueByPatientTypePoint,
  TopSpecialtyVolumePoint,
} from "@/lib/api/patient-analytics";

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

/** 1 — Patient Visits Trend (Line Chart) */
export function PatientVisitsTrendChart({
  data,
  onSelectPoint,
}: {
  data: PatientVisitsTrendPoint[];
  onSelectPoint?: (point: PatientVisitsTrendPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="returningGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} visits`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="returningPatients"
          name="Returning Patient Visits"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#returningGrad)"
        />
        <Area
          type="monotone"
          dataKey="newPatients"
          name="New Patient Visits"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#newGrad)"
          onClick={(state: any) => {
            if (state?.activePayload?.[0]?.payload) {
              onSelectPoint?.(state.activePayload[0].payload);
            }
          }}
          className={onSelectPoint ? "cursor-pointer" : undefined}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 2 — New vs Returning Patients (Donut Chart) */
export function NewVsReturningChart({ data }: { data: NewVsReturningPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} patients (${item.payload.percentage}%)`,
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
          dataKey="count"
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

/** 3 — Revenue by Patient Type (Bar Chart) */
export function RevenueByPatientTypeChart({
  data,
  onSelectType,
}: {
  data: RevenueByPatientTypePoint[];
  onSelectType?: (row: RevenueByPatientTypePoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="patientType" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar
          dataKey="revenue"
          name="Patient Revenue"
          fill="var(--chart-3)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
          onClick={(entry: any, idx: number) => onSelectType?.(data[idx])}
          className={onSelectType ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 4 — Top Specialties by Patient Volume (Horizontal Bar Chart) */
export function TopSpecialtiesVolumeChart({ data }: { data: TopSpecialtyVolumePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => formatNumber(v)} />
        <YAxis type="category" dataKey="specialty" width={140} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} patients`, name]}
        />
        <Bar dataKey="patientVolume" name="Patient Volume" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Monthly Patient Growth (Column Chart) */
export function MonthlyPatientGrowthChart({ data }: { data: MonthlyPatientGrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`+${formatNumber(value)} net patients`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="netGrowth" name="Net Patient Growth" fill="var(--chart-4)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
