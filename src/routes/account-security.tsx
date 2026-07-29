import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { MfaSetup, PasswordChangeForm, SessionTimeoutWarning } from "@/components/auth";

export const Route = createFileRoute("/account-security")({
  head: () => ({
    meta: [
      { title: "Account Security | RCM Analytics" },
      {
        name: "description",
        content:
          "Change your password, enroll in multi-factor authentication and review session timeout behavior for RCM Analytics.",
      },
      { property: "og:title", content: "Account Security | RCM Analytics" },
      {
        property: "og:description",
        content: "Manage your password, multi-factor enrollment and session policy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountSecurityPage,
});

function AccountSecurityPage() {
  const [warningOpen, setWarningOpen] = useState(false);

  return (
    <AppShell>
      <PageHeader
        title="Account security"
        description="Manage your credentials, multi-factor enrollment and session policy for this workspace."
        actions={
          <Button variant="outline" onClick={() => setWarningOpen(true)}>
            Preview timeout warning
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Password"
          subtitle="Passwords must meet the organization's security policy."
        >
          <PasswordChangeForm />
        </SectionCard>

        <SectionCard
          title="Multi-factor authentication"
          subtitle="Optional but strongly recommended for finance and compliance roles."
        >
          <MfaSetup onSkip={() => undefined} />
        </SectionCard>
      </div>

      <SessionTimeoutWarning
        open={warningOpen}
        countdownSeconds={120}
        onStaySignedIn={() => setWarningOpen(false)}
        onSignOut={() => setWarningOpen(false)}
        onExpire={() => setWarningOpen(false)}
      />
    </AppShell>
  );
}
