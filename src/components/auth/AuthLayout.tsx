import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Small badge / eyebrow above the title */
  eyebrow?: ReactNode;
}

/**
 * Split-screen shell shared by every authentication screen.
 * Presentation only — no session logic lives here.
 */
export function AuthLayout({ title, description, children, footer, eyebrow }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-muted/40 lg:grid-cols-[1.05fr_1fr]">
      <aside
        className="relative hidden overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex lg:flex-col lg:justify-between"
        aria-label="Product highlights"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <Link to="/" className="relative flex items-center gap-3 rounded-xl">
          <img src="/app-icon.png" alt="RCM Analytics" className="h-11 w-11 shrink-0 object-contain" />
          <span className="text-base tracking-tight">
            <span className="font-bold">RCM</span>
            <span className="font-light opacity-90"> Analytics</span>
          </span>
        </Link>

        <div className="relative max-w-md space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {["Predict", "Reconcile", "Maximize"].map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-primary-foreground/25 px-3 py-0.5 text-xs font-medium uppercase tracking-widest text-primary-foreground/70"
                >
                  {word}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary-foreground">
              For healthcare finance teams
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/75">
            Monitor collections, denials and payer performance across every practice from a single
            governed workspace.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            {[
              "Role-based access for billing, finance and compliance",
              "Audit-ready activity trails on every export",
              "Single sign-on and multi-factor ready",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          HIPAA-aligned controls · SOC 2 Type II program
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <Link to="/" className="flex items-center gap-3 lg:hidden">
            <img src="/app-icon.png" alt="RCM Analytics" className="h-10 w-10 shrink-0 object-contain" />
            <span className="text-base tracking-tight">
              <span className="font-bold">RCM</span>
              <span className="font-light text-muted-foreground"> Analytics</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-e2 sm:p-8">
            <header className="space-y-2">
              {eyebrow}
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              ) : null}
            </header>
            <div className="mt-6">{children}</div>
          </div>

          {footer ? (
            <div className="text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
