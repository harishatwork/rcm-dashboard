import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  CheckCircle2,
  ExternalLink,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FavoriteItem, SavedView } from "@/lib/api/personalization";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SavedViewsManager({
  initialViews,
  initialFavorites,
  onSaveViews,
  onSaveFavorites,
}: {
  initialViews: SavedView[];
  initialFavorites: FavoriteItem[];
  onSaveViews?: (views: SavedView[]) => void;
  onSaveFavorites?: (favorites: FavoriteItem[]) => void;
}) {
  const [views, setViews] = useState<SavedView[]>(initialViews);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);

  const [createOpen, setCreateOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");

  const handleSetDefault = (id: string, name: string) => {
    setViews((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === id,
      })),
    );
    toast.success(`"${name}" set as default dashboard view.`);
  };

  const handleDeleteView = (id: string, name: string) => {
    setViews((prev) => prev.filter((v) => v.id !== id));
    toast.error(`Saved view deleted: "${name}"`);
  };

  const handleRemoveFavorite = (id: string, title: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.info(`Removed from favorites: "${title}"`);
  };

  const handleCreateView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: `sv-${Date.now()}`,
      name: newViewName,
      dashboardPath: "/revenue",
      filters: { dateRange: "Last 30 Days", practice: "Main Campus Health", provider: "All", payor: "All" },
      sorting: "Default",
      isDefault: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setViews((prev) => [...prev, newView]);
    setCreateOpen(false);
    setNewViewName("");
    toast.success(`Saved custom view: "${newView.name}"`);
  };

  return (
    <div className="space-y-6">
      {/* Saved Views Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold tracking-tight">Saved Custom Dashboard Views</h3>
            <p className="text-xs text-muted-foreground">
              Save filter combinations, column visibility, and sorting presets for 1-click loading
            </p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
                <Plus className="h-3.5 w-3.5" />
                Save Current View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Save Custom View Preset</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Save current filters, sorting, and selected charts as a reusable view preset.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateView} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">View Name</label>
                  <Input
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="e.g. Q3 Orthopedic Denial Review"
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" className="h-9 text-xs rounded-xl" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="h-9 text-xs rounded-xl">
                    Save View Preset
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {views.map((v) => (
            <div key={v.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  {v.name}
                </span>
                {v.isDefault ? (
                  <Badge variant="default" className="text-[10px]">
                    Default View
                  </Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => handleSetDefault(v.id, v.name)}
                  >
                    Set Default
                  </Button>
                )}
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground space-y-1">
                <p>Path: <span className="font-mono font-medium text-foreground">{v.dashboardPath}</span></p>
                <p>Filters: Date ({v.filters.dateRange}), Payor ({v.filters.payor})</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <Button asChild variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1">
                  <Link to={v.dashboardPath}>
                    Load View
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:text-destructive"
                  onClick={() => handleDeleteView(v.id, v.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Favorites & Quick-Access Items</h3>
          <p className="text-xs text-muted-foreground">
            Frequently accessed dashboards, reports, and filter presets for 1-click navigation
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-xs text-foreground truncate">{fav.title}</p>
                <p className="text-[10px] text-muted-foreground">{fav.type} · {fav.category}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                  <Link to={fav.path}>
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-lg hover:text-amber-500"
                  onClick={() => handleRemoveFavorite(fav.id, fav.title)}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
