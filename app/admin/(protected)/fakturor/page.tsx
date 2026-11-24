import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getInvoices } from "@/lib/data/invoices";
import { formatCurrencySek, formatDateSv } from "@/lib/format";
import { getBillingEntities } from "@/lib/data/billing";
import type { InvoiceStatus } from "@/lib/types";

const statusLabels: Record<InvoiceStatus, string> = {
  utkast: "Utkast",
  skickad: "Skickad",
  betald: "Betald",
};

const statusClasses: Record<InvoiceStatus, string> = {
  utkast: "bg-ink-100 text-ink-700",
  skickad: "bg-blue-100 text-blue-800",
  betald: "bg-pine-100 text-pine-800",
};

type Props = { searchParams: Promise<{ entity?: string }> };

export default async function AdminInvoicesPage({ searchParams }: Props) {
  const { entity } = await searchParams;
  const [billingEntities, invoices] = await Promise.all([getBillingEntities(), getInvoices(entity)]);
  const billingEntityById = new Map(billingEntities.map((e) => [e.id, e]));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Fakturor</h1>
          <p className="mt-1 text-sm text-fg-muted">{invoices.length} fakturor totalt.</p>
        </div>
        <Link
          href="/admin/fakturor/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny faktura
        </Link>
      </div>

      {billingEntities.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/admin/fakturor"
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !entity ? "bg-primary text-on-primary" : "bg-fg/5 text-fg-muted hover:bg-fg/10"
            }`}
          >
            Alla
          </Link>
          {billingEntities.map((e) => (
            <Link
              key={e.id}
              href={`/admin/fakturor?entity=${e.id}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                entity === e.id ? "bg-primary text-on-primary" : "bg-fg/5 text-fg-muted hover:bg-fg/10"
              }`}
            >
              {e.name}
            </Link>
          ))}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <Receipt size={24} strokeWidth={2} className="text-fg-muted" />
          <p className="text-sm text-fg-muted">Inga fakturor ännu.</p>
          <Link href="/admin/fakturor/ny" className="mt-1 text-sm font-medium text-primary hover:underline">
            Skapa din första faktura
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/admin/fakturor/${invoice.id}`} className="block">
              <Card className="transition-colors hover:bg-fg/[0.08]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold text-fg">
                      Faktura #{invoice.invoiceNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-fg-muted">
                      {invoice.customer.name}
                      {invoice.customer.company ? ` · ${invoice.customer.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag>{billingEntityById.get(invoice.billingEntityId)?.name ?? "Okänd firma"}</Tag>
                    <Tag className={statusClasses[invoice.status]}>{statusLabels[invoice.status]}</Tag>
                    <span className="text-sm font-medium text-fg">{formatCurrencySek(invoice.total)}</span>
                    <span className="hidden text-xs text-fg-muted sm:inline">
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
