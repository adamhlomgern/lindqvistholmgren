import { notFound } from "next/navigation";
import { verifyCustomerSession } from "@/lib/auth/customer";
import {
  getMaterialBreadcrumb,
  getSharedItemCountsByFolder,
  getSharedMaterialFolderContents,
  isFolderSharedWithCustomer,
} from "@/lib/data/material";
import { MaterialLibrary } from "@/components/customer/MaterialLibrary";

type Props = { params: Promise<{ folderId: string }> };

export default async function CustomerMaterialFolderRoute({ params }: Props) {
  const { folderId } = await params;
  const { customerId } = await verifyCustomerSession();

  const [breadcrumb, isShared] = await Promise.all([
    getMaterialBreadcrumb(customerId, folderId),
    isFolderSharedWithCustomer(customerId, folderId),
  ]);

  // breadcrumb.length === 0 means the folder doesn't belong to this
  // customer at all; !isShared means it belongs to them but has no shared
  // content anywhere in its subtree — both are "you can't see this".
  if (breadcrumb.length === 0 || !isShared) {
    notFound();
  }

  const [{ folders, items }, folderItemCounts] = await Promise.all([
    getSharedMaterialFolderContents(customerId, folderId),
    getSharedItemCountsByFolder(customerId),
  ]);

  return (
    <MaterialLibrary
      basePath="/kund/material"
      breadcrumb={breadcrumb}
      folders={folders}
      folderItemCounts={folderItemCounts}
      items={items}
    />
  );
}
