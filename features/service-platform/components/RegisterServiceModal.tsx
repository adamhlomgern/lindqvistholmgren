"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useServicePlatform, suggestNextServiceDate } from "@/features/service-platform/state/ServicePlatformProvider";
import { toISODate } from "@/features/service-platform/utils/dates";
import type { Asset } from "@/features/service-platform/types";

type RegisterServiceModalProps = {
  open: boolean;
  onClose: () => void;
  asset: Asset;
};

export function RegisterServiceModal({ open, onClose, asset }: RegisterServiceModalProps) {
  const { registerService } = useServicePlatform();
  const [performedAt, setPerformedAt] = useState(() => toISODate(new Date()));
  const [serviceType, setServiceType] = useState("Årlig service");
  const [notes, setNotes] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState(
    () => suggestNextServiceDate(toISODate(new Date()), asset.serviceIntervalMonths) ?? "",
  );

  // Re-suggest the next service date whenever the performed date changes,
  // directly in the handler rather than an effect, so a manual edit to
  // nextServiceDate afterwards isn't immediately overwritten by a re-render.
  function handlePerformedAtChange(value: string) {
    setPerformedAt(value);
    setNextServiceDate(suggestNextServiceDate(value, asset.serviceIntervalMonths) ?? "");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    registerService(asset.id, {
      performedAt,
      serviceType: serviceType.trim() || undefined,
      notes: notes.trim() || undefined,
      nextServiceDate: nextServiceDate || null,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Registrera service — ${asset.name}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Datum" htmlFor="service-date" required>
          <input
            id="service-date"
            type="date"
            className={inputClass}
            value={performedAt}
            onChange={(e) => handlePerformedAtChange(e.target.value)}
            max="9999-12-31"
            required
          />
        </Field>
        <Field label="Typ av service" htmlFor="service-type">
          <input id="service-type" className={inputClass} value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
        </Field>
        <Field label="Anteckningar" htmlFor="service-notes">
          <textarea
            id="service-notes"
            className={`${inputClass} min-h-20`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <Field label="Nästa service" htmlFor="service-next">
          <input
            id="service-next"
            type="date"
            className={inputClass}
            value={nextServiceDate}
            onChange={(e) => setNextServiceDate(e.target.value)}
            max="9999-12-31"
          />
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit">Registrera service</Button>
        </div>
      </form>
    </Modal>
  );
}
