import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout, ResetPasswordForm } from "@/components/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password | RCM Analytics" },
      {
        name: "description",
        content:
          "Choose a new password that meets the RCM Analytics security policy and regain access to your workspace.",
      },
      { property: "og:title", content: "Set a New Password | RCM Analytics" },
      {
        property: "og:description",
        content: "Choose a new password that meets the workspace security policy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Choose a new password"
      description="Your new password must meet the organization's security policy."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
