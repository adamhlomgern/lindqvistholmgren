import { CalendarClock, CircleDashed, EyeOff, type LucideIcon } from "lucide-react";
import type { ArticleStatus } from "@/lib/types";

export const articleStatusLabels: Record<ArticleStatus, string> = {
  publicerad: "Publicerad",
  utkast: "Utkast",
  schemalagd: "Schemalagd",
  avpublicerad: "Avpublicerad",
};

// "Publicerad" gets no badge at all in the list — it's the default,
// expected state, and a badge on every single card would be more noise
// than signal. The other three statuses are the exceptions worth flagging.
export const articleStatusClasses: Partial<Record<ArticleStatus, string>> = {
  utkast: "bg-ink-100 text-ink-800",
  schemalagd: "bg-blue-100 text-blue-800",
  avpublicerad: "bg-red-100 text-red-800",
};

export const articleStatusIcons: Partial<Record<ArticleStatus, LucideIcon>> = {
  utkast: CircleDashed,
  schemalagd: CalendarClock,
  avpublicerad: EyeOff,
};
