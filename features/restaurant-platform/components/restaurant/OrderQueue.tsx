"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { AlertTriangle, ChefHat, ChevronDown, ChevronUp } from "lucide-react";
import { EmptyState } from "@/components/demo/EmptyState";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { DeliveryToggle } from "@/features/restaurant-platform/components/restaurant/DeliveryToggle";
import { OrderCard } from "@/features/restaurant-platform/components/restaurant/OrderCard";
import { OrderDetailDrawer } from "@/features/restaurant-platform/components/restaurant/OrderDetailDrawer";
import type { Order, OrderStatus } from "@/features/restaurant-platform/types";
import type { Tone } from "@/components/demo/tokens";
import { nextStatus, orderStatusLabel, orderStatusTone, urgencyLevel, urgencyTone } from "@/features/restaurant-platform/utils/orderStatus";
import { formatClock, minutesSince } from "@/features/restaurant-platform/utils/format";
import { isOpenNow } from "@/features/restaurant-platform/utils/hours";
import { useViewportFillHeight } from "@/features/restaurant-platform/utils/useViewportFillHeight";
import { playNewOrderChime } from "@/features/restaurant-platform/utils/sound";

const SEEN_ORDERS_STORAGE_KEY = "mumsa-restaurant-seen-order-ids";

function readSeenOrderIds(): Set<string> | null {
  try {
    const raw = window.sessionStorage.getItem(SEEN_ORDERS_STORAGE_KEY);
    return raw === null ? null : new Set(JSON.parse(raw) as string[]);
  } catch {
    // Private browsing / storage disabled — the arrival just won't be
    // caught across a navigation then, no need to break the page over it.
    return null;
  }
}

function writeSeenOrderIds(ids: Set<string>): void {
  try {
    window.sessionStorage.setItem(SEEN_ORDERS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // See readSeenOrderIds.
  }
}

// A new order waiting to be accepted is the single most time-critical
// thing on this screen — it escalates much faster than an order that's
// already being cooked.
const NEW_ORDER_LATE_MINUTES = 5;
// Once an order is sitting in Redo, the clock is about food quality
// (getting cold), not the kitchen's prep-time target — a separate,
// shorter threshold than either Nya or Tillagas.
const READY_WAIT_LATE_MINUTES = 15;
// A column only scrolls once it's genuinely busy. Below this, every order
// should just be visible — internal scroll is an overflow behavior for
// real load, not the default state at two or three orders.
const COLUMN_SCROLL_THRESHOLD = 4;

const dotClasses: Record<Tone, string> = {
  primary: "bg-demo-primary",
  danger: "bg-demo-danger",
  warning: "bg-demo-warning",
  info: "bg-demo-info",
  neutral: "bg-demo-neutral",
};

// Leveranser rows aren't OrderCards, so they get their own small
// text/border tone maps rather than reaching into OrderCard's internals.
const rowTimeToneClasses: Record<Tone, string> = {
  primary: "text-demo-primary",
  danger: "text-demo-danger",
  warning: "text-demo-warning",
  info: "text-demo-info",
  neutral: "text-demo-text-muted",
};

const rowTimeToneBorderClasses: Record<Tone, string> = {
  primary: "border-l-demo-primary",
  danger: "border-l-demo-danger",
  warning: "border-l-demo-warning",
  info: "border-l-demo-info",
  neutral: "border-l-transparent",
};

function byOldestFirst(a: Order, b: Order): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function timeInfoFor(minutes: number, lateAfterMinutes: number, prefix?: string): { label: string; tone: Tone } {
  const urgency = urgencyLevel(minutes, lateAfterMinutes);
  if (urgency === "late") return { label: `SEN · ${minutes} min`, tone: urgencyTone.late };
  return { label: prefix ? `${prefix} · ${minutes} min` : `${minutes} min`, tone: urgencyTone[urgency] };
}

// Total order age — this is "how long has the customer been waiting to
// even be acknowledged", the most critical measure for a fresh order.
function newOrderTimeInfo(order: Order): { label: string; tone: Tone } {
  return timeInfoFor(minutesSince(order.createdAt), NEW_ORDER_LATE_MINUTES, "NY");
}

// Time *in this status* — measured from when "Börja tillaga" was pressed,
// not from when the order was placed, so a pizza that waited 10 minutes to
// be accepted but has only been in the oven for 2 doesn't misleadingly
// read as almost-late.
function cookingTimeInfo(order: Order, targetMinutes: number): { label: string; tone: Tone } {
  return timeInfoFor(minutesSince(order.statusUpdatedAt), targetMinutes);
}

function readyTimeInfo(order: Order): { label: string; tone: Tone } {
  return timeInfoFor(minutesSince(order.statusUpdatedAt), READY_WAIT_LATE_MINUTES, "Redo");
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: Tone }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`mb-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClasses[tone]}`} />
      <span className="font-display text-base font-bold leading-none text-demo-text">{value}</span>
      <span className="text-xs text-demo-text-muted">{label}</span>
    </div>
  );
}

// Width ratio (36/36/28) is applied by the wrapper the caller puts around
// each Column, not here. Scrolling is only turned on past
// COLUMN_SCROLL_THRESHOLD orders — under that, the list just renders at
// its natural height, even if that means the page runs a bit past the
// viewport. A capped `maxListHeight` (from the caller's viewport
// measurement) only applies once scrolling is actually active.
function Column({
  title,
  orders,
  timeInfo,
  highlightedIds,
  justMovedTones,
  onOpenDetail,
  onAdvance,
  onReject,
  onMoveToStatus,
  maxListHeight,
}: {
  title: string;
  orders: Order[];
  timeInfo: (order: Order) => { label: string; tone: Tone };
  highlightedIds: Set<string>;
  justMovedTones: Map<string, Tone>;
  onOpenDetail: (order: Order) => void;
  onAdvance: (order: Order) => void;
  onReject: (order: Order) => void;
  onMoveToStatus: (order: Order, status: OrderStatus) => void;
  maxListHeight?: number;
}) {
  const needsScroll = orders.length > COLUMN_SCROLL_THRESHOLD;
  // A column-level signal for "something in here is overdue" — visible even
  // if the offending card is scrolled out of view, so a glance at just the
  // headers surfaces it.
  const hasLate = orders.some((order) => timeInfo(order).tone === "danger");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-demo-text">
          {title}
          {hasLate && <AlertTriangle size={14} className="text-demo-danger" />}
        </p>
        <span className="rounded-full bg-demo-neutral-soft px-2 py-0.5 text-xs font-semibold text-demo-text-muted">{orders.length}</span>
      </div>
      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-demo-border px-3 py-6 text-center text-xs text-demo-text-faint">Inget här just nu</p>
      ) : (
        <div
          className={`flex flex-col gap-2.5 ${needsScroll ? "scroll-area overflow-y-auto lg:pr-1" : ""}`}
          style={needsScroll && maxListHeight ? { maxHeight: maxListHeight } : undefined}
        >
          <AnimatePresence mode="popLayout">
            {orders.map((order) => {
              const info = timeInfo(order);
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  timeLabel={info.label}
                  timeTone={info.tone}
                  highlighted={highlightedIds.has(order.id)}
                  justMoved={justMovedTones.get(order.id)}
                  onOpenDetail={() => onOpenDetail(order)}
                  onAdvance={onAdvance}
                  onReject={onReject}
                  onMoveToStatus={onMoveToStatus}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// How long an action-confirmation toast (with its Ångra button) stays up.
// Longer than a pure notification would need, since this one asks for a
// decision, not just an FYI.
const ACTION_TOAST_MS = 6000;

export function OrderQueue() {
  const { orders, restaurant, advanceOrder, cancelOrder, setOrderStatus } = useRestaurantPlatform();
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  // A brief per-card tone flash after a status change — the "yes, that
  // registered" cue for whoever's eyes aren't on the toast in the corner.
  const [justMovedTones, setJustMovedTones] = useState<Map<string, Tone>>(new Map());
  const [toast, setToast] = useState<{ message: string; undo?: () => void } | null>(null);
  const knownOrderIdsRef = useRef<Set<string> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Measures from where the columns start, not the whole board — only used
  // as a cap for a column once it actually needs to scroll (see Column
  // above), not to force the page to a fixed viewport height.
  const { ref: columnsRef, height: columnsMaxHeight } = useViewportFillHeight(20);

  // A single toast slot shared by "a new order arrived" and "you just
  // advanced/rejected an order" — both are short-lived and one replacing
  // the other on the rare overlap is fine for a demo.
  function showToast(message: string, undo?: () => void) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, undo });
    toastTimerRef.current = setTimeout(() => setToast(null), ACTION_TOAST_MS);
  }

  // Flashes a card's border/background in the tone of its new status for a
  // moment — see justMovedTones above. Deliberately not applied to
  // handleReject: that path already has its own 2-step confirm UI, which
  // is its own confirmation.
  function flashMove(orderId: string, tone: Tone) {
    setJustMovedTones((prev) => new Map(prev).set(orderId, tone));
    setTimeout(() => {
      setJustMovedTones((prev) => {
        const next = new Map(prev);
        next.delete(orderId);
        return next;
      });
    }, 1000);
  }

  // The one place that actually changes an order's status outside of
  // rejecting it — used by the button flow (via handleAdvance, which just
  // resolves what "next" means) and by the card's quick-move menu (which
  // can target any reachable status directly, including moving an order
  // backwards). Clicking a card's own action already tells you *that* it
  // worked (the card visibly changes column), but not clearly *what*
  // happened or that a click on the button — as opposed to the card
  // itself, which opens the drawer — actually registered. This makes both
  // explicit, and the undo gives a way back from a mis-click before the
  // order quietly drops into history.
  function handleMoveToStatus(order: Order, targetStatus: OrderStatus) {
    if (targetStatus === order.status) return;
    const previousStatusValue = order.status;
    setOrderStatus(order.id, targetStatus);
    flashMove(order.id, orderStatusTone[targetStatus]);
    showToast(`${order.customerName} → ${orderStatusLabel(targetStatus, order.fulfillment)}`, () =>
      setOrderStatus(order.id, previousStatusValue),
    );
  }

  function handleAdvance(order: Order) {
    const target = nextStatus(order);
    if (!target) return;
    // Goes through advanceOrder (not handleMoveToStatus) so the sequence
    // validation and statusUpdatedAt bookkeeping stay in one place; the
    // toast/undo/flash trio is duplicated deliberately since this path's
    // "next status" comes from a different source (statusSequence) than
    // the quick-move menu's (whatever the user picked).
    const previousStatusValue = order.status;
    advanceOrder(order.id);
    flashMove(order.id, orderStatusTone[target]);
    showToast(`${order.customerName} → ${orderStatusLabel(target, order.fulfillment)}`, () =>
      setOrderStatus(order.id, previousStatusValue),
    );
  }

  function handleReject(order: Order) {
    cancelOrder(order.id);
    showToast(`Order #${order.number} nekad`, () => setOrderStatus(order.id, "ny"));
  }

  // Ctrl/Cmd+Z re-runs whatever undo the currently-visible toast carries —
  // the same action the "Ångra" button performs, just from the keyboard.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && toast?.undo) {
        event.preventDefault();
        toast.undo();
        setToast(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast]);

  // Detect orders that arrived since this screen was last looked at, and
  // give them a moment of sound + visual highlight + a toast.
  //
  // The in-memory ref alone isn't enough: this component unmounts every
  // time staff navigate to another tab (Kund/Ägare) and remounts fresh on
  // return, which is exactly the realistic path in this single-tab demo —
  // place an order as "Kund", switch to "Restaurang", and see it arrive.
  // sessionStorage carries the last-seen id set across that remount so the
  // arrival is still caught; a plain ref wouldn't survive it. Seed data on
  // the very first visit this session is intentionally excluded.
  useEffect(() => {
    const currentIds = new Set(orders.map((order) => order.id));
    const previousIds = knownOrderIdsRef.current ?? readSeenOrderIds();
    if (previousIds) {
      const newIds = [...currentIds].filter((id) => !previousIds.has(id));
      if (newIds.length > 0) {
        const newOrder = orders.find((order) => order.id === newIds[0]);
        playNewOrderChime();
        if (newOrder) showToast(`Ny order · #${newOrder.number}`);
        setHighlightedIds((prev) => new Set([...prev, ...newIds]));
        const highlightTimer = setTimeout(() => {
          setHighlightedIds((prev) => {
            const next = new Set(prev);
            for (const id of newIds) next.delete(id);
            return next;
          });
        }, 2500);
        knownOrderIdsRef.current = currentIds;
        writeSeenOrderIds(currentIds);
        return () => clearTimeout(highlightTimer);
      }
    }
    knownOrderIdsRef.current = currentIds;
    writeSeenOrderIds(currentIds);
  }, [orders]);

  if (orders.length === 0) {
    return <EmptyState icon={ChefHat} title="Inga ordrar ännu" description="Nya beställningar från kunder dyker upp här live." />;
  }

  const nyaOrders = orders.filter((order) => order.status === "ny").sort(byOldestFirst);
  const tillagasOrders = orders.filter((order) => order.status === "tillagas").sort(byOldestFirst);
  const redoOrders = orders.filter((order) => order.status === "redo").sort(byOldestFirst);
  const leveransOrders = orders.filter((order) => order.status === "levereras").sort(byOldestFirst);
  const doneToday = [...orders.filter((order) => order.status === "klar")].sort(
    (a, b) => new Date(b.statusUpdatedAt).getTime() - new Date(a.statusUpdatedAt).getTime(),
  );

  const openOrder = orders.find((order) => order.id === openOrderId) ?? null;
  const open = isOpenNow(restaurant);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-demo-border bg-demo-surface px-4 py-3">
        <div className="flex flex-wrap items-center divide-x divide-demo-border">
          <span className="flex items-center gap-1.5 pr-4 text-sm font-semibold text-demo-text">
            <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
            {open ? "Öppet" : "Stängt"}
          </span>
          <span className="px-4">
            <StatChip label="nya" value={nyaOrders.length} tone="info" />
          </span>
          <span className="px-4">
            <StatChip label="tillagas" value={tillagasOrders.length} tone="warning" />
          </span>
          <span className="px-4">
            <StatChip label="redo" value={redoOrders.length} tone="primary" />
          </span>
          {restaurant.deliveryEnabled && (
            <span className="pl-4">
              <StatChip label="ute" value={leveransOrders.length} tone="neutral" />
            </span>
          )}
        </div>
        <DeliveryToggle />
      </div>

      <LayoutGroup id="order-queue">
        {/* Nya/Tillagas carry the actual work and get ~36% each; Redo is a
            waiting state, not a task, so it gets ~28%. Columns aren't forced
            to a shared height (items-start) — a quiet Redo column shouldn't
            get artificially stretched to match a busy Nya. */}
        <div ref={columnsRef} className="flex flex-col items-start gap-4 lg:flex-row">
          <div className="flex w-full min-w-0 flex-col lg:flex-[9]">
            <Column
              title="Nya"
              orders={nyaOrders}
              timeInfo={newOrderTimeInfo}
              highlightedIds={highlightedIds}
              justMovedTones={justMovedTones}
              onOpenDetail={(order) => setOpenOrderId(order.id)}
              onAdvance={handleAdvance}
              onReject={handleReject}
              onMoveToStatus={handleMoveToStatus}
              maxListHeight={columnsMaxHeight}
            />
          </div>
          <div className="flex w-full min-w-0 flex-col lg:flex-[9]">
            <Column
              title="Tillagas"
              orders={tillagasOrders}
              timeInfo={(order) => cookingTimeInfo(order, restaurant.estimatedPrepMinutes)}
              highlightedIds={highlightedIds}
              justMovedTones={justMovedTones}
              onOpenDetail={(order) => setOpenOrderId(order.id)}
              onAdvance={handleAdvance}
              onReject={handleReject}
              onMoveToStatus={handleMoveToStatus}
              maxListHeight={columnsMaxHeight}
            />
          </div>
          <div className="flex w-full min-w-0 flex-col lg:flex-[7]">
            <Column
              title="Redo"
              orders={redoOrders}
              timeInfo={readyTimeInfo}
              highlightedIds={highlightedIds}
              justMovedTones={justMovedTones}
              onOpenDetail={(order) => setOpenOrderId(order.id)}
              onAdvance={handleAdvance}
              onReject={handleReject}
              onMoveToStatus={handleMoveToStatus}
              maxListHeight={columnsMaxHeight}
            />
          </div>
        </div>

        {/* Deliveries already left the kitchen — a different job (tracking a
            driver, not cooking) — so it's a single compact line per order,
            not a card, and doesn't compete with the columns for space. */}
        {restaurant.deliveryEnabled && leveransOrders.length > 0 && (
          <div className="shrink-0 rounded-xl border border-demo-border bg-demo-surface px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-demo-text-faint">
              Leveranser · {leveransOrders.length} ute
              {leveransOrders.some((order) => timeInfoFor(minutesSince(order.statusUpdatedAt), READY_WAIT_LATE_MINUTES).tone === "danger") && (
                <AlertTriangle size={12} className="text-demo-danger" />
              )}
            </p>
            <div className="scroll-area mt-1 flex max-h-32 flex-col divide-y divide-demo-border overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {leveransOrders.map((order) => {
                  const minutes = minutesSince(order.statusUpdatedAt);
                  const info = timeInfoFor(minutes, READY_WAIT_LATE_MINUTES);
                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenOrderId(order.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") setOpenOrderId(order.id);
                      }}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border-l-2 ${rowTimeToneBorderClasses[info.tone]} px-2 py-1.5 text-left text-sm transition-colors hover:bg-demo-surface-hover`}
                    >
                      <p className="min-w-0 truncate text-demo-text">
                        <span className="font-medium">{order.customerName}</span>{" "}
                        <span className="text-xs font-normal text-demo-text-faint">#{order.number}</span>
                        <span className="text-xs text-demo-text-muted"> · {order.deliveryAddress}</span>
                      </p>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className={`text-xs ${rowTimeToneClasses[info.tone]}`}>{info.label}</span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAdvance(order);
                          }}
                          className="rounded-full bg-demo-primary px-3 py-1 text-xs font-semibold text-white transition-transform hover:bg-demo-primary-hover active:scale-[0.97]"
                        >
                          Levererad
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Historik — deliberately separated from the live board, both
            visually (its own section below) and structurally (collapsed by
            default). This is where an operator looks back, not where they
            make the next decision. */}
        {doneToday.length > 0 && (
          <div className="border-t border-demo-border pt-4">
            <button
              type="button"
              onClick={() => setShowHistory((value) => !value)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-label text-demo-text-faint hover:text-demo-text-muted"
            >
              Historik · {doneToday.length} klara idag
              {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showHistory && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {doneToday.slice(0, 9).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      timeLabel={formatClock(order.statusUpdatedAt)}
                      timeTone="neutral"
                      justMoved={justMovedTones.get(order.id)}
                      onOpenDetail={() => setOpenOrderId(order.id)}
                      onMoveToStatus={handleMoveToStatus}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </LayoutGroup>

      {toast && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-demo-text pl-4 pr-2 py-2 text-sm font-semibold text-demo-surface shadow-xl">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-demo-primary" />
            {toast.message}
          </span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
                setToast(null);
              }}
              className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-label transition-colors hover:bg-white/25"
            >
              Ångra
            </button>
          )}
        </div>
      )}

      {/* Keyed by order id so switching to a different order resets local
          drawer state (like a pending "Neka" confirmation) via a fresh
          mount instead of a setState-in-effect. */}
      <OrderDetailDrawer
        key={openOrder?.id ?? "closed"}
        order={openOrder}
        onClose={() => setOpenOrderId(null)}
        onAdvance={handleAdvance}
        onReject={handleReject}
      />
    </div>
  );
}
