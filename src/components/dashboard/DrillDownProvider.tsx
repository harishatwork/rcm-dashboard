import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { rcmQueries } from "@/lib/api/queries";
import type { DrillLevel, EntityType } from "@/lib/api/drilldown";
import { DrillDownDrawerPanel } from "./DrillDownDrawerPanel";

export interface DrillDownTarget {
  title: string;
  hint: string;
  path: string;
  value?: string;
  level?: DrillLevel;
  entityType?: EntityType;
  entityId?: string;
}

interface DrillDownContextValue {
  openDrillDown: (target: DrillDownTarget) => void;
  navigateLevel: (level: DrillLevel, entityType: EntityType, entityId: string) => void;
}

const DrillDownContext = createContext<DrillDownContextValue | null>(null);

export function DrillDownProvider({ children }: { children: ReactNode }) {
  const [activeTarget, setActiveTarget] = useState<{
    entityType: EntityType;
    entityId: string;
    level: DrillLevel;
  } | null>(null);

  const query = useQuery(
    rcmQueries.drilldown(
      activeTarget?.entityType ?? "revenue",
      activeTarget?.entityId ?? "root",
      activeTarget?.level ?? 1,
    ),
  );

  const openDrillDown = (target: DrillDownTarget) => {
    setActiveTarget({
      entityType: target.entityType ?? "revenue",
      entityId: target.entityId ?? "root",
      level: target.level ?? 2,
    });
  };

  const navigateLevel = (level: DrillLevel, entityType: EntityType, entityId: string) => {
    setActiveTarget({ level, entityType, entityId });
  };

  return (
    <DrillDownContext.Provider value={{ openDrillDown, navigateLevel }}>
      {children}

      <DrillDownDrawerPanel
        open={activeTarget !== null}
        onOpenChange={(open) => !open && setActiveTarget(null)}
        data={activeTarget ? query.data ?? null : null}
        onNavigateLevel={navigateLevel}
      />
    </DrillDownContext.Provider>
  );
}

export function useDrillDown() {
  const context = useContext(DrillDownContext);
  if (!context) throw new Error("useDrillDown must be used inside DrillDownProvider");
  return context.openDrillDown;
}

export function useDrillDownNavigator() {
  const context = useContext(DrillDownContext);
  if (!context) throw new Error("useDrillDownNavigator must be used inside DrillDownProvider");
  return context.navigateLevel;
}
