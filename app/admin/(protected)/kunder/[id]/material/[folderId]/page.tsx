import { notFound } from "next/navigation";
import { getMaterialBreadcrumb, getMaterialFolderContents, getMaterialFolderTree } from "@/lib/data/material";
import { MaterialWorkspace } from "@/components/admin/MaterialWorkspace";

type Props = { params: Promise<{ id: string; folderId: string }> };

export default async function CustomerMaterialFolderRoute({ params }: Props) {
  const { id, folderId } = await params;
  const [{ folders, items }, breadcrumb, folderTree] = await Promise.all([
    getMaterialFolderContents(id, folderId),
    getMaterialBreadcrumb(id, folderId),
    getMaterialFolderTree(id),
  ]);

  if (breadcrumb.length === 0) {
    notFound();
  }

  return (
    <MaterialWorkspace
      customerId={id}
      basePath={`/admin/kunder/${id}/material`}
      currentFolderId={folderId}
      breadcrumb={breadcrumb}
      folders={folders}
      items={items}
      folderTree={folderTree}
    />
  );
}
