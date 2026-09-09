import type { MaterialFolder, MaterialItem } from "@/lib/types";
import {
  demoFolders,
  demoItemsAlwaysVisible,
  demoItemsUnlockedOnDelivery,
  LOCKED_FOLDER_IDS,
  withDemoDownloadUrl,
} from "@/features/customer-portal-demo/data/seed";

// All demo folders are top-level (no subfolders), so "children of root" and
// "children of any specific folder" only differ by the parentFolderId
// check — mirrors the shape of the real getSharedMaterialFolderContents,
// simplified since there's no tree to walk here.

export function getVisibleDemoFolders(unlocked: boolean): MaterialFolder[] {
  return demoFolders.filter((folder) => unlocked || !LOCKED_FOLDER_IDS.has(folder.id));
}

function getVisibleDemoItems(unlocked: boolean): MaterialItem[] {
  return unlocked ? [...demoItemsAlwaysVisible, ...demoItemsUnlockedOnDelivery] : demoItemsAlwaysVisible;
}

export function getDemoFolderContents(folderId: string | null, unlocked: boolean) {
  const folders = getVisibleDemoFolders(unlocked).filter((folder) => (folder.parentFolderId ?? null) === folderId);
  const items = getVisibleDemoItems(unlocked)
    .filter((item) => (item.folderId ?? null) === folderId)
    .sort((a, b) => (a.pinned === b.pinned ? a.position - b.position : a.pinned ? -1 : 1))
    .map(withDemoDownloadUrl);
  return { folders, items };
}

export function getDemoBreadcrumb(folderId: string | null): MaterialFolder[] {
  if (!folderId) return [];
  const folder = demoFolders.find((candidate) => candidate.id === folderId);
  return folder ? [folder] : [];
}

export function getDemoFolderItemCounts(unlocked: boolean): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of getVisibleDemoItems(unlocked)) {
    if (!item.folderId) continue;
    counts.set(item.folderId, (counts.get(item.folderId) ?? 0) + 1);
  }
  return counts;
}

export function getDemoPinnedItems(unlocked: boolean) {
  return getVisibleDemoItems(unlocked)
    .filter((item) => item.pinned)
    .sort((a, b) => a.position - b.position)
    .map(withDemoDownloadUrl);
}
