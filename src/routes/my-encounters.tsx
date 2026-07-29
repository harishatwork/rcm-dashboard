import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { StatusBadge } from "@/components/data/StatusBadge";
import {
  DataGrid,
  ExportButton,
  ModalWindow,
  SearchControl,
  type DataGridColumn,
} from "@/components/common";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { Encounter } from "@/lib/api/types";

export const Route = createFileRoute("/my-encounters")({
  head: () =>
    pageMeta(
      "My Encounters",
      "Every encounter you rendered with documentation status, CPT coding and charge amount.",
    ),
  component: MyEncountersPage,
});

function MyEncountersPage() {
  const encounters = useQuery(rcmQueries.encounters());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Encounter | null>(null);

  const rows = (encounters.data ?? []).filter((row) =>
    `${row.patient} ${row.cptCode} ${row.id}`.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: DataGridColumn<Encounter>[] = [
    { key: "date", header: "Date", sortValue: (r) => r.serviceDate, render: (r) => formatDate(r.serviceDate) },
    {
      key: "patient",
      header: "Patient",
      sortValue: (r) => r.patient,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.patient}</p>
          <p className="truncate text-xs text-muted-foreground">{r.id}</p>
        </div>
      ),
    },
    { key: "cpt", header: "CPT", render: (r) => <span className="font-mono text-xs">{r.cptCode}</span> },
    { key: "visitType", header: "Visit type", render: (r) => r.visitType },
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
      render: (r) => (
        <StatusBadge status={r.status} />
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="My encounters"
        description="Documentation and coding status for every encounter you rendered."
        actions={<ExportButton rows={rows} fileName="my-encounters" />}
      />

      <SectionCard
        title="Encounter list"
        subtitle="Select an encounter to review coding detail."
        actions={
          <SearchControl
            value={search}
            onChange={setSearch}
            placeholder="Search patient or CPT"
            className="w-full sm:w-72"
          />
        }
      >
        <DataGrid
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          isLoading={encounters.isLoading}
          error={encounters.error}
          onRetry={() => encounters.refetch()}
          onRowClick={setSelected}
          paginated
          initialPageSize={8}
        />
      </SectionCard>

      <ModalWindow
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected ? `Encounter ${selected.id}` : "Encounter"}
        description={selected ? `${selected.patient} · ${formatDate(selected.serviceDate)}` : undefined}
      >
        {selected ? (
          <dl className="space-y-4 text-sm">
            {[
              ["Visit type", selected.visitType],
              ["CPT", selected.cptCode],
              ["Charge", formatCurrency(selected.charge)],
              ["Documentation", selected.status],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </ModalWindow>
    </AppShell>
  );
}
