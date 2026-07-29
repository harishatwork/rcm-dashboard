import { Link } from "@tanstack/react-router";
import {
  Activity,
  CreditCard,
  DollarSign,
  FileCheck,
  PiggyBank,
  ShieldAlert,
  Stethoscope,
  Users,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_NAME_TO_SLUG, type ReportCategoryTile } from "@/lib/api/reports-analytics-dashboard";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, typeof DollarSign> = {
  DollarSign,
  PiggyBank,
  FileCheck,
  ShieldAlert,
  CreditCard,
  Users,
  Stethoscope,
  Activity,
};

export function ReportCategoryGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: ReportCategoryTile[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold tracking-tight">Report Categories</h3>
        {selectedCategory && onSelectCategory ? (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear category filter ({selectedCategory})
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Click any category card to open dedicated Report Library</span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] ?? DollarSign;
          const slug = cat.slug || CATEGORY_NAME_TO_SLUG[cat.category] || "financial";
          const isSelected = selectedCategory === cat.category;

          return (
            <Link
              key={cat.id}
              to="/reports/$category"
              params={{ category: slug }}
              className={cn(
                "group flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 shadow-e2 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-e1",
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <Icon className="h-4 w-4" />
                  </span>
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    {cat.reportCount} reports
                  </Badge>
                </div>

                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-end pt-2 border-t border-border/40 text-xs font-medium text-primary">
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Explore Reports
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
