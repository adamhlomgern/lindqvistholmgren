"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  ChevronDown,
  Flag,
  Image as ImageIcon,
  Link2,
  ListTodo,
  Plus,
  ShoppingBag,
  StickyNote,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { PrepperAssignee, PrepperItem, PrepperItemType, PrepperPurchaseStatus, PrepperSubtask } from "@/lib/types";
import { createSubtask, deleteItem, deleteSubtask, toggleSubtask, updateItem } from "@/lib/actions/prepper";
import { formatCurrencySek, formatShortDateSv } from "@/lib/format";
import { ActionMenu } from "@/components/prepper/ActionMenu";
import { Checkbox } from "@/components/prepper/Checkbox";

const TYPE_OPTIONS: { value: PrepperItemType; label: string; Icon: typeof ListTodo }[] = [
  { value: "task", label: "Uppgift", Icon: ListTodo },
  { value: "purchase", label: "Inköp", Icon: ShoppingBag },
  { value: "event", label: "Händelse", Icon: Calendar },
  { value: "note", label: "Anteckning", Icon: StickyNote },
];

const ASSIGNEE_OPTIONS: { value?: PrepperAssignee; label: string }[] = [
  { value: undefined, label: "Ingen" },
  { value: "ada", label: "Ada" },
  { value: "malin", label: "Malin" },
  { value: "both", label: "Båda" },
];

const PURCHASE_STATUS_OPTIONS: { value: PrepperPurchaseStatus; label: string }[] = [
  { value: "need", label: "Behöver köpa" },
  { value: "ordered", label: "Beställt" },
  { value: "bought", label: "Köpt" },
];

const chipClasses = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-prepper-primary text-prepper-on-primary"
      : "bg-prepper-surface-soft text-prepper-text-muted hover:bg-prepper-accent/30"
  }`;

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

  const [type, setType] = useState(item.type);
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [priority, setPriority] = useState(item.priority);
  const [assignee, setAssignee] = useState(item.assignee);
  const [tagsText, setTagsText] = useState((item.tags ?? []).join(", "));
  const [purchaseStatus, setPurchaseStatus] = useState(item.purchaseStatus);
  const [estimatedPrice, setEstimatedPrice] = useState(item.estimatedPrice?.toString() ?? "");
  const [actualPrice, setActualPrice] = useState(item.actualPrice?.toString() ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [imageUrl, setImageUrl] = useState(item.imageUrl ?? "");
  const hasDetails = type !== "task" || !!dueDate || priority || !!assignee || !!tagsText;
  const [detailsExpanded, setDetailsExpanded] = useState(hasDetails);

  const hasSubtasks = subtasks.length > 0;
  const subtaskDone = subtasks.filter((s) => s.completed).length;
  const derivedCompleted = hasSubtasks ? subtaskDone === subtasks.length : item.completed;

  function saveDetail(fields: Parameters<typeof updateItem>[2]) {
    startTransition(async () => {
      await updateItem(item.id, notebookId, fields);
    });
  }

  function saveTags() {
    const parsed = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setTagsText(parsed.join(", "));
    saveDetail({ tags: parsed });
  }

  function savePrice(kind: "estimated" | "actual", raw: string) {
    const parsed = raw.trim() === "" ? null : Number(raw);
    if (parsed !== null && Number.isNaN(parsed)) return;
    saveDetail(kind === "estimated" ? { estimatedPrice: parsed } : { actualPrice: parsed });
  }

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

          <button
            type="button"
            onClick={() => setDetailsExpanded((v) => !v)}
            className="mt-5 flex w-full items-center justify-between"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-prepper-text-muted">Detaljer</p>
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={`text-prepper-text-muted transition-transform ${detailsExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {!detailsExpanded && hasDetails && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {type !== "task" && (
                <span className={chipClasses(false)}>
                  {TYPE_OPTIONS.find((o) => o.value === type)?.label}
                  {type === "purchase" && purchaseStatus
                    ? ` · ${PURCHASE_STATUS_OPTIONS.find((o) => o.value === purchaseStatus)?.label}`
                    : ""}
                </span>
              )}
              {dueDate && <span className={chipClasses(false)}>{formatShortDateSv(dueDate)}</span>}
              {priority && <span className={chipClasses(false)}>Prioriterat</span>}
              {assignee && (
                <span className={chipClasses(false)}>{ASSIGNEE_OPTIONS.find((o) => o.value === assignee)?.label}</span>
              )}
              {tagsText && <span className={chipClasses(false)}>{tagsText}</span>}
            </div>
          )}

          {detailsExpanded && (
            <div className="mt-3 flex flex-col gap-4">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                  <ListTodo size={13} strokeWidth={2} /> Typ
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setType(option.value);
                        saveDetail({ type: option.value });
                      }}
                      className={chipClasses(type === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                    <Calendar size={13} strokeWidth={2} /> Gör före
                  </span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      saveDetail({ dueDate: e.target.value || null });
                    }}
                    className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = !priority;
                    setPriority(next);
                    saveDetail({ priority: next });
                  }}
                  className={`flex h-9 items-center gap-1.5 self-end rounded-full px-3 text-[13px] font-medium transition-colors ${
                    priority
                      ? "bg-prepper-primary text-prepper-on-primary"
                      : "bg-prepper-surface-soft text-prepper-text-muted hover:bg-prepper-accent/30"
                  }`}
                >
                  <Flag size={13} strokeWidth={2} /> Prioriterat
                </button>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                  <User size={13} strokeWidth={2} /> Tilldelad
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ASSIGNEE_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setAssignee(option.value);
                        saveDetail({ assignee: option.value ?? null });
                      }}
                      className={chipClasses(assignee === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                  <Tag size={13} strokeWidth={2} /> Taggar
                </span>
                <input
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  onBlur={saveTags}
                  placeholder="t.ex. bb, begagnat"
                  className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                />
              </label>

              {type === "purchase" && (
                <>
                  <div>
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                      <ShoppingBag size={13} strokeWidth={2} /> Inköpsstatus
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {PURCHASE_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setPurchaseStatus(option.value);
                            saveDetail({ purchaseStatus: option.value });
                          }}
                          className={chipClasses(purchaseStatus === option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex flex-1 flex-col gap-1.5">
                      <span className="text-xs font-medium text-prepper-text-muted">Uppskattat pris</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={estimatedPrice}
                        onChange={(e) => setEstimatedPrice(e.target.value)}
                        onBlur={() => savePrice("estimated", estimatedPrice)}
                        placeholder="0"
                        className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-1.5">
                      <span className="text-xs font-medium text-prepper-text-muted">Faktiskt pris</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={actualPrice}
                        onChange={(e) => setActualPrice(e.target.value)}
                        onBlur={() => savePrice("actual", actualPrice)}
                        placeholder="0"
                        className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                      />
                    </label>
                  </div>
                  {(estimatedPrice || actualPrice) && (
                    <p className="-mt-2 text-xs text-prepper-text-muted">
                      {actualPrice
                        ? `Faktiskt: ${formatCurrencySek(Number(actualPrice))}`
                        : `Uppskattat: ${formatCurrencySek(Number(estimatedPrice))}`}
                    </p>
                  )}

                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                      <Link2 size={13} strokeWidth={2} /> Länk
                    </span>
                    <input
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      onBlur={() => saveDetail({ link: link.trim() || null })}
                      placeholder="https://…"
                      className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                    />
                  </label>
                </>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted">
                  <ImageIcon size={13} strokeWidth={2} /> Bild
                </span>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onBlur={() => saveDetail({ imageUrl: imageUrl.trim() || null })}
                  placeholder="https://…"
                  className="rounded-xl border border-prepper-border bg-prepper-surface px-3 py-2 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
                />
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs, not worth next/image's domain allowlist config for a one-off preview
                  <img
                    src={imageUrl}
                    alt=""
                    className="mt-1 h-24 w-24 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </label>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
