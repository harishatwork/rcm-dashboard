import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  claims: "Claims",
  denials: "Denials",
  payers: "Payers",
  "kpi-dashboard": "KPI Dashboard",
  revenue: "Revenue Dashboard",
  ar: "Accounts Receivable",
  reports: "Reports & Analytics",
  financial: "Financial Reports",
  "accounts-receivable": "Accounts Receivable Reports",
  payments: "Payments Reports",
  patients: "Patient Reports",
  providers: "Provider Reports",
  operations: "Operational Reports",
};

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
        <li className="flex shrink-0 items-center">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="font-medium">RCM Analytics</span>
          </Link>
        </li>
        {segments.length === 0 ? (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <li className="truncate font-semibold text-foreground">Overview</li>
          </>
        ) : (
          segments.map((segment, i) => {
            const href = `/${segments.slice(0, i + 1).join("/")}`;
            const last = i === segments.length - 1;
            const label = LABELS[segment] ?? segment.replace(/-/g, " ");
            return (
              <li key={href} className="flex min-w-0 items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                {last ? (
                  <span className="truncate font-semibold capitalize text-foreground">{label}</span>
                ) : (
                  <Link
                    to={href}
                    className="truncate rounded-md px-1.5 py-1 capitalize transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })
        )}
      </ol>
    </nav>
  );
}
