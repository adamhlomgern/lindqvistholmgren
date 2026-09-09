import Link from "next/link";
import { Folder, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaterialItemRow } from "@/components/customer/MaterialItemRow";
import type { MaterialFolder, MaterialItem } from "@/lib/types";

type Props = {
  basePath: string; // "/kund/material" (or the admin kundvy equivalent)
  breadcrumb: MaterialFolder[];
  folders: MaterialFolder[];
  folderItemCounts: Map<string, number>;
  items: (MaterialItem & { downloadUrl: string | null })[];
  pinnedItems?: (MaterialItem & { downloadUrl: string | null })[];
};

export function MaterialLibrary({ basePath, breadcrumb, folders, folderItemCounts, items, pinnedItems }: Props) {
  const currentFolderName = breadcrumb[breadcrumb.length - 1]?.name;
  const crumbs = [
    { label: "Material", href: breadcrumb.length > 0 ? basePath : undefined },
    ...breadcrumb.map((folder, index) => ({
      label: folder.name,
      href: index < breadcrumb.length - 1 ? `${basePath}/${folder.id}` : undefined,
    })),
  ];

  return (
    <div>
      {breadcrumb.length > 0 && <Breadcrumbs items={crumbs} className="mb-3" />}
      <h1 className="font-display text-2xl font-bold text-bone">{currentFolderName ?? "Material"}</h1>
      {!currentFolderName && <p className="mt-1 text-sm text-stone">Filer, instruktioner och länkar från oss.</p>}

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

      {folders.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {folders.map((folder) => (
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

      {items.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <MaterialItemRow key={item.id} item={item} />
          ))}
        </div>
      )}

      {folders.length === 0 && items.length === 0 && (!pinnedItems || pinnedItems.length === 0) && (
        <Card className="mt-6">
          <p className="text-sm text-stone">Inget material här ännu.</p>
        </Card>
      )}
    </div>
  );
}
