import { useState } from "react";
import { Clock, Mail, FileText, Send, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ReportLibraryRow } from "@/lib/api/reports-analytics-dashboard";

export interface ScheduleReportModalProps {
  report: ReportLibraryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleReportModal({
  report,
  open,
  onOpenChange,
}: ScheduleReportModalProps) {
  const [frequency, setFrequency] = useState("Weekly");
  const [time, setTime] = useState("08:00");
  const [deliveryMethod, setDeliveryMethod] = useState("Email PDF");
  const [recipients, setRecipients] = useState("billing-team@rcmanalytics.org");
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">(report?.format ?? "PDF");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success(`Schedule saved for “${report.reportName}”`, {
        description: `${frequency} dispatch at ${time} sent via ${deliveryMethod} to ${recipients}.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                Automate Report Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up automated recurring dispatch for {report.reportName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSaveSchedule} className="space-y-4 py-2">
          {/* Frequency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Dispatch Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily (Every Morning)</SelectItem>
                <SelectItem value="Weekly">Weekly (Every Monday)</SelectItem>
                <SelectItem value="Monthly">Monthly (1st of the month)</SelectItem>
                <SelectItem value="Quarterly">Quarterly (End of Quarter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time & Delivery Method Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Dispatch Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Delivery Method</Label>
              <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email PDF">Email PDF Attachment</SelectItem>
                  <SelectItem value="SFTP CSV">SFTP Server Export (CSV)</SelectItem>
                  <SelectItem value="In-App Notification">In-App Vault Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recipient Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Recipients (Email list)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Comma separated emails"
                className="h-10 rounded-xl pl-9"
              />
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Export File Format</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF font-medium">Adobe PDF Document (.pdf)</SelectItem>
                <SelectItem value="Excel">Microsoft Excel Workbook (.xlsx)</SelectItem>
                <SelectItem value="CSV">Comma Separated Values (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 gap-2 rounded-xl"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Saving Schedule..." : "Activate Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
