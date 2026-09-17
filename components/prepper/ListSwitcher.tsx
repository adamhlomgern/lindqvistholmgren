"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ListChecks, Plus, X } from "lucide-react";
import type { PrepperChecklistSummary } from "@/lib/data/prepper";
import { createChecklist } from "@/lib/actions/prepper";
import { ProgressBar } from "@/components/prepper/ProgressBar";

type Props = {
  notebookId: string;
  notebookName: string;
  checklists: PrepperChecklistSummary[];
  activeChecklistId?: string;
  open: boolean;
  onClose: () => void;
};

function ChecklistLink({
  notebookId,
  checklist,
  active,
  onNavigate,
}: {
  notebookId: string;
  checklist: PrepperChecklistSummary;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/admin/appar/prepper/${notebookId}?checklist=${checklist.id}`}
      onClick={onNavigate}
      className={`flex flex-col gap-1.5 rounded-xl px-4 py-3 transition-colors ${
        active ? "bg-prepper-primary/10 text-prepper-text" : "text-prepper-text-muted hover:bg-prepper-surface-soft"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium">{checklist.title}</span>
        <span className="shrink-0 text-xs text-prepper-text-muted">
          {checklist.doneCount}/{checklist.totalCount}
        </span>
      </div>
      <ProgressBar done={checklist.doneCount} total={checklist.totalCount} />
    </Link>
  );
}

function CreateChecklistForm({ notebookId, onCreated }: { notebookId: string; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTitle("");
    startTransition(async () => {
      await createChecklist(notebookId, trimmed);
      router.refresh();
      onCreated();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 px-1">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ny checklista…"
        className="min-h-10 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-3.5 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
      />
      <button
        type="submit"
        disabled={pending || !title.trim()}
        aria-label="Skapa checklista"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-prepper-primary text-prepper-on-primary transition-colors hover:bg-prepper-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <Plus size={16} strokeWidth={2.25} />
      </button>
    </form>
  );
}

function SwitcherBody({ notebookId, notebookName, checklists, activeChecklistId, onNavigate }: Omit<Props, "open" | "onClose"> & { onNavigate: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 px-1 pb-3">
        <ListChecks size={14} strokeWidth={2} className="text-prepper-primary/70" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-prepper-primary/70">{notebookName}</p>
      </div>
      <div className="flex flex-col gap-1">
        {checklists.map((checklist) => (
          <ChecklistLink
            key={checklist.id}
            notebookId={notebookId}
            checklist={checklist}
            active={checklist.id === activeChecklistId}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <CreateChecklistForm notebookId={notebookId} onCreated={onNavigate} />
    </>
  );
}

export function ListSwitcher(props: Props) {
  const { open, onClose } = props;

  return (
    <>
      {/* Desktop: persistent left rail */}
      <aside className="hidden w-64 shrink-0 border-r border-prepper-border px-3 py-6 md:block">
        <SwitcherBody {...props} onNavigate={() => {}} />
      </aside>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-prepper-ink/40"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-prepper-background px-3 pb-8 pt-4 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="h-1 w-10 rounded-full bg-prepper-border" />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Stäng listväljare"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-prepper-text-muted hover:bg-prepper-surface-soft"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
              <SwitcherBody {...props} onNavigate={onClose} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
