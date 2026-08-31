import { notFound } from "next/navigation";
import { getBillingEntityById } from "@/lib/data/billing";
import { BillingEntityForm } from "@/components/admin/BillingEntityForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";

type Props = { params: Promise<{ id: string }> };

export default async function EditBillingEntityPage({ params }: Props) {
  const { id } = await params;
  const entity = await getBillingEntityById(id);

  if (!entity) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/admin/installningar" label="Tillbaka till inställningar" />
      <h1 className="font-display text-2xl font-bold text-bone">{entity.name}</h1>
      <Card className="mt-8 max-w-2xl">
        <BillingEntityForm entity={entity} />
      </Card>
    </div>
  );
}
