import type { ReactNode } from "react";
import { useDrillDown } from "./DrillDownProvider";
import type { DrillLevel, EntityType } from "@/lib/api/drilldown";
import { cn } from "@/lib/utils";

export interface DrillDownClickWrapperProps {
  children: ReactNode;
  entityType?: EntityType;
  entityId?: string;
  level?: DrillLevel;
  title?: string;
  hint?: string;
  value?: string;
  className?: string;
}

export function DrillDownClickWrapper({
  children,
  entityType = "revenue",
  entityId = "metric-1",
  level = 2,
  title,
  hint,
  value,
  className,
}: DrillDownClickWrapperProps) {
  const openDrillDown = useDrillDown();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDrillDown({
      title: title ?? `${entityType.toUpperCase()} Detail Analysis`,
      hint: hint ?? `Explore Level ${level} transactional analysis for ${entityType}`,
      path: `/drilldown?level=${level}&entityType=${entityType}&entityId=${entityId}`,
      value,
      level,
      entityType,
      entityId,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] group/drill",
        className,
      )}
    >
      {children}
    </div>
  );
}
