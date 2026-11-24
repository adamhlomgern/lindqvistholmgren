"use client";

import { useActionState, useEffect, useRef } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Select } from "@/components/ui/Select";
import { createLink } from "@/lib/actions/material";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:opacity-50";
const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

type Props = { open: boolean; onClose: () => void; customerId: string; folderId: string | null };

export function MaterialLinkDialog({ open, onClose, customerId, folderId }: Props) {
  const [state, formAction, pending] = useActionState(createLink.bind(null, customerId, folderId), undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose();
    wasPending.current = pending;
  }, [pending, state, onClose]);

  return (
    <SlideOver open={open} onClose={onClose} title="Lägg till länk">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Titel</span>
          <input name="title" required placeholder="T.ex. Designprototyp" className={`mt-2 ${inputClasses}`} />
        </div>
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Länk</span>
          <input name="url" type="url" required placeholder="https://…" className={`mt-2 ${inputClasses}`} />
        </div>
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Beskrivning (valfritt)</span>
          <textarea name="description" rows={2} placeholder="Vad länken är för…" className={`mt-2 ${inputClasses}`} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Synlighet</span>
            <div className="mt-2">
              <Select
                name="visibility"
                defaultValue="internal"
                className={selectClasses}
                options={[
                  { value: "internal", label: "Internt" },
                  { value: "shared", label: "Delat med kund" },
                ]}
              />
            </div>
          </div>
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Leveransstatus</span>
            <div className="mt-2">
              <Select
                name="deliveryStatus"
                defaultValue="draft"
                className={selectClasses}
                options={[
                  { value: "draft", label: "Utkast" },
                  { value: "review", label: "För granskning" },
                  { value: "final", label: "Slutleverans" },
                ]}
              />
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input type="checkbox" name="pinned" className="h-4 w-4 rounded border-line-strong bg-fg/5 accent-primary" />
          Fäst överst i mappen
        </label>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {pending ? "Sparar…" : "Lägg till länk"}
          </button>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        </div>
      </form>
    </SlideOver>
  );
}
