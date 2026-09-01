"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { duplicateArticle, deleteArticle, setArticleStatus } from "@/lib/actions/articles";
import type { ArticleStatus } from "@/lib/types";

export function ArticleCardMenu({
  slug,
  title,
  status,
}: {
  slug: string;
  title: string;
  status: ArticleStatus;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isPublished = status === "publicerad";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setOpen((v) => !v);
        }}
        aria-label="Fler alternativ"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
      >
        <MoreHorizontal size={16} strokeWidth={2.25} />
      </button>
      {open && (
        <div
          role="menu"
          onClick={(event) => event.preventDefault()}
          className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
        >
          <Link
            href={`/admin/artiklar/${slug}`}
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-bone/5"
          >
            <Pencil size={14} strokeWidth={2.25} />
            Redigera
          </Link>
          <Link
            href={`/admin/artiklar/${slug}/forhandsgranska`}
            target="_blank"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-bone/5"
          >
            <Eye size={14} strokeWidth={2.25} />
            Förhandsgranska
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              duplicateArticle(slug);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5"
          >
            <Copy size={14} strokeWidth={2.25} />
            Duplicera
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setArticleStatus(slug, isPublished ? "avpublicerad" : "publicerad");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5"
          >
            <EyeOff size={14} strokeWidth={2.25} />
            {isPublished ? "Avpublicera" : "Publicera"}
          </button>
          <div className="my-1 border-t border-bone/10" />
          <ConfirmDialog
            trigger={
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
              >
                <Trash2 size={14} strokeWidth={2.25} />
                Radera artikel
              </button>
            }
            title={`Radera artikeln "${title}"?`}
            description="Det går inte att ångra."
            confirmLabel="Radera"
            destructive
            onConfirm={() => deleteArticle(slug)}
          />
        </div>
      )}
    </div>
  );
}
