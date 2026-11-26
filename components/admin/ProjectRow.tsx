import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import type { ClientProjectListItem } from "@/lib/types";

// Shared by the main Projekt list and the customer workspace's Projekt tab
// so a project reads identically wherever it's listed.
export function ProjectRow({ project, showCustomer = true }: { project: ClientProjectListItem; showCustomer?: boolean }) {
  const isOverdue =
    project.deadline && project.status !== "klar" && project.deadline < new Date().toISOString().slice(0, 10);
  const StatusIcon = statusIcons[project.status];

  return (
    <Link href={`/admin/projekt/${project.id}`} className="block">
      <Card className={`transition-colors hover:bg-fg/[0.08] ${project.status === "klar" ? "opacity-70" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-fg">{project.title}</p>
            {showCustomer && (
              <p className="mt-0.5 text-sm text-fg-muted">
                {project.customer ? project.customer.company || project.customer.name : "Ingen kund kopplad"}
              </p>
            )}
          </div>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[project.status]}`}
          >
            <StatusIcon size={12} strokeWidth={2.25} />
            {statusLabels[project.status]}
          </span>
        </div>

        {project.overview && <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{project.overview}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-xs">
          {project.nextTask ? (
            <span className="flex min-w-0 items-center gap-1.5 text-fg">
              <ArrowRight size={12} strokeWidth={2.25} className="shrink-0 text-peach" />
              <span className="truncate">{project.nextTask}</span>
            </span>
          ) : project.checklistTotal > 0 ? (
            <span className="text-fg-muted">Allt avklarat</span>
          ) : (
            <span className="text-fg-muted">Ingen att göra-lista ännu</span>
          )}
          {project.checklistTotal > 0 && (
            <span className="shrink-0 text-fg-muted">
              {project.checklistDone} av {project.checklistTotal} klara
            </span>
          )}
          {project.deadline && (
            <span className={`shrink-0 ${isOverdue ? "font-medium text-coral" : "text-fg-muted"}`}>
              {isOverdue ? "Försenad · " : "Deadline "}
              {formatDateSv(project.deadline)}
            </span>
          )}
          <span className="shrink-0 text-fg-subtle">Uppdaterad {formatRelativeSv(project.updatedAt)}</span>
        </div>
      </Card>
    </Link>
  );
}
