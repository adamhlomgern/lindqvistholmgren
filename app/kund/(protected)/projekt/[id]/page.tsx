import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getProjectApprovals } from "@/lib/data/approvals";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/admin/BackLink";
import { ProjectPhaseIndicator } from "@/components/customer/ProjectPhaseIndicator";
import { MilestoneStatus } from "@/components/customer/MilestoneStatus";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { approvalStatusClasses, approvalStatusIcons, approvalStatusLabels } from "@/lib/approval-status";
import { getNextStepOwnerLabel } from "@/lib/project-phase";
import { formatRelativeSv } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerProjectDetailRoute({ params }: Props) {
  const { id } = await params;
  const { customerId } = await verifyCustomerSession();
  const [project, approvals] = await Promise.all([getClientProjectById(id), getProjectApprovals(id)]);

  // A project id alone isn't enough — it must also belong to the logged-in
  // customer, same pattern as requireCustomerAccess elsewhere.
  if (!project || project.customerId !== customerId) {
    notFound();
  }

  const StatusIcon = statusIcons[project.status];

  return (
    <div>
      <BackLink href="/kund/projekt" label="Alla projekt" />

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
              <MilestoneStatus project={project} />
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
                href={`/kund/projekt/${project.id}/godkannande/${approval.id}`}
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
