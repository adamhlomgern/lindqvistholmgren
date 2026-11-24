import type { BankAccount, BillingEntity, InvoiceWithItems } from "@/lib/types";
import { formatCurrencySek, formatDateSv } from "@/lib/format";

type InvoiceSummaryProps = {
  invoice: InvoiceWithItems;
  billingEntity: BillingEntity | null;
  bankAccount: BankAccount | null;
};

export function InvoiceSummary({ invoice, billingEntity, bankAccount }: InvoiceSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Firma</p>
          <p className="mt-1 text-sm text-fg">{billingEntity?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Bankkonto</p>
          <p className="mt-1 text-sm text-fg">{bankAccount?.label ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Fakturadatum</p>
          <p className="mt-1 text-sm text-fg">{formatDateSv(invoice.issuedDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Förfallodatum</p>
          <p className="mt-1 text-sm text-fg">{formatDateSv(invoice.dueDate)}</p>
        </div>
      </div>

      {invoice.paymentLink && (
        <div>
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Betalningslänk</p>
          <a
            href={invoice.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm text-primary hover:underline"
          >
            {invoice.paymentLink}
          </a>
        </div>
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Rader</p>
        <div className="mt-3 flex flex-col divide-y divide-line rounded-xl border border-line">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-fg">{item.description}</span>
              <span className="shrink-0 text-fg-muted">
                {item.quantity} × {formatCurrencySek(item.unitPrice)} ={" "}
                <span className="text-fg">{formatCurrencySek(item.quantity * item.unitPrice)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-fg-muted">
          <span>Summa</span>
          <span>{formatCurrencySek(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between text-fg-muted">
          <span>Moms ({invoice.momsRate}%)</span>
          <span>{formatCurrencySek(invoice.vatAmount)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-1.5 font-display text-base font-semibold text-fg">
          <span>Att betala</span>
          <span>{formatCurrencySek(invoice.total)}</span>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t border-line pt-4">
          <p className="text-xs font-medium uppercase tracking-label text-fg-muted">Anteckningar</p>
          <p className="mt-1 whitespace-pre-line text-sm text-fg-muted">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
