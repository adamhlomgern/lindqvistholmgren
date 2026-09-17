import { getMaterialFolderContents, getMaterialFolderTree } from "@/lib/data/material";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { MaterialWorkspace } from "@/components/admin/MaterialWorkspace";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerMaterialRoute({ params }: Props) {
  const { id } = await params;
  const [{ folders, items }, folderTree, projects] = await Promise.all([
    getMaterialFolderContents(id, null),
    getMaterialFolderTree(id),
    getClientProjectsByCustomerId(id),
  ]);

  return (
    <MaterialWorkspace
      customerId={id}
      basePath={`/admin/kunder/${id}/material`}
      currentFolderId={null}
      breadcrumb={[]}
      folders={folders}
      items={items}
      folderTree={folderTree}
      projects={projects.map((project) => ({ id: project.id, title: project.title }))}
    />
  );
}
