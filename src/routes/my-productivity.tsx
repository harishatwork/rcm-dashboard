import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { ChartCard, DataGrid, ProgressIndicator, type DataGridColumn } from "@/components/common";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rcmQueries } from "@/lib/api/queries";
import { formatNumber } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { ProductivityMetric } from "@/lib/api/types";

export const Route = createFileRoute("/my-productivity")({
  head: () =>
    pageMeta(
      "My Productivity",
      "Track your wRVU attainment, encounter volume and documentation turnaround month over month.",
    ),
  component: MyProductivityPage,
});

function MyProductivityPage() {
  const productivity = useQuery(rcmQueries.productivity());
  const rows = productivity.data ?? [];

  const latest = rows.at(-1);
  const attainment = latest && latest.targetWrvu ? Math.round((latest.wrvu / latest.targetWrvu) * 100) : 0;

  const columns: DataGridColumn<ProductivityMetric>[] = [
    { key: "month", header: "Month", sortValue: (r) => r.month, render: (r) => r.month },
    {
      key: "encounters",
      header: "Encounters",
      align: "right",
      sortValue: (r) => r.encounters,
      render: (r) => formatNumber(r.encounters),
    },
    {
      key: "wrvu",
      header: "wRVU",
      align: "right",
      sortValue: (r) => r.wrvu,
      render: (r) => formatNumber(r.wrvu),
    },
    {
      key: "target",
      header: "Target",
      align: "right",
      sortValue: (r) => r.targetWrvu,
      render: (r) => formatNumber(r.targetWrvu),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="My productivity"
        description="wRVU attainment and encounter volume compared with your monthly target."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ChartCard
          title="wRVU vs. target"
          isLoading={productivity.isLoading}
          error={productivity.error}
          onRetry={() => productivity.refetch()}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} width={48} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="wrvu" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="targetWrvu" fill="var(--muted)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Current attainment" subtitle={latest ? latest.month : undefined}>
          <ProgressIndicator
            label="wRVU attainment"
            value={attainment}
            tone={attainment >= 100 ? "success" : attainment >= 85 ? "primary" : "warning"}
          />
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Encounters</dt>
              <dd className="font-medium">{latest ? formatNumber(latest.encounters) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">wRVU</dt>
              <dd className="font-medium">{latest ? formatNumber(latest.wrvu) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Target</dt>
              <dd className="font-medium">{latest ? formatNumber(latest.targetWrvu) : "—"}</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Monthly history" subtitle="Rolling productivity record.">
          <DataGrid
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.month}
            isLoading={productivity.isLoading}
            error={productivity.error}
            onRetry={() => productivity.refetch()}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
