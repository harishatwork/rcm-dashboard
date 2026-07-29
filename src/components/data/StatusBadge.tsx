import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ClaimStatus } from "@/lib/api/types";

const styles: Record<string, string> = {
  paid: "bg-status-paid-soft text-status-paid",
  success: "bg-status-paid-soft text-status-paid",
  active: "bg-status-paid-soft text-status-paid",
  pending: "bg-status-pending-soft text-status-pending",
  warning: "bg-status-pending-soft text-status-pending",
  renewal: "bg-status-pending-soft text-status-pending",
  denied: "bg-status-denied-soft text-status-denied",
  rejected: "bg-status-rejected-soft text-status-rejected",
  appealed: "bg-status-info-soft text-status-info",
  negotiating: "bg-status-info-soft text-status-info",
  submitted: "bg-status-info-soft text-status-info",
  unbilled: "bg-muted text-muted-foreground",
};

const dots: Record<string, string> = {
  paid: "bg-status-paid",
  success: "bg-status-paid",
  active: "bg-status-paid",
  pending: "bg-status-pending",
  warning: "bg-status-pending",
  renewal: "bg-status-pending",
  denied: "bg-status-denied",
  rejected: "bg-status-rejected",
  appealed: "bg-status-info",
  negotiating: "bg-status-info",
  submitted: "bg-status-info",
  unbilled: "bg-muted-foreground",
};

export function StatusBadge({
  status,
  children,
}: {
  status: ClaimStatus | string;
  /** Optional label rendered instead of the raw status text. */
  children?: ReactNode;
}) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", dots[status] ?? "bg-muted-foreground")}
      />
      {children ?? status}
    </span>
  );
}
