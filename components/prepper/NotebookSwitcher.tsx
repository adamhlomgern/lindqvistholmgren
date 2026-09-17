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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-prepper-accent">Prepper</p>
      <h1 className="mt-1 font-prepper-display text-3xl text-prepper-text">Arbetsböcker</h1>
      <p className="mt-2 text-sm text-prepper-text-muted">
        Varje arbetsbok samlar checklistorna för ett förberedelseprojekt — t.ex. &quot;Baby&quot;.
      </p>

      {notebooks.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-prepper-border px-6 py-16 text-center">
          <BookOpen size={24} strokeWidth={1.75} className="text-prepper-text-muted" />
          <p className="text-sm text-prepper-text-muted">Här är det tomt än så länge.</p>
          <p className="text-sm text-prepper-text-muted">Lägg till första arbetsboken ni vill få ordning på.</p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {notebooks.map((notebook) => (
            <li key={notebook.id}>
              <Link
                href={`/admin/appar/prepper/${notebook.id}`}
                className="flex items-center gap-4 rounded-2xl border border-prepper-border bg-prepper-surface px-5 py-4 transition-colors hover:bg-prepper-surface-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-prepper-lavender-100 text-prepper-primary">
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
          className="min-h-11 flex-1 rounded-full border border-prepper-border bg-prepper-surface px-4 text-sm text-prepper-text placeholder:text-prepper-text-muted focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
        />
        <button
          type="submit"
          disabled={pending || !name.trim()}
          className="flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-prepper-primary px-4 text-sm font-semibold text-prepper-lavender-50 transition-colors hover:bg-prepper-primary-hover disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={2.25} />
          <span className="hidden sm:inline">Lägg till</span>
        </button>
      </form>
    </div>
  );
}
