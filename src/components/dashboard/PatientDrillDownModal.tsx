import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Star,
  User,
  X,
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
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getMockPatientProfile, type PatientSummaryRow } from "@/lib/api/patient-analytics";

export function PatientDrillDownModal({
  patient,
  open,
  onOpenChange,
}: {
  patient: PatientSummaryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!patient) return null;

  const { visits, billings, payments } = getMockPatientProfile(patient.patientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        {/* Breadcrumb Header */}
        <div className="space-y-4">
          <nav aria-label="Patient Drilldown Breadcrumbs" className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              Patient Analytics
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary">{patient.patientName}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="capitalize">{activeTab}</span>
          </nav>

          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-brand">
                  {patient.patientName.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                    {patient.patientName}
                    <Badge variant={patient.patientType === "New" ? "default" : "secondary"} className="text-xs">
                      {patient.patientType} Patient
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    ID: {patient.patientId} · {patient.age} yrs · {patient.gender} · {patient.specialty}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 space-y-4">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold">
              Patient Profile
            </TabsTrigger>
            <TabsTrigger value="visits" className="rounded-lg text-xs font-semibold">
              Visit History ({visits.length})
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg text-xs font-semibold">
              Billing History ({billings.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg text-xs font-semibold">
              Payment History ({payments.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Patient Profile */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Charges</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">
                  {formatCurrency(patient.totalCharges)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Cumulative billed</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Payments</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(patient.totalPayments)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Paid to date</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Outstanding Balance</p>
                <p className="mt-1 font-display text-xl font-bold text-destructive">
                  {formatCurrency(patient.outstandingBalance)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Patient due</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Satisfaction Rating</p>
                <p className="mt-1 font-display text-xl font-bold text-amber-500 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {patient.satisfactionScore} / 5.0
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Portal survey</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Demographics & Provider Details
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Primary Provider: </span>
                  <span className="font-semibold">{patient.provider}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Specialty: </span>
                  <span className="font-semibold">{patient.specialty}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Primary Location: </span>
                  <span className="font-semibold">{patient.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Visits: </span>
                  <span className="font-semibold">{patient.totalVisits} encounters</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Visit: </span>
                  <span className="font-semibold">{patient.lastVisit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Payment Date: </span>
                  <span className="font-semibold">{patient.lastPaymentDate}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Visit History */}
          <TabsContent value="visits" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Visit Type</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Chief Complaint</th>
                    <th className="py-2.5 px-3 font-mono">CPT</th>
                    <th className="py-2.5 px-3 text-right">Charge</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {visits.map((v) => (
                    <tr key={v.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 text-muted-foreground font-medium">{v.visitDate}</td>
                      <td className="py-2.5 px-3 font-medium">{v.visitType}</td>
                      <td className="py-2.5 px-3">{v.provider}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{v.chiefComplaint}</td>
                      <td className="py-2.5 px-3 font-mono">{v.cptCode}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{formatCurrency(v.chargeAmount)}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 3: Billing History */}
          <TabsContent value="billing" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Claim #</th>
                    <th className="py-2.5 px-3">Service Date</th>
                    <th className="py-2.5 px-3 text-right">Billed</th>
                    <th className="py-2.5 px-3 text-right">Insurance Paid</th>
                    <th className="py-2.5 px-3 text-right">Adjustments</th>
                    <th className="py-2.5 px-3 text-right">Patient Balance</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {billings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary">{b.claimNumber}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{b.serviceDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(b.billedAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(b.insurancePaid)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{formatCurrency(b.adjustments)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-destructive">
                        {formatCurrency(b.patientBalance)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 4: Payment History */}
          <TabsContent value="payments" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Payment Date</th>
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 text-muted-foreground">{p.paymentDate}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{p.receiptNumber}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {p.paymentMethod}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="default" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          {p.status}
                        </Badge>
                      </td>
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
