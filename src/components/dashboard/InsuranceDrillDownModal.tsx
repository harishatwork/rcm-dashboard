import { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  ShieldCheck,
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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { getMockPayorDetails, type InsurancePerformanceRow } from "@/lib/api/insurance-dashboard";

export function InsuranceDrillDownModal({
  payor,
  open,
  onOpenChange,
}: {
  payor: InsurancePerformanceRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!payor) return null;

  const { claims, remittances } = getMockPayorDetails(payor.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        {/* Breadcrumb Navigation Header */}
        <div className="space-y-4">
          <nav aria-label="Drilldown Breadcrumbs" className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              Insurance Dashboard
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary">{payor.insuranceCompany}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="capitalize">{activeTab} Details</span>
          </nav>

          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-brand">
                  {payor.insuranceCompany.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                    {payor.insuranceCompany}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {payor.financialClass} · Contract Status:{" "}
                    <span className="font-semibold text-foreground capitalize">{payor.contractStatus}</span>
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">
              Payor Overview
            </TabsTrigger>
            <TabsTrigger value="claims" className="rounded-lg text-xs font-semibold">
              Claims ({claims.length})
            </TabsTrigger>
            <TabsTrigger value="remittance" className="rounded-lg text-xs font-semibold">
              Payment Remittances ({remittances.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Payor Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Payments</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">
                  {formatCurrency(payor.totalPayments)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">YTD Collections</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Outstanding AR</p>
                <p className="mt-1 font-display text-xl font-bold text-destructive">
                  {formatCurrency(payor.outstandingBalance)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Balance in A/R</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Collection Rate</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {payor.collectionRate}%
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Target: 96%</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Avg Payment Days</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">
                  {payor.avgPaymentDays} days
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Turnaround time</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contract Benchmarks & Policy Summary
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Clean Claim Rate: </span>
                  <span className="font-semibold">{payor.cleanClaimRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Claims Submitted: </span>
                  <span className="font-semibold">{formatNumber(payor.claimsSubmitted)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Claims Paid Ratio: </span>
                  <span className="font-semibold">
                    {Math.round((payor.claimsPaid / payor.claimsSubmitted) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Claims Detail */}
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
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary">{claim.claimNumber}</td>
                      <td className="py-2.5 px-3 font-medium">{claim.patient}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{claim.serviceDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(claim.billedAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(claim.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={claim.status === "paid" ? "default" : claim.status === "denied" ? "destructive" : "secondary"}
                          className="capitalize text-[10px]"
                        >
                          {claim.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 3: Remittance Details */}
          <TabsContent value="remittance" className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Remittance Date</th>
                    <th className="py-2.5 px-3">Check / EFT #</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3 text-right">Allowed</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Adjustments</th>
                    <th className="py-2.5 px-3 text-right">Patient Resp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {remittances.map((rem) => (
                    <tr key={rem.id} className="hover:bg-muted/40">
                      <td className="py-2.5 px-3 text-muted-foreground">{rem.remittanceDate}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{rem.checkEftNumber}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {rem.paymentMethod}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(rem.allowedAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(rem.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                        {formatCurrency(rem.adjustmentAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(rem.patientResponsibility)}
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
