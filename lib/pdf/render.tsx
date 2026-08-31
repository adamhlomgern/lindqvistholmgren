import { renderToBuffer } from "@react-pdf/renderer";
import { getInvoiceById } from "@/lib/data/invoices";
import { getBillingEntityById, getBankAccountById } from "@/lib/data/billing";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";

export async function renderInvoicePdf(id: string): Promise<Buffer> {
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    throw new Error("Fakturan kunde inte hittas.");
  }

  const [billingEntity, bankAccount] = await Promise.all([
    getBillingEntityById(invoice.billingEntityId),
    getBankAccountById(invoice.bankAccountId),
  ]);

  return renderToBuffer(
    <InvoiceDocument invoice={invoice} billingEntity={billingEntity} bankAccount={bankAccount} />,
  );
}
