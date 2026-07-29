import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import type { DateRange } from "react-day-picker";

export type DatePresetId =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "currentMonth"
  | "previousMonth"
  | "quarter"
  | "year"
  | "custom";

export const DATE_PRESETS: Array<{ id: DatePresetId; label: string; range?: () => DateRange }> = [
  { id: "today", label: "Today", range: () => ({ from: new Date(), to: new Date() }) },
  {
    id: "yesterday",
    label: "Yesterday",
    range: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
  },
  { id: "last7", label: "Last 7 days", range: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { id: "last30", label: "Last 30 days", range: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  {
    id: "currentMonth",
    label: "Current month",
    range: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    id: "previousMonth",
    label: "Previous month",
    range: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    id: "quarter",
    label: "Quarter to date",
    range: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }),
  },
  {
    id: "year",
    label: "Year to date",
    range: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }),
  },
  { id: "custom", label: "Custom range" },
];

export type DateTypeId =
  | "service"
  | "chargeEntry"
  | "claimSubmission"
  | "billed"
  | "payment"
  | "paymentEntry";

export const DATE_TYPES: Array<{ id: DateTypeId; label: string }> = [
  { id: "service", label: "Date of service" },
  { id: "chargeEntry", label: "Charge entry date" },
  { id: "claimSubmission", label: "Claim submission date" },
  { id: "billed", label: "Billed date" },
  { id: "payment", label: "Payment date" },
  { id: "paymentEntry", label: "Payment entry date" },
];

export type OperationalFilterKey =
  | "provider"
  | "facility"
  | "insurance"
  | "location"
  | "patient"
  | "billingCompany"
  | "cpt"
  | "specialty"
  | "practice"
  | "denialCategory"
  | "denialReason"
  | "financialClass"
  | "patientType"
  | "ageGroup"
  | "gender"
  | "providerType"
  | "department"
  | "reportCategory";

export const OPERATIONAL_KEYS: OperationalFilterKey[] = [
  "provider",
  "facility",
  "insurance",
  "location",
  "patient",
  "billingCompany",
  "cpt",
  "specialty",
  "practice",
  "denialCategory",
  "denialReason",
  "financialClass",
  "patientType",
  "ageGroup",
  "gender",
  "providerType",
  "department",
  "reportCategory",
];

export interface GlobalFilterState {
  preset: DatePresetId;
  dateType: DateTypeId;
  range?: DateRange;
  search: string;
  selections: Record<OperationalFilterKey, string[]>;
}

export interface SavedPreset {
  id: string;
  name: string;
  state: GlobalFilterState;
}

const emptySelections = (): Record<OperationalFilterKey, string[]> =>
  OPERATIONAL_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {} as Record<OperationalFilterKey, string[]>,
  );

export function defaultFilterState(): GlobalFilterState {
  return {
    preset: "last30",
    dateType: "service",
    range: DATE_PRESETS.find((p) => p.id === "last30")!.range!(),
    search: "",
    selections: emptySelections(),
  };
}

export function countActiveFilters(state: GlobalFilterState) {
  const selectionCount = OPERATIONAL_KEYS.reduce(
    (sum, key) => sum + state.selections[key].length,
    0,
  );
  return selectionCount + (state.search.trim() ? 1 : 0) + (state.preset === "last30" ? 0 : 1);
}

interface GlobalFilterContextValue {
  filters: GlobalFilterState;
  setPreset: (preset: DatePresetId) => void;
  setDateType: (type: DateTypeId) => void;
  setRange: (range: DateRange | undefined) => void;
  setSearch: (value: string) => void;
  setSelection: (key: OperationalFilterKey, value: string[]) => void;
  reset: () => void;
  apply: () => void;
  appliedAt: number;
  recentSearches: string[];
  pushRecentSearch: (value: string) => void;
  clearRecentSearches: () => void;
  savedPresets: SavedPreset[];
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

const GlobalFilterContext = createContext<GlobalFilterContextValue | null>(null);

const RECENT_KEY = "rcm-recent-searches";
const PRESET_KEY = "rcm-saved-filter-presets";

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilterState>(defaultFilterState);
  const [appliedAt, setAppliedAt] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);

  useEffect(() => {
    try {
      const recent = window.localStorage.getItem(RECENT_KEY);
      if (recent) setRecentSearches(JSON.parse(recent));
      const presets = window.localStorage.getItem(PRESET_KEY);
      if (presets) setSavedPresets(JSON.parse(presets));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const persistRecent = (next: string[]) => {
    setRecentSearches(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };
  const persistPresets = (next: SavedPreset[]) => {
    setSavedPresets(next);
    window.localStorage.setItem(PRESET_KEY, JSON.stringify(next));
  };

  const setPreset = useCallback((preset: DatePresetId) => {
    setFilters((prev) => {
      const found = DATE_PRESETS.find((item) => item.id === preset);
      return { ...prev, preset, range: found?.range ? found.range() : prev.range };
    });
  }, []);

  const value = useMemo<GlobalFilterContextValue>(
    () => ({
      filters,
      appliedAt,
      setPreset,
      setDateType: (dateType) => setFilters((prev) => ({ ...prev, dateType })),
      setRange: (range) => setFilters((prev) => ({ ...prev, range, preset: "custom" })),
      setSearch: (search) => setFilters((prev) => ({ ...prev, search })),
      setSelection: (key, val) =>
        setFilters((prev) => ({ ...prev, selections: { ...prev.selections, [key]: val } })),
      reset: () => setFilters(defaultFilterState()),
      apply: () => setAppliedAt(Date.now()),
      recentSearches,
      pushRecentSearch: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return;
        persistRecent([trimmed, ...recentSearches.filter((i) => i !== trimmed)].slice(0, 8));
      },
      clearRecentSearches: () => persistRecent([]),
      savedPresets,
      savePreset: (name) =>
        persistPresets([
          ...savedPresets.filter((p) => p.name !== name),
          { id: `${Date.now()}`, name, state: filters },
        ]),
      loadPreset: (id) => {
        const found = savedPresets.find((p) => p.id === id);
        if (found) setFilters(found.state);
      },
      deletePreset: (id) => persistPresets(savedPresets.filter((p) => p.id !== id)),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, appliedAt, recentSearches, savedPresets, setPreset],
  );

  return <GlobalFilterContext.Provider value={value}>{children}</GlobalFilterContext.Provider>;
}

export function useGlobalFilters() {
  const ctx = useContext(GlobalFilterContext);
  if (!ctx) throw new Error("useGlobalFilters must be used inside GlobalFilterProvider");
  return ctx;
}
