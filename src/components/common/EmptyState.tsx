import type { ComponentType, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}

/** Neutral placeholder shown when a query succeeds but returns nothing. */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-5 rounded-xl">
          {actionLabel}
        </Button>
      ) : null}
      {children}
    </div>
  );
}
