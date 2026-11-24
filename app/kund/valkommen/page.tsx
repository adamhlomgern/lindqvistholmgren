"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { acceptCustomerInvite } from "@/lib/actions/customer-invites";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

type Status = "checking" | "ready" | "expired" | "saving" | "error";

export default function CustomerWelcomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function establishSession() {
      // Links land with the session in the URL hash (#access_token=...).
      // Parsed and set explicitly rather than relying on the client
      // library's automatic detectSessionInUrl: that consumes the hash
      // once and strips it from the URL, which races badly with React
      // Strict Mode's double effect invocation in dev — the second run
      // sees an already-cleared hash and reports "expired" even though
      // the link was perfectly valid. setSession() is idempotent, so
      // running this twice is harmless.
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!sessionError) {
          setStatus("ready");
          return;
        }
      }

      // Newer GoTrue /verify redirects can land with token_hash+type as
      // query params instead of a hash fragment — exchange those explicitly.
      const queryParams = new URLSearchParams(window.location.search);
      const tokenHash = queryParams.get("token_hash");
      const type = queryParams.get("type");
      if (tokenHash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: type as "invite" | "recovery" | "magiclink" | "signup" | "email_change" | "email",
          token_hash: tokenHash,
        });
        if (!verifyError) {
          setStatus("ready");
          return;
        }
      }

      // Fall back to whatever the client's own automatic detection may
      // already have picked up (e.g. outside Strict Mode, in production).
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setStatus(session ? "ready" : "expired");
    }

    establishSession();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setStatus("saving");
    const supabase = createBrowserSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Kunde inte spara lösenordet. Försök igen.");
      setStatus("ready");
      return;
    }

    await acceptCustomerInvite();
    router.push("/kund");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-surface-sunken px-6">
      <Image src="/images/lindqvist-holmgren/lindqvist-holmgren-full-logo-on-light.svg" alt="Lindqvist / Holmgren" width={6065} height={2124} priority className="h-8 w-auto" />
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-raised ring-1 ring-line">
        <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg">Välkommen</h1>
        <p className="mt-1 text-sm text-fg-muted">Sätt ett lösenord för att komma igång med kundportalen.</p>

        {status === "checking" && <p className="mt-6 text-sm text-fg-muted">Kontrollerar inbjudan…</p>}

        {status === "expired" && (
          <p className="mt-6 text-sm text-danger">
            Länken har gått ut eller redan använts. Be din kontaktperson hos oss om en ny inbjudan.
          </p>
        )}

        {(status === "ready" || status === "saving") && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fg"
              >
                Lösenord
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClasses} mt-2`}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-fg"
              >
                Bekräfta lösenord
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClasses} mt-2`}
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-2 inline-flex items-center justify-center h-11 rounded-full bg-primary px-5 text-[15px] font-medium shadow-card text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {status === "saving" ? "Sparar…" : "Kom igång"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
