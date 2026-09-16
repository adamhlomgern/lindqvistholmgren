import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/admin/BackLink";
import { ProjectPhaseIndicator } from "@/components/customer/ProjectPhaseIndicator";
import { MilestoneStatus } from "@/components/customer/MilestoneStatus";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { approvalStatusClasses, approvalStatusIcons, approvalStatusLabels } from "@/lib/approval-status";
import { getNextStepOwnerLabel } from "@/lib/project-phase";
import { formatRelativeSv } from "@/lib/format";
import type { ClientProjectWithCustomer, ProjectApproval } from "@/lib/types";

// hrefBase defaults to the real portal's own prefix — the admin "Kundvy"
// preview passes its own subtree so back/approval links stay inside the
// preview instead of dropping the admin into the real (auth-gated) customer
// route tree.
type Props = {
  project: ClientProjectWithCustomer;
  approvals: ProjectApproval[];
  hrefBase?: string;
};

export function ProjectDetailView({ project, approvals, hrefBase = "/kund" }: Props) {
  const StatusIcon = statusIcons[project.status];

  return (
    <div>
      <BackLink href={`${hrefBase}/projekt`} label="Alla projekt" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">{project.title}</h1>
          {project.assignee && <p className="mt-1 text-sm text-stone">Ansvarig: {project.assignee.name}</p>}
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
        >
          <StatusIcon size={12} strokeWidth={2.25} />
          {statusLabels[project.status]}
        </span>
      </div>

      <Card className="mt-6">
        <ProjectPhaseIndicator project={project} />

        <div className="mt-4 flex flex-col gap-4 border-t border-bone/10 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-stone/65">Vad händer nu?</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-bone">
              {project.customerUpdate || "Ingen uppdatering ännu."}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-stone/65">Nästa steg</p>
            <div className="mt-1.5">
              <MilestoneStatus project={project} hrefBase={hrefBase} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-bone/10 pt-3">
          <Tag>{getNextStepOwnerLabel(project.status)}</Tag>
          {project.customerUpdateAt && (
            <span className="text-xs text-stone/60">
              Senast uppdaterat {formatRelativeSv(project.customerUpdateAt)}
            </span>
          )}
        </div>
      </Card>

      {approvals.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <h2 className="font-display text-sm font-bold text-bone">Godkännanden</h2>
          {approvals.map((approval) => {
            const ApprovalIcon = approvalStatusIcons[approval.status];
            return (
              <Link
                key={approval.id}
                href={`${hrefBase}/projekt/${project.id}/godkannande/${approval.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-bone/10 px-4 py-3 transition-colors hover:bg-bone/5"
              >
                <span className="text-sm font-medium text-bone">{approval.title}</span>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${approvalStatusClasses[approval.status]}`}
                >
                  <ApprovalIcon size={12} strokeWidth={2.25} />
                  {approvalStatusLabels[approval.status]}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
