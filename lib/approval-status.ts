import { CheckCircle2, Clock, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import type { ApprovalKind, ApprovalStatus } from "@/lib/types";

export const approvalStatusLabels: Record<ApprovalStatus, string> = {
  pending: "Väntar på svar",
  approved: "Godkänd",
  changes_requested: "Ändringar begärda",
};

// A feedback request reuses the same two statuses, but "Godkänd" would be
// misleading when the customer only answered a question or picked a direction.
export function approvalStatusLabel(status: ApprovalStatus, kind: ApprovalKind): string {
  if (kind === "feedback") {
    if (status === "approved") return "Återkoppling skickad";
    if (status === "changes_requested") return "Vill se andra alternativ";
  }
  return approvalStatusLabels[status];
}

export const approvalStatusClasses: Record<ApprovalStatus, string> = {
  pending: "bg-peach/15 text-peach",
  approved: "bg-emerald/15 text-emerald",
  changes_requested: "bg-peach/15 text-peach",
};

export const approvalStatusIcons: Record<ApprovalStatus, LucideIcon> = {
  pending: Clock,
  approved: CheckCircle2,
  changes_requested: MessageCircleQuestion,
};
