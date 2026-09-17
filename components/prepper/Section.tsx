"use client";

import { useState, useTransition } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import type { PrepperItem, PrepperSection as PrepperSectionType } from "@/lib/types";
import { createItem } from "@/lib/actions/prepper";
import { ItemRow } from "@/components/prepper/ItemRow";
import { ProgressBar } from "@/components/prepper/ProgressBar";

export function Section({
  section,
  notebookId,
  onToggleItem,
  onDeleteItem,
  onReorderItems,
  onAddItem,
  onDeleteSection,
}: {
  section: PrepperSectionType;
  notebookId: string;
  onToggleItem: (itemId: string, completed: boolean) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems: (itemIds: string[]) => void;
  onAddItem: (item: PrepperItem) => void;
  onDeleteSection: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const done = section.items.filter((i) => i.completed).length;
  const total = section.items.length;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = section.items.findIndex((i) => i.id === active.id);
    const newIndex = section.items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(section.items, oldIndex, newIndex);
    onReorderItems(reordered.map((i) => i.id));
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setNewTitle("");
    startTransition(async () => {
      const created = await createItem(section.id, notebookId, trimmed);
      if (created) {
        onAddItem({
          id: created.id,
          sectionId: section.id,
          title: created.title,
          completed: false,
          position: section.items.length,
          createdBy: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subtasks: [],
        });
      }
    });
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group rounded-2xl border border-prepper-border bg-prepper-surface p-4 sm:p-5 ${isDragging ? "z-10 shadow-lg" : ""}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Dra för att sortera sektion"
          className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-prepper-border active:cursor-grabbing touch-none"
        >
          <GripVertical size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3"
        >
          <span className="min-w-0">
            <span className="block truncate font-prepper-display text-lg text-prepper-text">{section.title}</span>
            <span className="mt-0.5 block text-xs text-prepper-text-muted">
              {done}/{total} klara
            </span>
          </span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={`shrink-0 text-prepper-text-muted transition-transform ${collapsed ? "-rotate-90" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={onDeleteSection}
          aria-label="Ta bort sektion"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-prepper-text-muted opacity-0 transition-opacity hover:text-prepper-primary focus-visible:opacity-100 sm:group-hover:opacity-100"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>

      {total > 0 && (
        <div className="mt-3 ml-7">
          <ProgressBar done={done} total={total} />
        </div>
      )}

      {!collapsed && (
        <div className="mt-3 ml-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={section.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col divide-y divide-prepper-border/60">
                {section.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    notebookId={notebookId}
                    onToggleCompleted={(completed) => onToggleItem(item.id, completed)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <form onSubmit={handleAddItem} className="mt-2 flex items-center gap-2 pl-7">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Lägg till…"
              className="min-h-9 flex-1 rounded-full border border-dashed border-prepper-border bg-transparent px-3.5 text-sm text-prepper-text placeholder:text-prepper-text-muted focus:border-solid focus:border-prepper-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              aria-label="Lägg till moment"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-prepper-surface-soft text-prepper-primary transition-colors hover:bg-prepper-lavender-200 disabled:opacity-50"
            >
              <Plus size={15} strokeWidth={2.25} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
