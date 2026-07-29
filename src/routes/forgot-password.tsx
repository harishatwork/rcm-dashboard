import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout, ForgotPasswordForm } from "@/components/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password | RCM Analytics" },
      {
        name: "description",
        content:
          "Request a secure password reset link for your RCM Analytics revenue cycle workspace.",
      },
      { property: "og:title", content: "Forgot Password | RCM Analytics" },
      {
        property: "og:description",
        content: "Request a secure password reset link for your workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email tied to your workspace and we'll send a secure reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
