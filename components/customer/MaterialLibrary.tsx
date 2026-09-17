"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { File, FileText, Folder, Link2, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaterialItemRow } from "@/components/customer/MaterialItemRow";
import { MaterialViewControls } from "@/components/customer/MaterialViewControls";
import {
  getCustomerMaterialSortModeServerSnapshot,
  getCustomerMaterialSortModeSnapshot,
  getCustomerMaterialViewModeServerSnapshot,
  getCustomerMaterialViewModeSnapshot,
  setCustomerMaterialSortMode,
  setCustomerMaterialViewMode,
  subscribeCustomerMaterialSort,
  subscribeCustomerMaterialView,
  sortFolders,
  sortItems,
  type MaterialViewMode,
} from "@/lib/material-view";
import type { MaterialFolder, MaterialItem } from "@/lib/types";

type MaterialItemWithUrl = MaterialItem & { downloadUrl: string | null };

type Props = {
  basePath: string; // "/kund/material" (or the admin kundvy equivalent)
  breadcrumb: MaterialFolder[];
  folders: MaterialFolder[];
  folderItemCounts: Map<string, number>;
  items: MaterialItemWithUrl[];
  pinnedItems?: MaterialItemWithUrl[];
};

const typeIcons = { file: File, instruction: FileText, link: Link2 } as const;

const gridClasses: Record<Exclude<MaterialViewMode, "list">, string> = {
  "grid-sm": "grid grid-cols-3 gap-2.5 sm:grid-cols-4",
  "grid-lg": "grid grid-cols-2 gap-3 sm:grid-cols-3",
};

export function MaterialLibrary({ basePath, breadcrumb, folders, folderItemCounts, items, pinnedItems }: Props) {
  // getServerSnapshot matches the server-rendered first paint (list/custom)
  // so hydration never mismatches; per-viewer choice (this browser's own,
  // separate from any admin's) kicks in via useSyncExternalStore.
  const viewMode = useSyncExternalStore(
    subscribeCustomerMaterialView,
    getCustomerMaterialViewModeSnapshot,
    getCustomerMaterialViewModeServerSnapshot,
  );
  const sortMode = useSyncExternalStore(
    subscribeCustomerMaterialSort,
    getCustomerMaterialSortModeSnapshot,
    getCustomerMaterialSortModeServerSnapshot,
  );

  const sortedFolders = sortFolders(folders, sortMode);
  const sortedItems = sortItems(items, sortMode);

  const currentFolderName = breadcrumb[breadcrumb.length - 1]?.name;
  const crumbs = [
    { label: "Material", href: breadcrumb.length > 0 ? basePath : undefined },
    ...breadcrumb.map((folder, index) => ({
      label: folder.name,
      href: index < breadcrumb.length - 1 ? `${basePath}/${folder.id}` : undefined,
    })),
  ];

  const isEmpty = folders.length === 0 && items.length === 0 && (!pinnedItems || pinnedItems.length === 0);

  return (
    <div>
      {breadcrumb.length > 0 && <Breadcrumbs items={crumbs} className="mb-3" />}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">{currentFolderName ?? "Material"}</h1>
          {!currentFolderName && <p className="mt-1 text-sm text-stone">Filer, instruktioner och länkar från oss.</p>}
        </div>
        {!isEmpty && (
          <MaterialViewControls
            sortMode={sortMode}
            onSortModeChange={setCustomerMaterialSortMode}
            viewMode={viewMode}
            onViewModeChange={setCustomerMaterialViewMode}
          />
        )}
      </div>

      {pinnedItems && pinnedItems.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-1.5 font-display text-sm font-bold text-bone">
            <Star size={13} strokeWidth={2.5} className="text-peach" fill="currentColor" />
            Viktigt just nu
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {pinnedItems.map((item) => (
              <MaterialItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <>
          {sortedFolders.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {sortedFolders.map((folder) => (
                <Link key={folder.id} href={`${basePath}/${folder.id}`}>
                  <Card className="h-full transition-colors hover:bg-bone/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <Folder size={18} strokeWidth={2} className="shrink-0 text-peach" />
                      <p className="truncate text-sm font-medium text-bone">{folder.name}</p>
                    </div>
                    {folder.description && <p className="mt-1.5 text-xs text-stone">{folder.description}</p>}
                    <p className="mt-2 text-xs text-stone/60">{folderItemCounts.get(folder.id) ?? 0} objekt</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {sortedItems.length > 0 && (
            <div className="mt-6 flex flex-col gap-3">
              {sortedItems.map((item) => (
                <MaterialItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={`mt-6 ${gridClasses[viewMode]}`}>
          {sortedFolders.map((folder) => (
            <Link
              key={folder.id}
              href={`${basePath}/${folder.id}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/5 p-3 text-center transition-colors hover:bg-bone/[0.08]"
            >
              <Folder size={26} strokeWidth={1.75} className="text-peach" />
              <p className="line-clamp-2 text-xs font-medium text-bone">{folder.name}</p>
              <p className="text-[11px] text-stone/60">{folderItemCounts.get(folder.id) ?? 0} objekt</p>
            </Link>
          ))}
          {sortedItems.map((item) => (
            <MaterialItemGridCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {isEmpty && (
        <Card className="mt-6">
          <p className="text-sm text-stone">Inget material här ännu.</p>
        </Card>
      )}
    </div>
  );
}

function MaterialItemGridCard({ item }: { item: MaterialItemWithUrl }) {
  const TypeIcon = typeIcons[item.type];
  const isImage = item.type === "file" && item.contentType?.startsWith("image/");
  // Instructions carry rich body text that doesn't fit a thumbnail — switch
  // to list view to read one instead of clicking a dead card here.
  const href = item.type === "file" ? (item.downloadUrl ?? undefined) : item.type === "link" ? item.url : undefined;

  const content = (
    <>
      {isImage && item.downloadUrl ? (
        <div className="absolute inset-0 bg-checkered">
          {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URLs, not a static/optimizable asset */}
          <img src={item.downloadUrl} alt={item.title} className="h-full w-full object-contain p-3" />
        </div>
      ) : (
        <>
          <TypeIcon size={22} strokeWidth={1.75} className="text-stone" />
          <span className="line-clamp-2 text-[11px] text-stone">{item.title}</span>
        </>
      )}
      {isImage && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-charcoal/90 to-transparent px-2 pb-1.5 pt-4 text-[11px] text-bone">
          {item.title}
        </span>
      )}
    </>
  );

  const className =
    "relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-bone/10 bg-bone/5 p-3 text-center transition-colors hover:bg-bone/[0.08]";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}
