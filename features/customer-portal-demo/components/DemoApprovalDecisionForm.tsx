"use client";

import { useState, type FormEvent } from "react";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

type Choice = "approved" | "changes_requested" | null;

// Visual near-copy of the real components/customer/ApprovalDecisionForm —
// same markup/copy, but dispatches into the demo's reducer instead of
// calling the real decideApproval Server Action. approvalId is accepted
// only to satisfy ApprovalView's injectable DecisionForm slot; the demo has
// exactly one pending approval, so the context already knows which one.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by ApprovalView's DecisionForm slot signature
export function DemoApprovalDecisionForm(_props: { approvalId: string }) {
  const { approvalStatus, approve, requestChanges } = useCustomerPortalDemo();
  const [choice, setChoice] = useState<Choice>(null);
  const [note, setNote] = useState("");
  const pending = approvalStatus === "assembling";

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (choice === "approved") approve();
    else requestChanges(note);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        rows={3}
        required={choice === "changes_requested"}
        autoFocus
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={choice === "changes_requested" ? "Vad behöver ändras?" : "Valfri kommentar…"}
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
          {pending ? "Sammanställer slutleverans…" : choice === "approved" ? "Skicka godkännande" : "Skicka begäran om ändring"}
        </button>
        <button
          type="button"
          onClick={() => setChoice(null)}
          className="text-sm font-medium text-stone transition-colors hover:text-bone"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
