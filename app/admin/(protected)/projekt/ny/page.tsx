import { ClientProjectForm } from "@/components/admin/ClientProjectForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities } from "@/lib/data/billing";

export default async function NewClientProjectPage() {
  const [customers, billingEntities] = await Promise.all([getCustomers(), getBillingEntities()]);

  return (
    <div>
      <BackLink href="/admin/projekt" label="Projekt" />
      <h1 className="font-display text-2xl font-bold text-bone">Nytt projekt</h1>
      <Card className="mt-8 max-w-3xl">
        <ClientProjectForm customers={customers} billingEntities={billingEntities} />
      </Card>
    </div>
  );
}
