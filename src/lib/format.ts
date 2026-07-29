export function formatCurrency(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMetric(value: number, format: "currency" | "number" | "percent" | "days") {
  switch (format) {
    case "currency":
      return formatCurrency(value, true);
    case "percent":
      return formatPercent(value);
    case "days":
      return `${value.toFixed(1)} days`;
    default:
      return formatNumber(value);
  }
}
