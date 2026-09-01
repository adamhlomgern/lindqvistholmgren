"use client";

import { useActionState, type ReactNode } from "react";
import type { BillingEntity, ClientProjectWithCustomer, Customer } from "@/lib/types";
import { Select } from "@/components/ui/Select";
import {
  createClientProject,
  updateClientProject,
  type ClientProjectFormState,
} from "@/lib/actions/client-projects";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";
const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

type ClientProjectFormProps = {
  project?: ClientProjectWithCustomer;
  customers: Customer[];
  billingEntities: BillingEntity[];
  onCancel?: () => void;
};

export function ClientProjectForm({ project, customers, billingEntities, onCancel }: ClientProjectFormProps) {
  const isEditing = Boolean(project);
  const action = isEditing ? updateClientProject.bind(null, project!.id) : createClientProject;
  const [state, formAction, pending] = useActionState<ClientProjectFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Titel">
        <input
          name="title"
          defaultValue={project?.title}
          required
          placeholder="T.ex. Ny logga till Kund AB"
          className={inputClasses}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Kund (valfritt)">
          <Select
            name="customerId"
            defaultValue={project?.customerId}
            placeholder="Ingen kund vald"
            className={selectClasses}
            options={customers.map((customer) => ({
              value: customer.id,
              label: customer.company ? `${customer.name} (${customer.company})` : customer.name,
            }))}
          />
        </Field>
        <Field label="Ansvarig (valfritt)">
          <Select
            name="assigneeEntityId"
            defaultValue={project?.assigneeEntityId}
            placeholder="Ingen vald"
            className={selectClasses}
            options={billingEntities.map((entity) => ({ value: entity.id, label: entity.name }))}
          />
        </Field>
      </div>
      <Field label="Deadline (valfritt)">
        <input type="date" name="deadline" defaultValue={project?.deadline} className={inputClasses} />
      </Field>
      <Field label="Anteckningar">
        <textarea name="notes" defaultValue={project?.notes} rows={4} className={inputClasses} />
      </Field>

      <div className="flex items-center gap-3 border-t border-bone/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa projekt"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-stone transition-colors hover:text-bone"
          >
            Avbryt
          </button>
        )}
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
      </div>
    </form>
  );
}
