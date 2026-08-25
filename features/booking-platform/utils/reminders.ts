import type { Booking, Organization, Service } from "@/features/booking-platform/types";
import { addMinutes, formatDateSv, formatTimeSv } from "@/features/booking-platform/utils/dates";

export type MessageChannel = "sms" | "email";
export type MessageKind = "confirmation" | "reminder";
export type MessageState = "sent" | "scheduled";

export type SimulatedMessage = {
  id: string;
  channel: MessageChannel;
  kind: MessageKind;
  scheduledAt: string;
  state: MessageState;
  preview: string;
};

// No real SMS/email is ever sent in this demo — messages are derived from
// the booking's start time so a confirmation always shows as "sent" the
// moment a booking is made, and the reminder flips from "scheduled" to
// "sent" once its 24h-before mark has passed. Mirrors the derive-don't-store
// approach in service-platform/utils/reminders.ts.
export function getBookingMessages(
  booking: Booking,
  service: Service,
  organization: Organization,
  now: Date = new Date(),
): SimulatedMessage[] {
  const start = new Date(booking.start);
  const reminderAt = addMinutes(start, -24 * 60);

  const confirmation: SimulatedMessage = {
    id: `${booking.id}-confirmation`,
    channel: "sms",
    kind: "confirmation",
    scheduledAt: booking.createdAt,
    state: "sent",
    preview: `${organization.name}: Din bokning av ${service.name.toLowerCase()} ${formatDateSv(start)} kl ${formatTimeSv(start)} är bekräftad.`,
  };

  const reminder: SimulatedMessage = {
    id: `${booking.id}-reminder`,
    channel: "sms",
    kind: "reminder",
    scheduledAt: reminderAt.toISOString(),
    state: reminderAt.getTime() <= now.getTime() ? "sent" : "scheduled",
    preview: `${organization.name}: Påminnelse — du har en bokning imorgon kl ${formatTimeSv(start)}.`,
  };

  return booking.status === "cancelled" ? [confirmation] : [confirmation, reminder];
}
