import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void> | void;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSubmit?.(email);
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center" aria-live="polite">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success">
          <MailCheck className="h-7 w-7" aria-hidden />
        </span>
        <div className="space-y-2">
          <p className="text-base font-semibold">Check your inbox</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>,
            a password reset link is on its way. The link expires in 30 minutes.
          </p>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Work email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="username"
          placeholder="you@healthsystem.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Send reset link
      </Button>
      <Button asChild variant="ghost" className="w-full">
        <Link to="/login">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to sign in
        </Link>
      </Button>
    </form>
  );
}
