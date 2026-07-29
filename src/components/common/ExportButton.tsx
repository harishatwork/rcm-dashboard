import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ExportFormat = "csv" | "json";

export interface ExportButtonProps<T extends object> {
  /** Rows to export. Ignored when onExport is supplied. */
  rows?: T[];
  /** Base file name without extension. */
  fileName?: string;
  /** Override to delegate export to the backend once the API is wired up. */
  onExport?: (format: ExportFormat) => Promise<void> | void;
  formats?: ExportFormat[];
  label?: string;
  disabled?: boolean;
  className?: string;
}

function toCsv<T extends object>(rows: T[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape((row as Record<string, unknown>)[header])).join(",")),
  ].join("\n");
}

function download(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Client-side CSV/JSON export with a hook for server-generated exports. */
export function ExportButton<T extends object>({
  rows = [],
  fileName = "rcm-export",
  onExport,
  formats = ["csv", "json"],
  label = "Export",
  disabled,
  className,
}: ExportButtonProps<T>) {
  const [busy, setBusy] = useState(false);

  async function handleExport(format: ExportFormat) {
    setBusy(true);
    try {
      if (onExport) {
        await onExport(format);
      } else if (rows.length === 0) {
        toast.error("Nothing to export", { description: "The current view has no rows." });
        return;
      } else if (format === "csv") {
        download(toCsv(rows), `${fileName}.csv`, "text/csv;charset=utf-8");
      } else {
        download(JSON.stringify(rows, null, 2), `${fileName}.json`, "application/json");
      }
      toast.success(`${format.toUpperCase()} export ready`, {
        description: `${fileName}.${format}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || busy}
          className={cn("h-10 gap-2 rounded-xl", className)}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          Download as
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.includes("csv") ? (
          <DropdownMenuItem className="gap-2 rounded-lg" onSelect={() => handleExport("csv")}>
            <FileSpreadsheet className="h-4 w-4" />
            CSV spreadsheet
          </DropdownMenuItem>
        ) : null}
        {formats.includes("json") ? (
          <DropdownMenuItem className="gap-2 rounded-lg" onSelect={() => handleExport("json")}>
            <FileJson className="h-4 w-4" />
            JSON data
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
