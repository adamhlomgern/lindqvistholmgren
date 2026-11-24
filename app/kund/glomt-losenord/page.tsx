"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestCustomerPasswordReset } from "@/lib/actions/customer-auth";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export default function CustomerForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestCustomerPasswordReset, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm rounded-2xl bg-fg/5 p-8">
        <h1 className="font-display text-xl font-semibold text-fg">Återställ lösenord</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Ange e-postadressen du loggar in med, så skickar vi en länk om kontot finns hos oss.
        </p>

        {state?.message ? (
          <p className="mt-6 text-sm text-primary">{state.message}</p>
        ) : (
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
            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {pending ? "Skickar…" : "Skicka återställningslänk"}
            </button>
          </form>
        )}

        <Link
          href="/kund/login"
          className="mt-6 block text-sm text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Tillbaka till inloggning
        </Link>
      </div>
    </div>
  );
}
