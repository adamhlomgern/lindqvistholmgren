"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { ArrowUpDown, Check, Menu, Plus } from "lucide-react";
import type { PrepperChecklistDetail, PrepperItem, PrepperSection as PrepperSectionType } from "@/lib/types";
import type { PrepperChecklistSummary } from "@/lib/data/prepper";
import { createSection, deleteSection, reorderSections, toggleItem, deleteItem, reorderItems } from "@/lib/actions/prepper";
import { ListSwitcher } from "@/components/prepper/ListSwitcher";
import { Section } from "@/components/prepper/Section";
import { ProgressBar } from "@/components/prepper/ProgressBar";
import { ActionMenu } from "@/components/prepper/ActionMenu";
import { ItemDetailSheet } from "@/components/prepper/ItemDetailSheet";
import { usePrepperToast, pickDefaultToastMessage } from "@/components/prepper/Toast";

const CHECKLIST_CELEBRATIONS = ["Hela listan är klar! 🎉", "Klart, allihopa.", "Ni ligger steget före."];

export function ChecklistWorkspace({
  notebookId,
  notebookName,
  checklist,
  checklists,
}: {
  notebookId: string;
  notebookName: string;
  checklist: PrepperChecklistDetail;
  checklists: PrepperChecklistSummary[];
}) {
  const [sections, setSections] = useState<PrepperSectionType[]>(checklist.sections);
  const [syncedChecklist, setSyncedChecklist] = useState(checklist);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [openItem, setOpenItem] = useState<{ sectionId: string; itemId: string } | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();
  const showToast = usePrepperToast();
  const wasComplete = useRef(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Resync local state whenever the server hands us a fresh tree — a new
  // navigation, a router.refresh() after a mutation, or the poll cycle
  // below picking up the other admin's changes. A render-phase reset (React's
  // documented pattern for "adjust state when a prop changes") rather than
  // an effect — ItemRow/Section still keep their own local edit state across
  // this, since React matches them by item/section id, not array identity.
  if (checklist !== syncedChecklist) {
    setSyncedChecklist(checklist);
    setSections(checklist.sections);
  }

  // Lightweight cross-device sync: Realtime would need RLS this codebase
  // deliberately doesn't use (see plan), so a short poll is the simple,
  // secure stand-in — good enough for two people in one household.
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(interval);
  }, [router]);

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const doneItems = sections.reduce((sum, s) => sum + s.items.filter((i) => i.completed).length, 0);
  const openItemData = openItem
    ? (sections.find((s) => s.id === openItem.sectionId)?.items.find((i) => i.id === openItem.itemId) ?? null)
    : null;

  useEffect(() => {
    const complete = totalItems > 0 && doneItems === totalItems;
    if (complete && !wasComplete.current) {
      showToast(CHECKLIST_CELEBRATIONS[Math.floor(Math.random() * CHECKLIST_CELEBRATIONS.length)], "celebration");
    }
    wasComplete.current = complete;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneItems, totalItems]);

  function handleToggleItem(sectionId: string, itemId: string, completed: boolean) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) => (item.id === itemId ? { ...item, completed } : item)),
            },
      ),
    );
    if (completed) showToast(pickDefaultToastMessage());
    startTransition(async () => {
      await toggleItem(itemId, notebookId, completed);
    });
  }

  function handleDeleteItem(sectionId: string, itemId: string) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId ? section : { ...section, items: section.items.filter((i) => i.id !== itemId) },
      ),
    );
    startTransition(async () => {
      await deleteItem(itemId, notebookId);
    });
  }

  function handleReorderItems(sectionId: string, itemIds: string[]) {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const byId = new Map(section.items.map((i) => [i.id, i]));
        return { ...section, items: itemIds.map((id) => byId.get(id)!).filter(Boolean) };
      }),
    );
    startTransition(async () => {
      await reorderItems(notebookId, itemIds);
    });
  }

  function handleAddItem(sectionId: string, item: PrepperItem) {
    setSections((prev) =>
      prev.map((section) => (section.id !== sectionId ? section : { ...section, items: [...section.items, item] })),
    );
  }

  function handleDeleteSection(sectionId: string) {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    startTransition(async () => {
      await deleteSection(sectionId, notebookId);
    });
  }

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(sections, oldIndex, newIndex);
    setSections(reordered);
    startTransition(async () => {
      await reorderSections(
        notebookId,
        reordered.map((s) => s.id),
      );
    });
  }

  function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSectionTitle.trim();
    if (!trimmed) {
      setAddingSection(false);
      return;
    }
    setNewSectionTitle("");
    startTransition(async () => {
      const created = await createSection(checklist.id, notebookId, trimmed);
      if (created) {
        setSections((prev) => [
          ...prev,
          {
            id: created.id,
            checklistId: checklist.id,
            title: created.title,
            position: prev.length,
            createdBy: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [],
          },
        ]);
      }
    });
  }

  return (
    <div className="flex min-h-screen md:flex-row">
      <ListSwitcher
        notebookId={notebookId}
        notebookName={notebookName}
        checklists={checklists}
        activeChecklistId={checklist.id}
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 border-b border-prepper-border bg-prepper-surface px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              aria-label="Byt checklista"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-prepper-surface-soft text-prepper-primary md:hidden"
            >
              <Menu size={17} strokeWidth={2} />
            </button>
            <div className="min-w-0 flex-1">
              <Link
                href="/admin/appar/prepper"
                className="inline-block text-xs font-medium uppercase tracking-[0.14em] text-prepper-primary/70 transition-colors hover:text-prepper-primary"
              >
                {notebookName}
              </Link>
              <h1 className="truncate font-prepper-display text-xl text-prepper-text sm:text-2xl">
                {checklist.title}
              </h1>
            </div>
            <ActionMenu
              ariaLabel="Fler alternativ för checklistan"
              items={[
                {
                  label: reorderMode ? "Klar" : "Sortera",
                  icon: reorderMode ? Check : ArrowUpDown,
                  onSelect: () => setReorderMode((v) => !v),
                },
              ]}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <p className="shrink-0 text-xs text-prepper-text-muted">
              {doneItems} av {totalItems} klart
            </p>
            <div className="flex-1">
              <ProgressBar done={doneItems} total={totalItems} />
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 sm:px-8">
          {sections.length === 0 && (
            <div className="rounded-2xl border border-prepper-border bg-prepper-surface-soft px-6 py-14 text-center">
              <div className="mx-auto max-w-xs border-y border-prepper-border/70 py-5">
                <p className="font-prepper-display text-lg text-prepper-text">Här är det tomt än så länge</p>
                <p className="mt-1.5 text-sm text-prepper-text-muted">
                  Lägg till första sektionen ni vill få ordning på.
                </p>
              </div>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  notebookId={notebookId}
                  reorderMode={reorderMode}
                  onToggleItem={(itemId, completed) => handleToggleItem(section.id, itemId, completed)}
                  onOpenItem={(item) => setOpenItem({ sectionId: section.id, itemId: item.id })}
                  onReorderItems={(itemIds) => handleReorderItems(section.id, itemIds)}
                  onAddItem={(item) => handleAddItem(section.id, item)}
                  onDeleteSection={() => handleDeleteSection(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {!reorderMode &&
            (addingSection ? (
              <form onSubmit={handleAddSection} className="flex items-center gap-2">
                <input
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onBlur={() => {
                    if (!newSectionTitle.trim()) setAddingSection(false);
                  }}
                  placeholder="Ny sektion, t.ex. Sömn"
                  autoFocus
                  className="min-h-11 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-4 py-2.5 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                />
                <button
                  type="submit"
                  disabled={!newSectionTitle.trim()}
                  className="flex h-11 items-center gap-1.5 rounded-xl bg-prepper-primary px-4 text-sm font-semibold text-prepper-on-primary transition-colors hover:bg-prepper-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  <Plus size={16} strokeWidth={2.25} />
                  <span className="hidden sm:inline">Sektion</span>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingSection(true)}
                className="flex min-h-11 items-center gap-1.5 self-start rounded-xl px-2 text-sm font-medium text-prepper-primary transition-colors hover:bg-prepper-surface-soft"
              >
                <Plus size={16} strokeWidth={2.25} />
                Lägg till
              </button>
            ))}
        </div>
      </div>

      {openItemData && (
        <ItemDetailSheet
          key={openItemData.id}
          item={openItemData}
          notebookId={notebookId}
          onClose={() => setOpenItem(null)}
          onToggleCompleted={(completed) => handleToggleItem(openItem!.sectionId, openItemData.id, completed)}
          onDeleted={() => {
            handleDeleteItem(openItem!.sectionId, openItemData.id);
            setOpenItem(null);
          }}
        />
      )}
    </div>
  );
}
