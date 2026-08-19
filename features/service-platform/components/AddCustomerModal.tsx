"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import type { Customer } from "@/features/service-platform/types";

type AddCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (customer: Customer) => void;
};

export function AddCustomerModal({ open, onClose, onCreated }: AddCustomerModalProps) {
  const { addCustomer } = useServicePlatform();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function reset() {
    setName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    const customer = addCustomer({
      name: name.trim(),
      companyName: companyName.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    });

    reset();
    onCreated?.(customer);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Lägg till kund">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Namn" htmlFor="customer-name" required>
          <input
            id="customer-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field label="Företag" htmlFor="customer-company">
          <input
            id="customer-company"
            className={inputClass}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Field>
        <Field label="Telefon" htmlFor="customer-phone">
          <input id="customer-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="customer-email">
          <input
            id="customer-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit">Lägg till kund</Button>
        </div>
      </form>
    </Modal>
  );
}
