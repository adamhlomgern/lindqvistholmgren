import { getCustomerMaterials } from "@/lib/data/customer-materials";
import { MaterialsPanel } from "@/components/customer/MaterialsPanel";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerKundvyMaterialTab({ params }: Props) {
  const { id } = await params;
  const materials = await getCustomerMaterials(id);

  return <MaterialsPanel materials={materials} />;
}
