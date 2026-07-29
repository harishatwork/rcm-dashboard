import type { ReactNode } from "react";
import { FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  children: ReactNode;
  /** Right-aligned actions such as export or saved views. */
  actions?: ReactNode;
  /** Number of active filters — renders a reset control when above zero. */
  activeCount?: number;
  onReset?: () => void;
  className?: string;
}

/** Horizontal filter rail used above grids, charts and report pages. */
export function FilterBar({ children, actions, activeCount = 0, onReset, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        {activeCount > 0 ? (
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs font-semibold">
            {activeCount} active
          </Badge>
        ) : null}
        {activeCount > 0 && onReset ? (
          <Button variant="outline" size="sm" onClick={onReset} className="h-10 gap-2 rounded-xl">
            <FilterX className="h-4 w-4" />
            Reset
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
