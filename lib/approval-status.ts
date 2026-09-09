import { CheckCircle2, Clock, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import type { ApprovalStatus } from "@/lib/types";

export const approvalStatusLabels: Record<ApprovalStatus, string> = {
  pending: "Väntar på svar",
  approved: "Godkänd",
  changes_requested: "Ändringar begärda",
};

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
