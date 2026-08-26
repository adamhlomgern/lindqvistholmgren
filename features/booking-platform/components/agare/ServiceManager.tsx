"use client";

import { useState, type FormEvent } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { inputClass } from "@/components/demo/Field";
import type { Service } from "@/features/booking-platform/types";

function ServiceRow({
  service,
  onSave,
  onDelete,
}: {
  service: Service;
  onSave: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
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

  if (confirmingDelete) {
    return (
      <div className="flex items-center justify-between gap-3 py-2.5">
        <p className="text-sm text-demo-text">
          Ta bort <span className="font-semibold">{service.name}</span>?
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDelete(service.id)}
            className="rounded-full border border-demo-danger px-3 py-1.5 text-xs font-semibold text-demo-danger transition-colors hover:bg-demo-danger-soft"
          >
            Ta bort
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="rounded-full px-2 py-1.5 text-xs font-medium text-demo-text-muted hover:text-demo-text"
          >
            Avbryt
          </button>
        </div>
      </div>
    );
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
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Redigera ${service.name}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-demo-text-faint transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label={`Ta bort ${service.name}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-demo-text-faint transition-colors hover:bg-demo-danger-soft hover:text-demo-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
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

function AddServiceForm({
  onAdd,
}: {
  onAdd: (input: { name: string; durationMinutes: number; priceSek: number }) => void;
}) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("45");
  const [price, setPrice] = useState("500");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const durationMinutes = Math.max(5, Math.round(Number(duration)) || 45);
    const priceSek = Math.max(0, Math.round(Number(price)) || 0);
    onAdd({ name: trimmedName, durationMinutes, priceSek });
    setName("");
    setDuration("45");
    setPrice("500");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 pt-3">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ny tjänst, t.ex. Klippning dam"
        className={`${inputClass} min-w-0 flex-1 px-3 py-1.5`}
      />
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
        type="submit"
        disabled={!name.trim()}
        className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-demo-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-demo-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Lägg till
      </button>
    </form>
  );
}

export function ServiceManager({
  organizationId,
  services,
  onSave,
  onAdd,
  onDelete,
}: {
  organizationId: string;
  services: Service[];
  onSave: (service: Service) => void;
  onAdd: (input: { organizationId: string; name: string; durationMinutes: number; priceSek: number }) => void;
  onDelete: (serviceId: string) => void;
}) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-demo-text">Tjänster & priser</h2>
      {services.length === 0 ? (
        <p className="mt-2 text-sm text-demo-text-faint">Inga tjänster registrerade än — lägg till en nedan.</p>
      ) : (
        <div className="mt-2 flex flex-col divide-y divide-demo-border">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} onSave={onSave} onDelete={onDelete} />
          ))}
        </div>
      )}
      <div className="border-t border-demo-border">
        <AddServiceForm onAdd={(input) => onAdd({ organizationId, ...input })} />
      </div>
    </Card>
  );
}
