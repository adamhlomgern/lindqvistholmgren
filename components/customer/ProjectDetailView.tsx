import Link from "next/link";
import { BackLink } from "@/components/admin/BackLink";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ProjectPhaseIndicator } from "@/components/customer/ProjectPhaseIndicator";
import { MilestoneStatus } from "@/components/customer/MilestoneStatus";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { approvalStatusClasses, approvalStatusIcons, approvalStatusLabel } from "@/lib/approval-status";
import { getNextStepOwnerLabel } from "@/lib/project-phase";
import { formatRelativeSv } from "@/lib/format";
import type { ClientProjectWithCustomer, ProjectApproval } from "@/lib/types";

type Props = {
  project: ClientProjectWithCustomer;
  approvals: ProjectApproval[];
  // Defaults to the real portal's own path; the admin "Visa som kund"
  // preview overrides hrefBase (and, when it needs to break out of its own
  // subtree — e.g. back to the project's real admin page — backHref/
  // backLabel/approvalHref individually) so every link stays inside the
  // right preview instead of dropping the admin into the auth-gated
  // customer route tree.
  hrefBase?: string;
  backHref?: string;
  backLabel?: string;
  approvalHref?: (approvalId: string) => string;
};

export function ProjectDetailView({
  project,
  approvals,
  hrefBase = "/kund",
  backHref = `${hrefBase}/projekt`,
  backLabel = "Alla projekt",
  approvalHref = (approvalId) => `${hrefBase}/projekt/${project.id}/godkannande/${approvalId}`,
}: Props) {
  const StatusIcon = statusIcons[project.status];

  return (
    <div>
      <BackLink href={backHref} label={backLabel} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">{project.title}</h1>
          {project.assignee && <p className="mt-1 text-sm text-fg-muted">Ansvarig: {project.assignee.name}</p>}
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

        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-fg-subtle">Vad händer nu?</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-fg">
              {project.customerUpdate || "Ingen uppdatering ännu."}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-fg-subtle">Nästa steg</p>
            <div className="mt-1.5">
              <MilestoneStatus project={project} hrefBase={hrefBase} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <Tag>{getNextStepOwnerLabel(project.status)}</Tag>
          {project.customerUpdateAt && (
            <span className="text-xs text-fg-subtle">
              Senast uppdaterat {formatRelativeSv(project.customerUpdateAt)}
            </span>
          )}
        </div>
      </Card>

      {approvals.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <h2 className="font-display text-sm font-semibold text-fg">Godkännanden</h2>
          {approvals.map((approval) => {
            const ApprovalIcon = approvalStatusIcons[approval.status];
            return (
              <Link
                key={approval.id}
                href={approvalHref(approval.id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 transition-colors hover:bg-fg/5"
              >
                <span className="text-sm font-medium text-fg">{approval.title}</span>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${approvalStatusClasses[approval.status]}`}
                >
                  <ApprovalIcon size={12} strokeWidth={2.25} />
                  {approvalStatusLabel(approval.status, approval.kind)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
