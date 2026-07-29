import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { rcmQueries } from "@/lib/api/queries";
import { cn } from "@/lib/utils";
import { useGlobalFilters } from "./GlobalFilterProvider";

type Group = "Patients" | "Claims" | "Encounters" | "Providers" | "Insurance";

interface Suggestion {
  group: Group;
  label: string;
  detail: string;
}

/** Global search with cross-entity autocomplete and recent searches. */
export function GlobalSearch({ className }: { className?: string }) {
  const { filters, setSearch, recentSearches, pushRecentSearch, clearRecentSearches } =
    useGlobalFilters();
  const [draft, setDraft] = useState(filters.search);
  const [open, setOpen] = useState(false);

  useEffect(() => setDraft(filters.search), [filters.search]);

  const claims = useQuery(rcmQueries.claims());
  const providers = useQuery(rcmQueries.providers());
  const payers = useQuery(rcmQueries.payers());
  const encounters = useQuery(rcmQueries.encounters());
  const balances = useQuery(rcmQueries.patientBalances());

  const all = useMemo<Suggestion[]>(() => {
    const items: Suggestion[] = [];
    for (const b of balances.data ?? [])
      items.push({ group: "Patients", label: b.patient, detail: `${b.practice} · ${b.payer}` });
    for (const c of claims.data ?? [])
      items.push({ group: "Claims", label: c.id, detail: `${c.patient} · ${c.payer}` });
    for (const e of encounters.data ?? [])
      items.push({ group: "Encounters", label: e.id, detail: `${e.patient} · CPT ${e.cptCode}` });
    for (const p of providers.data ?? [])
      items.push({ group: "Providers", label: p.name, detail: `${p.specialty} · NPI ${p.npi}` });
    for (const p of payers.data ?? [])
      items.push({ group: "Insurance", label: p.name, detail: `${p.contractStatus} contract` });
    return items;
  }, [balances.data, claims.data, encounters.data, providers.data, payers.data]);

  const matches = useMemo(() => {
    const term = draft.trim().toLowerCase();
    if (!term) return [];
    return all
      .filter((i) => `${i.label} ${i.detail}`.toLowerCase().includes(term))
      .slice(0, 12);
  }, [all, draft]);

  const grouped = useMemo(() => {
    const map = new Map<Group, Suggestion[]>();
    for (const match of matches) {
      map.set(match.group, [...(map.get(match.group) ?? []), match]);
    }
    return [...map.entries()];
  }, [matches]);

  function commit(value: string) {
    setSearch(value);
    pushRecentSearch(value);
    setDraft(value);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative", className)}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Global search"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commit(draft);
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Search patients, claims, encounters, providers, insurance…"
            className="h-10 rounded-xl pl-9 pr-9"
          />
          {draft ? (
            <button
              type="button"
              aria-label="Clear global search"
              onClick={() => {
                setDraft("");
                setSearch("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-80 w-[--radix-popover-trigger-width] min-w-[320px] overflow-y-auto p-2"
      >
        {draft.trim() ? (
          grouped.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">No matches found.</p>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="mb-2 last:mb-0">
                <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {items.map((item) => (
                  <button
                    key={`${group}-${item.label}-${item.detail}`}
                    type="button"
                    onClick={() => commit(item.label)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{item.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.detail}
                      </span>
                    </span>
                    <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
                      {group}
                    </Badge>
                  </button>
                ))}
              </div>
            ))
          )
        ) : recentSearches.length > 0 ? (
          <div>
            <div className="flex items-center justify-between px-2 pb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Recent searches
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 rounded-lg px-2 text-xs"
                onClick={clearRecentSearches}
              >
                Clear
              </Button>
            </div>
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => commit(item)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Start typing to search patients, claims, encounters, providers and insurance.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
