import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerMaterials } from "@/lib/data/customer-materials";
import { MaterialsPanel } from "@/components/customer/MaterialsPanel";

export default async function CustomerMaterialsRoute() {
  const { customerId } = await verifyCustomerSession();
  const materials = await getCustomerMaterials(customerId);

  return <MaterialsPanel materials={materials} />;
}
