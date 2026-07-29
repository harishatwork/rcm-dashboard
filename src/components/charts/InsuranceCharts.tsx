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
  ClaimStatusDistributionPoint,
  InsurancePaymentsTrendPoint,
  MonthlyClaimsVolumePoint,
  PayorPaymentsPoint,
  TopPayorRevenuePoint,
} from "@/lib/api/insurance-dashboard";

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

/** 1 — Insurance Payments Trend (Line Chart) */
export function InsurancePaymentsTrendChart({
  data,
  onSelectMonth,
}: {
  data: InsurancePaymentsTrendPoint[];
  onSelectMonth?: (point: InsurancePaymentsTrendPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="paymentsGrad" x1="0" y1="0" x2="0" y2="1">
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
          dataKey="totalPayments"
          name="Total Insurance Payments"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#paymentsGrad)"
          onClick={(state: any) => {
            if (state?.activePayload?.[0]?.payload) {
              onSelectMonth?.(state.activePayload[0].payload);
            }
          }}
          className={onSelectMonth ? "cursor-pointer" : undefined}
        />
        <Line
          type="monotone"
          dataKey="insuranceAr"
          name="Insurance A/R Balance"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** 2 — Payments by Insurance Company (Horizontal Bar Chart) */
export function PaymentsByInsuranceChart({
  data,
  onSelectPayor,
}: {
  data: PayorPaymentsPoint[];
  onSelectPayor?: (payor: PayorPaymentsPoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis type="number" {...axisProps} tickFormatter={moneyFormatter} />
        <YAxis type="category" dataKey="payor" width={140} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
        />
        <Bar
          dataKey="totalPayments"
          name="Total Payments"
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

/** 3 — Claims Status Distribution (Donut Chart) */
export function ClaimsStatusDistributionChart({ data }: { data: ClaimStatusDistributionPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${formatNumber(value)} claims (${item.payload.percentage}%)`,
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

/** 4 — Monthly Submitted vs Paid Claims (Stacked Column Chart) */
export function MonthlySubmittedVsPaidChart({ data }: { data: MonthlyClaimsVolumePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} width={54} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${formatNumber(value)} claims`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="paid" name="Paid Claims" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} maxBarSize={48} />
        <Bar dataKey="denied" name="Denied Claims" stackId="a" fill="var(--chart-5)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 5 — Top Insurance Companies by Revenue (Bar Chart) */
export function TopInsuranceCompaniesRevenueChart({
  data,
  onSelectCompany,
}: {
  data: TopPayorRevenuePoint[];
  onSelectCompany?: (payor: TopPayorRevenuePoint) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="payor" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
        <YAxis {...axisProps} tickFormatter={moneyFormatter} width={64} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string, item: any) => {
            if (name === "Net Revenue") return [formatCurrency(value), name];
            return [value, name];
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar
          dataKey="revenue"
          name="Net Revenue"
          fill="var(--chart-1)"
          radius={[6, 6, 0, 0]}
          maxBarSize={52}
          onClick={(entry: any, idx: number) => onSelectCompany?.(data[idx])}
          className={onSelectCompany ? "cursor-pointer" : undefined}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
