"use client";

import { useActionState } from "react";
import type { BankAccount } from "@/lib/types";
import { createBankAccount, updateBankAccount, type BillingFormState } from "@/lib/actions/billing";

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

export function BankAccountForm({ account }: { account?: BankAccount }) {
  const isEditing = Boolean(account);
  const action = isEditing ? updateBankAccount.bind(null, account!.id) : createBankAccount;
  const [state, formAction, pending] = useActionState<BillingFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Namn (visas i väljaren)">
        <input
          name="label"
          defaultValue={account?.label}
          placeholder="T.ex. ICA-Banken (privat)"
          required
          className={inputClasses}
        />
      </Field>
      <Field label="Kontonummer">
        <input name="kontonummer" defaultValue={account?.kontonummer} required className={inputClasses} />
      </Field>
      <Field label="Bank">
        <input name="bank" defaultValue={account?.bank} className={inputClasses} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-bone">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={account?.isDefault ?? false}
          className="h-4 w-4 rounded border-bone/20 bg-bone/5 accent-emerald"
        />
        Förvalt konto vid ny faktura
      </label>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa bankkonto"}
        </button>
      </div>
    </form>
  );
}
