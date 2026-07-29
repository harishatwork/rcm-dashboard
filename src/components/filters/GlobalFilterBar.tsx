import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  FilterX,
  MapPin,
  Check,
  Save,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Stethoscope,
  Trash2,
  User,
  Briefcase,
  Hash,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { EntitySelector, type SelectorOption } from "@/components/common/EntitySelector";
import { ExportButton } from "@/components/common/ExportButton";
import { rcmQueries } from "@/lib/api/queries";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { GlobalSearch } from "./GlobalSearch";
import {
  DATE_PRESETS,
  DATE_TYPES,
  OPERATIONAL_KEYS,
  countActiveFilters,
  useGlobalFilters,
  type OperationalFilterKey,
} from "./GlobalFilterProvider";

const LOCATIONS = ["Main Campus", "North Annex", "Ambulatory Suite", "Telehealth", "Satellite Lab"];
const BILLING_COMPANIES = ["In-house RCM", "Meridian Billing Group", "Cardinal Revenue Partners"];

const META: Record<
  OperationalFilterKey,
  { label: string; placeholder: string; icon: typeof User }
> = {
  provider: { label: "Provider", placeholder: "All providers", icon: Stethoscope },
  facility: { label: "Facility", placeholder: "All facilities", icon: Building2 },
  insurance: { label: "Payor", placeholder: "All payors", icon: ShieldCheck },
  location: { label: "Location", placeholder: "All locations", icon: MapPin },
  patient: { label: "Patient", placeholder: "All patients", icon: User },
  billingCompany: { label: "Billing company", placeholder: "All billing companies", icon: Briefcase },
  cpt: { label: "CPT", placeholder: "All CPT codes", icon: Hash },
  specialty: { label: "Specialty", placeholder: "All specialties", icon: SlidersHorizontal },
  practice: { label: "Practice", placeholder: "All practices", icon: Building2 },
  denialCategory: { label: "Denial Category", placeholder: "All categories", icon: ShieldAlert },
  denialReason: { label: "Denial Reason", placeholder: "All reasons", icon: Bookmark },
  financialClass: { label: "Financial Class", placeholder: "All classes", icon: Briefcase },
  patientType: { label: "Patient Type", placeholder: "All patient types", icon: User },
  ageGroup: { label: "Age Group", placeholder: "All age groups", icon: User },
  gender: { label: "Gender", placeholder: "All genders", icon: User },
  providerType: { label: "Provider Type", placeholder: "All provider types", icon: Stethoscope },
  department: { label: "Department", placeholder: "All departments", icon: Building2 },
  reportCategory: { label: "Report Category", placeholder: "All report categories", icon: FileText },
};

function toOptions(values: string[]): SelectorOption[] {
  return [...new Set(values)].sort().map((value) => ({ value, label: value }));
}

const REPORT_CATEGORIES = [
  "Financial Reports",
  "Accounts Receivable Reports",
  "Claims Reports",
  "Denials Reports",
  "Payments Reports",
  "Patient Reports",
  "Provider Reports",
  "Operational Reports",
];
const DEPARTMENTS = ["Outpatient Clinic", "Urgent Care", "Imaging & Radiology", "Surgical Suite", "Telehealth"];
const PROVIDER_TYPES = ["Physician MD/DO", "Nurse Practitioner NP", "Physician Assistant PA", "Specialist"];
const PATIENT_TYPES = ["New", "Existing"];
const AGE_GROUPS = ["0-17", "18-34", "35-50", "51-64", "65+"];
const GENDERS = ["Female", "Male", "Other"];
const FINANCIAL_CLASSES = ["Commercial PPO", "Commercial HMO", "Medicare Advantage", "Medicaid", "Self-Pay"];
const DENIAL_CATEGORIES = ["Prior Authorization", "Eligibility & Coverage", "Coding & Documentation", "Technical / Timely Filing", "Clinical Necessity"];
const DENIAL_REASONS = [
  "CO-197: Precertification/authorization absent",
  "CO-27: Coverage terminated prior to service date",
  "CO-50: Not deemed medical necessity",
  "CO-16: Lacks information needed for adjudication",
  "CO-97: Included in payment for another service",
  "CO-29: Filing time limit expired",
];

/** Sticky global filter bar shared by every dashboard. */
export function GlobalFilterBar() {
  const {
    filters,
    setPreset,
    setDateType,
    setRange,
    setSelection,
    reset,
    apply,
    savedPresets,
    savePreset,
    loadPreset,
    deletePreset,
  } = useGlobalFilters();
  const [presetName, setPresetName] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const providers = useQuery(rcmQueries.providers());
  const payers = useQuery(rcmQueries.payers());
  const claims = useQuery(rcmQueries.claims());
  const encounters = useQuery(rcmQueries.encounters());
  const balances = useQuery(rcmQueries.patientBalances());
  const practices = useQuery(rcmQueries.practices());

  const options = useMemo<Record<OperationalFilterKey, SelectorOption[]>>(
    () => ({
      provider:
        providers.data?.map((p) => ({
          value: p.id,
          label: p.name,
          description: `${p.specialty} · NPI ${p.npi}`,
        })) ?? [],
      facility: toOptions((claims.data ?? []).map((c) => c.facility)),
      insurance: payers.data?.map((p) => ({ value: p.id, label: p.name })) ?? [],
      location: toOptions(LOCATIONS),
      patient: toOptions((balances.data ?? []).map((b) => b.patient)),
      billingCompany: toOptions(BILLING_COMPANIES),
      cpt: toOptions((encounters.data ?? []).map((e) => e.cptCode)),
      specialty: toOptions((providers.data ?? []).map((p) => p.specialty)),
      practice: practices.data?.map((pr) => ({ value: pr.name, label: pr.name })) ?? [],
      denialCategory: toOptions(DENIAL_CATEGORIES),
      denialReason: toOptions(DENIAL_REASONS),
      financialClass: toOptions(FINANCIAL_CLASSES),
      patientType: toOptions(PATIENT_TYPES),
      ageGroup: toOptions(AGE_GROUPS),
      gender: toOptions(GENDERS),
      providerType: toOptions(PROVIDER_TYPES),
      department: toOptions(DEPARTMENTS),
      reportCategory: toOptions(REPORT_CATEGORIES),
    }),
    [providers.data, payers.data, claims.data, encounters.data, balances.data, practices.data],
  );

  const activeCount = countActiveFilters(filters);
  const rangeLabel = filters.range?.from
    ? filters.range.to
      ? `${format(filters.range.from, "MMM d, yyyy")} – ${format(filters.range.to, "MMM d, yyyy")}`
      : format(filters.range.from, "MMM d, yyyy")
    : "Select dates";

  const exportRows = useMemo(
    () => [
      {
        datePreset: filters.preset,
        dateType: filters.dateType,
        from: filters.range?.from ? format(filters.range.from, "yyyy-MM-dd") : "",
        to: filters.range?.to ? format(filters.range.to, "yyyy-MM-dd") : "",
        search: filters.search,
        ...OPERATIONAL_KEYS.reduce(
          (acc, key) => ({ ...acc, [key]: filters.selections[key].join(" | ") }),
          {},
        ),
      },
    ],
    [filters],
  );

  return (
    <div className="border-t border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.preset} onValueChange={(v) => setPreset(v as never)}>
            <SelectTrigger className="h-10 w-[170px] rounded-xl" aria-label="Date preset">
              <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 justify-start rounded-xl font-normal"
                aria-label="Custom date range"
              >
                {rangeLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={filters.range?.from}
                selected={filters.range}
                onSelect={setRange}
                numberOfMonths={2}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Select value={filters.dateType} onValueChange={(v) => setDateType(v as never)}>
            <SelectTrigger className="h-10 w-[210px] rounded-xl" aria-label="Date type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="mx-1 hidden h-8 lg:block" />

          <GlobalSearch className="w-full min-w-[240px] flex-1 lg:max-w-md" />

          <div className="ml-auto flex items-center gap-2">
            {activeCount > 0 && !isExpanded && (
              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs font-semibold">
                {activeCount} active
              </Badge>
            )}

            <Button
              variant={isExpanded ? "secondary" : "outline"}
              className="h-10 gap-2 rounded-xl font-medium"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse entity filters" : "Expand entity filters"}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{isExpanded ? "Collapse Filters" : "Expand Filters"}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {!isExpanded && (
              <Button
                className="h-10 gap-2 rounded-xl"
                onClick={() => {
                  apply();
                  toast.success("Filters applied");
                }}
              >
                <Check className="h-4 w-4" />
                Apply
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-3 pt-2">
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {OPERATIONAL_KEYS.map((key) => (
                <EntitySelector
                  key={key}
                  label={META[key].label}
                  icon={META[key].icon}
                  options={options[key]}
                  value={filters.selections[key]}
                  onChange={(value) => setSelection(key, value)}
                  placeholder={META[key].placeholder}
                  searchPlaceholder={`Search ${META[key].label.toLowerCase()}…`}
                  className="h-10 w-full"
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
              <div className="flex items-center gap-2">
                {activeCount > 0 ? (
                  <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs font-semibold">
                    {activeCount} active
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 gap-2 rounded-xl">
                      <Bookmark className="h-4 w-4" />
                      Presets
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Saved filter presets</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {savedPresets.length === 0 ? (
                      <p className="px-2 py-3 text-xs text-muted-foreground">No presets saved yet.</p>
                    ) : (
                      savedPresets.map((preset) => (
                        <DropdownMenuItem
                          key={preset.id}
                          onSelect={() => {
                            loadPreset(preset.id);
                            toast.success(`Loaded “${preset.name}”`);
                          }}
                          className="justify-between gap-2"
                        >
                          <span className="truncate">{preset.name}</span>
                          <button
                            type="button"
                            aria-label={`Delete ${preset.name}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              deletePreset(preset.id);
                            }}
                            className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover open={saveOpen} onOpenChange={setSaveOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" aria-label="Save current filters as preset">
                      <Save className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 space-y-2">
                    <p className="text-sm font-medium">Save current filters</p>
                    <Input
                      value={presetName}
                      onChange={(event) => setPresetName(event.target.value)}
                      placeholder="Preset name"
                      className="h-9 rounded-lg"
                    />
                    <Button
                      className="w-full rounded-lg"
                      disabled={!presetName.trim()}
                      onClick={() => {
                        savePreset(presetName.trim());
                        toast.success(`Saved “${presetName.trim()}”`);
                        setPresetName("");
                        setSaveOpen(false);
                      }}
                    >
                      Save preset
                    </Button>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-xl"
                  onClick={() => {
                    reset();
                    toast.info("Filters reset");
                  }}
                >
                  <FilterX className="h-4 w-4" />
                  Reset
                </Button>

                <ExportButton rows={exportRows} fileName="rcm-filters" className="h-10 rounded-xl" />

                <Button
                  className="h-10 gap-2 rounded-xl"
                  onClick={() => {
                    apply();
                    toast.success("Filters applied");
                  }}
                >
                  <Check className="h-4 w-4" />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
