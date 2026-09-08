"use client";

import { useActionState, useTransition } from "react";
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
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

function memberStatus(member: CustomerMemberWithEmail) {
  if (member.revokedAt) return { label: "Återkallad", tone: "text-coral" };
  if (member.acceptedAt) return { label: "Aktiv", tone: "text-emerald" };
  return { label: "Inbjuden", tone: "text-peach" };
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
  const [, startResend] = useTransition();

  return (
    <div>
      <h2 className="font-display text-sm font-bold text-bone">Kundportal</h2>

      <div className="mt-3 flex flex-col gap-2">
        {members.length === 0 && <p className="text-sm text-stone">Ingen kontaktperson inbjuden ännu.</p>}
        {members.map((member) => {
          const status = memberStatus(member);
          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-bone/5 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-bone">{member.email}</p>
                <p className="mt-0.5 text-xs text-stone">Inbjuden {formatDateSv(member.invitedAt)}</p>
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
                          className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
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
                          className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-coral/10 hover:text-coral"
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
                  // ensamt vore ett dödläge (ingen giltig länk, inget
                  // lösenord). En ny inbjudan löser både återkallelse och
                  // saknad länk i ett klick.
                  <button
                    type="button"
                    onClick={() => startResend(() => resendCustomerInvite(customerId, member.email))}
                    aria-label="Skicka inbjudan igen"
                    title="Skicka inbjudan igen"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
                  >
                    <RotateCw size={13} strokeWidth={2.25} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          <UserPlus size={14} strokeWidth={2.25} />
          Bjud in
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-coral">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-emerald">Inbjudan skickad.</p>}
    </div>
  );
}
