import { notFound } from "next/navigation";
import { getBankAccountById } from "@/lib/data/billing";
import { BankAccountForm } from "@/components/admin/BankAccountForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";

type Props = { params: Promise<{ id: string }> };

export default async function EditBankAccountPage({ params }: Props) {
  const { id } = await params;
  const account = await getBankAccountById(id);

  if (!account) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/admin/installningar" label="Tillbaka till inställningar" />
      <h1 className="font-display text-2xl font-bold text-bone">{account.label}</h1>
      <Card className="mt-8 max-w-2xl">
        <BankAccountForm account={account} />
      </Card>
    </div>
  );
}
