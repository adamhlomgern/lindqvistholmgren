"use client";

import { useActionState, useState, useTransition } from "react";
import { UserPlus, UserX, UserCheck, RotateCw } from "lucide-react";
import {
  inviteCustomerContact,
  resendCustomerInvite,
  revokeCustomerAccess,
  restoreCustomerAccess,
} from "@/lib/actions/customer-invites";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Tag } from "@/components/ui/Tag";
import { formatDateSv } from "@/lib/format";
import type { CustomerMemberWithEmail } from "@/lib/data/customer-members";

const inputClasses =
  "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

function memberStatus(member: CustomerMemberWithEmail) {
  if (member.revokedAt) return { label: "Återkallad", tone: "text-coral" };
  if (member.acceptedAt) return { label: "Aktiv", tone: "text-primary" };
  return { label: "Inbjuden", tone: "text-peach" };
}

function MemberRow({ customerId, member }: { customerId: string; member: CustomerMemberWithEmail }) {
  const status = memberStatus(member);
  const [pending, startTransition] = useTransition();
  const [resendResult, setResendResult] = useState<{ error?: string } | null>(null);

  function handleResend() {
    setResendResult(null);
    startTransition(async () => {
      const result = await resendCustomerInvite(customerId, member.email);
      setResendResult(result.error ? result : {});
    });
  }

  return (
    <div className="rounded-xl bg-fg/5 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-fg">{member.email}</p>
          <p className="mt-0.5 text-xs text-fg-muted">Inbjuden {formatDateSv(member.invitedAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Tag className={status.tone}>{status.label}</Tag>
          {member.acceptedAt ? (
            member.revokedAt ? (
              <ConfirmDialog
                trigger={
                  <button
                    type="button"
                    aria-label="Återställ åtkomst"
                    title="Återställ åtkomst"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg"
                  >
                    <UserCheck size={14} strokeWidth={2.25} />
                  </button>
                }
                title="Återställ kundens åtkomst?"
                description="Kontaktpersonen kan logga in i portalen igen med sitt befintliga lösenord."
                confirmLabel="Återställ"
                onConfirm={restoreCustomerAccess.bind(null, customerId, member.id)}
              />
            ) : (
              <ConfirmDialog
                trigger={
                  <button
                    type="button"
                    aria-label="Återkalla åtkomst"
                    title="Återkalla åtkomst"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-coral/10 hover:text-coral"
                  >
                    <UserX size={14} strokeWidth={2.25} />
                  </button>
                }
                title="Återkalla kundens åtkomst?"
                description="Kontaktpersonen kan inte längre logga in i portalen förrän åtkomsten återställs."
                confirmLabel="Återkalla"
                destructive
                onConfirm={revokeCustomerAccess.bind(null, customerId, member.id)}
              />
            )
          ) : (
            // Kontaktpersonen har aldrig satt ett lösenord — "Återställ"
            // ensamt vore ett dödläge (ingen giltig länk, inget lösenord).
            // En ny inbjudan löser både återkallelse och saknad länk i ett
            // klick.
            <button
              type="button"
              onClick={handleResend}
              disabled={pending}
              aria-label="Skicka inbjudan igen"
              title="Skicka inbjudan igen"
              className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg disabled:opacity-60"
            >
              <RotateCw size={13} strokeWidth={2.25} className={pending ? "animate-spin" : undefined} />
            </button>
          )}
        </div>
      </div>
      {pending && <p className="mt-2 text-xs text-fg-muted">Skickar…</p>}
      {!pending && resendResult?.error && <p className="mt-2 text-xs text-coral">{resendResult.error}</p>}
      {!pending && resendResult && !resendResult.error && (
        <p className="mt-2 text-xs text-primary">Ny inbjudan skickad.</p>
      )}
    </div>
  );
}

export function CustomerPortalAccess({
  customerId,
  members,
}: {
  customerId: string;
  members: CustomerMemberWithEmail[];
}) {
  const [state, formAction, pending] = useActionState(
    inviteCustomerContact.bind(null, customerId),
    undefined,
  );

  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-fg">Kundportal</h2>

      <div className="mt-3 flex flex-col gap-2">
        {members.length === 0 && <p className="text-sm text-fg-muted">Ingen kontaktperson inbjuden ännu.</p>}
        {members.map((member) => (
          <MemberRow key={member.id} customerId={customerId} member={member} />
        ))}
      </div>

      <form action={formAction} className="mt-4 flex items-center gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="kontaktperson@foretag.se"
          className={inputClasses}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          <UserPlus size={14} strokeWidth={2.25} />
          Bjud in
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-coral">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-primary">Inbjudan skickad.</p>}
    </div>
  );
}
