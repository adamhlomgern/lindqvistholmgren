"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, X } from "lucide-react";
import type { PrepperItem, PrepperSubtask } from "@/lib/types";
import { createSubtask, deleteItem, deleteSubtask, toggleSubtask, updateItem } from "@/lib/actions/prepper";
import { ActionMenu } from "@/components/prepper/ActionMenu";
import { Checkbox } from "@/components/prepper/Checkbox";

function SubtaskRow({
  subtask,
  notebookId,
  onChanged,
  onRemoved,
}: {
  subtask: PrepperSubtask;
  notebookId: string;
  onChanged: (subtask: PrepperSubtask) => void;
  onRemoved: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !subtask.completed;
    onChanged({ ...subtask, completed: next });
    startTransition(async () => {
      await toggleSubtask(subtask.id, notebookId, next);
    });
  }

  function remove() {
    onRemoved(subtask.id);
    startTransition(async () => {
      await deleteSubtask(subtask.id, notebookId);
    });
  }

  return (
    <div className="flex items-center gap-2.5 py-2">
      <Checkbox checked={subtask.completed} onChange={toggle} size={19} />
      <span
        className={`flex-1 text-[16px] font-medium leading-[1.3] transition-colors duration-150 ${
          subtask.completed ? "text-prepper-text-muted line-through" : "text-prepper-text"
        }`}
      >
        {subtask.title}
      </span>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        aria-label="Ta bort underpunkt"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-prepper-text-muted transition-colors hover:text-prepper-primary"
      >
        <Trash2 size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ItemDetailSheet({
  item,
  notebookId,
  onClose,
  onToggleCompleted,
  onDeleted,
}: {
  item: PrepperItem;
  notebookId: string;
  onClose: () => void;
  onToggleCompleted: (completed: boolean) => void;
  onDeleted: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note ?? "");
  const [subtasks, setSubtasks] = useState<PrepperSubtask[]>(item.subtasks);
  const [newSubtask, setNewSubtask] = useState("");
  const [, startTransition] = useTransition();

  const hasSubtasks = subtasks.length > 0;
  const subtaskDone = subtasks.filter((s) => s.completed).length;
  const derivedCompleted = hasSubtasks ? subtaskDone === subtasks.length : item.completed;

  function saveTitle() {
    const trimmed = title.trim();
    if (!trimmed || trimmed === item.title) {
      setTitle(item.title);
      return;
    }
    startTransition(async () => {
      await updateItem(item.id, notebookId, { title: trimmed });
    });
  }

  function saveNote() {
    if ((note || undefined) === item.note) return;
    startTransition(async () => {
      await updateItem(item.id, notebookId, { note });
    });
  }

  function handleSubtaskChanged(updated: PrepperSubtask) {
    const next = subtasks.map((s) => (s.id === updated.id ? updated : s));
    setSubtasks(next);
    if (next.length > 0) {
      const allDone = next.every((s) => s.completed);
      if (allDone !== item.completed) onToggleCompleted(allDone);
    }
  }

  function handleSubtaskRemoved(id: string) {
    const next = subtasks.filter((s) => s.id !== id);
    setSubtasks(next);
    if (next.length > 0) {
      const allDone = next.every((s) => s.completed);
      if (allDone !== item.completed) onToggleCompleted(allDone);
    }
  }

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setNewSubtask("");
    startTransition(async () => {
      const created = await createSubtask(item.id, notebookId, trimmed);
      if (created) {
        const next = [
          ...subtasks,
          {
            id: created.id,
            itemId: item.id,
            title: created.title,
            completed: false,
            position: subtasks.length,
            createdBy: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setSubtasks(next);
        if (item.completed) onToggleCompleted(false);
      }
    });
  }

  function handleDelete() {
    onDeleted();
    startTransition(async () => {
      await deleteItem(item.id, notebookId);
    });
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
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
          className="absolute inset-x-0 bottom-0 mx-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-prepper-background px-5 pb-8 pt-4 shadow-xl sm:bottom-8 sm:rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <div className="h-1 w-10 rounded-full bg-prepper-border sm:hidden" />
            <div className="ml-auto flex items-center gap-1">
              <ActionMenu
                ariaLabel="Fler alternativ för momentet"
                items={[{ label: "Ta bort momentet", icon: Trash2, onSelect: handleDelete, destructive: true }]}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Stäng"
                className="flex h-9 w-9 items-center justify-center rounded-full text-prepper-text-muted hover:bg-prepper-surface-soft"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-start gap-3">
            <Checkbox
              checked={derivedCompleted}
              onChange={hasSubtasks ? undefined : () => onToggleCompleted(!item.completed)}
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              className={`min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-prepper-text focus:border-prepper-border focus:bg-prepper-surface focus:outline-none ${
                derivedCompleted ? "text-prepper-text-muted line-through" : ""
              }`}
            />
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={saveNote}
            placeholder="Kort anteckning…"
            rows={2}
            className="mt-4 w-full resize-none rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
          />

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.15em] text-prepper-text-muted">
            Deluppgifter{hasSubtasks ? ` · ${subtaskDone}/${subtasks.length}` : ""}
          </p>
          {hasSubtasks && (
            <div className="mt-1 flex flex-col divide-y divide-prepper-border/60">
              {subtasks.map((subtask) => (
                <SubtaskRow
                  key={subtask.id}
                  subtask={subtask}
                  notebookId={notebookId}
                  onChanged={handleSubtaskChanged}
                  onRemoved={handleSubtaskRemoved}
                />
              ))}
            </div>
          )}
          <form onSubmit={handleAddSubtask} className="mt-2 flex items-center gap-2">
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Lägg till deluppgift…"
              className="min-h-9 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-3 py-1.5 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
            />
            <button
              type="submit"
              disabled={!newSubtask.trim()}
              aria-label="Lägg till deluppgift"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-prepper-surface-soft text-prepper-primary transition-colors hover:bg-prepper-accent/30 disabled:opacity-50"
            >
              <Plus size={15} strokeWidth={2.25} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
