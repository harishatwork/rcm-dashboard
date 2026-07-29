import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { getMockProviderDetails, type ProviderPerformanceRow } from "@/lib/api/provider-performance-dashboard";

export function ProviderDrillDownModal({
  provider,
  open,
  onOpenChange,
}: {
  provider: ProviderPerformanceRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!provider) return null;

  const { encounterSummaries, claimsHistory, denialDetails } = getMockProviderDetails(provider.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        {/* Breadcrumb Header */}
        <div className="space-y-4">
          <nav aria-label="Provider Drilldown Breadcrumbs" className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              Provider Performance
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary">{provider.providerName}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="capitalize">{activeTab.replace("-", " ")}</span>
          </nav>

          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-brand">
                  {provider.providerName.replace(/^Dr\.?\s*/i, "").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                    {provider.providerName}
                    <Badge variant="outline" className="text-xs">
                      {provider.providerType}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    NPI: {provider.npi} · {provider.specialty} · {provider.practice}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 space-y-4">
          <TabsList className="grid w-full grid-cols-5 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold">
              Profile
            </TabsTrigger>
            <TabsTrigger value="encounters" className="rounded-lg text-xs font-semibold">
              Encounters
            </TabsTrigger>
            <TabsTrigger value="financial" className="rounded-lg text-xs font-semibold">
              Financial
            </TabsTrigger>
            <TabsTrigger value="claims" className="rounded-lg text-xs font-semibold">
              Claims ({claimsHistory.length})
            </TabsTrigger>
            <TabsTrigger value="denials" className="rounded-lg text-xs font-semibold">
              Denials ({denialDetails.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Provider Profile */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Net Collections</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">
                  {formatCurrency(provider.collections)}
                </p>
                <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  {provider.collectionRate}% Collection Rate
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">wRVU vs Target</p>
                <p className="mt-1 font-display text-xl font-bold text-primary">
                  {provider.wrvu} / {provider.wrvuTarget}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {Math.round((provider.wrvu / provider.wrvuTarget) * 100)}% of target
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Denial Rate</p>
                <p className="mt-1 font-display text-xl font-bold text-amber-600 dark:text-amber-400">
                  {provider.denialRate}%
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Target: &lt; 4.0%</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Outstanding AR</p>
                <p className="mt-1 font-display text-xl font-bold text-destructive">
                  {formatCurrency(provider.outstandingAr)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">A/R Exposure</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clinical Practice & Billing Credentials
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-muted-foreground">National Provider Identifier: </span>
                  <span className="font-semibold">{provider.npi}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Specialty: </span>
                  <span className="font-semibold">{provider.specialty}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Practice Location: </span>
                  <span className="font-semibold">{provider.practice}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Days to Bill: </span>
                  <span className="font-semibold">{provider.avgDaysToBill} days</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Encounters: </span>
                  <span className="font-semibold">{formatNumber(provider.encounters)} visits</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Revenue / Visit: </span>
                  <span className="font-semibold">{formatCurrency(provider.avgRevenuePerVisit)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Encounter Summary */}
          <TabsContent value="encounters" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Visit Type / CPT Category</th>
                    <th className="py-2.5 px-3 text-right">Encounter Count</th>
                    <th className="py-2.5 px-3 text-right">Total Charges</th>
                    <th className="py-2.5 px-3 text-right">Avg Charge / Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {encounterSummaries.map((enc, i) => (
                    <tr key={i} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-medium">{enc.visitType}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatNumber(enc.count)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{formatCurrency(enc.totalCharges)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(enc.avgCharge)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 3: Financial Performance */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Gross Billed Charges</p>
                <p className="mt-1 font-display text-xl font-bold">{formatCurrency(provider.charges)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Net Collections</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(provider.collections)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Collection Rate</p>
                <p className="mt-1 font-display text-xl font-bold text-primary">{provider.collectionRate}%</p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Claims History */}
          <TabsContent value="claims" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Claim #</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Service Date</th>
                    <th className="py-2.5 px-3 text-right">Billed</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {claimsHistory.map((clm) => (
                    <tr key={clm.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary">{clm.claimNumber}</td>
                      <td className="py-2.5 px-3 font-medium">{clm.patient}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{clm.serviceDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(clm.billedAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(clm.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={clm.status === "Paid" ? "default" : clm.status === "Denied" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {clm.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 5: Denial Details */}
          <TabsContent value="denials" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">CARC Code</th>
                    <th className="py-2.5 px-3">Denial Reason</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Count</th>
                    <th className="py-2.5 px-3 text-right">At-Risk Amount</th>
                    <th className="py-2.5 px-3">Appeal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {denialDetails.map((den, i) => (
                    <tr key={i} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-destructive">{den.code}</td>
                      <td className="py-2.5 px-3 font-medium">{den.reason}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{den.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{den.count}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-destructive">
                        {formatCurrency(den.amount)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
                          {den.status}
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
