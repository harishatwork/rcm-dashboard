import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { StatusBadge } from "@/components/data/StatusBadge";
import { DataTable, type Column } from "@/components/data/DataTable";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rcmQueries } from "@/lib/api/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Claim, ClaimStatus } from "@/lib/api/types";

export const Route = createFileRoute("/claims")({
  head: () => ({
    meta: [
      { title: "Claims Workqueue | RCM Analytics" },
      {
        name: "description",
        content:
          "Filter and monitor submitted, pending, paid, appealed and denied claims with billed vs. paid amounts and A/R age.",
      },
      { property: "og:title", content: "Claims Workqueue | RCM Analytics" },
      {
        property: "og:description",
        content: "Monitor every claim in the revenue cycle with live status and aging detail.",
      },
    ],
  }),
  component: ClaimsPage,
});

const statuses: Array<ClaimStatus | "all"> = [
  "all",
  "submitted",
  "pending",
  "paid",
  "denied",
  "appealed",
];

const columns: Column<Claim>[] = [
  { key: "id", header: "Claim ID", render: (row) => <span className="font-semibold">{row.id}</span> },
  {
    key: "patient",
    header: "Patient",
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{row.patient}</p>
        <p className="truncate text-xs text-muted-foreground">{row.facility}</p>
      </div>
    ),
  },
  { key: "payer", header: "Payer", render: (row) => row.payer },
  {
    key: "service",
    header: "Service date",
    render: (row) => <span className="text-muted-foreground">{formatDate(row.serviceDate)}</span>,
  },
  { key: "age", header: "A/R age", align: "right", render: (row) => `${row.ageDays}d` },
  { key: "amount", header: "Billed", align: "right", render: (row) => formatCurrency(row.amount) },
  {
    key: "paid",
    header: "Paid",
    align: "right",
    render: (row) =>
      row.paidAmount > 0 ? (
        formatCurrency(row.paidAmount)
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ClaimStatus | "all">("all");
  const claims = useQuery(rcmQueries.claims({ search, status }));

  const rows = claims.data ?? [];
  const summary = useMemo(() => {
    const billed = rows.reduce((sum, c) => sum + c.amount, 0);
    const paid = rows.reduce((sum, c) => sum + c.paidAmount, 0);
    return { billed, paid, outstanding: billed - paid };
  }, [rows]);

  return (
    <AppShell>
      <PageHeader
        title="Claims workqueue"
        description="Every claim in flight, with payer, aging and reimbursement status. Filters run against the same API contract the backend will serve."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        {[
          { label: "Billed in view", value: summary.billed },
          { label: "Paid in view", value: summary.paid },
          { label: "Outstanding", value: summary.outstanding },
        ].map((item, i) => (
          <div
            key={item.label}
            className="surface-card animate-rise p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold">
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="All claims"
        subtitle={`${rows.length} record${rows.length === 1 ? "" : "s"} matching filters`}
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search claim, patient, payer…"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Tabs value={status} onValueChange={(value) => setStatus(value as ClaimStatus | "all")}>
            <TabsList className="h-10 w-full justify-start overflow-x-auto rounded-xl lg:w-auto">
              {statuses.map((item) => (
                <TabsTrigger key={item} value={item} className="rounded-lg capitalize">
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          isLoading={claims.isLoading}
          getRowKey={(row) => row.id}
        />
      </SectionCard>
    </AppShell>
  );
}
