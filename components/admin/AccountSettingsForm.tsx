"use client";

import { useActionState } from "react";
import { updateDisplayName, type AccountFormState } from "@/lib/actions/account";

export function AccountSettingsForm({
  email,
  displayName,
  fallbackName,
}: {
  email: string;
  displayName: string;
  fallbackName: string;
}) {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(updateDisplayName, undefined);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="displayName" className="block text-xs font-medium uppercase tracking-label text-stone">
          Visningsnamn i kundchatten
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={displayName}
          placeholder={fallbackName}
          className="mt-2 w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-stone">
          Kunder ser det här namnet som avsändare i portalchatten istället för &quot;{fallbackName}&quot; (härlett
          från {email}). Lämna tomt för att återgå till det.
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
      >
        {pending ? "Sparar…" : "Spara"}
      </button>
      {state?.error && <p className="text-sm text-coral">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald">Sparat.</p>}
    </form>
  );
}
