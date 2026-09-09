"use client";

import { useActionState, useEffect, useRef } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Select } from "@/components/ui/Select";
import { createApprovalRequest } from "@/lib/actions/approvals";
import type { MaterialItem } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";
const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  customerId: string;
  materialItems: (MaterialItem & { folderPath: string })[];
};

export function ApprovalRequestDialog({ open, onClose, projectId, customerId, materialItems }: Props) {
  const [state, formAction, pending] = useActionState(
    createApprovalRequest.bind(null, projectId, customerId),
    undefined,
  );
  const titleInputRef = useRef<HTMLInputElement>(null);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose();
    wasPending.current = pending;
  }, [pending, state, onClose]);

  return (
    <SlideOver open={open} onClose={onClose} title="Begär godkännande">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-stone">Material</span>
          <div className="mt-2">
            <Select
              name="materialItemId"
              required
              placeholder="Välj vad begäran gäller…"
              className={selectClasses}
              options={materialItems.map((item) => ({ value: item.id, label: `${item.folderPath} / ${item.title}` }))}
              onValueChange={(value) => {
                const item = materialItems.find((candidate) => candidate.id === value);
                if (item && titleInputRef.current) titleInputRef.current.value = item.title;
              }}
            />
          </div>
          {materialItems.length === 0 && (
            <p className="mt-2 text-xs text-stone">
              Ladda upp materialet till kunden i biblioteket innan du kan begära ett godkännande.
            </p>
          )}
        </div>
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-stone">Titel</span>
          <input
            ref={titleInputRef}
            name="title"
            required
            placeholder="T.ex. Logotyp v2"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-stone">Version (valfritt)</span>
            <input name="versionLabel" placeholder="T.ex. v2" className={`mt-2 ${inputClasses}`} />
          </div>
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-stone">
              Svar önskas senast (valfritt)
            </span>
            <input name="dueAt" type="date" className={`mt-2 ${inputClasses}`} />
          </div>
        </div>
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-stone">
            Meddelande till kund (valfritt)
          </span>
          <textarea
            name="message"
            rows={3}
            placeholder="Vad ska kunden titta extra på?"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending || materialItems.length === 0}
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            {pending ? "Skickar…" : "Skicka begäran"}
          </button>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        </div>
      </form>
    </SlideOver>
  );
}
