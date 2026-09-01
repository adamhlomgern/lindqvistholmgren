import { CalendarClock, CheckCircle2, Circle, MessageCircleQuestion, PauseCircle, type LucideIcon } from "lucide-react";
import type { ClientProjectStatus } from "@/lib/types";

export const statusLabels: Record<ClientProjectStatus, string> = {
  planerat: "Planerat",
  pagaende: "Pågående",
  vantar_pa_kund: "Väntar på kund",
  pausat: "Pausat",
  klar: "Klart",
};

// Pill colors per status — status is state, not identity, so this
// intentionally reuses the app's status-accent classes rather than the
// categorical entity-color palette used elsewhere in admin.
export const statusClasses: Record<ClientProjectStatus, string> = {
  planerat: "bg-bone/10 text-bone",
  pagaende: "bg-sky/15 text-sky",
  vantar_pa_kund: "bg-peach/15 text-peach",
  pausat: "bg-bone/5 text-stone",
  klar: "bg-emerald/15 text-emerald",
};

// One icon per status so the badge reads at a glance, not just by color —
// color alone is a weak signal for anyone scanning quickly or color-blind.
export const statusIcons: Record<ClientProjectStatus, LucideIcon> = {
  planerat: Circle,
  pagaende: CalendarClock,
  vantar_pa_kund: MessageCircleQuestion,
  pausat: PauseCircle,
  klar: CheckCircle2,
};

// Most-actionable first, for sorting the active-project list.
export const activeStatusOrder: ClientProjectStatus[] = ["vantar_pa_kund", "pagaende", "planerat", "pausat"];
