import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ProjectPhaseIndicator } from "@/components/customer/ProjectPhaseIndicator";
import { MilestoneStatus } from "@/components/customer/MilestoneStatus";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { getNextStepOwnerLabel } from "@/lib/project-phase";
import { formatRelativeSv } from "@/lib/format";
import type { ClientProjectWithCustomer } from "@/lib/types";

// hrefBase defaults to the real portal's own prefix — the public demo
// passes its own subtree so "Visa projekt" stays inside the demo.
type Props = { project: ClientProjectWithCustomer; hrefBase?: string };

// Everything about one active project lives in a single card — phase,
// status, the latest word from us, and what happens next — so nothing about
// the same piece of work ends up scattered across separate cards.
export function ProjectOverviewCard({ project, hrefBase = "/kund" }: Props) {
  const StatusIcon = statusIcons[project.status];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-bone">{project.title}</p>
          {project.assignee && <p className="mt-0.5 text-sm text-stone">Ansvarig: {project.assignee.name}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
          >
            <StatusIcon size={12} strokeWidth={2.25} />
            {statusLabels[project.status]}
          </span>
          <Link
            href={`${hrefBase}/projekt/${project.id}`}
            className="flex items-center gap-1 text-sm font-medium text-emerald hover:underline"
          >
            Visa projekt
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <ProjectPhaseIndicator project={project} />
      </div>

      <div className="mt-4 grid gap-4 border-t border-bone/10 pt-4 sm:grid-cols-2">
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
          <span className="text-xs text-stone/60">Senast uppdaterat {formatRelativeSv(project.customerUpdateAt)}</span>
        )}
      </div>
    </Card>
  );
}
