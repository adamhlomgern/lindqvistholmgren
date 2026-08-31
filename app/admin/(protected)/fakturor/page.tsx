import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getInvoices } from "@/lib/data/invoices";
import { formatCurrencySek, formatDateSv } from "@/lib/format";
import { getBillingEntities, getDefaultBillingEntity } from "@/lib/data/billing";
import type { InvoiceStatus } from "@/lib/types";

const statusLabels: Record<InvoiceStatus, string> = {
  utkast: "Utkast",
  skickad: "Skickad",
  betald: "Betald",
};

const statusClasses: Record<InvoiceStatus, string> = {
  utkast: "bg-bone/5 text-stone",
  skickad: "bg-sky/15 text-sky",
  betald: "bg-emerald/15 text-emerald",
};

export default async function AdminInvoicesPage() {
  const [invoices, billingEntities, defaultBillingEntity] = await Promise.all([
    getInvoices(),
    getBillingEntities(),
    getDefaultBillingEntity(),
  ]);
  const billingEntityById = new Map(billingEntities.map((entity) => [entity.id, entity]));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">Fakturor</h1>
          <p className="mt-1 text-sm text-stone">{invoices.length} fakturor totalt.</p>
        </div>
        <Link
          href="/admin/fakturor/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny faktura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Receipt size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga fakturor ännu.</p>
          <Link href="/admin/fakturor/ny" className="mt-1 text-sm font-medium text-emerald hover:underline">
            Skapa din första faktura
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/admin/fakturor/${invoice.id}`} className="block">
              <Card className="transition-colors hover:bg-bone/[0.08]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold text-bone">
                      Faktura #{invoice.invoiceNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-stone">
                      {invoice.customer.name}
                      {invoice.customer.company ? ` · ${invoice.customer.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {invoice.billingEntityId !== defaultBillingEntity?.id && (
                      <Tag>{billingEntityById.get(invoice.billingEntityId)?.name ?? "Okänd firma"}</Tag>
                    )}
                    <Tag className={statusClasses[invoice.status]}>{statusLabels[invoice.status]}</Tag>
                    <span className="text-sm font-medium text-bone">{formatCurrencySek(invoice.total)}</span>
                    <span className="hidden text-xs text-stone sm:inline">
                      Förfaller {formatDateSv(invoice.dueDate)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
