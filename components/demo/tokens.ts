// Shared visual vocabulary for every demo app shell (see globals.css for the
// --color-demo-* custom properties this maps to). Keep this file product-
// agnostic — Servicekoll-specific meaning (e.g. "overdue" -> "danger") lives
// in the owning feature module, not here.
export type Tone = "primary" | "danger" | "warning" | "info" | "neutral";

export const toneBadgeClasses: Record<Tone, string> = {
  primary: "bg-demo-primary-soft text-demo-primary-soft-text",
  danger: "bg-demo-danger-soft text-demo-danger",
  warning: "bg-demo-warning-soft text-demo-warning",
  info: "bg-demo-info-soft text-demo-info",
  neutral: "bg-demo-neutral-soft text-demo-neutral",
};

export const toneIconClasses: Record<Tone, string> = {
  primary: "text-demo-primary",
  danger: "text-demo-danger",
  warning: "text-demo-warning",
  info: "text-demo-info",
  neutral: "text-demo-neutral",
};

export const toneIconBgClasses: Record<Tone, string> = {
  primary: "bg-demo-primary-soft text-demo-primary-soft-text",
  danger: "bg-demo-danger-soft text-demo-danger",
  warning: "bg-demo-warning-soft text-demo-warning",
  info: "bg-demo-info-soft text-demo-info",
  neutral: "bg-demo-neutral-soft text-demo-neutral",
};
