import Link from "next/link";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { getClientProjectListItemsByCustomerId } from "@/lib/data/client-projects";
import { ProjectRow } from "@/components/admin/ProjectRow";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { activeStatusOrder } from "@/lib/project-status";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerProjectsTab({ params }: Props) {
  const { id } = await params;
  const projects = await getClientProjectListItemsByCustomerId(id);
  const active = projects
    .filter((p) => p.status !== "klar")
    .sort((a, b) => activeStatusOrder.indexOf(a.status) - activeStatusOrder.indexOf(b.status));
  const done = projects.filter((p) => p.status === "klar");

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
        <BriefcaseBusiness size={24} strokeWidth={2} className="text-stone" />
        <p className="text-sm text-stone">Inga projekt kopplade till kunden ännu.</p>
        <Link
          href={`/admin/projekt/ny?customer=${id}`}
          className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald hover:underline"
        >
          <Plus size={14} strokeWidth={2.5} />
          Skapa ett projekt
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {active.length > 0 && (
        <div className="flex flex-col gap-3">
          {active.map((project) => (
            <ProjectRow key={project.id} project={project} showCustomer={false} />
          ))}
        </div>
      )}
      {done.length > 0 && (
        <CollapsibleSection label="Klara projekt" count={done.length}>
          {done.map((project) => (
            <ProjectRow key={project.id} project={project} showCustomer={false} />
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}
