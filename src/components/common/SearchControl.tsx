import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce in ms before onChange fires. Set to 0 for immediate updates. */
  debounceMs?: number;
  className?: string;
  "aria-label"?: string;
}

/** Debounced search input with clear affordance. */
export function SearchControl({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 250,
  className,
  "aria-label": ariaLabel = "Search",
}: SearchControlProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft === value) return;
    if (debounceMs === 0) {
      onChange(draft);
      return;
    }
    const timer = setTimeout(() => onChange(draft), debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, debounceMs]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label={ariaLabel}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl pl-9 pr-9"
      />
      {draft ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
