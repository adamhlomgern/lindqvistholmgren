"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import { EmptyState } from "@/components/demo/EmptyState";
import type { Tone } from "@/components/demo/tokens";
import { BookingCard } from "@/features/booking-platform/components/kalender/BookingCard";
import type { Booking, Customer, Service, Staff } from "@/features/booking-platform/types";
import { bookingLabels } from "@/features/booking-platform/utils/labels";
import { bookingStatusTone } from "@/features/booking-platform/utils/status";
import {
  addDays,
  buildMonthGrid,
  formatDayLongSv,
  formatMonthHeaderSv,
  formatTimeSv,
  formatWeekRangeSv,
  formatWeekdayShortSv,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfWeek,
} from "@/features/booking-platform/utils/dates";

type Mode = "day" | "week" | "month";

const modeOptions: { key: Mode; label: string }[] = [
  { key: "day", label: "Dag" },
  { key: "week", label: "Vecka" },
  { key: "month", label: "Månad" },
];

const weekdayHeaders = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

const toneDotClasses: Record<Tone, string> = {
  primary: "bg-demo-primary",
  danger: "bg-demo-danger",
  warning: "bg-demo-warning",
  info: "bg-demo-info",
  neutral: "bg-demo-neutral",
};

// Day/vecka/månad-vy ovanpå samma bokningsdata som listläget (BookingQueue)
// och ägarens dashboard delar — vecko-/månadscellerna är medvetet bara en
// räkning + status-prickar (inte en full timgrid), man klickar sig in i en
// dag för att se/agera på de faktiska bokningarna via samma BookingCard som
// listläget redan använder.
export function CalendarView({
  bookings,
  services,
  staff,
  customers,
  onComplete,
  onNoShow,
  onCancel,
}: {
  bookings: Booking[];
  services: Service[];
  staff: Staff[];
  customers: Customer[];
  onComplete?: (bookingId: string) => void;
  onNoShow?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("week");
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));

  function bookingsOn(date: Date): Booking[] {
    return bookings
      .filter((booking) => isSameDay(new Date(booking.start), date))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  function goToDay(date: Date) {
    setAnchor(date);
    setMode("day");
  }

  function step(direction: 1 | -1) {
    if (mode === "day") {
      setAnchor((current) => addDays(current, direction));
    } else if (mode === "week") {
      setAnchor((current) => addDays(current, direction * 7));
    } else {
      setAnchor((current) => {
        const next = new Date(current);
        next.setMonth(next.getMonth() + direction);
        return next;
      });
    }
  }

  const today = startOfDay(new Date());
  const weekStart = startOfWeek(anchor);
  const monthGrid = buildMonthGrid(anchor);

  const headerLabel =
    mode === "day" ? formatDayLongSv(anchor) : mode === "week" ? formatWeekRangeSv(weekStart) : formatMonthHeaderSv(anchor);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-demo-border bg-demo-neutral-soft p-1">
          {modeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMode(option.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === option.key ? "bg-demo-text text-demo-surface" : "text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Föregående"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-demo-border text-demo-text-muted transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <ChevronLeft size={15} />
          </button>
          <p className="min-w-[8rem] text-center text-sm font-semibold text-demo-text sm:min-w-[12rem]">{headerLabel}</p>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Nästa"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-demo-border text-demo-text-muted transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(startOfDay(new Date()))}
            className="rounded-full border border-demo-border px-3 py-1.5 text-xs font-semibold text-demo-text-muted transition-colors hover:border-demo-primary hover:text-demo-primary"
          >
            Idag
          </button>
        </div>
      </div>

      {mode === "day" &&
        (bookingsOn(anchor).length === 0 ? (
          <EmptyState icon={Store} title="Inga bokningar" description="Inga bokningar den här dagen." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookingsOn(anchor).map((booking) => {
              const labels = bookingLabels(booking, { services, staff, customers });
              const actionable = booking.status === "confirmed";
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  {...labels}
                  onComplete={actionable && onComplete ? () => onComplete(booking.id) : undefined}
                  onNoShow={actionable && onNoShow ? () => onNoShow(booking.id) : undefined}
                  onCancel={actionable && onCancel ? () => onCancel(booking.id) : undefined}
                />
              );
            })}
          </div>
        ))}

      {mode === "week" && (
        <div className="scroll-area overflow-x-auto pb-1">
          <div className="grid min-w-[840px] grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)).map((date) => {
              const dayBookings = bookingsOn(date);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => goToDay(date)}
                  className={`flex min-h-[9rem] flex-col gap-1.5 rounded-2xl border p-2.5 text-left transition-colors hover:border-demo-primary ${
                    isToday ? "border-demo-primary bg-demo-primary-soft" : "border-demo-border bg-demo-surface"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-label ${
                      isToday ? "text-demo-primary-soft-text" : "text-demo-text-faint"
                    }`}
                  >
                    {formatWeekdayShortSv(date)} {date.getDate()}
                  </p>
                  <div className="flex flex-col gap-1">
                    {dayBookings.slice(0, 4).map((booking) => (
                      <span key={booking.id} className="flex items-center gap-1.5 text-xs text-demo-text">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDotClasses[bookingStatusTone[booking.status]]}`} />
                        <span className="truncate">{formatTimeSv(booking.start)}</span>
                      </span>
                    ))}
                    {dayBookings.length > 4 && <span className="text-xs text-demo-text-faint">+{dayBookings.length - 4} till</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "month" && (
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-label text-demo-text-faint sm:gap-2">
            {weekdayHeaders.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthGrid.map((date) => {
              const dayBookings = bookingsOn(date);
              const inMonth = isSameMonth(date, anchor);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => goToDay(date)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-1 text-center transition-colors hover:border-demo-primary sm:aspect-auto sm:h-20 sm:items-start sm:justify-start sm:p-2 ${
                    isToday ? "border-demo-primary bg-demo-primary-soft" : "border-demo-border bg-demo-surface"
                  } ${inMonth ? "" : "opacity-40"}`}
                >
                  <span className={`text-xs font-semibold ${isToday ? "text-demo-primary-soft-text" : "text-demo-text"}`}>
                    {date.getDate()}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="hidden rounded-full bg-demo-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-demo-primary-soft-text sm:inline-flex">
                      {dayBookings.length} bokn.
                    </span>
                  )}
                  {dayBookings.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-demo-primary sm:hidden" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
