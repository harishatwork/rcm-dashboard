import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export interface SessionTimeoutWarningProps {
  open: boolean;
  /** Seconds remaining when the dialog opens. */
  countdownSeconds?: number;
  onStaySignedIn: () => void;
  onSignOut: () => void;
  /** Called once the countdown reaches zero. */
  onExpire?: () => void;
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Inactivity warning modal. Counts down while open; parent owns the session.
 */
export function SessionTimeoutWarning({
  open,
  countdownSeconds = 120,
  onStaySignedIn,
  onSignOut,
  onExpire,
}: SessionTimeoutWarningProps) {
  const [remaining, setRemaining] = useState(countdownSeconds);

  useEffect(() => {
    if (!open) {
      setRemaining(countdownSeconds);
      return;
    }
    const id = window.setInterval(() => {
      setRemaining((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, countdownSeconds]);

  useEffect(() => {
    if (open && remaining === 0) onExpire?.();
  }, [open, remaining, onExpire]);

  const percent = Math.round((remaining / countdownSeconds) * 100);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-2xl sm:max-w-md">
        <AlertDialogHeader>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-warning/15 text-warning">
            <Clock className="h-6 w-6" aria-hidden />
          </span>
          <AlertDialogTitle>Your session is about to expire</AlertDialogTitle>
          <AlertDialogDescription>
            For the protection of patient and financial data, you will be signed out automatically
            after a period of inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2" aria-live="polite">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Time remaining</span>
            <span className="font-mono text-2xl font-semibold tabular-nums">
              {formatClock(remaining)}
            </span>
          </div>
          <Progress value={percent} aria-label="Time remaining before automatic sign out" />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSignOut}>Sign out now</AlertDialogCancel>
          <AlertDialogAction onClick={onStaySignedIn}>Stay signed in</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
