"use client";

import { useState } from "react";
import { BellRing, Check, Clock, MessageSquare, Phone, User } from "lucide-react";
import { Badge } from "@/components/demo/Badge";
import type { Booking } from "@/features/booking-platform/types";
import { bookingStatusLabels, bookingStatusTone } from "@/features/booking-platform/utils/status";
import { formatTimeSv } from "@/features/booking-platform/utils/dates";

export function BookingCard({
  booking,
  serviceName,
  staffName,
  customerName,
  customerPhone,
  onComplete,
  onNoShow,
  onCancel,
}: {
  booking: Booking;
  serviceName: string;
  staffName: string | null;
  customerName: string;
  customerPhone: string;
  // Omitted for already-resolved bookings (completed/no_show/cancelled) —
  // those render read-only in the history section below the live queue.
  onComplete?: () => void;
  onNoShow?: () => void;
  onCancel?: () => void;
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [reminded, setReminded] = useState(false);
  const telHref = `tel:${customerPhone.replace(/[^\d+]/g, "")}`;
  const actionable = booking.status === "confirmed" && (onComplete || onNoShow || onCancel);

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-demo-border bg-demo-surface p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-label text-demo-primary">
            <Clock size={12} />
            {formatTimeSv(booking.start)}
          </p>
          <p className="mt-0.5 font-display text-sm font-bold text-demo-text">{customerName}</p>
          <p className="text-xs text-demo-text-faint">{customerPhone}</p>
        </div>
        <Badge tone={bookingStatusTone[booking.status]}>{bookingStatusLabels[booking.status]}</Badge>
      </div>

      <div className="flex flex-col gap-0.5 border-t border-demo-border pt-2 text-sm text-demo-text">
        <p className="font-medium">{serviceName}</p>
        {staffName && (
          <p className="flex items-center gap-1.5 text-xs text-demo-text-muted">
            <User size={12} />
            {staffName}
          </p>
        )}
      </div>

      {booking.status === "confirmed" && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-demo-border pt-2.5 text-xs">
          <a
            href={telHref}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-demo-text-muted transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <Phone size={12} /> Ring
          </a>
          <a
            href={`sms:${customerPhone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-demo-text-muted transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <MessageSquare size={12} /> Sms
          </a>
          <button
            type="button"
            disabled={reminded}
            onClick={() => setReminded(true)}
            className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors ${
              reminded ? "text-demo-primary" : "text-demo-text-muted hover:bg-demo-surface-hover hover:text-demo-text"
            }`}
          >
            {reminded ? <Check size={12} /> : <BellRing size={12} />}
            {reminded ? "Påminnelse skickad" : "Skicka påminnelse"}
          </button>
        </div>
      )}

      {actionable && (
        <div className="flex flex-wrap items-center gap-2 border-t border-demo-border pt-2.5">
          {onComplete && (
            <button
              type="button"
              onClick={onComplete}
              className="rounded-full bg-demo-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-demo-primary-hover"
            >
              Klarmarkera
            </button>
          )}
          {onNoShow && (
            <button
              type="button"
              onClick={onNoShow}
              className="rounded-full border border-demo-border px-3 py-1.5 text-xs font-medium text-demo-text-muted transition-colors hover:border-demo-warning hover:text-demo-warning"
            >
              Uteblev
            </button>
          )}
          {onCancel &&
            (confirmingCancel ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onCancel();
                    setConfirmingCancel(false);
                  }}
                  className="rounded-full border border-demo-danger px-3 py-1.5 text-xs font-semibold text-demo-danger transition-colors hover:bg-demo-danger-soft"
                >
                  Bekräfta avbokning
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(false)}
                  className="rounded-full px-2 py-1.5 text-xs font-medium text-demo-text-muted hover:text-demo-text"
                >
                  Avbryt
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingCancel(true)}
                className="rounded-full border border-demo-border px-3 py-1.5 text-xs font-medium text-demo-text-muted transition-colors hover:border-demo-danger hover:text-demo-danger"
              >
                Avboka
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
