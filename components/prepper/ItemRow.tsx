"use client";

import { useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import type { PrepperItem, PrepperSubtask } from "@/lib/types";
import {
  createSubtask,
  deleteItem,
  toggleSubtask,
  updateItem,
  deleteSubtask,
} from "@/lib/actions/prepper";

function Checkbox({ checked, onChange, size = 22 }: { checked: boolean; onChange: () => void; size?: number }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      whileTap={{ scale: 0.85 }}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
        checked
          ? "border-prepper-primary bg-prepper-primary text-prepper-lavender-50"
          : "border-prepper-border bg-prepper-surface"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2`}
    >
      {checked && (
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.18 }}
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 16 16"
          fill="none"
        >
          <motion.path
            d="M3 8.5L6.2 11.5L13 4.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}

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
    <div className="group/subtask flex items-center gap-2.5 py-1.5 pl-1">
      <Checkbox checked={subtask.completed} onChange={toggle} size={17} />
      <span
        className={`flex-1 text-sm transition-colors duration-150 ${
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
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-prepper-text-muted opacity-0 transition-opacity hover:text-prepper-primary focus-visible:opacity-100 group-hover/subtask:opacity-100"
      >
        <Trash2 size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ItemRow({
  item,
  notebookId,
  onToggleCompleted,
  onDelete,
}: {
  item: PrepperItem;
  notebookId: string;
  onToggleCompleted: (completed: boolean) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note ?? "");
  const [subtasks, setSubtasks] = useState<PrepperSubtask[]>(item.subtasks);
  const [newSubtask, setNewSubtask] = useState("");
  const [, startTransition] = useTransition();

  const subtaskDone = subtasks.filter((s) => s.completed).length;

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

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setNewSubtask("");
    startTransition(async () => {
      const created = await createSubtask(item.id, notebookId, trimmed);
      if (created) {
        setSubtasks((prev) => [
          ...prev,
          {
            id: created.id,
            itemId: item.id,
            title: created.title,
            completed: false,
            position: prev.length,
            createdBy: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    });
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl ${isDragging ? "z-10 bg-prepper-surface shadow-md" : ""}`}
    >
      <div className="flex items-center gap-2 py-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Dra för att sortera"
          className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-prepper-border active:cursor-grabbing touch-none"
        >
          <GripVertical size={15} strokeWidth={2} />
        </button>

        <Checkbox checked={item.completed} onChange={() => onToggleCompleted(!item.completed)} />

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
        >
          <span className="min-w-0">
            <span
              className={`block truncate text-[15px] transition-colors duration-150 ${
                item.completed ? "text-prepper-text-muted line-through" : "text-prepper-text"
              }`}
            >
              {title}
            </span>
            {!expanded && note && (
              <span className="mt-0.5 block truncate text-xs text-prepper-text-muted">{note}</span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {subtasks.length > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  subtaskDone === subtasks.length
                    ? "bg-prepper-completed text-prepper-completed-text"
                    : "bg-prepper-surface-soft text-prepper-text-muted"
                }`}
              >
                {subtaskDone}/{subtasks.length}
              </span>
            )}
            <ChevronDown
              size={15}
              strokeWidth={2}
              className={`text-prepper-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </div>

      {expanded && (
        <div className="ml-7 flex flex-col gap-3 border-l border-prepper-border/70 py-1 pb-3 pl-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            className="rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-prepper-text focus:border-prepper-border focus:bg-prepper-surface focus:outline-none"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={saveNote}
            placeholder="Kort anteckning…"
            rows={1}
            className="resize-none rounded-lg border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-muted focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
          />

          {subtasks.length > 0 && (
            <div className="flex flex-col">
              {subtasks.map((subtask) => (
                <SubtaskRow
                  key={subtask.id}
                  subtask={subtask}
                  notebookId={notebookId}
                  onChanged={(updated) =>
                    setSubtasks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
                  }
                  onRemoved={(id) => setSubtasks((prev) => prev.filter((s) => s.id !== id))}
                />
              ))}
            </div>
          )}

          <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Lägg till underpunkt…"
              className="min-h-8 flex-1 rounded-full border border-prepper-border bg-prepper-surface px-3 text-sm text-prepper-text placeholder:text-prepper-text-muted focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
            />
            <button
              type="submit"
              disabled={!newSubtask.trim()}
              aria-label="Lägg till underpunkt"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-prepper-surface-soft text-prepper-primary transition-colors hover:bg-prepper-lavender-200 disabled:opacity-50"
            >
              <Plus size={14} strokeWidth={2.25} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              onDelete();
              startTransition(async () => {
                await deleteItem(item.id, notebookId);
              });
            }}
            className="mt-1 flex w-fit items-center gap-1.5 text-xs font-medium text-prepper-text-muted transition-colors hover:text-prepper-primary"
          >
            <Trash2 size={12} strokeWidth={2} />
            Ta bort momentet
          </button>
        </div>
      )}
    </div>
  );
}
