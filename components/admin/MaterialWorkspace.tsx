"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  File,
  FileText,
  Folder as FolderIcon,
  FolderInput,
  FolderPlus,
  Link2,
  MessageSquareText,
  Pencil,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MaterialVisibilityToggle } from "@/components/admin/MaterialVisibilityToggle";
import { MaterialViewControls } from "@/components/admin/MaterialViewControls";
import { MaterialUploadDialog } from "@/components/admin/MaterialUploadDialog";
import { MaterialFolderDialog } from "@/components/admin/MaterialFolderDialog";
import { MaterialInstructionDialog } from "@/components/admin/MaterialInstructionDialog";
import { MaterialLinkDialog } from "@/components/admin/MaterialLinkDialog";
import { MaterialMoveDialog } from "@/components/admin/MaterialMoveDialog";
import {
  deleteFolder,
  deleteMaterialItem,
  togglePinned,
  notifyCustomerAboutFolder,
  setMaterialFolderOrder,
  setMaterialItemOrder,
} from "@/lib/actions/material";
import { formatBytes } from "@/lib/format";
import {
  getMaterialSortModeServerSnapshot,
  getMaterialSortModeSnapshot,
  getMaterialViewModeServerSnapshot,
  getMaterialViewModeSnapshot,
  setMaterialSortMode,
  setMaterialViewMode,
  subscribeMaterialView,
  sortFolders,
  sortItems,
  type MaterialViewMode,
} from "@/lib/material-view";
import type { MaterialFolderTreeNode } from "@/lib/data/material";
import type { MaterialFolder, MaterialItem } from "@/lib/types";

const deliveryStatusLabels = { draft: "Utkast", review: "För granskning", final: "Slutleverans" };

const typeIcons = { file: File, instruction: FileText, link: Link2 } as const;

type MaterialItemWithUrl = MaterialItem & { downloadUrl: string | null };

type Props = {
  customerId: string;
  basePath: string; // "/admin/kunder/{id}/material"
  currentFolderId: string | null;
  breadcrumb: MaterialFolder[];
  folders: MaterialFolder[];
  items: MaterialItemWithUrl[];
  folderTree: MaterialFolderTreeNode[];
};

type MoveTarget = { itemIds: string[]; folderIds: string[]; label: string };

const gridClasses: Record<Exclude<MaterialViewMode, "list">, string> = {
  "grid-sm": "grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6",
  "grid-lg": "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
};

export function MaterialWorkspace({ customerId, basePath, currentFolderId, breadcrumb, folders, items, folderTree }: Props) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderDialog, setFolderDialog] = useState<{ folder?: MaterialFolder } | null>(null);
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<MoveTarget | null>(null);

  // getServerSnapshot matches the server-rendered first paint (list/custom)
  // so hydration never mismatches; the real value (from localStorage) kicks
  // in on the client's next render via useSyncExternalStore, not an effect.
  const viewMode = useSyncExternalStore(subscribeMaterialView, getMaterialViewModeSnapshot, getMaterialViewModeServerSnapshot);
  const sortMode = useSyncExternalStore(subscribeMaterialView, getMaterialSortModeSnapshot, getMaterialSortModeServerSnapshot);

  const sortedFolders = sortFolders(folders, sortMode);
  const sortedItems = sortItems(items, sortMode);

  function moveFolder(folderId: string, direction: -1 | 1) {
    const order = sortedFolders.map((f) => f.id);
    const index = order.indexOf(folderId);
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    setMaterialFolderOrder(customerId, order);
  }

  function moveItem(itemId: string, direction: -1 | 1) {
    const order = sortedItems.map((i) => i.id);
    const index = order.indexOf(itemId);
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    setMaterialItemOrder(customerId, order);
  }

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
      <Breadcrumbs items={crumbs} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-bone">{currentFolderName ?? "Material"}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
          >
            <Upload size={13} strokeWidth={2.5} />
            Ladda upp
          </button>
          <button
            type="button"
            onClick={() => setFolderDialog({})}
            className="flex items-center gap-1.5 rounded-full bg-bone/10 px-4 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
          >
            <FolderPlus size={13} strokeWidth={2.5} />
            Ny mapp
          </button>
          <button
            type="button"
            onClick={() => setInstructionOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-bone/10 px-4 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
          >
            <FileText size={13} strokeWidth={2.5} />
            Skapa instruktion
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-bone/10 px-4 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
          >
            <Link2 size={13} strokeWidth={2.5} />
            Lägg till länk
          </button>
          {currentFolderId && currentFolderName && (
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full bg-bone/10 px-4 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
                >
                  <MessageSquareText size={13} strokeWidth={2.5} />
                  Meddela kund
                </button>
              }
              title="Meddela kunden?"
              description={`Skickar ett meddelande i portalchatten med en länk till "${currentFolderName}".`}
              confirmLabel="Skicka"
              onConfirm={() => notifyCustomerAboutFolder(customerId, currentFolderId, currentFolderName)}
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <MaterialViewControls
          sortMode={sortMode}
          onSortModeChange={setMaterialSortMode}
          viewMode={viewMode}
          onViewModeChange={setMaterialViewMode}
        />
      </div>

      {folders.length === 0 && items.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-stone">Mappen är tom. Ladda upp filer, skapa en instruktion eller en ny undermapp.</p>
        </Card>
      ) : viewMode === "list" ? (
        <div className="mt-4 flex flex-col gap-2">
          {sortedFolders.map((folder, index) => (
            <FolderListRow
              key={folder.id}
              folder={folder}
              basePath={basePath}
              customerId={customerId}
              canReorder={sortMode === "custom"}
              isFirst={index === 0}
              isLast={index === sortedFolders.length - 1}
              onMove={(direction) => moveFolder(folder.id, direction)}
              onRename={() => setFolderDialog({ folder })}
              onMoveTo={() => setMoveTarget({ itemIds: [], folderIds: [folder.id], label: folder.name })}
            />
          ))}
          {sortedItems.map((item, index) => (
            <ItemListRow
              key={item.id}
              item={item}
              customerId={customerId}
              canReorder={sortMode === "custom"}
              isFirst={index === 0}
              isLast={index === sortedItems.length - 1}
              onMove={(direction) => moveItem(item.id, direction)}
              onMoveTo={() => setMoveTarget({ itemIds: [item.id], folderIds: [], label: item.title })}
            />
          ))}
        </div>
      ) : (
        <div className={`mt-4 ${gridClasses[viewMode]}`}>
          {sortedFolders.map((folder, index) => (
            <FolderGridCard
              key={folder.id}
              folder={folder}
              basePath={basePath}
              customerId={customerId}
              canReorder={sortMode === "custom"}
              isFirst={index === 0}
              isLast={index === sortedFolders.length - 1}
              onMove={(direction) => moveFolder(folder.id, direction)}
              onRename={() => setFolderDialog({ folder })}
              onMoveTo={() => setMoveTarget({ itemIds: [], folderIds: [folder.id], label: folder.name })}
            />
          ))}
          {sortedItems.map((item, index) => (
            <ItemGridCard
              key={item.id}
              item={item}
              customerId={customerId}
              canReorder={sortMode === "custom"}
              isFirst={index === 0}
              isLast={index === sortedItems.length - 1}
              onMove={(direction) => moveItem(item.id, direction)}
              onMoveTo={() => setMoveTarget({ itemIds: [item.id], folderIds: [], label: item.title })}
            />
          ))}
        </div>
      )}

      <MaterialUploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} customerId={customerId} folderId={currentFolderId} />
      {folderDialog && (
        <MaterialFolderDialog
          open
          onClose={() => setFolderDialog(null)}
          customerId={customerId}
          parentFolderId={currentFolderId}
          folder={folderDialog.folder}
        />
      )}
      <MaterialInstructionDialog open={instructionOpen} onClose={() => setInstructionOpen(false)} customerId={customerId} folderId={currentFolderId} />
      <MaterialLinkDialog open={linkOpen} onClose={() => setLinkOpen(false)} customerId={customerId} folderId={currentFolderId} />
      {moveTarget && (
        <MaterialMoveDialog
          open
          onClose={() => setMoveTarget(null)}
          customerId={customerId}
          folderTree={folderTree}
          itemIds={moveTarget.itemIds}
          folderIds={moveTarget.folderIds}
          label={moveTarget.label}
        />
      )}
    </div>
  );
}

// Move-up/move-down pair, only rendered in "Egen ordning" sort mode — the
// audit explicitly asked for a non-drag way to reorder, so this is the only
// mechanism (no drag-and-drop) rather than a fallback bolted onto one.
function ReorderButtons({
  isFirst,
  isLast,
  onMove,
}: {
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        aria-label="Flytta upp"
        className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:text-bone disabled:opacity-30"
      >
        <ChevronUp size={14} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        aria-label="Flytta ner"
        className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:text-bone disabled:opacity-30"
      >
        <ChevronDown size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}

type FolderRowProps = {
  folder: MaterialFolder;
  basePath: string;
  customerId: string;
  canReorder: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onRename: () => void;
  onMoveTo: () => void;
};

function FolderListRow({ folder, basePath, canReorder, isFirst, isLast, onMove, onRename, onMoveTo, customerId }: FolderRowProps) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <Link href={`${basePath}/${folder.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <FolderIcon size={18} strokeWidth={2} className="shrink-0 text-peach" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-bone">{folder.name}</p>
          {folder.description && <p className="truncate text-xs text-stone">{folder.description}</p>}
        </div>
      </Link>
      <div className="flex shrink-0 items-center gap-1">
        {canReorder && <ReorderButtons isFirst={isFirst} isLast={isLast} onMove={onMove} />}
        <button
          type="button"
          onClick={onRename}
          aria-label="Byt namn"
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <Pencil size={14} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={onMoveTo}
          aria-label="Flytta"
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <FolderInput size={14} strokeWidth={2.25} />
        </button>
        <ConfirmDialog
          trigger={
            <button
              type="button"
              aria-label="Radera mapp"
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-coral/10 hover:text-coral"
            >
              <Trash2 size={14} strokeWidth={2.25} />
            </button>
          }
          title="Radera mappen?"
          description={`"${folder.name}" och allt innehåll i den (inklusive undermappar) raderas permanent.`}
          confirmLabel="Radera"
          destructive
          onConfirm={() => deleteFolder(customerId, folder.id)}
        />
      </div>
    </Card>
  );
}

function FolderGridCard({ folder, basePath, canReorder, isFirst, isLast, onMove, onRename, onMoveTo, customerId }: FolderRowProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/5 p-3">
      <Link href={`${basePath}/${folder.id}`} className="flex w-full flex-1 flex-col items-center gap-2 text-center">
        <FolderIcon size={26} strokeWidth={1.75} className="text-peach" />
        <p className="line-clamp-2 text-xs font-medium text-bone">{folder.name}</p>
      </Link>
      <div className="flex shrink-0 items-center gap-0.5">
        {canReorder && <ReorderButtons isFirst={isFirst} isLast={isLast} onMove={onMove} />}
        <button
          type="button"
          onClick={onRename}
          aria-label="Byt namn"
          className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <Pencil size={12} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={onMoveTo}
          aria-label="Flytta"
          className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <FolderInput size={12} strokeWidth={2.25} />
        </button>
        <ConfirmDialog
          trigger={
            <button
              type="button"
              aria-label="Radera mapp"
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-coral/10 hover:text-coral"
            >
              <Trash2 size={12} strokeWidth={2.25} />
            </button>
          }
          title="Radera mappen?"
          description={`"${folder.name}" och allt innehåll i den (inklusive undermappar) raderas permanent.`}
          confirmLabel="Radera"
          destructive
          onConfirm={() => deleteFolder(customerId, folder.id)}
        />
      </div>
    </div>
  );
}

type ItemRowProps = {
  item: MaterialItemWithUrl;
  customerId: string;
  canReorder: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onMoveTo: () => void;
};

function ItemListRow({ item, customerId, canReorder, isFirst, isLast, onMove, onMoveTo }: ItemRowProps) {
  const TypeIcon = typeIcons[item.type];
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <TypeIcon size={18} strokeWidth={2} className="shrink-0 text-stone" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-bone">{item.title}</p>
          <p className="truncate text-xs text-stone">
            {item.type === "file" && item.filename && `${item.filename}${item.size ? ` · ${formatBytes(item.size)}` : ""}`}
            {item.type === "link" && item.url}
            {item.type === "instruction" && "Instruktion"}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
        <Tag>{deliveryStatusLabels[item.deliveryStatus]}</Tag>
        <MaterialVisibilityToggle customerId={customerId} itemId={item.id} visibility={item.visibility} itemTitle={item.title} />
        {canReorder && <ReorderButtons isFirst={isFirst} isLast={isLast} onMove={onMove} />}
        <button
          type="button"
          onClick={() => togglePinned(customerId, item.id, !item.pinned)}
          aria-label={item.pinned ? "Ta bort nål" : "Fäst överst"}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-bone/10 ${
            item.pinned ? "text-peach" : "text-stone hover:text-bone"
          }`}
        >
          <Star size={14} strokeWidth={2.25} fill={item.pinned ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={onMoveTo}
          aria-label="Flytta"
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <FolderInput size={14} strokeWidth={2.25} />
        </button>
        <ConfirmDialog
          trigger={
            <button
              type="button"
              aria-label="Radera"
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-coral/10 hover:text-coral"
            >
              <Trash2 size={14} strokeWidth={2.25} />
            </button>
          }
          title="Radera?"
          description={`"${item.title}" raderas permanent.`}
          confirmLabel="Radera"
          destructive
          onConfirm={() => deleteMaterialItem(customerId, item.id, item.storagePath ?? null)}
        />
      </div>
    </Card>
  );
}

function ItemGridCard({ item, customerId, canReorder, isFirst, isLast, onMove, onMoveTo }: ItemRowProps) {
  const TypeIcon = typeIcons[item.type];
  const isImage = item.type === "file" && item.contentType?.startsWith("image/");

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-bone/10 bg-bone/5">
      <a
        href={item.downloadUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex aspect-square flex-col items-center justify-center gap-2 p-3 text-center"
      >
        {isImage && item.downloadUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URLs, not a static/optimizable asset
          <img src={item.downloadUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
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
        {item.pinned && (
          <Star size={13} strokeWidth={2.25} fill="currentColor" className="absolute right-1.5 top-1.5 text-peach" />
        )}
      </a>
      <div className="flex flex-wrap items-center justify-between gap-1 border-t border-bone/10 p-1.5">
        <MaterialVisibilityToggle customerId={customerId} itemId={item.id} visibility={item.visibility} itemTitle={item.title} />
        <div className="flex shrink-0 items-center gap-0.5">
          {canReorder && <ReorderButtons isFirst={isFirst} isLast={isLast} onMove={onMove} />}
          <button
            type="button"
            onClick={() => togglePinned(customerId, item.id, !item.pinned)}
            aria-label={item.pinned ? "Ta bort nål" : "Fäst överst"}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-bone/10 ${
              item.pinned ? "text-peach" : "text-stone hover:text-bone"
            }`}
          >
            <Star size={12} strokeWidth={2.25} fill={item.pinned ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={onMoveTo}
            aria-label="Flytta"
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
          >
            <FolderInput size={12} strokeWidth={2.25} />
          </button>
          <ConfirmDialog
            trigger={
              <button
                type="button"
                aria-label="Radera"
                className="flex h-7 w-7 items-center justify-center rounded-full text-stone transition-colors hover:bg-coral/10 hover:text-coral"
              >
                <Trash2 size={12} strokeWidth={2.25} />
              </button>
            }
            title="Radera?"
            description={`"${item.title}" raderas permanent.`}
            confirmLabel="Radera"
            destructive
            onConfirm={() => deleteMaterialItem(customerId, item.id, item.storagePath ?? null)}
          />
        </div>
      </div>
    </div>
  );
}
