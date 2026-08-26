"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Store } from "lucide-react";
import { EmptyState } from "@/components/demo/EmptyState";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { BookingCard } from "@/features/booking-platform/components/kalender/BookingCard";
import type { Booking } from "@/features/booking-platform/types";
import { bookingTiming } from "@/features/booking-platform/utils/status";
import { formatDayHeaderSv } from "@/features/booking-platform/utils/dates";
import { isOpenNow } from "@/features/booking-platform/utils/hours";
import { bookingLabels } from "@/features/booking-platform/utils/labels";
import { CalendarView } from "@/features/booking-platform/components/kalender/CalendarView";

function byStartAscending(a: Booking, b: Booking): number {
  return new Date(a.start).getTime() - new Date(b.start).getTime();
}

function byStartDescending(a: Booking, b: Booking): number {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
}

export function BookingQueue() {
  const { organizations, currentOrgSlug, services, staff, customers, bookings, completeBooking, markNoShow, cancelBooking } =
    useBookingPlatform();
  const [showHistory, setShowHistory] = useState(false);
  const [view, setView] = useState<"lista" | "kalender">("lista");
  const organization = organizations.find((org) => org.slug === currentOrgSlug);

  if (!organization) {
    return <EmptyState icon={Store} title="Ingen salong vald" description="Välj en salong i topbaren för att se bokningskön." />;
  }

  const orgBookings = bookings.filter((booking) => booking.organizationId === organization.id);

  function labelsFor(booking: Booking) {
    return bookingLabels(booking, { services, staff, customers });
  }

  if (orgBookings.length === 0) {
    return <EmptyState icon={Store} title="Inga bokningar ännu" description="Nya bokningar från kunder dyker upp här." />;
  }

  const today = orgBookings.filter((booking) => bookingTiming(booking) === "today").sort(byStartAscending);
  const upcoming = orgBookings
    .filter((booking) => bookingTiming(booking) === "upcoming" && booking.status === "confirmed")
    .sort(byStartAscending);
  const past = orgBookings.filter((booking) => bookingTiming(booking) === "past").sort(byStartDescending);

  const open = isOpenNow(organization);
  const todayConfirmedCount = today.filter((booking) => booking.status === "confirmed").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-demo-border bg-demo-surface px-4 py-3">
        <div>
          <h1 className="font-display text-lg font-bold text-demo-text">{organization.name}</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-demo-text-muted">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
            {open ? "Öppet nu" : "Stängt"}
          </p>
        </div>
        <p className="text-sm text-demo-text-muted">
          <span className="font-display text-lg font-bold text-demo-text">{todayConfirmedCount}</span> bokningar idag
        </p>
      </div>

      <div className="flex items-center gap-1 self-start rounded-full border border-demo-border bg-demo-neutral-soft p-1">
        {(
          [
            { key: "lista", label: "Lista" },
            { key: "kalender", label: "Kalender" },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setView(option.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              view === option.key ? "bg-demo-text text-demo-surface" : "text-demo-text-muted hover:text-demo-text"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {view === "kalender" ? (
        <CalendarView
          bookings={orgBookings}
          services={services}
          staff={staff}
          customers={customers}
          onComplete={completeBooking}
          onNoShow={markNoShow}
          onCancel={cancelBooking}
        />
      ) : (
        <>
      <div>
        <h2 className="font-display text-lg font-bold text-demo-text">Idag</h2>
        {today.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-demo-border px-4 py-8 text-center text-sm text-demo-text-faint">
            Inga bokningar idag.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {today.map((booking) => {
              const labels = labelsFor(booking);
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  {...labels}
                  onComplete={booking.status === "confirmed" ? () => completeBooking(booking.id) : undefined}
                  onNoShow={booking.status === "confirmed" ? () => markNoShow(booking.id) : undefined}
                  onCancel={booking.status === "confirmed" ? () => cancelBooking(booking.id) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-demo-text">Kommande dagar</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-demo-border px-4 py-8 text-center text-sm text-demo-text-faint">
            Inga kommande bokningar.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-4">
            {Object.entries(
              upcoming.reduce<Record<string, Booking[]>>((groups, booking) => {
                const key = booking.start.slice(0, 10);
                (groups[key] ??= []).push(booking);
                return groups;
              }, {}),
            ).map(([dateKey, dayBookings]) => (
              <div key={dateKey}>
                <p className="text-xs font-semibold uppercase tracking-label text-demo-text-faint">{formatDayHeaderSv(dateKey)}</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {dayBookings.map((booking) => {
                    const labels = labelsFor(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        {...labels}
                        onComplete={() => completeBooking(booking.id)}
                        onNoShow={() => markNoShow(booking.id)}
                        onCancel={() => cancelBooking(booking.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="border-t border-demo-border pt-4">
          <button
            type="button"
            onClick={() => setShowHistory((value) => !value)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-label text-demo-text-faint hover:text-demo-text-muted"
          >
            Historik · {past.length}
            {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showHistory && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, 12).map((booking) => {
                const labels = labelsFor(booking);
                return <BookingCard key={booking.id} booking={booking} {...labels} />;
              })}
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
