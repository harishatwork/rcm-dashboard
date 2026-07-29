import { useState } from "react";
import { Check, Copy, ShieldCheck, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";

export interface MfaSetupProps {
  /** Placeholder secret rendered for the authenticator app. */
  secret?: string;
  recoveryCodes?: string[];
  onVerify?: (code: string) => Promise<void> | void;
  onSkip?: () => void;
}

const DEFAULT_RECOVERY = [
  "H4TQ-9PLM-2WXD",
  "K8ZC-4RNB-7YQE",
  "M2VF-6JTS-1LKP",
  "P9WD-3XHR-8CGN",
  "R5NB-7QKA-4ZTM",
  "T1LS-2MDV-9HFX",
];

/** Optional multi-factor enrollment screen. UI only — no secret is generated. */
export function MfaSetup({
  secret = "JBSW Y3DP EHPK 3PXP",
  recoveryCodes = DEFAULT_RECOVERY,
  onVerify,
  onSkip,
}: MfaSetupProps) {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  async function copySecret() {
    try {
      await navigator.clipboard.writeText(secret.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <ol className="space-y-6">
        <li className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="h-4 w-4 text-primary" aria-hidden />
            1. Scan with your authenticator app
          </p>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row">
            <div
              className="grid h-32 w-32 shrink-0 place-items-center rounded-xl border border-dashed border-border bg-card text-center text-[10px] leading-tight text-muted-foreground"
              role="img"
              aria-label="QR code placeholder for authenticator enrollment"
            >
              QR code
              <br />
              placeholder
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs text-muted-foreground">
                Can&apos;t scan? Enter this setup key manually.
              </p>
              <p className="break-all rounded-lg bg-card px-3 py-2 font-mono text-sm tracking-wider">
                {secret}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={copySecret}>
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied ? "Copied" : "Copy key"}
              </Button>
            </div>
          </div>
        </li>

        <li className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            2. Enter the 6-digit verification code
          </p>
          <InputOTP maxLength={6} value={code} onChange={setCode} aria-label="Verification code">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </li>
      </ol>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-semibold">Recovery codes</p>
        <Alert>
          <AlertDescription>
            Store these somewhere safe. Each code can be used once if you lose your device.
          </AlertDescription>
        </Alert>
        <ul className="grid grid-cols-2 gap-2">
          {recoveryCodes.map((recoveryCode) => (
            <li
              key={recoveryCode}
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center font-mono text-xs"
            >
              {recoveryCode}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          className="sm:flex-1"
          disabled={code.length !== 6}
          onClick={() => onVerify?.(code)}
        >
          Verify and enable
        </Button>
        <Button type="button" variant="ghost" className="sm:flex-1" onClick={onSkip}>
          Set up later
        </Button>
      </div>
    </div>
  );
}
