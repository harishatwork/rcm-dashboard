import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { ChartCard, ProgressIndicator, DataGrid, type DataGridColumn } from "@/components/common";
import { AgingChart } from "@/components/charts/RcmCharts";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatPercent } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { PayerPerformance } from "@/lib/api/types";

export const Route = createFileRoute("/financial-analytics")({
  head: () =>
    pageMeta(
      "Financial Analytics",
      "Payer mix, contract yield and cash conversion analytics for enterprise financial planning.",
    ),
  component: FinancialAnalyticsPage,
});

const columns: DataGridColumn<PayerPerformance>[] = [
  { key: "name", header: "Payer", sortValue: (r) => r.name, render: (r) => r.name },
  {
    key: "collected",
    header: "Collected",
    align: "right",
    sortValue: (r) => r.collectedAmount,
    render: (r) => formatCurrency(r.collectedAmount),
  },
  {
    key: "clean",
    header: "Clean claim",
    align: "right",
    sortValue: (r) => r.cleanClaimRate,
    render: (r) => formatPercent(r.cleanClaimRate),
  },
  {
    key: "days",
    header: "Days to pay",
    align: "right",
    sortValue: (r) => r.avgDaysToPay,
    render: (r) => `${r.avgDaysToPay}d`,
  },
];

function FinancialAnalyticsPage() {
  const payers = useQuery(rcmQueries.payers());
  const aging = useQuery(rcmQueries.aging());

  const total = payers.data?.reduce((sum, p) => sum + p.collectedAmount, 0) ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="Financial analytics"
        description="Where collections come from, how fast they convert to cash and which contracts underperform."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Payer mix" subtitle={`${formatCurrency(total)} collected in period`}>
          <div className="space-y-5">
            {(payers.data ?? []).map((payer) => (
              <ProgressIndicator
                key={payer.id}
                label={payer.name}
                value={total ? Math.round((payer.collectedAmount / total) * 100) : 0}
                caption={formatCurrency(payer.collectedAmount)}
              />
            ))}
          </div>
        </SectionCard>

        <ChartCard
          title="Cash conversion by A/R bucket"
          isLoading={aging.isLoading}
          error={aging.error}
          onRetry={() => aging.refetch()}
        >
          <AgingChart data={aging.data ?? []} />
        </ChartCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Contract yield" subtitle="Sortable comparison across contracted payers.">
          <DataGrid
            columns={columns}
            rows={payers.data ?? []}
            getRowKey={(row) => row.id}
            isLoading={payers.isLoading}
            error={payers.error}
            onRetry={() => payers.refetch()}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
