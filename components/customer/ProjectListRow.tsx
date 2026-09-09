import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { getMilestoneState } from "@/lib/project-phase";
import { formatDateSv } from "@/lib/format";
import type { ClientProjectWithCustomer } from "@/lib/types";

type Props = { project: ClientProjectWithCustomer };

// Customer-facing project row — deliberately its own component rather than
// reusing admin's ProjectRow, which surfaces internal checklist items
// (task labels never meant for the customer to see).
export function ProjectListRow({ project }: Props) {
  const StatusIcon = statusIcons[project.status];
  const milestoneState = getMilestoneState(project);

  return (
    <Link href={`/kund/projekt/${project.id}`} className="block">
      <Card className={`transition-colors hover:bg-bone/[0.08] ${project.status === "klar" ? "opacity-70" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-bone">{project.title}</p>
            {project.assignee && <p className="mt-0.5 text-sm text-stone">Ansvarig: {project.assignee.name}</p>}
          </div>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[project.status]}`}
          >
            <StatusIcon size={12} strokeWidth={2.25} />
            {statusLabels[project.status]}
          </span>
        </div>

        {milestoneState !== "none" && (
          <p className="mt-3 border-t border-bone/10 pt-3 text-xs text-stone">
            {milestoneState === "delivered" && `${project.nextMilestoneLabel} finns att granska`}
            {milestoneState === "planned" &&
              `${project.nextMilestoneLabel}${project.nextMilestoneDate ? ` · planerad ${formatDateSv(project.nextMilestoneDate)}` : ""}`}
            {milestoneState === "overdue" && (
              <span className="text-coral">Planerat datum har passerat — ny tidsplan inväntas</span>
            )}
          </p>
        )}
      </Card>
    </Link>
  );
}
