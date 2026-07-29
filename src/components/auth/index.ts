/**
 * Authentication UI module for RCM Analytics.
 * Presentation only — wire the callbacks to a real provider later.
 */
export { AuthLayout, type AuthLayoutProps } from "./AuthLayout";
export { AuthStatusScreen, type AuthStatusScreenProps, type AuthStatusTone } from "./AuthStatusScreen";
export { PasswordField, type PasswordFieldProps } from "./PasswordField";
export {
  PasswordStrengthMeter,
  defaultPasswordRules,
  getPasswordScore,
  type PasswordRule,
} from "./PasswordStrengthMeter";
export { LoginForm, type LoginFormProps, type LoginFormValues } from "./LoginForm";
export { ForgotPasswordForm } from "./ForgotPasswordForm";
export { ResetPasswordForm } from "./ResetPasswordForm";
export { PasswordChangeForm, type PasswordChangeFormProps } from "./PasswordChangeForm";
export { MfaSetup, type MfaSetupProps } from "./MfaSetup";
export { SessionTimeoutWarning, type SessionTimeoutWarningProps } from "./SessionTimeoutWarning";
export { RoleProvider, useRole } from "./RoleProvider";
export { RoleSwitcher, type RoleSwitcherProps } from "./RoleSwitcher";
