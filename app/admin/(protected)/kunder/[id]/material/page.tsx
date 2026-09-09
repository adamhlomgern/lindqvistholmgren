import { getCustomerMaterials } from "@/lib/data/customer-materials";
import { CustomerMaterialsCard } from "@/components/admin/CustomerMaterialsCard";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerMaterialTab({ params }: Props) {
  const { id } = await params;
  const materials = await getCustomerMaterials(id);

  return (
    <div className="max-w-2xl">
      <CustomerMaterialsCard customerId={id} materials={materials} />
    </div>
  );
}
