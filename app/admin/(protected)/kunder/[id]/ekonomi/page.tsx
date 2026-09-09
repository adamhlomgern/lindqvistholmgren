import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { getInvoicesForCustomer } from "@/lib/data/invoices";
import { Tag } from "@/components/ui/Tag";
import { formatCurrencySek } from "@/lib/format";
import type { InvoiceStatus } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

const statusLabels: Record<InvoiceStatus, string> = {
  utkast: "Utkast",
  skickad: "Skickad",
  betald: "Betald",
};

export default async function CustomerEconomyTab({ params }: Props) {
  const { id } = await params;
  const invoices = await getInvoicesForCustomer(id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Fakturor</h2>
        <Link
          href={`/admin/fakturor/ny?customer=${id}`}
          className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
        >
          <Plus size={12} strokeWidth={2.5} />
          Ny faktura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Receipt size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga fakturor ännu.</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
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
      )}
    </div>
  );
}
