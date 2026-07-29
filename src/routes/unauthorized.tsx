import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { AuthStatusScreen } from "@/components/auth";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Unauthorized | RCM Analytics" },
      {
        name: "description",
        content:
          "You need to be signed in to view this RCM Analytics page. Authenticate to continue to your workspace.",
      },
      { property: "og:title", content: "Unauthorized | RCM Analytics" },
      {
        property: "og:description",
        content: "You need to be signed in to view this page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <AuthStatusScreen
      icon={ShieldAlert}
      tone="danger"
      title="You're not signed in"
      description="This page requires an authenticated session. Sign in with your organization credentials to continue."
      reference="RCM-AUTH-401"
      primaryAction={{ label: "Sign in", to: "/login" }}
      secondaryAction={{ label: "Forgot password?", to: "/forgot-password" }}
    />
  );
}
