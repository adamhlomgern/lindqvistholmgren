"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-6">
      <div className="w-full max-w-sm rounded-2xl bg-bone/5 p-8">
        <h1 className="font-display text-xl font-bold text-bone">Logga in</h1>
        <p className="mt-1 text-sm text-stone">Admin för Lindqvist / Holmgren</p>
        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-label text-stone"
            >
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={`${inputClasses} mt-2`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-label text-stone"
            >
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={`${inputClasses} mt-2`}
            />
          </div>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            {pending ? "Loggar in…" : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
}
