"use client";

import { useActionState } from "react";
import type { BillingEntity } from "@/lib/types";
import {
  createBillingEntity,
  updateBillingEntity,
  type BillingFormState,
} from "@/lib/actions/billing";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function BillingEntityForm({ entity }: { entity?: BillingEntity }) {
  const isEditing = Boolean(entity);
  const action = isEditing ? updateBillingEntity.bind(null, entity!.id) : createBillingEntity;
  const [state, formAction, pending] = useActionState<BillingFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Namn">
        <input name="name" defaultValue={entity?.name} required className={inputClasses} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-post">
          <input name="email" type="email" defaultValue={entity?.email} className={inputClasses} />
        </Field>
        <Field label="Telefon">
          <input name="phone" defaultValue={entity?.phone} className={inputClasses} />
        </Field>
      </div>
      <Field label="Adress">
        <input name="address" defaultValue={entity?.address} className={inputClasses} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Postnummer">
          <input name="postalCode" defaultValue={entity?.postalCode} className={inputClasses} />
        </Field>
        <Field label="Ort">
          <input name="city" defaultValue={entity?.city} className={inputClasses} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organisationsnummer">
          <input name="orgNumber" defaultValue={entity?.orgNumber} className={inputClasses} />
        </Field>
        <Field label="Webbsida">
          <input
            name="website"
            defaultValue={entity?.website}
            placeholder="dindomän.se"
            className={inputClasses}
          />
        </Field>
      </div>
      <Field label="Momsregistreringsnummer">
        <input
          name="vatNumber"
          defaultValue={entity?.vatNumber}
          placeholder="SE..."
          className={inputClasses}
        />
      </Field>
      <Field label="Betalningsvillkor (visas längst ner på fakturan)">
        <textarea
          name="paymentTerms"
          defaultValue={entity?.paymentTerms}
          rows={3}
          placeholder="Betalningsvillkor 10 dagar netto. Vid försenad betalning debiteras dröjsmålsränta enligt räntelagen (referensränta + 8 procentenheter) samt påminnelseavgift 60 kr."
          className={inputClasses}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-bone">
          <input
            type="checkbox"
            name="fSkatt"
            defaultChecked={entity?.fSkatt ?? false}
            className="h-4 w-4 rounded border-bone/20 bg-bone/5 accent-emerald"
          />
          Godkänd för F-skatt (visas på fakturan)
        </label>
        <label className="flex items-center gap-2 text-sm text-bone">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={entity?.isDefault ?? false}
            className="h-4 w-4 rounded border-bone/20 bg-bone/5 accent-emerald"
          />
          Förvald firma vid ny faktura
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa firma"}
        </button>
      </div>
    </form>
  );
}
