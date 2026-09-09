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
