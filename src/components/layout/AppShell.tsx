import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, ChevronsLeft, ChevronsRight, Lock, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { SearchBox } from "@/components/layout/SearchBox";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useRole } from "@/components/auth/RoleProvider";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";
import { GlobalFilterBar } from "@/components/filters/GlobalFilterBar";
import { GlobalFilterProvider } from "@/components/filters/GlobalFilterProvider";
import { canAccessPath, navForRole, roleLabel } from "@/lib/rbac";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "rcm-sidebar-collapsed";

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();
  const groups = navForRole(role);

  return (
    <nav
      aria-label={`${roleLabel(role)} navigation`}
      className={cn("flex flex-col gap-4 overflow-y-auto", collapsed ? "px-2" : "px-3")}
    >
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {collapsed ? (
            <span className="mx-auto my-1 h-px w-6 bg-sidebar-border" aria-hidden />
          ) : (
            <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
          )}
          {group.items.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            const link = (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-2" : "px-3",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-e1"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                    active && "text-primary",
                  )}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/** Blocks rendering when the active role has no menu entry for the route. */
function RouteRoleGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();

  if (canAccessPath(role, pathname)) return <>{children}</>;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-e2">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/12 text-destructive">
        <Lock className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Not available for your role</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The {roleLabel(role)} role doesn't include this area. Switch roles or ask an administrator
        to extend your permissions.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <RoleSwitcher compact />
        <Button asChild variant="outline">
          <Link to="/access-denied">Request access</Link>
        </Button>
      </div>
    </div>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 py-6", collapsed ? "justify-center px-2" : "px-6")}>
      <img
        src="/app-icon.png"
        alt="RCM Analytics"
        className="h-[52px] w-[52px] shrink-0 object-contain drop-shadow-md"
      />
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate font-display text-base font-extrabold tracking-tight">
            RCM Analytics
          </p>
          <p className="truncate text-xs text-muted-foreground">Revenue cycle intelligence</p>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-xl"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

const NO_FILTER_BAR = ["/settings", "/administration", "/account-security"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showFilters = !NO_FILTER_BAR.includes(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      window.localStorage.setItem(COLLAPSE_KEY, String(!prev));
      return !prev;
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
    <GlobalFilterProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div
        className={cn(
          "min-h-dvh lg:grid",
          collapsed ? "lg:grid-cols-[80px_minmax(0,1fr)]" : "lg:grid-cols-[276px_minmax(0,1fr)]",
        )}
      >
        <aside
          aria-label="Primary navigation"
          className="sticky top-0 z-40 hidden h-dvh flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex"
        >
          <Brand collapsed={collapsed} />
          <NavList collapsed={collapsed} />

          {!collapsed && (
            <div className="mt-auto m-4 space-y-3">
              <div className="rounded-2xl bg-primary-soft p-4">
                <p className="text-sm font-semibold text-accent-foreground">Q3 close in 12 days</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  8 payer reconciliations still open across 3 facilities.
                </p>
              </div>
              <RoleSwitcher />
            </div>
          )}

          <div className={cn("border-t border-sidebar-border p-3", collapsed && "mt-auto")}>
            <Button
              variant="ghost"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "w-full rounded-xl text-muted-foreground",
                collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
              )}
            >
              {collapsed ? (
                <ChevronsRight className="h-[18px] w-[18px]" />
              ) : (
                <>
                  <ChevronsLeft className="h-[18px] w-[18px]" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl lg:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[276px] overflow-y-auto bg-sidebar p-0">
                  <Brand />
                  <NavList onNavigate={() => setMobileOpen(false)} />
                  <div className="p-3">
                    <RoleSwitcher />
                  </div>
                </SheetContent>
              </Sheet>

              <SearchBox className="lg:max-w-sm" />

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <ThemeToggle />
                <NotificationPanel />
                <ProfileMenu />
              </div>
            </div>

            <div className="border-t border-border/70 px-4 py-2 sm:px-6 lg:px-10">
              <Breadcrumbs />
            </div>

            {showFilters ? <GlobalFilterBar /> : null}
          </header>

          <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <RouteRoleGuard>{children}</RouteRoleGuard>
          </main>
        </div>
      </div>
    </GlobalFilterProvider>
    </TooltipProvider>
  );
}
