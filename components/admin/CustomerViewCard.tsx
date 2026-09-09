import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { ClientProjectWithCustomer } from "@/lib/types";

// Read-only mirror of what the customer sees on their overview page for this
// project ("Kundvy" in the edit form) — lets admin sanity-check what's being
// shown before a customer notices something stale.
export function CustomerViewCard({
  project,
  onEdit,
}: {
  project: ClientProjectWithCustomer;
  onEdit: () => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-bone">
          <Users size={14} className="text-lavender" />
          Kundvy
        </h2>
        <button type="button" onClick={onEdit} className="text-xs font-medium text-emerald hover:underline">
          Redigera
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        <div>
          <p className="whitespace-pre-wrap text-sm text-stone">
            {project.customerUpdate || "Ingen statusuppdatering satt ännu — kunden ser ingen uppdatering."}
          </p>
          {project.customerUpdateAt && (
            <p className="mt-1 text-xs text-stone/60">Uppdaterat {formatRelativeSv(project.customerUpdateAt)}</p>
          )}
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-label text-stone">Nästa milstolpe</span>
          <p className="mt-1 text-sm text-bone">
            {project.nextMilestoneLabel ? (
              <>
                {project.nextMilestoneLabel}
                {project.nextMilestoneDate && (
                  <span className="text-stone"> · {formatDateSv(project.nextMilestoneDate)}</span>
                )}
              </>
            ) : (
              <span className="text-stone">Ingen satt.</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
