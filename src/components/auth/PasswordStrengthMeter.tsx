import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const defaultPasswordRules: PasswordRule[] = [
  { id: "length", label: "At least 12 characters", test: (v) => v.length >= 12 },
  { id: "case", label: "Upper and lower case letters", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: "number", label: "At least one number", test: (v) => /\d/.test(v) },
  { id: "symbol", label: "At least one symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const TONES = [
  { label: "Very weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Fair", bar: "bg-warning", text: "text-warning" },
  { label: "Strong", bar: "bg-success", text: "text-success" },
  { label: "Excellent", bar: "bg-success", text: "text-success" },
];

export function getPasswordScore(value: string, rules: PasswordRule[] = defaultPasswordRules) {
  return rules.reduce((score, rule) => (rule.test(value) ? score + 1 : score), 0);
}

export interface PasswordStrengthMeterProps {
  value: string;
  rules?: PasswordRule[];
  showChecklist?: boolean;
  className?: string;
}

/** Visual strength meter + requirement checklist. Pure presentation. */
export function PasswordStrengthMeter({
  value,
  rules = defaultPasswordRules,
  showChecklist = true,
  className,
}: PasswordStrengthMeterProps) {
  const score = getPasswordScore(value, rules);
  const tone = TONES[Math.min(score, TONES.length - 1)];

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="flex items-center gap-2"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={rules.length}
        aria-valuenow={score}
        aria-valuetext={`Password strength: ${tone.label}`}
        aria-label="Password strength"
      >
        {rules.map((rule, index) => (
          <span
            key={rule.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index < score ? tone.bar : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", value ? tone.text : "text-muted-foreground")}>
        {value ? tone.label : "Enter a password to see its strength"}
      </p>
      {showChecklist ? (
        <ul className="space-y-1.5">
          {rules.map((rule) => {
            const passed = rule.test(value);
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  passed ? "text-success" : "text-muted-foreground",
                )}
              >
                {passed ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <X className="h-3.5 w-3.5" aria-hidden />
                )}
                <span>{rule.label}</span>
                <span className="sr-only">{passed ? "requirement met" : "requirement not met"}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
