"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { inputClass } from "@/components/demo/Field";
import type { Service } from "@/features/booking-platform/types";

function ServiceRow({ service, onSave }: { service: Service; onSave: (service: Service) => void }) {
  const [editing, setEditing] = useState(false);
  const [duration, setDuration] = useState(String(service.durationMinutes));
  const [price, setPrice] = useState(String(service.priceSek));

  function handleSave() {
    const durationMinutes = Math.max(5, Math.round(Number(duration)) || service.durationMinutes);
    const priceSek = Math.max(0, Math.round(Number(price)) || 0);
    onSave({ ...service, durationMinutes, priceSek });
    setEditing(false);
  }

  function handleCancel() {
    setDuration(String(service.durationMinutes));
    setPrice(String(service.priceSek));
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-demo-text">{service.name}</p>
          <p className="text-xs text-demo-text-muted">
            {service.durationMinutes} min · {service.priceSek} kr
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Redigera ${service.name}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-demo-text-faint transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
        >
          <Pencil size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2.5">
      <p className="min-w-0 flex-1 text-sm font-medium text-demo-text">{service.name}</p>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-demo-text-muted">
          <input
            type="number"
            min={5}
            step={5}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className={`${inputClass} w-16 px-2 py-1.5 text-right`}
          />
          min
        </label>
        <label className="flex items-center gap-1.5 text-xs text-demo-text-muted">
          <input
            type="number"
            min={0}
            step={10}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={`${inputClass} w-20 px-2 py-1.5 text-right`}
          />
          kr
        </label>
        <button
          type="button"
          onClick={handleSave}
          aria-label="Spara"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-demo-primary text-white transition-colors hover:bg-demo-primary-hover"
        >
          <Check size={14} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Avbryt"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-demo-text-faint transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function ServiceManager({ services, onSave }: { services: Service[]; onSave: (service: Service) => void }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-demo-text">Tjänster & priser</h2>
      <div className="mt-2 flex flex-col divide-y divide-demo-border">
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} onSave={onSave} />
        ))}
      </div>
    </Card>
  );
}
