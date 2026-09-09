"use client";

import { useState } from "react";
import Link from "next/link";
import {
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
import { MaterialUploadDialog } from "@/components/admin/MaterialUploadDialog";
import { MaterialFolderDialog } from "@/components/admin/MaterialFolderDialog";
import { MaterialInstructionDialog } from "@/components/admin/MaterialInstructionDialog";
import { MaterialLinkDialog } from "@/components/admin/MaterialLinkDialog";
import { MaterialMoveDialog } from "@/components/admin/MaterialMoveDialog";
import { deleteFolder, deleteMaterialItem, togglePinned, notifyCustomerAboutFolder } from "@/lib/actions/material";
import { formatBytes } from "@/lib/format";
import type { MaterialFolderTreeNode } from "@/lib/data/material";
import type { MaterialFolder, MaterialItem } from "@/lib/types";

const deliveryStatusLabels = { draft: "Utkast", review: "För granskning", final: "Slutleverans" };

const typeIcons = { file: File, instruction: FileText, link: Link2 } as const;

type Props = {
  customerId: string;
  basePath: string; // "/admin/kunder/{id}/material"
  currentFolderId: string | null;
  breadcrumb: MaterialFolder[];
  folders: MaterialFolder[];
  items: (MaterialItem & { downloadUrl: string | null })[];
  folderTree: MaterialFolderTreeNode[];
};

type MoveTarget = { itemIds: string[]; folderIds: string[]; label: string };

export function MaterialWorkspace({ customerId, basePath, currentFolderId, breadcrumb, folders, items, folderTree }: Props) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderDialog, setFolderDialog] = useState<{ folder?: MaterialFolder } | null>(null);
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<MoveTarget | null>(null);

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

      {folders.length === 0 && items.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-stone">Mappen är tom. Ladda upp filer, skapa en instruktion eller en ny undermapp.</p>
        </Card>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {folders.map((folder) => (
            <Card key={folder.id} className="flex items-center justify-between gap-3">
              <Link href={`${basePath}/${folder.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <FolderIcon size={18} strokeWidth={2} className="shrink-0 text-peach" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-bone">{folder.name}</p>
                  {folder.description && <p className="truncate text-xs text-stone">{folder.description}</p>}
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFolderDialog({ folder })}
                  aria-label="Byt namn"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
                >
                  <Pencil size={14} strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  onClick={() => setMoveTarget({ itemIds: [], folderIds: [folder.id], label: folder.name })}
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
          ))}

          {items.map((item) => {
            const TypeIcon = typeIcons[item.type];
            return (
              <Card key={item.id} className="flex items-center justify-between gap-3">
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
                    onClick={() => setMoveTarget({ itemIds: [item.id], folderIds: [], label: item.title })}
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
          })}
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
