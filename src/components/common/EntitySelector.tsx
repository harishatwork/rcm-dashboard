import { useState } from "react";
import { Check, ChevronsUpDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SelectorOption {
  value: string;
  label: string;
  description?: string;
}

export interface EntitySelectorProps {
  options: SelectorOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  icon?: LucideIcon;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  multiple?: boolean;
  isLoading?: boolean;
  className?: string;
}

/**
 * Generic searchable entity picker. Provider / practice / payer selectors are
 * thin wrappers around this so behaviour stays identical across the app.
 */
export function EntitySelector({
  options,
  value,
  onChange,
  label,
  icon: Icon,
  placeholder,
  searchPlaceholder = "Search…",
  emptyMessage = "No matches found.",
  multiple = true,
  isLoading,
  className,
}: EntitySelectorProps) {
  const [open, setOpen] = useState(false);

  const selected = options.filter((option) => value.includes(option.value));
  const display =
    selected.length === 0
      ? (placeholder ?? `All ${label.toLowerCase()}s`)
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} ${label.toLowerCase()}s selected`;

  function toggle(option: SelectorOption) {
    if (!multiple) {
      onChange(value.includes(option.value) ? [] : [option.value]);
      setOpen(false);
      return;
    }
    onChange(
      value.includes(option.value)
        ? value.filter((item) => item !== option.value)
        : [...value, option.value],
    );
  }

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full rounded-xl sm:w-56", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className={cn(
            "h-10 w-full justify-between gap-2 rounded-xl font-normal sm:w-56",
            selected.length === 0 && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
            <span className="truncate">{display}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.description ?? ""}`}
                  onSelect={() => toggle(option)}
                  className="gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value.includes(option.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{option.label}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
