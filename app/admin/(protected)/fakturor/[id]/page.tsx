import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye } from "lucide-react";
import { getInvoiceById } from "@/lib/data/invoices";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities, getBankAccounts, getBillingEntityById, getBankAccountById } from "@/lib/data/billing";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { InvoiceSummary } from "@/components/admin/InvoiceSummary";
import { InvoiceStatusActions } from "@/components/admin/InvoiceStatusActions";
import { DeleteInvoiceButton } from "@/components/admin/DeleteInvoiceButton";
import { SendInvoiceEmailForm } from "@/components/admin/SendInvoiceEmailForm";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/admin/BackLink";
import { deleteInvoice } from "@/lib/actions/invoices";
import type { InvoiceStatus } from "@/lib/types";

const statusLabels: Record<InvoiceStatus, string> = {
  utkast: "Utkast",
  skickad: "Skickad",
  betald: "Betald",
};

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const isDraft = invoice.status === "utkast";
  const [customers, billingEntities, bankAccounts, billingEntity, bankAccount] = await Promise.all([
    isDraft ? getCustomers() : Promise.resolve([]),
    isDraft ? getBillingEntities() : Promise.resolve([]),
    isDraft ? getBankAccounts() : Promise.resolve([]),
    getBillingEntityById(invoice.billingEntityId),
    getBankAccountById(invoice.bankAccountId),
  ]);

  return (
    <div>
      <BackLink href="/admin/fakturor" label="Tillbaka till fakturor" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-bone">Faktura #{invoice.invoiceNumber}</h1>
            <Tag>{statusLabels[invoice.status]}</Tag>
          </div>
          <Link href={`/admin/kunder/${invoice.customerId}`} className="mt-1.5 inline-block text-sm text-emerald hover:underline">
            {invoice.customer.name}
          </Link>
        </div>
        <DeleteInvoiceButton
          action={deleteInvoice.bind(null, invoice.id)}
          invoiceNumber={invoice.invoiceNumber}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={`/api/admin/fakturor/${invoice.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
        >
          <Eye size={14} strokeWidth={2.25} />
          Förhandsgranska
        </a>
        <a
          href={`/api/admin/fakturor/${invoice.id}/pdf?download=1`}
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
        >
          <Download size={14} strokeWidth={2.25} />
          Ladda ner PDF
        </a>
        <SendInvoiceEmailForm id={invoice.id} customerEmail={invoice.customer.email} />
        <InvoiceStatusActions id={invoice.id} status={invoice.status} />
      </div>

      <Card className="mt-8 max-w-2xl">
        {isDraft ? (
          <InvoiceForm
            invoice={invoice}
            customers={customers}
            billingEntities={billingEntities}
            bankAccounts={bankAccounts}
          />
        ) : (
          <InvoiceSummary invoice={invoice} billingEntity={billingEntity} bankAccount={bankAccount} />
        )}
      </Card>
    </div>
  );
}
