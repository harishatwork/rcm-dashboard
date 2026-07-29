import { useQuery } from "@tanstack/react-query";
import { Building2, Stethoscope, ShieldCheck } from "lucide-react";
import { EntitySelector, type SelectorOption } from "./EntitySelector";
import { rcmQueries } from "@/lib/api/queries";

interface SelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  className?: string;
}

/** Rendering providers, sourced from the shared data layer. */
export function ProviderSelector({ value, onChange, multiple, className }: SelectorProps) {
  const { data, isLoading } = useQuery(rcmQueries.providers());
  const options: SelectorOption[] =
    data?.map((provider) => ({
      value: provider.id,
      label: provider.name,
      description: `${provider.specialty} · NPI ${provider.npi}`,
    })) ?? [];

  return (
    <EntitySelector
      label="Provider"
      icon={Stethoscope}
      options={options}
      value={value}
      onChange={onChange}
      multiple={multiple}
      isLoading={isLoading}
      searchPlaceholder="Search providers…"
      className={className}
    />
  );
}

/** Practices / facilities in the organisation. */
export function PracticeSelector({ value, onChange, multiple, className }: SelectorProps) {
  const { data, isLoading } = useQuery(rcmQueries.practices());
  const options: SelectorOption[] =
    data?.map((practice) => ({
      value: practice.id,
      label: practice.name,
      description: `${practice.region} · ${practice.providerCount} providers`,
    })) ?? [];

  return (
    <EntitySelector
      label="Practice"
      icon={Building2}
      options={options}
      value={value}
      onChange={onChange}
      multiple={multiple}
      isLoading={isLoading}
      searchPlaceholder="Search practices…"
      className={className}
    />
  );
}

/** Contracted payers. */
export function PayerSelector({ value, onChange, multiple, className }: SelectorProps) {
  const { data, isLoading } = useQuery(rcmQueries.payers());
  const options: SelectorOption[] =
    data?.map((payer) => ({
      value: payer.id,
      label: payer.name,
      description: `${payer.contractStatus} contract`,
    })) ?? [];

  return (
    <EntitySelector
      label="Payer"
      icon={ShieldCheck}
      options={options}
      value={value}
      onChange={onChange}
      multiple={multiple}
      isLoading={isLoading}
      searchPlaceholder="Search payers…"
      className={className}
    />
  );
}
