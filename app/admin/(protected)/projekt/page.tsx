import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { getClientProjects } from "@/lib/data/client-projects";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import { activeStatusOrder, statusClasses, statusIcons, statusLabels } from "@/lib/project-status";

export default async function AdminClientProjectsPage() {
  const projects = await getClientProjects();
  const active = projects
    .filter((p) => p.status !== "klar")
    .sort((a, b) => activeStatusOrder.indexOf(a.status) - activeStatusOrder.indexOf(b.status));
  const done = projects.filter((p) => p.status === "klar");

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">Projekt</h1>
          <p className="mt-1 text-sm text-stone">{active.length} aktiva projekt.</p>
        </div>
        <Link
          href="/admin/projekt/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nytt projekt
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <BriefcaseBusiness size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga projekt ännu.</p>
          <Link href="/admin/projekt/ny" className="mt-1 text-sm font-medium text-emerald hover:underline">
            Skapa ditt första projekt
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {active.length > 0 && (
            <div className="flex flex-col gap-3">
              {active.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          )}
          {done.length > 0 && (
            <CollapsibleSection label="Klara projekt" count={done.length}>
              {done.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectRow({
  project,
}: {
  project: Awaited<ReturnType<typeof getClientProjects>>[number];
}) {
  const isOverdue =
    project.deadline && project.status !== "klar" && project.deadline < new Date().toISOString().slice(0, 10);
  const StatusIcon = statusIcons[project.status];

  return (
    <Link href={`/admin/projekt/${project.id}`} className="block">
      <Card className={`transition-colors hover:bg-bone/[0.08] ${project.status === "klar" ? "opacity-70" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-bone">{project.title}</p>
            <p className="mt-0.5 text-sm text-stone">
              {project.customer ? project.customer.company || project.customer.name : "Ingen kund kopplad"}
            </p>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[project.status]}`}
          >
            <StatusIcon size={12} strokeWidth={2.25} />
            {statusLabels[project.status]}
          </span>
        </div>

        {project.overview && <p className="mt-2 line-clamp-2 text-sm text-stone">{project.overview}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-bone/10 pt-3 text-xs">
          {project.nextTask ? (
            <span className="flex min-w-0 items-center gap-1.5 text-bone">
              <ArrowRight size={12} strokeWidth={2.25} className="shrink-0 text-peach" />
              <span className="truncate">{project.nextTask}</span>
            </span>
          ) : project.checklistTotal > 0 ? (
            <span className="text-stone">Allt avklarat</span>
          ) : (
            <span className="text-stone">Ingen att göra-lista ännu</span>
          )}
          {project.checklistTotal > 0 && (
            <span className="shrink-0 text-stone">
              {project.checklistDone} av {project.checklistTotal} klara
            </span>
          )}
          {project.deadline && (
            <span className={`shrink-0 ${isOverdue ? "font-medium text-coral" : "text-stone"}`}>
              {isOverdue ? "Försenad · " : "Deadline "}
              {formatDateSv(project.deadline)}
            </span>
          )}
          <span className="shrink-0 text-stone/70">Uppdaterad {formatRelativeSv(project.updatedAt)}</span>
        </div>
      </Card>
    </Link>
  );
}
