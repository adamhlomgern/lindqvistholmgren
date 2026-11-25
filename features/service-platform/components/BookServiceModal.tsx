"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { formatDateSv } from "@/features/service-platform/utils/dates";
import { defaultBookingDate, timeSlots } from "@/features/service-platform/components/ContactComposer";
import type { Asset, Customer } from "@/features/service-platform/types";

// Boka en servicetid direkt, med en bekräftelse till kunden som standard.
export function BookServiceModal({
  open,
  onClose,
  asset,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  asset: Asset;
  customer?: Customer;
}) {
  if (!open) return null;
  return <Body key={asset.id} onClose={onClose} asset={asset} customer={customer} />;
}

function Body({ onClose, asset, customer }: { onClose: () => void; asset: Asset; customer?: Customer }) {
  const { bookService, logContacts, notify } = useServicePlatform();
  const [date, setDate] = useState(() => (asset.bookedAt ? asset.bookedAt.slice(0, 10) : defaultBookingDate(asset)));
  const [time, setTime] = useState(() => (asset.bookedAt ? asset.bookedAt.slice(11, 16) : "09:00"));
  const [confirm, setConfirm] = useState(Boolean(customer?.phone));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    bookService(asset.id, `${date}T${time}`);
    if (confirm && customer) {
      logContacts([
        {
          customerId: customer.id,
          assetId: asset.id,
          channel: "sms",
          message: `Hej ${customer.name.split(" ")[0]}! Välkommen ${formatDateSv(date)} kl ${time} för service av ${asset.name}. Svara på detta sms om tiden inte passar.`,
        },
      ]);
    }
    notify(confirm && customer ? `Tid bokad, bekräftelse skickad till ${customer.name}` : `Tid bokad ${formatDateSv(date)} kl ${time}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Boka tid — ${asset.name}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Field label="Datum" htmlFor="booking-date" required>
            <input id="booking-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} max="9999-12-31" required />
          </Field>
          <Field label="Tid" htmlFor="booking-time">
            <select id="booking-time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)}>
              {timeSlots.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        {customer?.phone && (
          <label className="flex items-start gap-3 rounded-xl border border-demo-border px-4 py-3 text-sm text-demo-text">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-demo-primary)]" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
            <span>
              Skicka bekräftelse via sms till {customer.name}
              <span className="block text-xs text-demo-text-muted">{customer.phone}</span>
            </span>
          </label>
        )}
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit">Boka tid</Button>
        </div>
      </form>
    </Modal>
  );
}
