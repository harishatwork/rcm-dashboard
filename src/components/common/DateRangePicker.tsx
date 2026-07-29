import { useState } from "react";
import { format, subDays, startOfMonth, startOfYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type { DateRange };

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
}

const presets = [
  { label: "Last 7 days", range: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", range: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "Last 90 days", range: () => ({ from: subDays(new Date(), 89), to: new Date() }) },
  { label: "Month to date", range: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "Year to date", range: () => ({ from: startOfYear(new Date()), to: new Date() }) },
];

function label(range?: DateRange) {
  if (!range?.from) return undefined;
  if (!range.to) return format(range.from, "MMM d, yyyy");
  return `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`;
}

/** Reporting period picker with common revenue-cycle presets. */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select reporting period",
  className,
  align = "start",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const text = label(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 w-full justify-start gap-2 rounded-xl text-left font-normal sm:w-auto",
            !text && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{text ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex flex-col sm:flex-row">
          <div className="flex shrink-0 flex-row gap-1 overflow-x-auto p-3 sm:flex-col sm:overflow-visible">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start rounded-lg text-xs font-medium"
                onClick={() => {
                  onChange(preset.range());
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
            <Separator className="my-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              className="justify-start rounded-lg text-xs font-medium text-muted-foreground"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
          <Separator orientation="vertical" className="hidden h-auto sm:block" />
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
