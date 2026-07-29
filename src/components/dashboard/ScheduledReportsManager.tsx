import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Edit,
  Mail,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ScheduledReportRow } from "@/lib/api/reports-analytics-dashboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ScheduledReportsManager({ initialRows }: { initialRows: ScheduledReportRow[] }) {
  const [schedules, setSchedules] = useState<ScheduledReportRow[]>(initialRows);
  const [createOpen, setCreateOpen] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [newFrequency, setNewFrequency] = useState("Weekly on Monday");
  const [newDelivery, setNewDelivery] = useState<"Email PDF" | "SFTP CSV" | "In-App Notification">("Email PDF");
  const [newEmail, setNewEmail] = useState("");

  const togglePause = (id: string) => {
    setSchedules((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Active" ? "Paused" : "Active";
          toast.info(`Schedule ${nextStatus.toLowerCase()}: "${item.reportName}"`);
          return { ...item, status: nextStatus };
        }
        return item;
      }),
    );
  };

  const handleDelete = (id: string, name: string) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
    toast.error(`Schedule deleted: "${name}"`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim()) return;

    const newRow: ScheduledReportRow = {
      id: `sch-${Date.now()}`,
      reportName: newReportName,
      frequency: newFrequency,
      nextRun: "Tomorrow at 08:00 AM",
      lastRun: "Never",
      deliveryMethod: newDelivery,
      status: "Active",
      emailRecipients: newEmail || "analysts@rcmanalytics.org",
    };

    setSchedules((prev) => [newRow, ...prev]);
    setCreateOpen(false);
    setNewReportName("");
    setNewEmail("");
    toast.success(`Schedule created for "${newRow.reportName}"`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Scheduled Reports Management</h3>
          <p className="text-xs text-muted-foreground">
            Automate recurring report dispatches to leadership and billing teams
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
              <Plus className="h-3.5 w-3.5" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Create Automated Report Schedule</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up recurring automated email or SFTP delivery for standard RCM analytics reports.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Report Name</label>
                <Input
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  placeholder="e.g. Monthly Collections Summary"
                  className="h-10 rounded-xl"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Frequency</label>
                  <Select value={newFrequency} onValueChange={setNewFrequency}>
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily at 08:00 AM">Daily at 08:00 AM</SelectItem>
                      <SelectItem value="Weekly on Monday">Weekly on Monday</SelectItem>
                      <SelectItem value="Monthly on 1st">Monthly on 1st</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Delivery Method</label>
                  <Select
                    value={newDelivery}
                    onValueChange={(v: any) => setNewDelivery(v)}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email PDF">Email PDF</SelectItem>
                      <SelectItem value="SFTP CSV">SFTP CSV</SelectItem>
                      <SelectItem value="In-App Notification">In-App Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Recipients / Target</label>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="executive-team@rcmanalytics.org"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="h-9 text-xs rounded-xl" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs rounded-xl">
                  Save Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-e1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Scheduled Report</th>
              <th className="py-3.5 px-4">Frequency</th>
              <th className="py-3.5 px-4">Next Run</th>
              <th className="py-3.5 px-4">Last Run</th>
              <th className="py-3.5 px-4">Delivery Method</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {schedules.map((row) => (
              <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  <p className="font-semibold text-foreground">{row.reportName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" />
                    {row.emailRecipients}
                  </p>
                </td>
                <td className="py-3.5 px-4 font-medium">{row.frequency}</td>
                <td className="py-3.5 px-4 text-muted-foreground font-mono">{row.nextRun}</td>
                <td className="py-3.5 px-4 text-muted-foreground font-mono">{row.lastRun}</td>
                <td className="py-3.5 px-4">
                  <Badge variant="outline" className="text-[10px]">
                    {row.deliveryMethod}
                  </Badge>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <Badge
                    variant={row.status === "Active" ? "default" : "secondary"}
                    className={cn(
                      "text-[10px]",
                      row.status === "Active" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                    )}
                  >
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      title={row.status === "Active" ? "Pause Schedule" : "Resume Schedule"}
                      className="h-8 w-8 p-0 rounded-lg hover:text-amber-600"
                      onClick={() => togglePause(row.id)}
                    >
                      {row.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete Schedule"
                      className="h-8 w-8 p-0 rounded-lg hover:text-destructive"
                      onClick={() => handleDelete(row.id, row.reportName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
