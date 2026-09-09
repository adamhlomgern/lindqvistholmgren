import type { MaterialDeliveryStatus, MaterialFolder, MaterialItem, MaterialItemType, MaterialVisibility } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { tryDecryptText } from "@/lib/crypto/secrets";

const BUCKET = "attachments";
// Long enough to cover one page view; regenerated on every request since
// this is deliberately uncached, same as every other signed-URL table here.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type MaterialFolderRow = {
  id: string;
  customer_id: string;
  project_id: string | null;
  parent_folder_id: string | null;
  name: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

type MaterialItemRow = {
  id: string;
  customer_id: string;
  project_id: string | null;
  folder_id: string | null;
  type: MaterialItemType;
  title: string;
  description: string | null;
  body_html: string | null;
  url: string | null;
  filename: string | null;
  content_type: string | null;
  size: number | null;
  storage_path: string | null;
  visibility: MaterialVisibility;
  delivery_status: MaterialDeliveryStatus;
  pinned: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

function toMaterialFolder(row: MaterialFolderRow): MaterialFolder {
  return {
    id: row.id,
    customerId: row.customer_id,
    projectId: row.project_id ?? undefined,
    parentFolderId: row.parent_folder_id ?? undefined,
    name: row.name,
    description: row.description ?? undefined,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toMaterialItem(row: MaterialItemRow): MaterialItem {
  return {
    id: row.id,
    customerId: row.customer_id,
    projectId: row.project_id ?? undefined,
    folderId: row.folder_id ?? undefined,
    type: row.type,
    title: row.title,
    description: row.description ? tryDecryptText(row.description) : undefined,
    bodyHtml: row.body_html ?? undefined,
    url: row.url ?? undefined,
    filename: row.filename ?? undefined,
    contentType: row.content_type ?? undefined,
    size: row.size ?? undefined,
    storagePath: row.storage_path ?? undefined,
    visibility: row.visibility,
    deliveryStatus: row.delivery_status,
    pinned: row.pinned,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Named downloadUrl, not url — MaterialItem.url is already the link-type's
// destination URL; a signed storage URL is a different thing and the two
// would otherwise collide on the same property for link items.
async function withFileSignedUrls(
  supabase: ReturnType<typeof createServiceRoleClient>,
  items: MaterialItem[],
): Promise<(MaterialItem & { downloadUrl: string | null })[]> {
  return Promise.all(
    items.map(async (item) => {
      if (item.type !== "file" || !item.storagePath) return { ...item, downloadUrl: null };
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(item.storagePath, SIGNED_URL_TTL_SECONDS);
      return { ...item, downloadUrl: data?.signedUrl ?? null };
    }),
  );
}

async function getAllFolders(customerId: string): Promise<MaterialFolder[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("material_folders")
    .select("*")
    .eq("customer_id", customerId)
    .order("position");

  if (error) {
    console.error("[getAllFolders] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toMaterialFolder);
}

export type MaterialFolderTreeNode = MaterialFolder & { children: MaterialFolderTreeNode[] };

// Assembled in app code from a single flat fetch — mirrors the rest of the
// codebase's "no DB triggers, reduce in JS" convention (see
// lib/data/client-projects.ts's checklist summary).
export function buildFolderTree(folders: MaterialFolder[]): MaterialFolderTreeNode[] {
  const byParent = new Map<string | undefined, MaterialFolder[]>();
  for (const folder of folders) {
    const key = folder.parentFolderId;
    byParent.set(key, [...(byParent.get(key) ?? []), folder]);
  }
  function attach(parentId: string | undefined): MaterialFolderTreeNode[] {
    return (byParent.get(parentId) ?? []).map((folder) => ({ ...folder, children: attach(folder.id) }));
  }
  return attach(undefined);
}

export async function getMaterialFolderTree(customerId: string): Promise<MaterialFolderTreeNode[]> {
  return buildFolderTree(await getAllFolders(customerId));
}

// Walks parent_folder_id up to the root for the breadcrumb trail. `folderId`
// null means the root itself — an empty (root-only) breadcrumb.
export async function getMaterialBreadcrumb(
  customerId: string,
  folderId: string | null,
): Promise<MaterialFolder[]> {
  if (!folderId) return [];
  const folders = await getAllFolders(customerId);
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const trail: MaterialFolder[] = [];
  let current = byId.get(folderId);
  while (current) {
    trail.unshift(current);
    current = current.parentFolderId ? byId.get(current.parentFolderId) : undefined;
  }
  return trail;
}

export type MaterialFolderContents = {
  folders: MaterialFolder[];
  items: (MaterialItem & { downloadUrl: string | null })[];
};

// Deliberately uncached: signed URLs expire, and items move/get added or
// removed at any time.
export async function getMaterialFolderContents(customerId: string, folderId: string | null): Promise<MaterialFolderContents> {
  const supabase = createServiceRoleClient();

  let folderQuery = supabase.from("material_folders").select("*").eq("customer_id", customerId);
  folderQuery = folderId ? folderQuery.eq("parent_folder_id", folderId) : folderQuery.is("parent_folder_id", null);

  let itemQuery = supabase.from("material_items").select("*").eq("customer_id", customerId);
  itemQuery = folderId ? itemQuery.eq("folder_id", folderId) : itemQuery.is("folder_id", null);

  const [{ data: folderRows, error: folderError }, { data: itemRows, error: itemError }] = await Promise.all([
    folderQuery.order("position"),
    itemQuery.order("position"),
  ]);

  if (folderError) console.error("[getMaterialFolderContents] Kunde inte hämta mappar", folderError);
  if (itemError) console.error("[getMaterialFolderContents] Kunde inte hämta objekt", itemError);

  const folders = (folderRows ?? []).map(toMaterialFolder);
  const items = (itemRows ?? [])
    .map(toMaterialItem)
    .sort((a, b) => (a.pinned === b.pinned ? a.position - b.position : a.pinned ? -1 : 1));

  return { folders, items: await withFileSignedUrls(supabase, items) };
}

// Shared groundwork for every customer-facing query below: which folders
// contain a shared item anywhere in their subtree (recursively), so an
// internal-only folder — even one with internal-only descendants — never
// shows up or resolves for a customer, whether via navigation or a guessed
// URL.
async function computeFoldersWithSharedContent(customerId: string) {
  const supabase = createServiceRoleClient();
  const [allFolders, { data: sharedItemRows, error: itemError }] = await Promise.all([
    getAllFolders(customerId),
    supabase.from("material_items").select("*").eq("customer_id", customerId).eq("visibility", "shared"),
  ]);
  if (itemError) console.error("[computeFoldersWithSharedContent] Kunde inte hämta objekt", itemError);

  const sharedItems = (sharedItemRows ?? []).map(toMaterialItem);
  const foldersWithSharedItems = new Set(sharedItems.map((item) => item.folderId).filter((id): id is string => !!id));

  const childrenOf = new Map<string | undefined, MaterialFolder[]>();
  for (const folder of allFolders) {
    const key = folder.parentFolderId;
    childrenOf.set(key, [...(childrenOf.get(key) ?? []), folder]);
  }

  const hasSharedContent = new Map<string, boolean>();
  function computeHasSharedContent(folder: MaterialFolder): boolean {
    if (hasSharedContent.has(folder.id)) return hasSharedContent.get(folder.id)!;
    const children = childrenOf.get(folder.id) ?? [];
    const result = foldersWithSharedItems.has(folder.id) || children.some(computeHasSharedContent);
    hasSharedContent.set(folder.id, result);
    return result;
  }
  allFolders.forEach(computeHasSharedContent);

  return { supabase, childrenOf, hasSharedContent, sharedItems };
}

// The one function customer-facing pages call — folders that contain no
// shared item anywhere in their subtree never show up, so the customer
// never sees an internal-only folder, even an empty-looking one.
export async function getSharedMaterialFolderContents(
  customerId: string,
  folderId: string | null,
): Promise<MaterialFolderContents> {
  const { supabase, childrenOf, hasSharedContent, sharedItems } = await computeFoldersWithSharedContent(customerId);

  const folders = (childrenOf.get(folderId ?? undefined) ?? []).filter((folder) => hasSharedContent.get(folder.id));
  const items = sharedItems
    .filter((item) => (item.folderId ?? null) === folderId)
    .sort((a, b) => (a.pinned === b.pinned ? a.position - b.position : a.pinned ? -1 : 1));

  return { folders, items: await withFileSignedUrls(supabase, items) };
}

// Guards a direct/guessed folder URL: true only if the folder itself (or a
// descendant) has shared content — same rule that keeps it out of listings.
export async function isFolderSharedWithCustomer(customerId: string, folderId: string): Promise<boolean> {
  const { hasSharedContent } = await computeFoldersWithSharedContent(customerId);
  return hasSharedContent.get(folderId) ?? false;
}

// One query, grouped in JS — the customer folder cards' "N objekt" count,
// without an N+1 per folder shown.
export async function getSharedItemCountsByFolder(customerId: string): Promise<Map<string, number>> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("material_items")
    .select("folder_id")
    .eq("customer_id", customerId)
    .eq("visibility", "shared")
    .not("folder_id", "is", null);

  const counts = new Map<string, number>();
  if (error) {
    console.error("[getSharedItemCountsByFolder] Supabase-fråga misslyckades", error);
    return counts;
  }

  for (const row of data ?? []) {
    const folderId = row.folder_id as string;
    counts.set(folderId, (counts.get(folderId) ?? 0) + 1);
  }
  return counts;
}

// Pinned + shared items across every folder, for the customer library's
// home-page "fästa guider/leveranser" section.
export async function getPinnedSharedMaterial(customerId: string): Promise<(MaterialItem & { downloadUrl: string | null })[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("material_items")
    .select("*")
    .eq("customer_id", customerId)
    .eq("visibility", "shared")
    .eq("pinned", true)
    .order("position");

  if (error) {
    console.error("[getPinnedSharedMaterial] Supabase-fråga misslyckades", error);
    return [];
  }

  return withFileSignedUrls(supabase, (data ?? []).map(toMaterialItem));
}

// Flat, newest-first — used by the admin customer overview's preview card
// and merged activity feed (lib/data/customer-activity.ts). No visibility
// filter: this is admin-only.
export async function getRecentMaterialItems(customerId: string, limit: number): Promise<MaterialItem[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("material_items")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentMaterialItems] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toMaterialItem);
}
