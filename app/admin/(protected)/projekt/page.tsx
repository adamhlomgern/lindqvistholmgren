import Link from "next/link";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { ProjectRow } from "@/components/admin/ProjectRow";
import { getClientProjects } from "@/lib/data/client-projects";
import { activeStatusOrder } from "@/lib/project-status";

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
          <h1 className="font-display text-2xl font-semibold text-fg">Projekt</h1>
          <p className="mt-1 text-sm text-fg-muted">{active.length} aktiva projekt.</p>
        </div>
        <Link
          href="/admin/projekt/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nytt projekt
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <BriefcaseBusiness size={24} strokeWidth={2} className="text-fg-muted" />
          <p className="text-sm text-fg-muted">Inga projekt ännu.</p>
          <Link href="/admin/projekt/ny" className="mt-1 text-sm font-medium text-primary hover:underline">
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
