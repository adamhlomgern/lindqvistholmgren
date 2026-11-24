"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCustomer } from "@/lib/actions/customer-auth";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export default function CustomerLoginPage() {
  const [state, formAction, pending] = useActionState(loginCustomer, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm rounded-2xl bg-fg/5 p-8">
        <h1 className="font-display text-xl font-semibold text-fg">Logga in</h1>
        <p className="mt-1 text-sm text-fg-muted">Kundportal för Lindqvist / Holmgren</p>
        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-label text-fg-muted"
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
              className="block text-xs font-medium uppercase tracking-label text-fg-muted"
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
            className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {pending ? "Loggar in…" : "Logga in"}
          </button>
        </form>
        <Link
          href="/kund/glomt-losenord"
          className="mt-4 block text-sm text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Glömt lösenord?
        </Link>
      </div>
    </div>
  );
}
