"use client";

import { useActionState } from "react";
import type { BankAccount } from "@/lib/types";
import { createBankAccount, updateBankAccount, type BillingFormState } from "@/lib/actions/billing";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:opacity-50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">{label}</span>
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

      <label className="flex items-center gap-2 text-sm text-fg">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={account?.isDefault ?? false}
          className="h-4 w-4 rounded border-line-strong bg-fg/5 accent-primary"
        />
        Förvalt konto vid ny faktura
      </label>

      <div className="flex flex-col gap-3 border-t border-line pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa bankkonto"}
        </button>
      </div>
    </form>
  );
}
