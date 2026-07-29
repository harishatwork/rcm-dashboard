import { createFileRoute } from "@tanstack/react-router";
import { PredictiveAnalyticsDashboardPage } from "./predictive-analytics";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Predictive Analytics Dashboard | RCM Analytics" },
      {
        name: "description",
        content:
          "Machine learning predictive analytics dashboard forecasting 30/90-day revenue trends, expected collections, denial probability, and claim risk analysis.",
      },
      { property: "og:title", content: "Predictive Analytics Dashboard | RCM Analytics" },
      {
        property: "og:description",
        content: "Track revenue forecasts, claim denial risks, cash flow projections, and machine learning models.",
      },
    ],
  }),
  component: PredictiveAnalyticsDashboardPage,
});
