"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, ChevronRight, Flag, GripVertical, ShoppingBag, StickyNote } from "lucide-react";
import type { PrepperItem, PrepperItemType } from "@/lib/types";
import { formatShortDateSv } from "@/lib/format";
import { Checkbox } from "@/components/prepper/Checkbox";

// "task" gets no icon — a plain checklist item shouldn't look any different
// than it did before this metadata existed (progressive disclosure).
const typeIcons: Partial<Record<PrepperItemType, typeof ShoppingBag>> = {
  purchase: ShoppingBag,
  event: Calendar,
  note: StickyNote,
};

export function ItemRow({
  item,
  reorderMode,
  onToggleCompleted,
  onOpen,
}: {
  item: PrepperItem;
  reorderMode: boolean;
  onToggleCompleted: (completed: boolean) => void;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const hasSubtasks = item.subtasks.length > 0;
  const subtaskDone = item.subtasks.filter((s) => s.completed).length;
  // Items with subtasks derive their completion from them (see
  // ItemDetailSheet) — the row's checkbox is read-only for those, so people
  // never have to separately check both a parent and every child.
  const derivedCompleted = hasSubtasks ? subtaskDone === item.subtasks.length : item.completed;
  const TypeIcon = typeIcons[item.type];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 py-2.5 ${isDragging ? "z-10 rounded-xl bg-prepper-surface shadow-md" : ""}`}
    >
      {reorderMode && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Dra för att sortera"
          className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-prepper-border active:cursor-grabbing touch-none"
        >
          <GripVertical size={15} strokeWidth={2} />
        </button>
      )}

      <Checkbox
        checked={derivedCompleted}
        onChange={reorderMode || hasSubtasks ? undefined : () => onToggleCompleted(!item.completed)}
      />

      <button
        type="button"
        onClick={onOpen}
        disabled={reorderMode}
        className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          {TypeIcon && <TypeIcon size={14} strokeWidth={2} className="shrink-0 text-prepper-text-faint" />}
          {item.priority && <Flag size={13} strokeWidth={2} className="shrink-0 text-prepper-primary" />}
          <span
            className={`block min-w-0 flex-1 break-words text-[16px] font-medium leading-[1.3] transition-colors duration-150 ${
              derivedCompleted ? "text-prepper-text-muted line-through" : "text-prepper-text"
            }`}
          >
            {item.title}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {item.dueDate && (
            <span className="rounded-full bg-prepper-surface-soft px-2 py-0.5 text-[11px] font-medium text-prepper-text-muted">
              {formatShortDateSv(item.dueDate)}
            </span>
          )}
          {hasSubtasks && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                subtaskDone === item.subtasks.length
                  ? "bg-prepper-completed text-prepper-completed-text"
                  : "bg-prepper-surface-soft text-prepper-text-muted"
              }`}
            >
              {subtaskDone}/{item.subtasks.length}
            </span>
          )}
          {!reorderMode && <ChevronRight size={15} strokeWidth={2} className="text-prepper-text-muted" />}
        </span>
      </button>
    </div>
  );
}
