"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { setCustomerNotes } from "@/lib/actions/customers";

const textareaClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

export function CustomerNotesCard({ customerId, notes }: { customerId: string; notes?: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(notes ?? "");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await setCustomerNotes(customerId, value);
      setEditing(false);
    });
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Interna anteckningar</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setValue(notes ?? "");
              setEditing(true);
            }}
            className="text-xs font-medium text-emerald hover:underline"
          >
            Redigera
          </button>
        )}
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-label text-stone/50">Synligt endast för er, aldrig för kunden</p>

      {editing ? (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={4}
            autoFocus
            className={textareaClasses}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
            >
              {pending ? "Sparar…" : "Spara"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs font-medium text-stone transition-colors hover:text-bone"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-stone">{notes || "Inga anteckningar ännu."}</p>
      )}
    </Card>
  );
}
