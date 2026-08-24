"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { Bike, CalendarDays, ChevronDown, ChevronUp, Clock, PackageCheck, Route, Wallet } from "lucide-react";
import { KpiCard } from "@/components/demo/KpiCard";
import { EmptyState } from "@/components/demo/EmptyState";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { CourierOrderCard } from "@/features/restaurant-platform/components/courier/CourierOrderCard";
import type { Order } from "@/features/restaurant-platform/types";
import type { Tone } from "@/components/demo/tokens";
import { formatClock, formatSek } from "@/features/restaurant-platform/utils/format";
import { isOpenNow, todaysHours } from "@/features/restaurant-platform/utils/hours";
import { orderStatusTone } from "@/features/restaurant-platform/utils/orderStatus";
import { deliveryDurationMinutes, deliveryDistanceKm, deliveryPayoutSek, isSameLocalDay } from "@/features/restaurant-platform/utils/courier";
import { playNewOrderChime } from "@/features/restaurant-platform/utils/sound";

const SEEN_PICKUP_STORAGE_KEY = "mumsa-courier-seen-pickup-ids";

function readSeenIds(): Set<string> | null {
  try {
    const raw = window.sessionStorage.getItem(SEEN_PICKUP_STORAGE_KEY);
    return raw === null ? null : new Set(JSON.parse(raw) as string[]);
  } catch {
    return null;
  }
}

function writeSeenIds(ids: Set<string>): void {
  try {
    window.sessionStorage.setItem(SEEN_PICKUP_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Private browsing / storage disabled — the highlight just won't
    // survive a tab switch then, no need to break the page over it.
  }
}

function byOldestFirst(a: Order, b: Order): number {
  return new Date(a.statusUpdatedAt).getTime() - new Date(b.statusUpdatedAt).getTime();
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function shortDateLabel(now: Date): string {
  return `${now.getDate()}/${now.getMonth() + 1}`;
}

// A personal "I'm working" switch, kept as local page state rather than
// global reducer state — nothing else in the demo needs to know about it.
// Going offline hides new pickups (nothing new gets handed to you), but an
// already-active delivery still shows so you can finish the job you're on.
function AvailabilityToggle({ online, onToggle }: { online: boolean; onToggle: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!online)}
      aria-pressed={online}
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-demo-border bg-demo-surface px-3.5 py-2 text-xs font-medium text-demo-text sm:text-sm"
    >
      Tillgänglig
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${online ? "bg-demo-primary" : "bg-demo-neutral-soft"}`}>
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            online ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
      <span className={online ? "text-demo-primary" : "text-demo-text-muted"}>{online ? "Online" : "Offline"}</span>
    </button>
  );
}

function HistoryRow({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm">
      <p className="min-w-0 truncate text-demo-text">
        <span className="font-medium">{order.customerName}</span>{" "}
        <span className="text-xs font-normal text-demo-text-faint">#{order.number}</span>
        <span className="text-xs text-demo-text-muted"> · {order.deliveryAddress}</span>
      </p>
      <span className="flex shrink-0 items-center gap-2 text-xs text-demo-text-muted">
        {formatClock(order.statusUpdatedAt)}
        <span className="font-semibold text-demo-primary">+{deliveryPayoutSek(order)} kr</span>
      </span>
    </div>
  );
}

export function CourierDashboard() {
  const { orders, restaurant, advanceOrder, setOrderStatus } = useRestaurantPlatform();
  const now = useMemo(() => new Date(), []);
  const [online, setOnline] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [justMovedTones, setJustMovedTones] = useState<Map<string, Tone>>(new Map());
  const [toast, setToast] = useState<{ message: string; undo?: () => void } | null>(null);
  const knownPickupIdsRef = useRef<Set<string> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, undo?: () => void) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, undo });
    toastTimerRef.current = setTimeout(() => setToast(null), 6000);
  }

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

  const deliveryOrders = useMemo(() => orders.filter((order) => order.fulfillment === "delivery"), [orders]);
  const pickupQueue = useMemo(() => deliveryOrders.filter((order) => order.status === "redo").sort(byOldestFirst), [deliveryOrders]);
  const activeDeliveries = useMemo(() => deliveryOrders.filter((order) => order.status === "levereras").sort(byOldestFirst), [deliveryOrders]);
  const deliveredToday = useMemo(
    () => deliveryOrders.filter((order) => order.status === "klar" && isSameLocalDay(order.statusUpdatedAt, now)).sort(byOldestFirst).reverse(),
    [deliveryOrders, now],
  );

  const earningsToday = deliveredToday.reduce((sum, order) => sum + deliveryPayoutSek(order), 0);
  const kmToday = deliveredToday.reduce((sum, order) => sum + deliveryDistanceKm(order), 0);
  const durations = deliveredToday.map(deliveryDurationMinutes).filter((value): value is number => value !== null);
  const avgDurationLabel = durations.length > 0 ? `${Math.round(average(durations))} min` : "–";

  // Same "arrived while I was on another tab" detection as the kitchen
  // board — a pickup ready while the courier had Kund or Ägare open should
  // still announce itself the moment this screen is back in view.
  useEffect(() => {
    const currentIds = new Set(pickupQueue.map((order) => order.id));
    const previousIds = knownPickupIdsRef.current ?? readSeenIds();
    if (previousIds) {
      const newIds = [...currentIds].filter((id) => !previousIds.has(id));
      if (newIds.length > 0) {
        playNewOrderChime();
        setHighlightedIds((prev) => new Set([...prev, ...newIds]));
        const timer = setTimeout(() => {
          setHighlightedIds((prev) => {
            const next = new Set(prev);
            for (const id of newIds) next.delete(id);
            return next;
          });
        }, 2500);
        knownPickupIdsRef.current = currentIds;
        writeSeenIds(currentIds);
        return () => clearTimeout(timer);
      }
    }
    knownPickupIdsRef.current = currentIds;
    writeSeenIds(currentIds);
  }, [pickupQueue]);

  function handlePickedUp(order: Order) {
    const previousStatus = order.status;
    advanceOrder(order.id); // redo -> levereras
    flashMove(order.id, orderStatusTone.levereras);
    showToast(`${order.customerName} · hämtad`, () => setOrderStatus(order.id, previousStatus));
  }

  function handleDelivered(order: Order) {
    const previousStatus = order.status;
    advanceOrder(order.id); // levereras -> klar
    flashMove(order.id, orderStatusTone.klar);
    showToast(`${order.customerName} · levererad (+${deliveryPayoutSek(order)} kr)`, () => setOrderStatus(order.id, previousStatus));
  }

  const open = isOpenNow(restaurant);
  const hours = todaysHours(restaurant);

  const showPickupSection = online && pickupQueue.length > 0;
  const showActiveSection = activeDeliveries.length > 0;
  const hasNothingToShow = !showPickupSection && !showActiveSection;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-bold text-demo-text">Leveranser</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm text-demo-text-muted">
            <CalendarDays size={14} className="shrink-0" />
            {shortDateLabel(now)}
            <span className="text-demo-border">·</span>
            <Clock size={14} className={`shrink-0 ${open ? "text-demo-primary" : "text-demo-text-faint"}`} />
            {open && hours ? hours.close : "Stängt"}
          </p>
          <AvailabilityToggle online={online} onToggle={setOnline} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard icon={PackageCheck} label="Levererat idag" value={deliveredToday.length} tone="primary" />
        <KpiCard icon={Wallet} label="Intjänat idag" value={formatSek(earningsToday)} tone="primary" />
        <KpiCard icon={Clock} label="Snitt leveranstid" value={avgDurationLabel} tone="info" />
        <KpiCard icon={Route} label="Körda mil" value={`${kmToday.toFixed(1)} km`} tone="warning" />
      </div>

      {!restaurant.deliveryEnabled ? (
        <EmptyState
          icon={Bike}
          title="Leveranser är avstängda"
          description="Restaurangen tar just nu inte emot leveransbeställningar. Kolla igen om en stund."
        />
      ) : hasNothingToShow ? (
        !online ? (
          <EmptyState
            icon={Bike}
            title="Du är offline"
            description="Slå på Tillgänglig ovan för att se nya hämtningar."
            action={
              <button
                type="button"
                onClick={() => setOnline(true)}
                className="rounded-full bg-demo-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-demo-primary-hover"
              >
                Bli tillgänglig
              </button>
            }
          />
        ) : (
          <EmptyState icon={PackageCheck} title="Inga leveranser just nu" description="Nya ordrar redo för hämtning dyker upp här." />
        )
      ) : (
        <LayoutGroup id="courier-queue">
          <div className="flex flex-col gap-5">
            {showPickupSection && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-demo-text">Att hämta · {pickupQueue.length}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {pickupQueue.map((order) => (
                      <CourierOrderCard
                        key={order.id}
                        order={order}
                        mode="pickup"
                        actionLabel="Hämtad"
                        onAction={handlePickedUp}
                        highlighted={highlightedIds.has(order.id)}
                        justMoved={justMovedTones.get(order.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {showActiveSection && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-demo-text">Pågående leverans · {activeDeliveries.length}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {activeDeliveries.map((order) => (
                      <CourierOrderCard
                        key={order.id}
                        order={order}
                        mode="active"
                        actionLabel="Levererad"
                        onAction={handleDelivered}
                        justMoved={justMovedTones.get(order.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </LayoutGroup>
      )}

      {deliveredToday.length > 0 && (
        <div className="border-t border-demo-border pt-4">
          <button
            type="button"
            onClick={() => setShowHistory((value) => !value)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-label text-demo-text-faint hover:text-demo-text-muted"
          >
            Historik · {deliveredToday.length} levererade idag
            {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showHistory && (
            <div className="mt-3 flex flex-col divide-y divide-demo-border rounded-2xl border border-demo-border bg-demo-surface px-3">
              {deliveredToday.map((order) => (
                <HistoryRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

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
    </div>
  );
}
