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
import { formatNumber, formatPercent } from "@/lib/format";
import type {
  AppointmentStatusDistributionPoint,
  DailyAppointmentTrendPoint,
  PatientFlowTimelinePoint,
  ProviderUtilizationPoint,
  WaitTimeByLocationPoint,
} from "@/lib/api/operational-dashboard";

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

/** 1 — Daily Appointment Trend (Line Chart) */
export function DailyAppointmentTrendChart({ data }: { data: DailyAppointmentTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="date" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} visits`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="scheduled"
          name="Scheduled Appointments"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed Check-ins"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** 2 — Appointment Status Distribution (Donut Chart) */
export function AppointmentStatusDistributionChart({ data }: { data: AppointmentStatusDistributionPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} appointments (${item.payload.percentage}%)`,
            item.payload.status,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          formatter={(val: string, entry: any) => entry.payload.status}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
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

/** 3 — Provider Utilization (Horizontal Bar Chart) */
export function ProviderUtilizationChart({
  data,
  onSelectProvider,
}: {
  data: ProviderUtilizationPoint[];
  onSelectProvider?: (row: ProviderUtilizationPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" domain={[0, 100]} {...axisProps} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="providerName" width={140} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${value}% utilization`, name]}
        />
        <Bar
          dataKey="utilizationPct"
          name="Schedule Capacity Utilized"
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

/** 4 — Average Wait Time by Location (Column Chart) */
export function AverageWaitTimeLocationChart({
  data,
  onSelectLocation,
}: {
  data: WaitTimeByLocationPoint[];
  onSelectLocation?: (row: WaitTimeByLocationPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="location" {...axisProps} interval={0} tick={{ fontSize: 10 }} />
        <YAxis {...axisProps} tickFormatter={(v) => `${v} min`} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${value} minutes`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar
          dataKey="avgWaitMinutes"
          name="Average Wait Time (Min)"
          fill="var(--chart-3)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
          onClick={(entry: any, idx: number) => onSelectLocation?.(data[idx])}
          className={onSelectLocation ? "cursor-pointer" : undefined}
        >
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.avgWaitMinutes > entry.targetWaitMinutes ? "var(--destructive)" : "var(--chart-3)"}
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="targetWaitMinutes"
          name="Target Threshold (15 min)"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Patient Flow Timeline (Area Chart) */
export function PatientFlowTimelineChart({ data }: { data: PatientFlowTimelinePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="checkInGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="examGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="hour" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} patients`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="checkIns"
          name="Patient Arrival Check-ins"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#checkInGrad)"
        />
        <Area
          type="monotone"
          dataKey="examInRoom"
          name="In Exam Room Throughput"
          stroke="var(--chart-4)"
          strokeWidth={2.5}
          fill="url(#examGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
