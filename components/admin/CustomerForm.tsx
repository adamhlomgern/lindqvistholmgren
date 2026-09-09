"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import type { Customer } from "@/lib/types";
import { createCustomer, updateCustomer, type CustomerFormState } from "@/lib/actions/customers";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold text-bone">{title}</h2>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

type CustomerFormProps = { customer?: Customer; onSaved?: () => void; onCancel?: () => void };

// Notes live on the same "customers" row but are edited separately (see
// CustomerNotesCard) — keeping them out of this form means the contact/
// address side panel can never accidentally wipe them by submitting an
// empty notes field.
export function CustomerForm({ customer, onSaved, onCancel }: CustomerFormProps) {
  const isEditing = Boolean(customer);
  const action = isEditing ? updateCustomer.bind(null, customer!.id) : createCustomer;
  const [state, formAction, pending] = useActionState<CustomerFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSaved?.();
    // onSaved is expected to be a stable callback (or the caller accepts a
    // re-run on identity change) — omitting it from deps avoids re-firing
    // this effect on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="divide-y divide-bone/10 [&>*+*]:pt-6 [&>*:not(:last-child)]:pb-6">
        <Section title="Kontaktuppgifter">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Namn">
              <input name="name" defaultValue={customer?.name} required className={inputClasses} />
            </Field>
            <Field label="Företag (valfritt)">
              <input name="company" defaultValue={customer?.company} className={inputClasses} />
            </Field>
            <Field label="E-post">
              <input
                name="email"
                type="email"
                defaultValue={customer?.email}
                className={inputClasses}
              />
            </Field>
            <Field label="Telefon">
              <input name="phone" defaultValue={customer?.phone} className={inputClasses} />
            </Field>
          </div>
        </Section>

        <Section title="Adress">
          <Field label="Gatuadress">
            <input name="address" defaultValue={customer?.address} className={inputClasses} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Postnummer">
              <input name="postalCode" defaultValue={customer?.postalCode} className={inputClasses} />
            </Field>
            <Field label="Ort">
              <input name="city" defaultValue={customer?.city} className={inputClasses} />
            </Field>
          </div>
        </Section>

        <Section title="Övrigt">
          <Field label="Organisationsnummer (valfritt)">
            <input name="orgNumber" defaultValue={customer?.orgNumber} className={inputClasses} />
          </Field>
        </Section>
      </div>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa kund"}
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
        </div>
      </div>
    </form>
  );
}
