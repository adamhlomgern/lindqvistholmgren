import { verifyCustomerSession } from "@/lib/auth/customer";
import { getPinnedSharedMaterial, getSharedItemCountsByFolder, getSharedMaterialFolderContents } from "@/lib/data/material";
import { MaterialLibrary } from "@/components/customer/MaterialLibrary";

export default async function CustomerMaterialRoute() {
  const { customerId } = await verifyCustomerSession();
  const [{ folders, items }, folderItemCounts, pinnedItems] = await Promise.all([
    getSharedMaterialFolderContents(customerId, null),
    getSharedItemCountsByFolder(customerId),
    getPinnedSharedMaterial(customerId),
  ]);

  return (
    <MaterialLibrary
      basePath="/kund/material"
      breadcrumb={[]}
      folders={folders}
      folderItemCounts={folderItemCounts}
      items={items}
      pinnedItems={pinnedItems}
    />
  );
}
