import Link from "next/link";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities, getBankAccounts, getDefaultBillingEntity, getDefaultBankAccount } from "@/lib/data/billing";

type Props = { searchParams: Promise<{ customer?: string }> };

export default async function NewInvoicePage({ searchParams }: Props) {
  const { customer } = await searchParams;
  const [customers, billingEntities, bankAccounts, defaultBillingEntity, defaultBankAccount] =
    await Promise.all([
      getCustomers(),
      getBillingEntities(),
      getBankAccounts(),
      getDefaultBillingEntity(),
      getDefaultBankAccount(),
    ]);

  const missing: string[] = [];
  if (customers.length === 0) missing.push("en kund");
  if (billingEntities.length === 0) missing.push("en firma");
  if (bankAccounts.length === 0) missing.push("ett bankkonto");

  return (
    <div>
      <BackLink href="/admin/fakturor" label="Tillbaka till fakturor" />
      <h1 className="font-display text-2xl font-bold text-bone">Ny faktura</h1>
      {missing.length > 0 ? (
        <p className="mt-4 text-sm text-stone">
          Du behöver lägga till {missing.join(" och ")} innan du kan skapa en faktura.{" "}
          {customers.length === 0 && (
            <Link href="/admin/kunder/ny" className="text-emerald hover:underline">
              Lägg till kund
            </Link>
          )}
          {(billingEntities.length === 0 || bankAccounts.length === 0) && (
            <>
              {customers.length === 0 && " · "}
              <Link href="/admin/installningar" className="text-emerald hover:underline">
                Gå till inställningar
              </Link>
            </>
          )}
        </p>
      ) : (
        <Card className="mt-8 max-w-2xl">
          <InvoiceForm
            customers={customers}
            billingEntities={billingEntities}
            bankAccounts={bankAccounts}
            defaultBillingEntityId={defaultBillingEntity?.id}
            defaultBankAccountId={defaultBankAccount?.id}
            defaultCustomerId={customer}
          />
        </Card>
      )}
    </div>
  );
}
