import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "./PasswordField";
import { PasswordStrengthMeter, defaultPasswordRules } from "./PasswordStrengthMeter";

export interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void> | void;
}

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;
  const meetsPolicy = defaultPasswordRules.every((rule) => rule.test(password));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch || !meetsPolicy) return;
    setBusy(true);
    try {
      await onSubmit?.(password);
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-6 text-center" aria-live="polite">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your password has been updated. Sign in with your new credentials to continue.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Alert>
        <AlertDescription>
          Choose a password you have not used on this workspace before.
        </AlertDescription>
      </Alert>

      <PasswordField
        id="reset-password"
        label="New password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <PasswordStrengthMeter value={password} />

      <PasswordField
        id="reset-confirm"
        label="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={mismatch ? "Passwords do not match." : undefined}
        required
      />

      <Button type="submit" className="w-full" disabled={busy || mismatch || !meetsPolicy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Update password
      </Button>
    </form>
  );
}
