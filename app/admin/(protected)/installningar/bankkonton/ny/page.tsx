import { BankAccountForm } from "@/components/admin/BankAccountForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";

export default function NewBankAccountPage() {
  return (
    <div>
      <BackLink href="/admin/installningar" label="Tillbaka till inställningar" />
      <h1 className="font-display text-2xl font-semibold text-fg">Nytt bankkonto</h1>
      <Card className="mt-8 max-w-2xl">
        <BankAccountForm />
      </Card>
    </div>
  );
}
