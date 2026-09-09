import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { formatDateSv } from "@/lib/format";
import type { ClientProjectWithCustomer } from "@/lib/types";

export function CustomerActiveProjectsCard({ projects }: { projects: ClientProjectWithCustomer[] }) {
  return (
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Aktiva projekt</h2>

      {projects.length === 0 ? (
        <p className="mt-3 text-sm text-stone">Inget aktivt projekt just nu.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1">
          {projects.map((project) => {
            const StatusIcon = statusIcons[project.status];
            return (
              <Link
                key={project.id}
                href={`/admin/projekt/${project.id}`}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-bone/[0.06]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-bone">{project.title}</p>
                  <p className="text-xs text-stone">
                    {project.deadline ? `Deadline ${formatDateSv(project.deadline)}` : "Inget deadline satt"}
                  </p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
                >
                  <StatusIcon size={12} strokeWidth={2.25} />
                  {statusLabels[project.status]}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
