"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Palette, PenLine, Plus } from "lucide-react";
import type { PrepperNotebook } from "@/lib/types";
import { createNotebook, renameNotebook, updateNotebookAppearance } from "@/lib/actions/prepper";
import { AccentIcon } from "@/components/prepper/AccentIcon";
import { AppearancePicker } from "@/components/prepper/AppearancePicker";
import { ActionMenu } from "@/components/prepper/ActionMenu";

function NotebookRow({ notebook }: { notebook: PrepperNotebook }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [name, setName] = useState(notebook.name);
  const [appearance, setAppearance] = useState({ icon: notebook.icon, color: notebook.color });
  const [pickingAppearance, setPickingAppearance] = useState(false);
  const [, startTransition] = useTransition();

  function saveName() {
    const trimmed = name.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === notebook.name) {
      setName(notebook.name);
      return;
    }
    startTransition(async () => {
      await renameNotebook(notebook.id, trimmed);
    });
  }

  function saveAppearance(icon: string, color: string) {
    setAppearance({ icon, color });
    startTransition(async () => {
      await updateNotebookAppearance(notebook.id, icon, color);
    });
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-prepper-border bg-prepper-surface px-4 py-3">
      <button type="button" onClick={() => setPickingAppearance(true)} aria-label="Byt ikon och färg">
        <AccentIcon icon={appearance.icon} color={appearance.color} />
      </button>

      {editingTitle ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setName(notebook.name);
              setEditingTitle(false);
            }
          }}
          autoFocus
          className="min-w-0 flex-1 rounded-lg border border-prepper-border bg-prepper-surface px-2 py-1 text-[17px] font-semibold tracking-[-0.02em] text-prepper-text focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
        />
      ) : (
        <Link href={`/admin/appar/prepper/${notebook.id}`} className="min-w-0 flex-1 py-1">
          <span className="block truncate text-[17px] font-semibold tracking-[-0.02em] text-prepper-text">
            {notebook.name}
          </span>
          {notebook.description && (
            <span className="mt-0.5 block truncate text-sm text-prepper-text-muted">{notebook.description}</span>
          )}
        </Link>
      )}

      <ActionMenu
        ariaLabel="Fler alternativ för arbetsboken"
        items={[
          { label: "Byt namn", icon: PenLine, onSelect: () => setEditingTitle(true) },
          { label: "Byt ikon & färg", icon: Palette, onSelect: () => setPickingAppearance(true) },
        ]}
      />

      {pickingAppearance && (
        <AppearancePicker
          icon={appearance.icon}
          color={appearance.color}
          onSave={saveAppearance}
          onClose={() => setPickingAppearance(false)}
        />
      )}
    </li>
  );
}

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
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-prepper-primary/70">Prepper</p>
      <h1 className="mt-2 text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] text-prepper-text sm:text-[42px]">
        Arbetsböcker
      </h1>
      <p className="mt-3 max-w-md text-[16px] leading-[1.55] text-prepper-text-muted">
        Samla checklistor, inköp och förberedelser i separata arbetsböcker — till exempel Baby, BB-väska eller
        Hemmet.
      </p>

      {notebooks.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-prepper-border bg-prepper-surface-soft px-6 py-14 text-center">
          <div className="mx-auto max-w-xs border-y border-prepper-border/70 py-5">
            <BookOpen size={20} strokeWidth={1.5} className="mx-auto text-prepper-text-faint" />
            <p className="mt-3 text-[21px] font-bold tracking-[-0.02em] text-prepper-text">Inga arbetsböcker än</p>
            <p className="mt-1.5 text-sm text-prepper-text-muted">
              Lägg till den första arbetsboken ni vill börja planera i.
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-3">
          {notebooks.map((notebook) => (
            <NotebookRow key={notebook.id} notebook={notebook} />
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
