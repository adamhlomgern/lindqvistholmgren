import type { ComponentType } from "react";
import { BackLink } from "@/components/admin/BackLink";
import { Card } from "@/components/ui/Card";
import { MaterialItemRow } from "@/components/customer/MaterialItemRow";
import { ApprovalDecisionForm } from "@/components/customer/ApprovalDecisionForm";
import { approvalStatusClasses, approvalStatusLabels, approvalStatusIcons } from "@/lib/approval-status";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { ProjectApprovalWithItem } from "@/lib/data/approvals";

type Props = {
  approval: ProjectApprovalWithItem;
  projectTitle: string;
  // Both default to the real portal's own paths/form — the public demo
  // overrides them so a visitor's "Godkänn" click can never reach the real
  // decideApproval Server Action, and so the back link stays inside the
  // demo route tree.
  backHref?: string;
  DecisionForm?: ComponentType<{ approvalId: string }>;
};

export function ApprovalView({
  approval,
  projectTitle,
  backHref = `/kund/projekt/${approval.projectId}`,
  DecisionForm = ApprovalDecisionForm,
}: Props) {
  const StatusIcon = approvalStatusIcons[approval.status];

  return (
    <div>
      <BackLink href={backHref} label={projectTitle} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">{approval.title}</h1>
          {approval.versionLabel && <p className="mt-1 text-sm text-stone">Version {approval.versionLabel}</p>}
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${approvalStatusClasses[approval.status]}`}
        >
          <StatusIcon size={12} strokeWidth={2.25} />
          {approvalStatusLabels[approval.status]}
        </span>
      </div>

      {approval.message && <p className="mt-4 whitespace-pre-wrap text-sm text-bone">{approval.message}</p>}
      {approval.dueAt && (
        <p className="mt-2 text-xs text-stone">Svar önskas senast {formatDateSv(approval.dueAt)}</p>
      )}

      <div className="mt-6">
        <MaterialItemRow item={approval.materialItem} />
      </div>

      <Card className="mt-6">
        {approval.status === "pending" ? (
          <DecisionForm approvalId={approval.id} />
        ) : (
          <div>
            <p className="text-sm font-medium text-bone">
              {approval.status === "approved" ? "Godkänd" : "Ändringar begärda"}
              {approval.decidedAt && ` · ${formatRelativeSv(approval.decidedAt)}`}
            </p>
            {approval.decidedByLabel && <p className="mt-1 text-xs text-stone">Av {approval.decidedByLabel}</p>}
            {approval.decisionNote && <p className="mt-3 text-sm text-bone">{approval.decisionNote}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
