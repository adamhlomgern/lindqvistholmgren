"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Bike, MoreVertical, ShoppingBag } from "lucide-react";
import { Button } from "@/components/demo/Button";
import { Badge } from "@/components/demo/Badge";
import type { Order, OrderStatus } from "@/features/restaurant-platform/types";
import type { Tone } from "@/components/demo/tokens";
import { nextStatusActionLabel, orderStatusLabel, orderStatusTone, statusSequence } from "@/features/restaurant-platform/utils/orderStatus";
import { formatSek } from "@/features/restaurant-platform/utils/format";

const timeToneClasses: Record<Tone, string> = {
  primary: "text-demo-primary",
  danger: "text-demo-danger",
  warning: "text-demo-warning",
  info: "text-demo-info",
  neutral: "text-demo-text-muted",
};

// A left-edge accent, not a background tint — reads in peripheral vision
// while scanning a column, and doesn't compete with the soft-color note
// chips or the tone-flash below. Neutral renders transparent (reserves the
// space, shows nothing) so the accent only appears once something's
// actually worth noticing.
const timeToneBorderClasses: Record<Tone, string> = {
  primary: "border-l-demo-primary",
  danger: "border-l-demo-danger",
  warning: "border-l-demo-warning",
  info: "border-l-demo-info",
  neutral: "border-l-transparent",
};

// Feeds the `--flash-color` custom property the .animate-new-order
// keyframe (globals.css) reads, so the same flash animation can read as
// "a new order arrived" (primary) or "this card's status just changed"
// (whatever tone that status is) without two separate keyframes.
const toneCssVar: Record<Tone, string> = {
  primary: "var(--color-demo-primary)",
  danger: "var(--color-demo-danger)",
  warning: "var(--color-demo-warning)",
  info: "var(--color-demo-info)",
  neutral: "var(--color-demo-neutral)",
};

// A delivery note (gate code, "ring on arrival") is noise while the order
// is still being cooked — it only becomes relevant once it's actually
// heading out. Until then the card just flags that one exists.
const DELIVERY_NOTE_RELEVANT_STATUSES: Order["status"][] = ["redo", "levereras"];

export function OrderCard({
  order,
  timeLabel,
  timeTone,
  highlighted,
  justMoved,
  onOpenDetail,
  onAdvance,
  onReject,
  onMoveToStatus,
}: {
  order: Order;
  timeLabel: string;
  timeTone: Tone;
  highlighted?: boolean;
  // Brief tone-colored pulse after a status change — a quieter,
  // per-card echo of the toast that also doubles as the "yes, that
  // registered" cue for whoever's eyes aren't on the toast corner.
  justMoved?: Tone;
  onOpenDetail: () => void;
  // Optional — the read-only "Senast klara" history cards pass neither,
  // since a finished order has nothing left to advance or reject.
  onAdvance?: (order: Order) => void;
  onReject?: (order: Order) => void;
  // Present on both active and history cards — a "Klar" order accidentally
  // marked done can jump back to an earlier status through the same menu
  // an active card uses to skip ahead.
  onMoveToStatus?: (order: Order, status: OrderStatus) => void;
}) {
  const actionLabel = nextStatusActionLabel(order.status, order.fulfillment);
  const canReject = order.status === "ny" && Boolean(onReject);
  const [confirmingReject, setConfirmingReject] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  const showFullDeliveryNote = order.deliveryNote && DELIVERY_NOTE_RELEVANT_STATUSES.includes(order.status);
  const showDeliveryNoteHint = order.deliveryNote && !showFullDeliveryNote;
  const moveTargets = statusSequence(order.fulfillment).filter((status) => status !== order.status);

  useEffect(() => {
    if (!moveMenuOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (moveMenuRef.current && !moveMenuRef.current.contains(event.target as Node)) setMoveMenuOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMoveMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [moveMenuOpen]);

  return (
    <motion.div
      layout
      layoutId={`order-card-${order.id}`}
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }, default: { duration: 0.2 } }}
      role="button"
      tabIndex={0}
      onClick={onOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpenDetail();
      }}
      style={(highlighted || justMoved) ? ({ "--flash-color": toneCssVar[justMoved ?? "primary"] } as CSSProperties) : undefined}
      className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border border-demo-border border-l-4 ${timeToneBorderClasses[timeTone]} bg-demo-surface p-3 text-left transition-colors hover:bg-demo-surface-hover ${
        highlighted ? "animate-new-order" : justMoved ? "animate-status-flash" : ""
      }`}
    >
      {/* Header — the one thing staff actually need to triage with: how
          urgent is this, and whose order is it. Status is implied by which
          column the card sits in, so it isn't repeated here. needsAttention
          isn't set anywhere yet (no real exception source exists), but the
          card can already render it once one is wired up. */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {order.needsAttention ? (
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-label text-demo-danger">
              <AlertTriangle size={12} />
              Åtgärd krävs
            </p>
          ) : (
            <p className={`text-xs font-bold uppercase tracking-label ${timeToneClasses[timeTone]}`}>{timeLabel}</p>
          )}
          <p className="mt-0.5 font-display text-sm font-bold text-demo-text">
            {order.customerName} <span className="font-sans text-xs font-normal text-demo-text-faint">#{order.number}</span>
          </p>
        </div>
        {onMoveToStatus && (
          <div ref={moveMenuRef} className="relative -mr-1 -mt-1 shrink-0" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setConfirmingReject(false);
                setMoveMenuOpen((open) => !open);
              }}
              aria-haspopup="listbox"
              aria-expanded={moveMenuOpen}
              aria-label="Flytta till en annan status"
              title="Flytta till en annan status"
              className="rounded-full p-2 text-demo-text-faint transition-colors hover:bg-demo-surface-hover hover:text-demo-text-muted"
            >
              <MoreVertical size={16} />
            </button>
            {moveMenuOpen && (
              <div role="listbox" className="absolute right-0 top-full z-40 mt-1 w-44 rounded-xl border border-demo-border bg-demo-surface p-1.5 shadow-xl">
                {moveTargets.map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => {
                      onMoveToStatus(order, status);
                      setMoveMenuOpen(false);
                    }}
                    className="flex w-full items-center rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-demo-surface-hover"
                  >
                    <Badge tone={orderStatusTone[status]}>{orderStatusLabel(status, order.fulfillment)}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order — just the food. Modifiers get their own indented line so
          they read as "what changed" rather than part of the dish name. */}
      <div className="flex flex-col gap-1 border-t border-demo-border pt-2 text-sm text-demo-text">
        {order.lines.map((line, index) => (
          <div key={index}>
            <p className="font-medium">
              {line.quantity} × {line.name}
            </p>
            {line.toppings.map((topping) => (
              <p key={topping.optionId} className="ml-3 text-xs text-demo-text-muted">
                ↳ {topping.name}
              </p>
            ))}
          </div>
        ))}
      </div>

      {order.kitchenNote && (
        <p className="rounded-lg bg-demo-warning-soft px-2 py-1 text-xs font-medium text-demo-text">
          <span className="font-bold uppercase tracking-label">Kök </span>
          {order.kitchenNote}
        </p>
      )}

      {showFullDeliveryNote && (
        <p className="rounded-lg bg-demo-info-soft px-2 py-1 text-xs font-medium text-demo-text">
          <span className="font-bold uppercase tracking-label">Leverans </span>
          {order.deliveryNote}
        </p>
      )}

      {/* Footer — fulfillment + price as quiet context, then the one
          action that actually moves this order forward. The delivery-note
          hint (when there's one but it isn't relevant yet) rides on this
          same line rather than getting a row of its own. */}
      <p className="flex items-center gap-1.5 border-t border-demo-border pt-2 text-xs text-demo-text-muted">
        {order.fulfillment === "delivery" ? <Bike size={13} /> : <ShoppingBag size={13} />}
        {order.fulfillment === "delivery" ? "Leverans" : "Avhämtning"} · {formatSek(order.total)}
        {showDeliveryNoteHint && " · Instruktion"}
      </p>

      {(actionLabel || canReject) && onAdvance && (
        <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
          {canReject &&
            (confirmingReject ? (
              <div className="flex flex-1 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onReject?.(order);
                    setConfirmingReject(false);
                  }}
                  className="flex-1 rounded-full border border-demo-danger px-3 py-1.5 text-xs font-semibold text-demo-danger transition-transform hover:bg-demo-danger-soft active:scale-[0.97]"
                >
                  Bekräfta nekad order
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReject(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-demo-text-muted hover:text-demo-text"
                >
                  Avbryt
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReject(true)}
                className="shrink-0 rounded-full border border-demo-border px-3 py-1.5 text-xs font-medium text-demo-text-muted transition-colors hover:border-demo-danger hover:text-demo-danger"
              >
                Neka
              </button>
            ))}
          {actionLabel && !confirmingReject && (
            <Button className="flex-1 px-3.5 py-2 text-sm transition-transform active:scale-[0.97]" onClick={() => onAdvance(order)}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
