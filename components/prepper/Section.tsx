"use client";

import { useState, useTransition } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Palette, PenLine, Plus, Trash2 } from "lucide-react";
import type { PrepperItem, PrepperSection as PrepperSectionType } from "@/lib/types";
import { createItem, renameSection, updateSectionAppearance } from "@/lib/actions/prepper";
import { ItemRow } from "@/components/prepper/ItemRow";
import { ProgressBar } from "@/components/prepper/ProgressBar";
import { ActionMenu } from "@/components/prepper/ActionMenu";
import { AccentIcon } from "@/components/prepper/AccentIcon";
import { AppearancePicker } from "@/components/prepper/AppearancePicker";

export function Section({
  section,
  notebookId,
  reorderMode,
  onToggleItem,
  onOpenItem,
  onReorderItems,
  onAddItem,
  onDeleteSection,
}: {
  section: PrepperSectionType;
  notebookId: string;
  reorderMode: boolean;
  onToggleItem: (itemId: string, completed: boolean) => void;
  onOpenItem: (item: PrepperItem) => void;
  onReorderItems: (itemIds: string[]) => void;
  onAddItem: (item: PrepperItem) => void;
  onDeleteSection: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [appearance, setAppearance] = useState({ icon: section.icon, color: section.color });
  const [pickingAppearance, setPickingAppearance] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const done = section.items.filter((i) => i.completed).length;
  const total = section.items.length;

  function saveTitle() {
    const trimmed = title.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === section.title) {
      setTitle(section.title);
      return;
    }
    startTransition(async () => {
      await renameSection(section.id, notebookId, trimmed);
    });
  }

  function saveAppearance(icon: string, color: string) {
    setAppearance({ icon, color });
    startTransition(async () => {
      await updateSectionAppearance(section.id, notebookId, icon, color);
    });
  }

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
    if (!trimmed) {
      setAddingItem(false);
      return;
    }
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
      className={`rounded-2xl border border-prepper-border bg-prepper-surface px-4 py-2 sm:px-5 ${isDragging ? "z-10 shadow-lg" : ""}`}
    >
      <div className="flex items-center gap-2 py-1.5">
        {reorderMode && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label="Dra för att sortera sektion"
            className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-prepper-border active:cursor-grabbing touch-none"
          >
            <GripVertical size={15} strokeWidth={2} />
          </button>
        )}
        {!reorderMode && (
          <button type="button" onClick={() => setPickingAppearance(true)} aria-label="Byt ikon och färg">
            <AccentIcon icon={appearance.icon} color={appearance.color} size="sm" />
          </button>
        )}
        {editingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setTitle(section.title);
                setEditingTitle(false);
              }
            }}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-prepper-border bg-prepper-surface px-2 py-1 text-[21px] font-bold tracking-[-0.02em] text-prepper-text focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
          />
        ) : (
          <button
            type="button"
            onClick={() => !reorderMode && setCollapsed((v) => !v)}
            disabled={reorderMode}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-3"
          >
            <span className="min-w-0 truncate text-[21px] font-bold tracking-[-0.02em] text-prepper-text">
              {title}
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-prepper-text-muted">
              {done}/{total}
              {!reorderMode && (
                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className={`text-prepper-text-muted transition-transform ${collapsed ? "-rotate-90" : ""}`}
                />
              )}
            </span>
          </button>
        )}
        {!reorderMode && (
          <ActionMenu
            ariaLabel="Fler alternativ för sektionen"
            items={[
              { label: "Byt namn", icon: PenLine, onSelect: () => setEditingTitle(true) },
              { label: "Byt ikon & färg", icon: Palette, onSelect: () => setPickingAppearance(true) },
              { label: "Ta bort sektion", icon: Trash2, onSelect: onDeleteSection, destructive: true },
            ]}
          />
        )}
      </div>

      {pickingAppearance && (
        <AppearancePicker
          icon={appearance.icon}
          color={appearance.color}
          onSave={saveAppearance}
          onClose={() => setPickingAppearance(false)}
        />
      )}

      {!collapsed && !reorderMode && total > 0 && (
        <div className="pb-2">
          <ProgressBar done={done} total={total} />
        </div>
      )}

      {!collapsed && (
        <div className="pb-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={section.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col divide-y divide-prepper-border/60">
                {section.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    reorderMode={reorderMode}
                    onToggleCompleted={(completed) => onToggleItem(item.id, completed)}
                    onOpen={() => onOpenItem(item)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!reorderMode &&
            (addingItem ? (
              <form onSubmit={handleAddItem} className="mt-1 flex items-center gap-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => {
                    if (!newTitle.trim()) setAddingItem(false);
                  }}
                  placeholder="Nytt moment…"
                  autoFocus
                  className="min-h-9 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-3.5 py-1.5 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  aria-label="Lägg till moment"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-prepper-primary text-prepper-on-primary transition-colors hover:bg-prepper-primary-hover disabled:opacity-50"
                >
                  <Plus size={15} strokeWidth={2.25} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingItem(true)}
                className="mt-1 flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-prepper-text-muted transition-colors hover:text-prepper-primary"
              >
                <Plus size={14} strokeWidth={2.25} />
                Lägg till
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
