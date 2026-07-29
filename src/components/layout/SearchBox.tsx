import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label="Search claims, payers and facilities"
        placeholder="Search claims, payers, facilities…"
        className="h-10 rounded-xl border-border bg-card pl-9 pr-14 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:block">
        ⌘K
      </kbd>
    </div>
  );
}
