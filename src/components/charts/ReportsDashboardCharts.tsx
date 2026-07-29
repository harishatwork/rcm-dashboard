import {
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
import { formatNumber } from "@/lib/format";
import type {
  MostViewedReportPoint,
  ReportGenerationTrendPoint,
  ReportsByCategoryPoint,
  ReportUsageTrendPoint,
  UserRoleActivityPoint,
} from "@/lib/api/reports-analytics-dashboard";

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

/** 1 — Report Usage Trend (Line Chart) */
export function ReportUsageTrendChart({ data }: { data: ReportUsageTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="date" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} runs`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="executions"
          name="Report Executions"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="exports"
          name="Downloads & Exports"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** 2 — Reports by Category (Donut Chart) */
export function ReportsByCategoryChart({ data }: { data: ReportsByCategoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} runs (${item.payload.percentage}%)`,
            item.payload.category,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          formatter={(val: string, entry: any) => entry.payload.category}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
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

/** 3 — Most Viewed Reports (Horizontal Bar Chart) */
export function MostViewedReportsChart({
  data,
  onSelectReport,
}: {
  data: MostViewedReportPoint[];
  onSelectReport?: (row: MostViewedReportPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => formatNumber(v)} />
        <YAxis type="category" dataKey="reportName" width={160} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} accesses`, name]}
        />
        <Bar
          dataKey="views"
          name="Report Accesses"
          radius={[0, 6, 6, 0]}
          maxBarSize={28}
          onClick={(entry: any, idx: number) => onSelectReport?.(data[idx])}
          className={onSelectReport ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 4 — Report Generation Trend (Column Chart) */
export function ReportGenerationTrendChart({ data }: { data: ReportGenerationTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} runs`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="manualRuns" name="Manual Ad-hoc Runs" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={36} />
        <Bar dataKey="scheduledRuns" name="Automated Scheduled Runs" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Dashboard Activity by User Role (Stacked Bar Chart) */
export function DashboardActivityRoleChart({ data }: { data: UserRoleActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="role" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} actions`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="views" name="Page Views" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} maxBarSize={48} />
        <Bar dataKey="exports" name="Report Exports" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} maxBarSize={48} />
        <Bar dataKey="schedules" name="Schedules Configured" stackId="a" fill="var(--chart-4)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
