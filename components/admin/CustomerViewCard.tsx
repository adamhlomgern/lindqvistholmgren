"use client";

import { useActionState, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { PhaseListEditor } from "@/components/admin/PhaseListEditor";
import { ProjectPhaseIndicator } from "@/components/customer/ProjectPhaseIndicator";
import { updateCustomerView, type ClientProjectFormState } from "@/lib/actions/client-projects";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { AwaitingCustomerType, ClientProjectWithCustomer } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";
const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";
const labelClasses = "block text-xs font-medium uppercase tracking-label text-stone";

const awaitingTypeOptions: { value: AwaitingCustomerType; label: string }[] = [
  { value: "project", label: "Visa projekt" },
  { value: "material", label: "Ladda upp material" },
  { value: "message", label: "Öppna meddelande" },
];

// Everything the customer sees on their overview/project page for this
// project, editable right here — no detour through the big "Redigera
// projekt"-formulär (that form now only holds internal grunduppgifter).
export function CustomerViewCard({ project }: { project: ClientProjectWithCustomer }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <CustomerViewForm project={project} onDone={() => setEditing(false)} />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-bone">
          <Users size={14} className="text-lavender" />
          Kundvy
        </h2>
        <button type="button" onClick={() => setEditing(true)} className="text-xs font-medium text-emerald hover:underline">
          Redigera
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {project.phaseLabels && project.phaseLabels.length > 0 && <ProjectPhaseIndicator project={project} />}

        <div>
          <p className="whitespace-pre-wrap text-sm text-stone">
            {project.customerUpdate || "Ingen statusuppdatering satt ännu — kunden ser ingen uppdatering."}
          </p>
          {project.customerUpdateAt && (
            <p className="mt-1 text-xs text-stone/60">Uppdaterat {formatRelativeSv(project.customerUpdateAt)}</p>
          )}
        </div>

        <div>
          <span className={labelClasses}>Nästa milstolpe</span>
          <p className="mt-1 text-sm text-bone">
            {project.nextMilestoneLabel ? (
              <>
                {project.nextMilestoneLabel}
                {project.nextMilestoneDate && (
                  <span className="text-stone"> · {formatDateSv(project.nextMilestoneDate)}</span>
                )}
                {project.nextMilestoneDelivered && <span className="text-emerald"> · Levererad</span>}
              </>
            ) : (
              <span className="text-stone">Ingen satt.</span>
            )}
          </p>
        </div>

        <div>
          <span className={labelClasses}>Väntar på kund</span>
          <p className="mt-1 text-sm text-bone">
            {project.awaitingCustomerLabel || <span className="text-stone">Inget just nu.</span>}
            {project.awaitingCustomerDue && (
              <span className="text-stone"> · Svar senast {formatDateSv(project.awaitingCustomerDue)}</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}

function CustomerViewForm({ project, onDone }: { project: ClientProjectWithCustomer; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ClientProjectFormState, FormData>(
    updateCustomerView.bind(null, project.id),
    undefined,
  );

  const [phaseLabels, setPhaseLabels] = useState<string[]>(project.phaseLabels ?? []);
  const [phaseCurrent, setPhaseCurrent] = useState(project.phaseCurrent ?? 0);
  const [awaitingCustomerLabel, setAwaitingCustomerLabel] = useState(project.awaitingCustomerLabel ?? "");

  // useActionState has no built-in "succeeded" signal — a settled call with
  // no error is the only way to tell the save went through, so that's what
  // closes the form back to the read view.
  useEffect(() => {
    if (!pending && state === undefined) return;
    if (!pending && !state?.error) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when a submit settles, not on every onDone identity change
  }, [pending, state]);

  return (
    <Card>
      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-bone">
            <Users size={14} className="text-lavender" />
            Kundvy
          </h2>
        </div>

        <div>
          <span className={labelClasses}>Faser (valfritt)</span>
          <div className="mt-2">
            <PhaseListEditor labels={phaseLabels} current={phaseCurrent} onChange={(labels, current) => {
              setPhaseLabels(labels);
              setPhaseCurrent(current);
            }} />
          </div>
          <input type="hidden" name="phaseLabels" value={phaseLabels.map((l) => l.trim()).filter(Boolean).join(",")} readOnly />
          <input type="hidden" name="phaseCurrent" value={phaseCurrent} readOnly />
          <p className="mt-2 text-xs text-stone">Lämna listan tom för ingen fasindikator.</p>
        </div>

        <div>
          <span className={labelClasses}>Statusuppdatering till kunden</span>
          <textarea
            name="customerUpdate"
            defaultValue={project.customerUpdate}
            rows={3}
            placeholder="Vad ser kunden på sin startsida? T.ex. 'Vi jobbar just nu på den nya startsidan och siktar på ett första utkast till fredag.'"
            className={`mt-2 ${inputClasses}`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className={labelClasses}>Nästa milstolpe</span>
            <input
              name="nextMilestoneLabel"
              defaultValue={project.nextMilestoneLabel}
              placeholder="T.ex. Första designförslaget"
              className={`mt-2 ${inputClasses}`}
            />
          </div>
          <div>
            <span className={labelClasses}>Planerat datum</span>
            <input
              type="date"
              name="nextMilestoneDate"
              defaultValue={project.nextMilestoneDate}
              className={`mt-2 ${inputClasses}`}
            />
          </div>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-bone">
          <input
            type="checkbox"
            name="nextMilestoneDelivered"
            defaultChecked={project.nextMilestoneDelivered}
            className="h-4 w-4 rounded border-bone/20 bg-bone/5 accent-emerald"
          />
          Milstolpen är levererad — kunden kan granska den
        </label>

        <div>
          <span className={labelClasses}>Behöver kunden göra något just nu? (valfritt)</span>
          <input
            name="awaitingCustomerLabel"
            value={awaitingCustomerLabel}
            onChange={(event) => setAwaitingCustomerLabel(event.target.value)}
            placeholder="T.ex. Granska logotypförslaget"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        {awaitingCustomerLabel.trim() && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className={labelClasses}>Typ av handling</span>
              <div className="mt-2">
                <Select
                  name="awaitingCustomerType"
                  defaultValue={project.awaitingCustomerType ?? "project"}
                  className={selectClasses}
                  options={awaitingTypeOptions}
                />
              </div>
            </div>
            <div>
              <span className={labelClasses}>Sista svarsdatum (valfritt)</span>
              <input
                type="date"
                name="awaitingCustomerDue"
                defaultValue={project.awaitingCustomerDue}
                className={`mt-2 ${inputClasses}`}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-bone/10 pt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            {pending ? "Sparar…" : "Spara"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-medium text-stone transition-colors hover:text-bone"
          >
            Avbryt
          </button>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        </div>
      </form>
    </Card>
  );
}
