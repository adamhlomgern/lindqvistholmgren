import Link from "next/link";
import { getMilestoneState } from "@/lib/project-phase";
import { formatDateSv } from "@/lib/format";
import type { ClientProject } from "@/lib/types";

type Props = {
  project: Pick<ClientProject, "id" | "nextMilestoneLabel" | "nextMilestoneDate" | "nextMilestoneDelivered">;
};

// Never call a passed date "done" on its own — only nextMilestoneDelivered
// (set explicitly by an admin) does that. See lib/project-phase.ts.
export function MilestoneStatus({ project }: Props) {
  const state = getMilestoneState(project);

  if (state === "none") {
    return <p className="text-sm text-stone">Inget bestämt datum just nu.</p>;
  }

  if (state === "delivered") {
    return (
      <div>
        <p className="text-sm text-bone">
          <span className="font-medium">{project.nextMilestoneLabel}</span> finns att granska
        </p>
        <Link href={`/kund/projekt/${project.id}`} className="mt-1 inline-block text-sm text-emerald hover:underline">
          Visa förslag
        </Link>
      </div>
    );
  }

  if (state === "overdue") {
    return (
      <div>
        <p className="text-sm font-medium text-bone">{project.nextMilestoneLabel}</p>
        <p className="mt-0.5 text-sm text-coral">Planerat datum har passerat — ny tidsplan inväntas</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-bone">{project.nextMilestoneLabel}</p>
      <p className="mt-0.5 text-sm text-stone">
        Planerad leverans {project.nextMilestoneDate && formatDateSv(project.nextMilestoneDate)}
      </p>
    </div>
  );
}
