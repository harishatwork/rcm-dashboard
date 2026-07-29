import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "./PasswordField";
import { PasswordStrengthMeter, defaultPasswordRules } from "./PasswordStrengthMeter";

export interface PasswordChangeFormProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => Promise<void> | void;
  onCancel?: () => void;
}

/** In-app password change — reusable inside settings pages or a drawer. */
export function PasswordChangeForm({ onSubmit, onCancel }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && confirm !== newPassword;
  const reused = newPassword.length > 0 && newPassword === currentPassword;
  const meetsPolicy = defaultPasswordRules.every((rule) => rule.test(newPassword));
  const canSubmit = !mismatch && !reused && meetsPolicy && currentPassword.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      await onSubmit?.({ currentPassword, newPassword });
      setStatus("Password updated. All other sessions have been signed out.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status ? (
        <Alert aria-live="polite">
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}

      <PasswordField
        id="current-password"
        label="Current password"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <PasswordField
        id="new-password"
        label="New password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={reused ? "Choose a password different from your current one." : undefined}
        required
      />
      <PasswordStrengthMeter value={newPassword} />

      <PasswordField
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={mismatch ? "Passwords do not match." : undefined}
        required
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={busy || !canSubmit}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <KeyRound className="h-4 w-4" aria-hidden />
          )}
          Update password
        </Button>
      </div>
    </form>
  );
}
