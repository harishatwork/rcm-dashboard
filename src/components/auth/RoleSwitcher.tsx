import { Check, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ROLES, type AppRole } from "@/lib/rbac";
import { useRole } from "./RoleProvider";
import { cn } from "@/lib/utils";

export interface RoleSwitcherProps {
  /** Render as a compact icon button (used in the top bar). */
  compact?: boolean;
  className?: string;
}

/**
 * Switches the active workspace role. Navigation re-renders from the
 * role's menu definition, so unauthorized items are never mounted.
 */
export function RoleSwitcher({ compact, className }: RoleSwitcherProps) {
  const { role, setRole } = useRole();
  const active = ROLES.find((r) => r.id === role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-xl", compact ? "h-10 gap-2 px-3" : "w-full justify-start gap-2", className)}
          aria-label={`Active role: ${active?.label}. Change role`}
        >
          <UserCog className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate text-sm font-medium">{active?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 rounded-xl">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Active role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => setRole(option.id as AppRole)}
            className="items-start gap-3 py-2.5"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-[11px] font-bold text-accent-foreground">
              {option.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="block text-xs leading-snug text-muted-foreground">
                {option.description}
              </span>
            </span>
            {option.id === role ? (
              <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
