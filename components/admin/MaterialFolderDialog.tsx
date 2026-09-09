"use client";

import { useActionState, useEffect, useRef } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { createFolder, renameFolder, type MaterialFormState } from "@/lib/actions/material";
import type { MaterialFolder } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

type Props = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  parentFolderId: string | null;
  folder?: MaterialFolder;
};

// Same form for create and rename — rename just pre-fills and calls a
// different action, kept as one component so the fields never drift apart.
export function MaterialFolderDialog({ open, onClose, customerId, parentFolderId, folder }: Props) {
  const isEditing = Boolean(folder);
  const action = isEditing
    ? async (_prevState: MaterialFormState, formData: FormData): Promise<MaterialFormState> =>
        renameFolder(customerId, folder!.id, String(formData.get("name") ?? ""), String(formData.get("description") ?? ""))
    : createFolder.bind(null, customerId, parentFolderId);
  const [state, formAction, pending] = useActionState<MaterialFormState, FormData>(action, undefined);

  // `state` stays `undefined` on both "never submitted" and "submitted
  // successfully" (the actions return nothing on success) — a
  // pending-was-true-now-false transition is the only reliable success
  // signal, so track the previous pending value instead of state alone.
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose();
    wasPending.current = pending;
  }, [pending, state, onClose]);

  return (
    <SlideOver open={open} onClose={onClose} title={isEditing ? "Byt namn på mapp" : "Ny mapp"}>
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-stone">Namn</span>
          <input
            name="name"
            defaultValue={folder?.name}
            required
            placeholder="T.ex. Logotyp och varumärke"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-stone">Beskrivning (valfritt)</span>
          <textarea
            name="description"
            defaultValue={folder?.description}
            rows={2}
            placeholder="Kort om vad mappen innehåller…"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            {pending ? "Sparar…" : isEditing ? "Spara" : "Skapa mapp"}
          </button>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        </div>
      </form>
    </SlideOver>
  );
}
