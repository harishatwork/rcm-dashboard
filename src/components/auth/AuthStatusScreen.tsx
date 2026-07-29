import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AuthStatusTone = "info" | "warning" | "danger" | "success";

const TONE_STYLES: Record<AuthStatusTone, string> = {
  info: "bg-primary-soft text-accent-foreground",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/12 text-destructive",
  success: "bg-success/15 text-success",
};

export interface AuthStatusScreenProps {
  icon: ComponentType<LucideProps>;
  tone?: AuthStatusTone;
  title: string;
  description: string;
  /** Optional monospace reference shown for support escalation. */
  reference?: string;
  primaryAction?: { label: string; to: string };
  secondaryAction?: { label: string; to: string };
  children?: ReactNode;
}

/**
 * Full-page state screen used by session expired / access denied / unauthorized.
 */
export function AuthStatusScreen({
  icon: Icon,
  tone = "info",
  title,
  description,
  reference,
  primaryAction,
  secondaryAction,
  children,
}: AuthStatusScreenProps) {
  return (
    <div className="grid min-h-dvh place-items-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-e2 sm:p-10">
        <span
          className={cn(
            "mx-auto grid h-14 w-14 place-items-center rounded-2xl",
            TONE_STYLES[tone],
          )}
        >
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {children ? <div className="mt-6 text-left">{children}</div> : null}

        {reference ? (
          <p className="mt-6 rounded-xl bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            Reference: {reference}
          </p>
        ) : null}

        {primaryAction || secondaryAction ? (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {primaryAction ? (
              <Button asChild className="sm:min-w-40">
                <Link to={primaryAction.to}>{primaryAction.label}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button asChild variant="outline" className="sm:min-w-40">
                <Link to={secondaryAction.to}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
