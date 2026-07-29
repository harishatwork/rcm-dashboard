import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { DrillDownDetailPage } from "@/components/dashboard/DrillDownDetailPage";

export const Route = createFileRoute("/drilldown")({
  head: () => ({
    meta: [
      { title: "Drill-down Analytics | RCM Analytics" },
      {
        name: "description",
        content:
          "Multi-level drill-down detail analysis from high-level KPIs to transactional claim line items with preserved filter context.",
      },
      { property: "og:title", content: "Drill-down Analytics | RCM Analytics" },
      {
        property: "og:description",
        content: "Explore multi-level hierarchical drill-down views across Revenue, Denials, A/R, Payors, Providers, and Patients.",
      },
    ],
  }),
  component: DrillDownRoutePage,
});

export function DrillDownRoutePage() {
  return (
    <AppShell>
      <PageHeader
        title="Drill-down Analytics Detail"
        description="Multi-level hierarchical drill-down view linking high-level dashboard KPIs directly to transactional line items while preserving global filter context."
      />
      <DrillDownDetailPage />
    </AppShell>
  );
}
