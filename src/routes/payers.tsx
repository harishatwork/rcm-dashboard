import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDashboardPage } from "./insurance-dashboard";

export const Route = createFileRoute("/payers")({
  head: () => ({
    meta: [
      { title: "Insurance Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive insurance analytics dashboard tracking payments, AR balances, claim status distributions, payor turnaround times, and contract performance.",
      },
      { property: "og:title", content: "Insurance Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track insurance payments, payor performance, collection rates, and claims turnaround.",
      },
    ],
  }),
  component: InsuranceDashboardPage,
});
