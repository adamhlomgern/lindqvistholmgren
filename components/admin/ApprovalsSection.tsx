"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApprovalRequestDialog } from "@/components/admin/ApprovalRequestDialog";
import { cancelApprovalRequest } from "@/lib/actions/approvals";
import { approvalStatusClasses, approvalStatusLabels, approvalStatusIcons } from "@/lib/approval-status";
import { formatDateSv } from "@/lib/format";
import type { MaterialItem, ProjectApproval } from "@/lib/types";

type Props = {
  projectId: string;
  customerId?: string;
  approvals: ProjectApproval[];
  materialItems: (MaterialItem & { folderPath: string })[];
};

export function ApprovalsSection({ projectId, customerId, approvals, materialItems }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">
          Godkännanden {approvals.length > 0 && <span className="text-stone">({approvals.length})</span>}
        </h2>
        {customerId && (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="rounded-full bg-bone/10 px-3.5 py-1.5 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
          >
            Begär godkännande
          </button>
        )}
      </div>

      {approvals.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-bone/15 px-6 py-10 text-center">
          <CheckCircle2 size={20} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">
            {customerId
              ? "Begär godkännande av en leverans från materialbiblioteket."
              : "Koppla en kund till projektet för att begära godkännanden."}
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {approvals.map((approval) => {
            const StatusIcon = approvalStatusIcons[approval.status];
            return (
              <div key={approval.id} className="rounded-xl border border-bone/10 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bone">
                      {approval.title}
                      {approval.versionLabel && <span className="text-stone"> · {approval.versionLabel}</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-stone">
                      Begärt {formatDateSv(approval.requestedAt)}
                      {approval.dueAt && ` · Svar önskas senast ${formatDateSv(approval.dueAt)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${approvalStatusClasses[approval.status]}`}
                    >
                      <StatusIcon size={12} strokeWidth={2.25} />
                      {approvalStatusLabels[approval.status]}
                    </span>
                    {approval.status === "pending" && (
                      <ConfirmDialog
                        trigger={
                          <button
                            type="button"
                            aria-label="Avbryt begäran"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-stone/70 transition-colors hover:bg-coral/10 hover:text-coral"
                          >
                            <X size={14} strokeWidth={2.25} />
                          </button>
                        }
                        title={`Avbryt begäran "${approval.title}"?`}
                        confirmLabel="Avbryt begäran"
                        destructive
                        onConfirm={() =>
                          cancelApprovalRequest(approval.id, projectId, approval.customerId)
                        }
                      />
                    )}
                  </div>
                </div>
                {approval.decisionNote && (
                  <p className="mt-2 rounded-lg bg-bone/5 px-3 py-2 text-xs text-stone">{approval.decisionNote}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {customerId && (
        <ApprovalRequestDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          projectId={projectId}
          customerId={customerId}
          materialItems={materialItems}
        />
      )}
    </Card>
  );
}
