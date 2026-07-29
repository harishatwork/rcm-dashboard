import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import {
  ConfirmationDialog,
  DataGrid,
  ExportButton,
  type DataGridColumn,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { Encounter } from "@/lib/api/types";
import { toast } from "sonner";

export const Route = createFileRoute("/unsigned-encounters")({
  head: () =>
    pageMeta(
      "Unsigned Encounters",
      "Encounters awaiting your signature, ranked by age and held charge value.",
    ),
  component: UnsignedEncountersPage,
});

function UnsignedEncountersPage() {
  const encounters = useQuery(rcmQueries.encounters());
  const [pending, setPending] = useState<Encounter | null>(null);

  const rows = useMemo(
    () =>
      (encounters.data ?? [])
        .filter((row) => row.status !== "signed")
        .sort((a, b) => a.serviceDate.localeCompare(b.serviceDate)),
    [encounters.data],
  );

  const heldCharges = rows.reduce((sum, row) => sum + row.charge, 0);

  const columns: DataGridColumn<Encounter>[] = [
    { key: "date", header: "Date of service", sortValue: (r) => r.serviceDate, render: (r) => formatDate(r.serviceDate) },
    {
      key: "patient",
      header: "Patient",
      sortValue: (r) => r.patient,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.patient}</p>
          <p className="truncate text-xs text-muted-foreground">
            {r.visitType} · CPT {r.cptCode}
          </p>
        </div>
      ),
    },
    {
      key: "charge",
      header: "Held charge",
      align: "right",
      sortValue: (r) => r.charge,
      render: (r) => formatCurrency(r.charge),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => setPending(r)}>
          Sign
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Unsigned encounters"
        description={`${rows.length} encounters holding ${formatCurrency(heldCharges)} in charges from release.`}
        actions={<ExportButton rows={rows} fileName="unsigned-encounters" />}
      />

      <SectionCard
        title="Signature queue"
        subtitle="Oldest encounters first — charges cannot bill until signed."
        actions={<AlertTriangle className="h-5 w-5 text-warning" aria-hidden />}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          isLoading={encounters.isLoading}
          error={encounters.error}
          onRetry={() => encounters.refetch()}
          paginated
          initialPageSize={8}
          emptyTitle="Nothing awaiting signature"
          emptyMessage="All of your encounters are signed and released to billing."
        />
      </SectionCard>

      <ConfirmationDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Sign this encounter?"
        description={
          pending
            ? `Signing releases ${formatCurrency(pending.charge)} in charges for ${pending.patient} to billing.`
            : undefined
        }
        confirmLabel="Sign encounter"
        onConfirm={() => {
          toast.success("Encounter signed", {
            description: "Connect the EHR feed to persist signatures.",
          });
          setPending(null);
        }}
      />
    </AppShell>
  );
}
