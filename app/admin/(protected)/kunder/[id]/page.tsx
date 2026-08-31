import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { getCustomerById } from "@/lib/data/customers";
import { getInvoicesForCustomer } from "@/lib/data/invoices";
import { getEmailsForCustomer } from "@/lib/data/emails";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/admin/BackLink";
import { DeleteCustomerButton } from "@/components/admin/DeleteCustomerButton";
import { deleteCustomer } from "@/lib/actions/customers";
import { formatCurrencySek, formatDateSv } from "@/lib/format";
import type { InvoiceStatus } from "@/lib/types";

const statusLabels: Record<InvoiceStatus, string> = {
  utkast: "Utkast",
  skickad: "Skickad",
  betald: "Betald",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  has_invoices: "Kunden har fakturor kopplade till sig och kan inte raderas.",
  unknown: "Något gick fel — kunden kunde inte raderas.",
};

export default async function EditCustomerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const [invoices, emails] = await Promise.all([
    getInvoicesForCustomer(id),
    getEmailsForCustomer(id),
  ]);

  return (
    <div>
      <BackLink href="/admin/kunder" label="Tillbaka till kunder" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-bone">{customer.name}</h1>
          <p className="mt-1.5 text-xs text-stone">Redigera kund</p>
        </div>
        <DeleteCustomerButton
          action={deleteCustomer.bind(null, customer.id)}
          customerName={customer.name}
        />
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
          {errorMessages[error] ?? errorMessages.unknown}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <Card className="max-w-2xl lg:flex-1">
          <CustomerForm customer={customer} />
        </Card>

        <div className="w-full lg:max-w-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-bone">Fakturor</h2>
            <Link
              href={`/admin/fakturor/ny?customer=${customer.id}`}
              className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
            >
              <Plus size={12} strokeWidth={2.5} />
              Ny faktura
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {invoices.length === 0 && <p className="text-sm text-stone">Inga fakturor ännu.</p>}
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/admin/fakturor/${invoice.id}`}
                className="flex items-center justify-between rounded-xl bg-bone/5 px-4 py-3 transition-colors hover:bg-bone/[0.08]"
              >
                <span className="text-sm text-bone">#{invoice.invoiceNumber}</span>
                <div className="flex items-center gap-2">
                  <Tag>{statusLabels[invoice.status]}</Tag>
                  <span className="text-sm font-medium text-bone">{formatCurrencySek(invoice.total)}</span>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="mt-8 font-display text-sm font-bold text-bone">E-post</h2>
          <div className="mt-3 flex flex-col gap-2">
            {emails.length === 0 && <p className="text-sm text-stone">Inga mejl kopplade ännu.</p>}
            {emails.map((email) => (
              <div key={email.id} className="rounded-xl bg-bone/5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-bone">{email.subject || "(Inget ämne)"}</p>
                  <span className="shrink-0 text-xs text-stone">{formatDateSv(email.receivedAt)}</span>
                </div>
                {email.bodyText && (
                  <p className="mt-1 line-clamp-2 text-xs text-stone">{email.bodyText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
