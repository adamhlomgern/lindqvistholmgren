import { BillingEntityForm } from "@/components/admin/BillingEntityForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";

export default function NewBillingEntityPage() {
  return (
    <div>
      <BackLink href="/admin/installningar" label="Tillbaka till inställningar" />
      <h1 className="font-display text-2xl font-bold text-bone">Ny firma</h1>
      <Card className="mt-8 max-w-2xl">
        <BillingEntityForm />
      </Card>
    </div>
  );
}
