import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordField } from "./PasswordField";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  /** Wire this to a real auth provider later. */
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  onSsoSignIn?: () => void;
  error?: string;
  loading?: boolean;
}

export function LoginForm({ onSubmit, onSsoSignIn, error, loading }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const busy = loading || submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">Work email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="username"
          placeholder="you@healthsystem.org"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          required
        />
      </div>

      <PasswordField
        id="login-password"
        autoComplete="current-password"
        placeholder="••••••••••••"
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        required
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="login-remember"
            checked={values.rememberMe}
            onCheckedChange={(checked) =>
              setValues((v) => ({ ...v, rememberMe: checked === true }))
            }
          />
          <Label htmlFor="login-remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>
        <Link
          to="/forgot-password"
          className="rounded text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden />
        )}
        {busy ? "Signing in…" : "Sign in"}
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onSsoSignIn}>
        Continue with organization SSO
      </Button>
    </form>
  );
}
