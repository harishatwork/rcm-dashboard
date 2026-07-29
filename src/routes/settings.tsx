import { createFileRoute } from "@tanstack/react-router";
import { PersonalizationPage } from "./personalization";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Personalization & Preferences | RCM Analytics" },
      {
        name: "description",
        content:
          "Personalize your healthcare RCM analytics workspace, profile preferences, themes, dashboard widget layouts, saved views, and recent activity stream.",
      },
      { property: "og:title", content: "Personalization & Preferences | RCM Analytics" },
      {
        property: "og:description",
        content: "Customize user preferences, color themes, widget order, saved views, and favorites.",
      },
    ],
  }),
  component: PersonalizationPage,
});
