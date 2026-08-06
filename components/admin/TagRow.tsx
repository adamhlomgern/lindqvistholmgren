"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { deleteTag, renameTag } from "@/lib/actions/tags";

type Mode = "view" | "edit" | "confirm-delete";

const iconButtonClasses =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-stone transition-colors";

export function TagRow({ tag, count }: { tag: string; count: number }) {
  const [mode, setMode] = useState<Mode>("view");

  if (mode === "edit") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-bone/5 px-4 py-3 sm:gap-3 sm:px-5">
        <span className="w-6 shrink-0 text-xs text-stone sm:w-8">{count}×</span>
        <form
          action={async (formData: FormData) => {
            await renameTag(tag, formData);
            setMode("view");
          }}
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <label htmlFor={`tag-${tag}`} className="sr-only">
            Nytt namn för taggen {tag}
          </label>
          <input
            id={`tag-${tag}`}
            name="newName"
            autoFocus
            defaultValue={tag}
            className="min-w-0 flex-1 rounded-lg border border-emerald/60 bg-bone/5 px-3 py-2 text-sm text-bone focus:outline-none"
          />
          <button
            type="submit"
            aria-label={`Spara nytt namn för ${tag}`}
            title="Spara"
            className={`${iconButtonClasses} text-emerald hover:bg-emerald/10`}
          >
            <Check size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setMode("view")}
            aria-label="Avbryt namnbyte"
            title="Avbryt"
            className={`${iconButtonClasses} hover:bg-bone/10 hover:text-bone`}
          >
            <X size={18} strokeWidth={2.25} />
          </button>
        </form>
      </div>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-coral/10 px-4 py-3 sm:gap-3 sm:px-5">
        <span className="w-6 shrink-0 text-xs text-stone sm:w-8">{count}×</span>
        <p className="min-w-0 flex-1 text-sm text-bone">
          Ta bort <span className="font-semibold">{tag}</span> från {count}{" "}
          {count === 1 ? "artikel" : "artiklar"}? Det går inte att ångra.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("view")}
            className="rounded-full px-3 py-2 text-xs font-medium text-stone hover:text-bone"
          >
            Avbryt
          </button>
          <form
            action={async () => {
              await deleteTag(tag);
            }}
          >
            <button
              type="submit"
              className="rounded-full bg-coral px-3.5 py-2 text-xs font-semibold text-charcoal hover:bg-coral/80"
            >
              Ta bort
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-bone/5 px-4 py-3 sm:gap-3 sm:px-5">
      <span className="w-6 shrink-0 text-xs text-stone sm:w-8">{count}×</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-bone">{tag}</span>
      <button
        type="button"
        onClick={() => setMode("edit")}
        aria-label={`Byt namn på ${tag}`}
        title="Byt namn"
        className={`${iconButtonClasses} hover:bg-bone/10 hover:text-emerald`}
      >
        <Pencil size={16} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={() => setMode("confirm-delete")}
        aria-label={`Ta bort ${tag}`}
        title="Ta bort"
        className={`${iconButtonClasses} hover:bg-coral/10 hover:text-coral`}
      >
        <X size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}
