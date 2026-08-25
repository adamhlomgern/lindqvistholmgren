"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Modal } from "@/components/demo/Modal";
import { Button } from "@/components/demo/Button";
import { Field, inputClass } from "@/components/demo/Field";
import type { Organization, Service } from "@/features/booking-platform/types";
import { formatSlotLabelSv } from "@/features/booking-platform/utils/dates";

export function BookingConfirmModal({
  open,
  onClose,
  organization,
  service,
  staffLabel,
  slotIso,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  organization: Organization;
  service: Service;
  staffLabel: string | null;
  slotIso: string;
  onConfirm: (input: { name: string; phone: string; email: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && phone.trim().length > 3;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    // Ingen riktig betalning/bokningssystem bakom — en kort fördröjning ger
    // samma "det här känns på riktigt"-effekt som Mumsas kassaflöde.
    setTimeout(() => {
      onConfirm({ name: name.trim(), phone: phone.trim(), email: email.trim() });
      setSubmitting(false);
    }, 700);
  }

  return (
    <Modal open={open} onClose={onClose} title="Bekräfta bokning">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-demo-border bg-demo-primary-soft p-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-demo-primary-soft-text">
            <CalendarCheck size={16} />
            {formatSlotLabelSv(slotIso)}
          </p>
          <p className="mt-1.5 text-sm text-demo-text">{service.name}</p>
          <p className="text-xs text-demo-text-muted">
            {organization.name}
            {staffLabel ? ` · ${staffLabel}` : ""} · {service.durationMinutes} min · {service.priceSek} kr
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Namn" htmlFor="booking-name" required>
            <input id="booking-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="För- och efternamn" />
          </Field>
          <Field label="Telefon" htmlFor="booking-phone" required>
            <input id="booking-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070-123 45 67" />
          </Field>
        </div>
        <Field label="E-post" htmlFor="booking-email">
          <input
            id="booking-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="för bekräftelse (valfritt)"
          />
        </Field>

        <p className="text-xs text-demo-text-faint">
          Demo — ingen riktig bokning skickas till salongen. En simulerad bekräftelse via SMS visas på nästa sida.
        </p>

        <Button className="w-full" disabled={!canSubmit || submitting} onClick={handleSubmit}>
          {submitting ? "Bekräftar…" : "Bekräfta bokning"}
        </Button>
      </div>
    </Modal>
  );
}
