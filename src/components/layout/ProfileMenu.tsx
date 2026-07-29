import { ChevronDown, KeyRound, LifeBuoy, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-xl px-1.5 sm:px-2"
          aria-label="Open profile menu"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
              DM
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 text-left leading-tight lg:block">
            <span className="block truncate text-xs font-semibold">Dana Meyers</span>
            <span className="block truncate text-[11px] text-muted-foreground">RCM Director</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">Dana Meyers</p>
          <p className="truncate text-xs text-muted-foreground">dana.meyers@northsidehealth.org</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4" /> Workspace settings
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account-security">
            <KeyRound className="h-4 w-4" /> Password & security
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/access-denied">
            <ShieldCheck className="h-4 w-4" /> Access & compliance
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="h-4 w-4" /> Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
          <Link to="/login">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
