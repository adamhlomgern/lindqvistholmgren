"use client";

import { useState } from "react";
import { HorizontalScroller } from "@/components/demo/HorizontalScroller";
import type { DaySlots } from "@/features/booking-platform/utils/slots";
import { formatDayHeaderSv, formatTimeSv } from "@/features/booking-platform/utils/dates";

export function SlotPicker({
  days,
  selectedSlotIso,
  onSelect,
}: {
  days: DaySlots[];
  selectedSlotIso: string | null;
  onSelect: (slotIso: string) => void;
}) {
  const firstDayWithSlots = days.findIndex((day) => day.slots.length > 0);
  const anchorIndex = firstDayWithSlots === -1 ? 0 : firstDayWithSlots;
  // The signature identifies the *shape* of availability (which days have
  // slots), not the specific active day — bundling it with activeDayIndex
  // in one state value lets the render-time check below re-anchor only when
  // the shape actually changes (e.g. switching service/staff), while a
  // manual day-tab click updates activeDayIndex without touching signature,
  // so it sticks instead of being immediately overwritten. This replaces an
  // effect-based reset (React's "adjusting state when a prop changes"
  // pattern: https://react.dev/learn/you-might-not-need-an-effect).
  const daySignature = days.map((day) => `${day.date}:${day.slots.length}`).join(",");
  const [state, setState] = useState({ signature: daySignature, activeDayIndex: anchorIndex });
  if (state.signature !== daySignature) {
    setState({ signature: daySignature, activeDayIndex: anchorIndex });
  }
  const activeDayIndex = state.activeDayIndex;
  function setActiveDayIndex(index: number) {
    setState((prev) => ({ ...prev, activeDayIndex: index }));
  }

  const activeDay = days[activeDayIndex];

  return (
    <div className="flex flex-col gap-4">
      <HorizontalScroller className="scrollbar-hide flex gap-2 pb-1" fadeFrom="from-demo-surface" rounding="full">
        {days.map((day, index) => {
          const active = index === activeDayIndex;
          const hasSlots = day.slots.length > 0;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDayIndex(index)}
              disabled={!hasSlots}
              className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                active ? "border-demo-primary bg-demo-primary text-white" : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {formatDayHeaderSv(day.date)}
              <span className={active ? "text-white/80" : "text-demo-text-faint"}>{hasSlots ? `${day.slots.length} tider` : "Fullbokat"}</span>
            </button>
          );
        })}
      </HorizontalScroller>

      {activeDay && activeDay.slots.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {activeDay.slots.map((slot) => {
            const active = slot === selectedSlotIso;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelect(slot)}
                aria-pressed={active}
                className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                  active ? "border-demo-primary bg-demo-primary text-white" : "border-demo-border bg-demo-surface text-demo-text hover:bg-demo-surface-hover"
                }`}
              >
                {formatTimeSv(slot)}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-demo-border px-4 py-6 text-center text-sm text-demo-text-faint">
          Inga lediga tider den här dagen.
        </p>
      )}
    </div>
  );
}
