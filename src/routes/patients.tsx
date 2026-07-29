import { createFileRoute } from "@tanstack/react-router";
import { PatientAnalyticsDashboardPage } from "./patient-analytics";

export const Route = createFileRoute("/patients")({
  head: () => ({
    meta: [
      { title: "Patient Analytics Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Comprehensive patient analytics dashboard tracking patient growth, visit trends, specialty volume, revenue per patient, and patient billing histories.",
      },
      { property: "og:title", content: "Patient Analytics Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track patient volume growth, new vs returning patient trends, and patient collections.",
      },
    ],
  }),
  component: PatientAnalyticsDashboardPage,
});
