import { notFound } from "next/navigation";
import { getMaterialBreadcrumb, getSharedItemCountsByFolder, getSharedMaterialFolderContents } from "@/lib/data/material";
import { MaterialLibrary } from "@/components/customer/MaterialLibrary";

type Props = { params: Promise<{ id: string; folderId: string }> };

export default async function CustomerKundvyMaterialFolderTab({ params }: Props) {
  const { id, folderId } = await params;
  const breadcrumb = await getMaterialBreadcrumb(id, folderId);
  if (breadcrumb.length === 0) {
    notFound();
  }

  const [{ folders, items }, folderItemCounts] = await Promise.all([
    getSharedMaterialFolderContents(id, folderId),
    getSharedItemCountsByFolder(id),
  ]);

  return (
    <MaterialLibrary
      basePath={`/admin/kunder/${id}/kundvy/material`}
      breadcrumb={breadcrumb}
      folders={folders}
      folderItemCounts={folderItemCounts}
      items={items}
    />
  );
}
