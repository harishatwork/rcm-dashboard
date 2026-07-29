import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AuthStatusScreen } from "@/components/auth";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access Denied | RCM Analytics" },
      {
        name: "description",
        content:
          "Your role does not include permission for this RCM Analytics area. Request access from a workspace administrator.",
      },
      { property: "og:title", content: "Access Denied | RCM Analytics" },
      {
        property: "og:description",
        content: "Your role does not include permission for this area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  return (
    <AuthStatusScreen
      icon={Lock}
      tone="danger"
      title="Access denied"
      description="Your role doesn't include permission for this area. A workspace administrator can grant the required access level."
      reference="RCM-ACCESS-403"
      primaryAction={{ label: "Back to overview", to: "/" }}
      secondaryAction={{ label: "Sign in as another user", to: "/login" }}
    >
      <dl className="space-y-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Requested area</dt>
          <dd className="font-medium">Payer contract analytics</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Your role</dt>
          <dd className="font-medium">Billing Analyst</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Required role</dt>
          <dd className="font-medium">RCM Director</dd>
        </div>
      </dl>
    </AuthStatusScreen>
  );
}
