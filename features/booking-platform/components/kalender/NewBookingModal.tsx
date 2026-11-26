"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { findFreeStaffId, getAvailableSlots } from "@/features/booking-platform/utils/slots";
import type { Organization } from "@/features/booking-platform/types";

// Bokning som tas emot på telefon eller i kassan: salongen väljer tjänst,
// personal och en ledig tid och fyller i kundens namn och nummer.
export function NewBookingModal({ open, onClose, organization }: { open: boolean; onClose: () => void; organization: Organization }) {
  if (!open) return null;
  return <Body onClose={onClose} organization={organization} />;
}

function Body({ onClose, organization }: { onClose: () => void; organization: Organization }) {
  const { services, staff, bookings, placeBooking } = useBookingPlatform();
  const orgServices = services.filter((s) => s.organizationId === organization.id);
  const orgStaff = staff.filter((s) => s.organizationId === organization.id);
  const [serviceId, setServiceId] = useState(orgServices[0]?.id ?? "");
  const [staffId, setStaffId] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const service = orgServices.find((s) => s.id === serviceId);

  const days = service
    ? getAvailableSlots({ organization, staff: orgStaff, bookings, durationMinutes: service.durationMinutes, staffId: staffId || null, daysAhead: 7 }).filter(
        (d) => d.slots.length > 0,
      )
    : [];
  const [dayIndex, setDayIndex] = useState(0);
  const day = days[Math.min(dayIndex, Math.max(days.length - 1, 0))];
  const [slot, setSlot] = useState("");
  const chosenSlot = slot && day?.slots.includes(slot) ? slot : day?.slots[0] ?? "";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!service || !chosenSlot) return;
    const start = new Date(chosenSlot);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);
    const resolvedStaff =
      staffId ||
      (orgStaff.length
        ? findFreeStaffId({ organization, staff: orgStaff, bookings, durationMinutes: service.durationMinutes, slotIso: chosenSlot })
        : null);
    placeBooking({
      organizationId: organization.id,
      serviceId: service.id,
      staffId: resolvedStaff,
      start: start.toISOString(),
      end: end.toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: "",
    });
    setDone(`${name.trim()} är bokad ${start.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "short" })} kl ${start.toTimeString().slice(0, 5)}`);
  }

  if (done) {
    return (
      <Modal open onClose={onClose} title="Bokningen är klar">
        <p className="text-sm text-demo-text">{done}. En bekräftelse skickas till kunden via sms.</p>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Stäng</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="Ny bokning">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Tjänst" htmlFor="nb-service" required>
          <select id="nb-service" className={inputClass} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {orgServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.durationMinutes} min · {s.priceSek} kr
              </option>
            ))}
          </select>
        </Field>
        {orgStaff.length > 0 && (
          <Field label="Personal" htmlFor="nb-staff">
            <select id="nb-staff" className={inputClass} value={staffId} onChange={(e) => setStaffId(e.target.value)}>
              <option value="">Första lediga</option>
              {orgStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dag" htmlFor="nb-day" required>
            <select id="nb-day" className={inputClass} value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
              {days.map((d, i) => (
                <option key={d.date} value={i}>
                  {new Date(`${d.date}T12:00`).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric", month: "short" })}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tid" htmlFor="nb-time" required>
            <select id="nb-time" className={inputClass} value={chosenSlot} onChange={(e) => setSlot(e.target.value)}>
              {(day?.slots ?? []).map((s) => (
                <option key={s} value={s}>
                  {new Date(s).toTimeString().slice(0, 5)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kundens namn" htmlFor="nb-name" required>
            <input id="nb-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Telefon" htmlFor="nb-phone" required>
            <input id="nb-phone" type="tel" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
        </div>
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit" disabled={!chosenSlot}>
            Boka
          </Button>
        </div>
      </form>
    </Modal>
  );
}
