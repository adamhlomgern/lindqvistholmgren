import { getPinnedSharedMaterial, getSharedItemCountsByFolder, getSharedMaterialFolderContents } from "@/lib/data/material";
import { MaterialLibrary } from "@/components/customer/MaterialLibrary";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerKundvyMaterialTab({ params }: Props) {
  const { id } = await params;
  const [{ folders, items }, folderItemCounts, pinnedItems] = await Promise.all([
    getSharedMaterialFolderContents(id, null),
    getSharedItemCountsByFolder(id),
    getPinnedSharedMaterial(id),
  ]);

  return (
    <MaterialLibrary
      basePath={`/admin/kunder/${id}/kundvy/material`}
      breadcrumb={[]}
      folders={folders}
      folderItemCounts={folderItemCounts}
      items={items}
      pinnedItems={pinnedItems}
    />
  );
}
