"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { categoryOptions } from "@/features/service-platform/config/categories";
import type { Asset, AssetCategory } from "@/features/service-platform/types";

type AddAssetModalProps = {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
  onCreated?: (asset: Asset) => void;
};

export function AddAssetModal({ open, onClose, defaultCustomerId, onCreated }: AddAssetModalProps) {
  const { addAsset, customers } = useServicePlatform();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetCategory>("vehicle");
  const [identifier, setIdentifier] = useState("");
  const [customerId, setCustomerId] = useState(defaultCustomerId ?? "");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [intervalMonths, setIntervalMonths] = useState("12");

  function reset() {
    setName("");
    setCategory("vehicle");
    setIdentifier("");
    setCustomerId(defaultCustomerId ?? "");
    setNextServiceDate("");
    setIntervalMonths("12");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    const asset = addAsset({
      customerId: customerId || null,
      name: name.trim(),
      category,
      identifier: identifier.trim() || undefined,
      lastServiceDate: null,
      nextServiceDate: nextServiceDate || null,
      serviceIntervalMonths: intervalMonths ? Number(intervalMonths) : null,
    });

    reset();
    onCreated?.(asset);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Lägg till objekt">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Namn" htmlFor="asset-name" required>
          <input
            id="asset-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kia EV3, IVT Geo 512, Kompressor 03…"
            required
          />
        </Field>
        <Field label="Kategori" htmlFor="asset-category">
          <select
            id="asset-category"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as AssetCategory)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Identifierare" htmlFor="asset-identifier">
          <input
            id="asset-identifier"
            className={inputClass}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Registreringsnummer, serienummer eller internt ID"
          />
        </Field>
        <Field label="Ägare" htmlFor="asset-customer">
          <select id="asset-customer" className={inputClass} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Eget objekt (ingen kund)</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.companyName ?? customer.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nästa service" htmlFor="asset-next-service">
            <input
              id="asset-next-service"
              type="date"
              className={inputClass}
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              max="9999-12-31"
            />
          </Field>
          <Field label="Intervall (mån)" htmlFor="asset-interval">
            <input
              id="asset-interval"
              type="number"
              min={1}
              className={inputClass}
              value={intervalMonths}
              onChange={(e) => setIntervalMonths(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit">Lägg till objekt</Button>
        </div>
      </form>
    </Modal>
  );
}
