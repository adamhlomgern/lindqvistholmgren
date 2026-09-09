"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Folder, FolderTree } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { moveMaterialItems } from "@/lib/actions/material";
import type { MaterialFolderTreeNode } from "@/lib/data/material";

type Props = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  folderTree: MaterialFolderTreeNode[];
  itemIds: string[];
  folderIds: string[];
  label: string;
};

function flatten(nodes: MaterialFolderTreeNode[], depth = 0): { id: string; name: string; depth: number }[] {
  return nodes.flatMap((node) => [{ id: node.id, name: node.name, depth }, ...flatten(node.children, depth + 1)]);
}

export function MaterialMoveDialog({ open, onClose, customerId, folderTree, itemIds, folderIds, label }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const rows = flatten(folderTree);

  function moveTo(targetFolderId: string | null) {
    setError(undefined);
    startTransition(async () => {
      const result = await moveMaterialItems(customerId, itemIds, folderIds, targetFolderId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <SlideOver open={open} onClose={onClose} title={`Flytta "${label}"`}>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => moveTo(null)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5 disabled:opacity-50"
        >
          <FolderTree size={15} strokeWidth={2.25} className="shrink-0 text-stone" />
          Bibliotekets rot
        </button>
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            disabled={pending || folderIds.includes(row.id)}
            onClick={() => moveTo(row.id)}
            style={{ paddingLeft: `${0.75 + row.depth * 1.25}rem` }}
            className="flex items-center gap-2.5 rounded-lg py-2.5 pr-3 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5 disabled:opacity-40"
          >
            <Folder size={15} strokeWidth={2.25} className="shrink-0 text-stone" />
            {row.name}
          </button>
        ))}
        {error && <p className="mt-2 text-sm text-coral">{error}</p>}
      </div>
    </SlideOver>
  );
}
