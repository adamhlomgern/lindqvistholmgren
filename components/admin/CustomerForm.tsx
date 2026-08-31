"use client";

import { useActionState, type ReactNode } from "react";
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
    <div className="border-t border-bone/10 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-sm font-bold text-bone">{title}</h2>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

type CustomerFormProps = { customer?: Customer };

export function CustomerForm({ customer }: CustomerFormProps) {
  const isEditing = Boolean(customer);
  const action = isEditing ? updateCustomer.bind(null, customer!.id) : createCustomer;
  const [state, formAction, pending] = useActionState<CustomerFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
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
        <Field label="Anteckningar">
          <textarea name="notes" defaultValue={customer?.notes} rows={3} className={inputClasses} />
        </Field>
      </Section>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa kund"}
        </button>
      </div>
    </form>
  );
}
