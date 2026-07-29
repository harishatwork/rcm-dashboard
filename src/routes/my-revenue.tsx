import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { ChartCard, DataGrid, ExportButton, type DataGridColumn } from "@/components/common";
import { RevenueTrendChart } from "@/components/charts/RcmCharts";
import { StatusBadge } from "@/components/data/StatusBadge";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { Encounter } from "@/lib/api/types";

export const Route = createFileRoute("/my-revenue")({
  head: () =>
    pageMeta(
      "My Revenue",
      "Your personal collections, charge capture and payment trend as a rendering provider.",
    ),
  component: MyRevenuePage,
});

const columns: DataGridColumn<Encounter>[] = [
  {
    key: "date",
    header: "Date of service",
    sortValue: (r) => r.serviceDate,
    render: (r) => formatDate(r.serviceDate),
  },
  { key: "patient", header: "Patient", render: (r) => r.patient },
  { key: "cpt", header: "CPT", render: (r) => <span className="font-mono text-xs">{r.cptCode}</span> },
  {
    key: "charge",
    header: "Charge",
    align: "right",
    sortValue: (r) => r.charge,
    render: (r) => formatCurrency(r.charge),
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (r) => <StatusBadge status={r.status} />,
  },
];

function MyRevenuePage() {
  const trend = useQuery(rcmQueries.revenueTrend());
  const encounters = useQuery(rcmQueries.encounters());

  const rows = encounters.data ?? [];
  const charges = rows.reduce((sum, e) => sum + e.charge, 0);
  const collected = trend.data?.reduce((sum, p) => sum + p.collected, 0) ?? 0;

  const summary = [
    { label: "Charges captured", value: formatCurrency(charges) },
    { label: "Collected (panel share)", value: formatCurrency(Math.round(collected * 0.08)) },
    { label: "Encounters", value: rows.length },
    { label: "Avg charge", value: formatCurrency(rows.length ? Math.round(charges / rows.length) : 0) },
  ];

  return (
    <AppShell>
      <PageHeader
        title="My revenue"
        description="Charge capture and collections attributable to your rendered encounters."
        actions={<ExportButton rows={rows} fileName="my-revenue" />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="surface-card p-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6">
        <ChartCard
          title="Collections trend"
          isLoading={trend.isLoading}
          error={trend.error}
          onRetry={() => trend.refetch()}
        >
          <RevenueTrendChart data={trend.data ?? []} />
        </ChartCard>

        <SectionCard title="Recent charges" subtitle="Encounters contributing to your revenue.">
          <DataGrid
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            isLoading={encounters.isLoading}
            error={encounters.error}
            onRetry={() => encounters.refetch()}
            paginated
            initialPageSize={6}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
