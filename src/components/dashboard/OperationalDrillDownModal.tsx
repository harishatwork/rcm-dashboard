import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Stethoscope,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/format";
import { getMockOperationalDetails, type OperationalSummaryRow } from "@/lib/api/operational-dashboard";

export function OperationalDrillDownModal({
  row,
  open,
  onOpenChange,
}: {
  row: OperationalSummaryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("appointments");

  if (!row) return null;

  const { appointmentDetails, providerSchedule, departmentPerformance } = getMockOperationalDetails(row.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        {/* Breadcrumb Header */}
        <div className="space-y-4">
          <nav aria-label="Operational Drilldown Breadcrumbs" className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              Operational Dashboard
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary">{row.location}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="capitalize">{activeTab.replace("-", " ")}</span>
          </nav>

          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-brand">
                  {row.location.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                    {row.location}
                    <Badge variant="outline" className="text-xs">
                      {row.department}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Practice: {row.practice} · Lead Provider: {row.provider}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 space-y-4">
          <TabsList className="grid w-full grid-cols-5 rounded-xl">
            <TabsTrigger value="appointments" className="rounded-lg text-xs font-semibold">
              Appointments ({appointmentDetails.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-lg text-xs font-semibold">
              Schedule ({providerSchedule.length})
            </TabsTrigger>
            <TabsTrigger value="operations" className="rounded-lg text-xs font-semibold">
              Daily Ops
            </TabsTrigger>
            <TabsTrigger value="flow" className="rounded-lg text-xs font-semibold">
              Patient Flow
            </TabsTrigger>
            <TabsTrigger value="departments" className="rounded-lg text-xs font-semibold">
              Departments ({departmentPerformance.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Appointment Details */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Appointment #</th>
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Slot Time</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                    <th className="py-2.5 px-3 text-right">Wait (Min)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {appointmentDetails.map((apt) => (
                    <tr key={apt.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary">{apt.appointmentNumber}</td>
                      <td className="py-2.5 px-3 font-medium">{apt.patientName}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{apt.timeSlot}</td>
                      <td className="py-2.5 px-3">{apt.provider}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{apt.checkInTime}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{apt.waitMinutes} min</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={apt.status === "Completed" ? "default" : apt.status === "No Show" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 2: Provider Schedule */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Time Slot</th>
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Visit Type</th>
                    <th className="py-2.5 px-3 text-right">Duration</th>
                    <th className="py-2.5 px-3">Slot Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {providerSchedule.map((slot, i) => (
                    <tr key={i} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-medium">{slot.time}</td>
                      <td className="py-2.5 px-3 font-medium">{slot.patientName}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{slot.visitType}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{slot.durationMinutes} min</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={slot.status === "Completed" ? "default" : slot.status === "Open" ? "outline" : "secondary"}
                          className="text-[10px]"
                        >
                          {slot.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 3: Daily Operations */}
          <TabsContent value="operations" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Scheduled Visits</p>
                <p className="mt-1 font-display text-xl font-bold">{formatNumber(row.scheduledAppointments)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Completed Check-ins</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatNumber(row.completedVisits)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">No Shows</p>
                <p className="mt-1 font-display text-xl font-bold text-amber-600 dark:text-amber-400">{row.noShows}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Cancellations</p>
                <p className="mt-1 font-display text-xl font-bold text-muted-foreground">{row.cancellations}</p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Patient Flow */}
          <TabsContent value="flow" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient Journey Cycle Time Breakdown
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-muted-foreground">Lobby Wait Time</p>
                  <p className="text-base font-bold text-foreground mt-1">{row.avgWaitMinutes} min</p>
                  <p className="text-[11px] text-muted-foreground">Target: &lt; 15 min</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-muted-foreground">Exam Room Duration</p>
                  <p className="text-base font-bold text-foreground mt-1">{row.avgVisitDurationMinutes} min</p>
                  <p className="text-[11px] text-muted-foreground">Clinical encounter</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-muted-foreground">Capacity Utilization</p>
                  <p className="text-base font-bold text-primary mt-1">{row.utilizationPct}%</p>
                  <p className="text-[11px] text-muted-foreground">Schedule efficiency</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Department Performance */}
          <TabsContent value="departments" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Staff Count</th>
                    <th className="py-2.5 px-3 text-right">Avg Wait (Min)</th>
                    <th className="py-2.5 px-3 text-right">Completion Rate</th>
                    <th className="py-2.5 px-3 text-right">Utilization %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {departmentPerformance.map((dept, i) => (
                    <tr key={i} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-medium">{dept.department}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.staffCount} FTEs</td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.avgWaitMinutes} min</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {dept.completionRate}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">{dept.utilizationPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
