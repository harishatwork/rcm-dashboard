import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

function messageFrom(error: unknown) {
  if (!error) return undefined;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

/** Recoverable failure surface for any data-backed component. */
export function ErrorState({
  title = "Something went wrong",
  description,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const detail = description ?? messageFrom(error) ?? "We couldn't load this data. Try again.";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-destructive/25 bg-danger-soft/50 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </span>
      <p className="text-sm font-semibold text-destructive">{title}</p>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{detail}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-5 gap-2 rounded-xl">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
