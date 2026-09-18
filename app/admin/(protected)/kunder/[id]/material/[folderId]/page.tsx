import { notFound } from "next/navigation";
import {
  getFolderSharedStatusMap,
  getMaterialBreadcrumb,
  getMaterialFolderContents,
  getMaterialFolderTree,
} from "@/lib/data/material";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { MaterialWorkspace } from "@/components/admin/MaterialWorkspace";

type Props = { params: Promise<{ id: string; folderId: string }> };

export default async function CustomerMaterialFolderRoute({ params }: Props) {
  const { id, folderId } = await params;
  const [{ folders, items }, breadcrumb, folderTree, projects, folderSharedStatus] = await Promise.all([
    getMaterialFolderContents(id, folderId),
    getMaterialBreadcrumb(id, folderId),
    getMaterialFolderTree(id),
    getClientProjectsByCustomerId(id),
    getFolderSharedStatusMap(id),
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
      projects={projects.map((project) => ({ id: project.id, title: project.title }))}
      folderSharedStatus={Object.fromEntries(folderSharedStatus)}
    />
  );
}
