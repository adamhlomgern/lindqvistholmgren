"use client";

import { useActionState, useState } from "react";
import { decideApproval } from "@/lib/actions/approvals";

type Props = { approvalId: string };

type Choice = "approved" | "changes_requested" | null;

export function ApprovalDecisionForm({ approvalId }: Props) {
  const [choice, setChoice] = useState<Choice>(null);
  const [state, formAction, pending] = useActionState(
    decideApproval.bind(null, approvalId, choice ?? "approved"),
    undefined,
  );

  if (!choice) {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setChoice("approved")}
          className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          Godkänn leverans
        </button>
        <button
          type="button"
          onClick={() => setChoice("changes_requested")}
          className="rounded-full bg-bone/10 px-5 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-bone/15"
        >
          Begär ändringar
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <textarea
        name="note"
        rows={3}
        required={choice === "changes_requested"}
        autoFocus
        placeholder={
          choice === "changes_requested" ? "Vad behöver ändras?" : "Valfri kommentar…"
        }
        className="w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            choice === "approved" ? "bg-emerald text-charcoal hover:bg-bone" : "bg-peach text-charcoal hover:bg-bone"
          }`}
        >
          {pending ? "Skickar…" : choice === "approved" ? "Skicka godkännande" : "Skicka begäran om ändring"}
        </button>
        <button
          type="button"
          onClick={() => setChoice(null)}
          className="text-sm font-medium text-stone transition-colors hover:text-bone"
        >
          Avbryt
        </button>
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
      </div>
    </form>
  );
}
