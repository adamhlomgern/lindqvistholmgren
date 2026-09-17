"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import type { PrepperNotebook } from "@/lib/types";
import { createNotebook } from "@/lib/actions/prepper";

export function NotebookSwitcher({ notebooks }: { notebooks: PrepperNotebook[] }) {
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setName("");
    startTransition(async () => {
      await createNotebook(trimmed);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 pt-10 pb-16 sm:px-8 sm:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-prepper-primary/70">Prepper</p>
      <h1 className="mt-2 font-prepper-display text-4xl text-prepper-text sm:text-5xl">Arbetsböcker</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-prepper-text-muted">
        Samla checklistor, inköp och förberedelser i separata arbetsböcker — till exempel Baby, BB-väska eller
        Hemmet.
      </p>

      {notebooks.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-prepper-border bg-prepper-surface-soft px-6 py-14 text-center">
          <div className="mx-auto max-w-xs border-y border-prepper-border/70 py-5">
            <BookOpen size={20} strokeWidth={1.5} className="mx-auto text-prepper-text-faint" />
            <p className="mt-3 font-prepper-display text-lg text-prepper-text">Inga arbetsböcker än</p>
            <p className="mt-1.5 text-sm text-prepper-text-muted">
              Lägg till den första arbetsboken ni vill börja planera i.
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-3">
          {notebooks.map((notebook) => (
            <li key={notebook.id}>
              <Link
                href={`/admin/appar/prepper/${notebook.id}`}
                className="flex items-center gap-4 rounded-2xl border border-prepper-border bg-prepper-surface px-5 py-4 transition-colors hover:bg-prepper-surface-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-prepper-accent/25 text-prepper-primary">
                  <BookOpen size={18} strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block font-prepper-display text-lg text-prepper-text">{notebook.name}</span>
                  {notebook.description && (
                    <span className="mt-0.5 block truncate text-sm text-prepper-text-muted">
                      {notebook.description}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className="mt-6 flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ny arbetsbok, t.ex. Baby"
          className="min-h-11 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-4 py-2.5 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
        />
        <button
          type="submit"
          disabled={pending || !name.trim()}
          className="flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl bg-prepper-primary px-4 text-sm font-semibold text-prepper-on-primary transition-colors hover:bg-prepper-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2 disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={2.25} />
          <span className="hidden sm:inline">Lägg till</span>
        </button>
      </form>
    </div>
  );
}
