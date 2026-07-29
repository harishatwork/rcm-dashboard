import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, LoginForm } from "@/components/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | RCM Analytics" },
      {
        name: "description",
        content:
          "Sign in to RCM Analytics to monitor collections, denials and payer performance across your practices.",
      },
      { property: "og:title", content: "Sign In | RCM Analytics" },
      {
        property: "og:description",
        content: "Secure access to your revenue cycle analytics workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your workspace"
      description="Use your organization credentials to access revenue cycle analytics."
      footer={
        <span>
          Need an account?{" "}
          <Link to="/access-denied" className="font-medium text-primary hover:underline">
            Request access from your administrator
          </Link>
        </span>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
