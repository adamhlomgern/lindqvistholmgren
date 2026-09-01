"use client";

import { useActionState, useMemo, useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import type { BankAccount, BillingEntity, Customer, InvoiceWithItems } from "@/lib/types";
import { createInvoice, updateInvoice, type InvoiceFormState } from "@/lib/actions/invoices";
import { formatCurrencySek } from "@/lib/format";
import { Select } from "@/components/ui/Select";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-bone/10 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-sm font-bold text-bone">{title}</h2>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

type ItemRow = { description: string; quantity: string; unitPrice: string };

function LineItemsField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: ItemRow[];
}) {
  const [rows, setRows] = useState<ItemRow[]>(
    defaultValue.length > 0 ? defaultValue : [{ description: "", quantity: "1", unitPrice: "" }],
  );

  function update(index: number, key: keyof ItemRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }
  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const parsed = rows
    .map((row) => ({
      description: row.description.trim(),
      quantity: Number(row.quantity),
      unitPrice: Number(row.unitPrice),
    }))
    .filter((row) => row.description && Number.isFinite(row.quantity) && row.quantity > 0 && Number.isFinite(row.unitPrice));

  const subtotal = useMemo(
    () => parsed.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0),
    [parsed],
  );

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-xl border border-bone/10 bg-bone/5 p-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-medium uppercase tracking-label text-stone/70">
              Tjänst
            </span>
            <input
              value={row.description}
              onChange={(event) => update(index, "description", event.target.value)}
              placeholder="T.ex. Webbdesign"
              className={`${inputClasses} mt-1`}
            />
          </div>
          <div className="sm:w-20 sm:shrink-0">
            <span className="block text-[10px] font-medium uppercase tracking-label text-stone/70">
              Antal
            </span>
            <input
              value={row.quantity}
              onChange={(event) => update(index, "quantity", event.target.value)}
              inputMode="decimal"
              className={`${inputClasses} mt-1`}
            />
          </div>
          <div className="sm:w-28 sm:shrink-0">
            <span className="block text-[10px] font-medium uppercase tracking-label text-stone/70">
              À-pris (kr)
            </span>
            <input
              value={row.unitPrice}
              onChange={(event) => update(index, "unitPrice", event.target.value)}
              inputMode="decimal"
              className={`${inputClasses} mt-1`}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label="Ta bort rad"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone transition-colors hover:text-coral"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }])}
        className="flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs font-medium text-emerald transition-colors hover:bg-emerald/10"
      >
        <Plus size={14} strokeWidth={2.5} />
        Lägg till rad
      </button>

      {parsed.length > 0 && (
        <p className="self-end text-sm text-stone">
          Delsumma: <span className="font-medium text-bone">{formatCurrencySek(subtotal)}</span>
        </p>
      )}

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(parsed.map((row) => ({ description: row.description, quantity: row.quantity, unitPrice: row.unitPrice })))}
        readOnly
      />
    </div>
  );
}

const momsOptions = [25, 12, 6, 0];

type InvoiceFormProps = {
  invoice?: InvoiceWithItems;
  customers: Customer[];
  billingEntities: BillingEntity[];
  bankAccounts: BankAccount[];
  defaultBillingEntityId?: string;
  defaultBankAccountId?: string;
  defaultCustomerId?: string;
};

export function InvoiceForm({
  invoice,
  customers,
  billingEntities,
  bankAccounts,
  defaultBillingEntityId,
  defaultBankAccountId,
  defaultCustomerId,
}: InvoiceFormProps) {
  const isEditing = Boolean(invoice);
  const action = isEditing ? updateInvoice.bind(null, invoice!.id) : createInvoice;
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(action, undefined);
  const [momsRate, setMomsRate] = useState(invoice?.momsRate ?? 25);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Section title="Kund">
        <Field label="Kund">
          <Select
            name="customerId"
            defaultValue={invoice?.customerId ?? defaultCustomerId}
            required
            disabled={isEditing}
            placeholder="Välj kund"
            className={selectClasses}
            options={customers.map((customer) => ({
              value: customer.id,
              label: customer.company ? `${customer.name} (${customer.company})` : customer.name,
            }))}
          />
        </Field>
      </Section>

      <Section title="Fakturera från">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Firma">
            <Select
              name="billingEntityId"
              defaultValue={invoice?.billingEntityId ?? defaultBillingEntityId}
              required
              placeholder="Välj firma"
              className={selectClasses}
              options={billingEntities.map((entity) => ({ value: entity.id, label: entity.name }))}
            />
          </Field>
          <Field label="Bankkonto">
            <Select
              name="bankAccountId"
              defaultValue={invoice?.bankAccountId ?? defaultBankAccountId}
              required
              placeholder="Välj bankkonto"
              className={selectClasses}
              options={bankAccounts.map((account) => ({ value: account.id, label: account.label }))}
            />
          </Field>
        </div>
        <Field label="Betalningslänk (valfritt, t.ex. Revolut Pro)">
          <input
            name="paymentLink"
            type="url"
            defaultValue={invoice?.paymentLink}
            placeholder="https://revolut.me/..."
            className={inputClasses}
          />
        </Field>
      </Section>

      <Section title="Rader">
        <LineItemsField
          name="items"
          defaultValue={
            invoice?.items.map((item) => ({
              description: item.description,
              quantity: String(item.quantity),
              unitPrice: String(item.unitPrice),
            })) ?? []
          }
        />
      </Section>

      <Section title="Villkor">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Moms">
            <div className="flex items-center gap-2">
              <input
                name="momsRate"
                value={momsRate}
                onChange={(event) => setMomsRate(Number(event.target.value))}
                inputMode="decimal"
                className={inputClasses}
              />
              <div className="flex shrink-0 gap-1">
                {momsOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMomsRate(option)}
                    className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      momsRate === option ? "bg-emerald text-charcoal" : "bg-bone/5 text-stone hover:bg-bone/10"
                    }`}
                  >
                    {option}%
                  </button>
                ))}
              </div>
            </div>
          </Field>
          <Field label="Fakturadatum (valfritt, för att bakdatera)">
            <input
              name="issuedDate"
              type="date"
              defaultValue={invoice?.issuedDate}
              className={inputClasses}
            />
          </Field>
          <Field label="Förfallodatum">
            <input
              name="dueDate"
              type="date"
              defaultValue={invoice?.dueDate}
              className={inputClasses}
            />
          </Field>
        </div>
        <Field label="Anteckningar (betalningsvillkor m.m., visas på fakturan)">
          <textarea name="notes" defaultValue={invoice?.notes} rows={3} className={inputClasses} />
        </Field>
      </Section>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa faktura"}
        </button>
      </div>
    </form>
  );
}
