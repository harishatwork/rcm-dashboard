import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppRole } from "@/lib/rbac";
import { ROLES } from "@/lib/rbac";

const STORAGE_KEY = "rcm-active-role";
const DEFAULT_ROLE: AppRole = "practice-admin";

interface RoleContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

/**
 * Client-side role context for navigation gating.
 * Swap the initial value for a real session claim when auth is wired up.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>(DEFAULT_ROLE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppRole | null;
    if (stored && ROLES.some((r) => r.id === stored)) setRoleState(stored);
  }, []);

  const setRole = useCallback((next: AppRole) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setRoleState(next);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
}
