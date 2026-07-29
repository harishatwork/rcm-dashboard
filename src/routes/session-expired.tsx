import { createFileRoute } from "@tanstack/react-router";
import { TimerOff } from "lucide-react";
import { AuthStatusScreen } from "@/components/auth";

export const Route = createFileRoute("/session-expired")({
  head: () => ({
    meta: [
      { title: "Session Expired | RCM Analytics" },
      {
        name: "description",
        content:
          "Your RCM Analytics session ended after a period of inactivity. Sign in again to continue working.",
      },
      { property: "og:title", content: "Session Expired | RCM Analytics" },
      {
        property: "og:description",
        content: "Your session ended after inactivity. Sign in again to continue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SessionExpiredPage,
});

function SessionExpiredPage() {
  return (
    <AuthStatusScreen
      icon={TimerOff}
      tone="warning"
      title="Your session has expired"
      description="For the protection of patient and financial data, we signed you out after a period of inactivity. Any unsaved filters were not retained."
      primaryAction={{ label: "Sign in again", to: "/login" }}
      secondaryAction={{ label: "Back to overview", to: "/" }}
    />
  );
}
