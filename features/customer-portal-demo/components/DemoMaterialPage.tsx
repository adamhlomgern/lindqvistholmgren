"use client";

import { notFound } from "next/navigation";
import { MaterialLibrary } from "@/components/customer/MaterialLibrary";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";
import {
  getDemoBreadcrumb,
  getDemoFolderContents,
  getDemoFolderItemCounts,
  getDemoPinnedItems,
  getVisibleDemoFolders,
} from "@/features/customer-portal-demo/data/materialView";

const BASE_PATH = "/demo/kundportal/material";

export function DemoMaterialPage({ folderId }: { folderId: string | null }) {
  const { finalMaterialsUnlocked } = useCustomerPortalDemo();

  // Matches the real app's isFolderSharedWithCustomer guard — an unknown id
  // or a still-locked folder guessed directly both read as "not found",
  // never a silent empty page.
  const isVisible = folderId ? getVisibleDemoFolders(finalMaterialsUnlocked).some((folder) => folder.id === folderId) : true;
  if (!isVisible) notFound();

  const breadcrumb = getDemoBreadcrumb(folderId);
  const { folders, items } = getDemoFolderContents(folderId, finalMaterialsUnlocked);
  const folderItemCounts = getDemoFolderItemCounts(finalMaterialsUnlocked);
  const pinnedItems = folderId ? undefined : getDemoPinnedItems(finalMaterialsUnlocked);

  return (
    <MaterialLibrary
      basePath={BASE_PATH}
      breadcrumb={breadcrumb}
      folders={folders}
      folderItemCounts={folderItemCounts}
      items={items}
      pinnedItems={pinnedItems}
    />
  );
}
