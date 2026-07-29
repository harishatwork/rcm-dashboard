import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export interface ModalWindowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: ModalSize;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Standard centred modal for forms and detail views. */
export function ModalWindow({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  footer,
  children,
  className,
}: ModalWindowProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] gap-0 overflow-hidden rounded-2xl p-0",
          sizes[size],
          className,
        )}
      >
        <DialogHeader className="space-y-1.5 border-b border-border px-6 py-5 text-left">
          <DialogTitle className="text-base font-bold">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-xs">{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <DialogFooter className="gap-2 border-t border-border px-6 py-4">{footer}</DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
