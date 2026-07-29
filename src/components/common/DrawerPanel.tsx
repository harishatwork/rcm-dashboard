import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface DrawerPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: "left" | "right" | "top" | "bottom";
  width?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Side panel for record detail, activity and contextual editing. */
export function DrawerPanel({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  width = "sm:max-w-md",
  footer,
  children,
  className,
}: DrawerPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("flex w-full flex-col gap-0 p-0", width, className)}
      >
        <SheetHeader className="space-y-1.5 border-b border-border px-6 py-5 text-left">
          <SheetTitle className="text-base font-bold">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-xs">{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-border px-6 py-4">{footer}</div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
