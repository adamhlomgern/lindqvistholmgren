"use client";

import Link from "next/link";
import { CalendarCheck, Mail, MapPin, MessageSquare, User } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { Badge } from "@/components/demo/Badge";
import { EmptyState } from "@/components/demo/EmptyState";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { bokadRoutes } from "@/features/booking-platform/config/product";
import { bookingStatusLabels, bookingStatusTone } from "@/features/booking-platform/utils/status";
import { formatDateSv, formatTimeSv } from "@/features/booking-platform/utils/dates";
import { getBookingMessages } from "@/features/booking-platform/utils/reminders";

export function BookingReceipt({ bookingId }: { bookingId: string }) {
  const { getBooking, organizations, services, staff, customers } = useBookingPlatform();
  const booking = getBooking(bookingId);
  const organization = organizations.find((org) => org.id === booking?.organizationId);
  const service = services.find((candidate) => candidate.id === booking?.serviceId);
  const bookedStaff = staff.find((member) => member.id === booking?.staffId);
  const customer = customers.find((candidate) => candidate.id === booking?.customerId);

  if (!booking || !organization || !service) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Hittade ingen bokning"
        description="Bokningen kan ha försvunnit om demot återställdes. Boka gärna en ny tid."
        action={
          <Link href={bokadRoutes.directory()} className="text-sm font-semibold text-demo-primary hover:underline">
            Till katalogen
          </Link>
        }
      />
    );
  }

  const messages = getBookingMessages(booking, service, organization);
  const start = new Date(booking.start);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div className="text-center">
        <p className="text-sm text-demo-text-muted">Bokning bekräftad</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-demo-text">
          {customer ? `Tack, ${customer.name.split(" ")[0]}!` : "Tack för din bokning!"}
        </h1>
        <p className="mt-1 text-sm text-demo-text-muted">Vi ses hos {organization.name}.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <Badge tone={bookingStatusTone[booking.status]}>{bookingStatusLabels[booking.status]}</Badge>
          <span className="flex items-center gap-1.5 text-xs text-demo-text-muted">
            <CalendarCheck size={13} />
            {formatDateSv(start)} kl {formatTimeSv(start)}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-t border-demo-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-demo-text-muted">Tjänst</span>
            <span className="font-medium text-demo-text">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-demo-text-muted">Längd</span>
            <span className="font-medium text-demo-text">{service.durationMinutes} min</span>
          </div>
          {bookedStaff && (
            <div className="flex justify-between">
              <span className="text-demo-text-muted">Personal</span>
              <span className="font-medium text-demo-text">{bookedStaff.name}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span className="text-demo-text">Pris</span>
            <span className="text-demo-text">{service.priceSek} kr</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-demo-border pt-4 text-sm text-demo-text-muted">
          <MapPin size={14} className="shrink-0 text-demo-primary" />
          {organization.address}, {organization.city}
        </div>
        {customer && (
          <div className="mt-2 flex items-center gap-2 text-sm text-demo-text-muted">
            <User size={14} className="shrink-0 text-demo-primary" />
            {customer.name} · {customer.phone}
          </div>
        )}
      </Card>

      <Card padding="compact">
        <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Bekräftelse & påminnelse</p>
        <div className="mt-3 flex flex-col gap-3">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-demo-primary-soft text-demo-primary-soft-text">
                {message.channel === "sms" ? <MessageSquare size={12} /> : <Mail size={12} />}
              </span>
              <div>
                <p className="text-demo-text">{message.preview}</p>
                <p className="mt-0.5 text-xs text-demo-text-faint">
                  {message.kind === "confirmation" ? "Skickad direkt" : message.state === "sent" ? "Skickad" : "Schemalagd 24h innan"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col items-center gap-2 text-center text-xs text-demo-text-faint">
        <p>Nyfiken på hur salongen ser den här bokningen? Byt till fliken &quot;Salong&quot; högst upp.</p>
        <Link href={bokadRoutes.directory()} className="font-semibold text-demo-primary hover:underline">
          Boka en till tid
        </Link>
      </div>
    </div>
  );
}
