import {
  ArrowRight,
  Banknote,
  FileCheck2,
  FilePlus2,
  Percent,
  ShieldAlert,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionCard } from "@/components/data/SectionCard";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDrillDown } from "./DrillDownProvider";
import type { ActivityEvent, ActivityKind } from "@/lib/api/types";

const KIND: Record<ActivityKind, { icon: LucideIcon; tone: string }> = {
  payment: { icon: Banknote, tone: "bg-success-soft text-success" },
  denial: { icon: ShieldAlert, tone: "bg-danger-soft text-destructive" },
  submission: { icon: FileCheck2, tone: "bg-primary/10 text-primary" },
  adjustment: { icon: Percent, tone: "bg-warning-soft text-warning" },
  user: { icon: UserCog, tone: "bg-secondary text-muted-foreground" },
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Chronological feed of revenue-cycle events with drill-down. */
export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  const openDrillDown = useDrillDown();

  return (
    <SectionCard title="Recent activity" subtitle="Last 24 hours across all facilities">
      <ul className="space-y-2">
        {events.map((event) => {
          const meta = KIND[event.kind];
          const Icon = meta.icon;
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() =>
                  openDrillDown({
                    title: event.title,
                    hint: event.detail,
                    path: event.drillPath,
                    value: event.amount ? formatCurrency(event.amount) : undefined,
                  })
                }
                className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary/60"
              >
                <span className={cn("rounded-lg p-2", meta.tone)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{event.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{event.detail}</span>
                </span>
                <span className="text-right">
                  {event.amount ? (
                    <span className="block text-sm font-semibold">
                      {formatCurrency(event.amount, true)}
                    </span>
                  ) : null}
                  <span className="block text-xs text-muted-foreground">
                    {relativeTime(event.timestamp)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

const QUICK_ACTIONS: Array<{ label: string; description: string; to: string; icon: LucideIcon }> = [
  { label: "Work denials", description: "Prioritised appeal queue", to: "/denials", icon: ShieldAlert },
  { label: "Review A/R", description: "Aged balances by payer", to: "/ar", icon: Percent },
  { label: "Post payments", description: "Open remittance batches", to: "/collections", icon: Banknote },
  { label: "Submit claims", description: "Ready-to-bill encounters", to: "/billing", icon: FilePlus2 },
  { label: "Run a report", description: "Executive report library", to: "/reports", icon: FileCheck2 },
];

/** Shortcut rail into the highest-value revenue-cycle workflows. */
export function QuickActions() {
  return (
    <SectionCard title="Quick actions" subtitle="Jump into the day's priority work">
      <ul className="space-y-2">
        {QUICK_ACTIONS.map((action) => (
          <li key={action.to}>
            <Link
              to={action.to}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-secondary/60"
            >
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <action.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{action.label}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {action.description}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
