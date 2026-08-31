import Link from "next/link";
import { Plus } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { DeleteBillingItemButton } from "@/components/admin/DeleteBillingItemButton";
import { getBillingEntities, getBankAccounts } from "@/lib/data/billing";
import { deleteBillingEntity, deleteBankAccount } from "@/lib/actions/billing";

type Props = { searchParams: Promise<{ error?: string }> };

const errorMessages: Record<string, string> = {
  billing_entity_in_use: "Firman används på en eller flera fakturor och kan inte raderas.",
  bank_account_in_use: "Bankkontot används på en eller flera fakturor och kan inte raderas.",
  unknown: "Något gick fel — posten kunde inte raderas.",
};

export default async function AdminSettingsPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const [billingEntities, bankAccounts] = await Promise.all([getBillingEntities(), getBankAccounts()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Inställningar</h1>
      <p className="mt-1 text-sm text-stone">
        Firmor och bankkonton som går att välja mellan när du skapar en faktura.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
          {errorMessages[error] ?? errorMessages.unknown}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-bold text-bone">Firmor</h2>
        <Link
          href="/admin/installningar/firmor/ny"
          className="flex items-center gap-1.5 self-start rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={14} strokeWidth={2.5} />
          Ny firma
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {billingEntities.length === 0 && <p className="text-sm text-stone">Inga firmor ännu.</p>}
        {billingEntities.map((entity) => (
          <div key={entity.id} className="flex items-center justify-between rounded-2xl bg-bone/5 px-5 py-3">
            <Link href={`/admin/installningar/firmor/${entity.id}`} className="flex items-center gap-2">
              <span className="text-sm font-medium text-bone">{entity.name}</span>
              {entity.isDefault && <Tag className="bg-emerald/15 text-emerald">Standard</Tag>}
            </Link>
            <DeleteBillingItemButton
              action={deleteBillingEntity.bind(null, entity.id)}
              itemName={entity.name}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-bold text-bone">Bankkonton</h2>
        <Link
          href="/admin/installningar/bankkonton/ny"
          className="flex items-center gap-1.5 self-start rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={14} strokeWidth={2.5} />
          Nytt bankkonto
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {bankAccounts.length === 0 && <p className="text-sm text-stone">Inga bankkonton ännu.</p>}
        {bankAccounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between rounded-2xl bg-bone/5 px-5 py-3">
            <Link href={`/admin/installningar/bankkonton/${account.id}`} className="flex items-center gap-2">
              <span className="text-sm font-medium text-bone">{account.label}</span>
              <span className="text-xs text-stone">{account.kontonummer}</span>
              {account.isDefault && <Tag className="bg-emerald/15 text-emerald">Standard</Tag>}
            </Link>
            <DeleteBillingItemButton
              action={deleteBankAccount.bind(null, account.id)}
              itemName={account.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
