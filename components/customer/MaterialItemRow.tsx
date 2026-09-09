"use client";

import { useState } from "react";
import { Download, ExternalLink, File, FileText, Link2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatBytes } from "@/lib/format";
import type { MaterialItem } from "@/lib/types";

type Props = { item: MaterialItem & { downloadUrl: string | null } };

const backgrounds = {
  light: "bg-white",
  dark: "bg-charcoal",
  checkered:
    "bg-[linear-gradient(45deg,#88888833_25%,transparent_25%),linear-gradient(-45deg,#88888833_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#88888833_75%),linear-gradient(-45deg,transparent_75%,#88888833_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]",
} as const;

// Only matters for images — swapping the preview's background reveals a
// white or transparent logo variant that would otherwise be invisible.
function ImagePreview({ url, title }: { url: string; title: string }) {
  const [background, setBackground] = useState<keyof typeof backgrounds>("checkered");

  return (
    <div>
      <div className={`flex h-40 items-center justify-center overflow-hidden rounded-xl ${backgrounds[background]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={title} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {(Object.keys(backgrounds) as (keyof typeof backgrounds)[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setBackground(key)}
            aria-label={`Bakgrund: ${key}`}
            className={`h-5 w-5 rounded-full border transition-colors ${
              background === key ? "border-emerald" : "border-bone/20"
            } ${key === "light" ? "bg-white" : key === "dark" ? "bg-charcoal" : "bg-[conic-gradient(#888_25%,transparent_25%,transparent_50%,#888_50%,#888_75%,transparent_75%)] bg-[length:8px_8px]"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function MaterialItemRow({ item }: Props) {
  const isImage = item.type === "file" && item.contentType?.startsWith("image/");
  const isPdf = item.type === "file" && item.contentType === "application/pdf";

  if (item.type === "instruction") {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <FileText size={16} strokeWidth={2} className="shrink-0 text-stone" />
          <p className="font-display text-sm font-bold text-bone">{item.title}</p>
        </div>
        {item.description && <p className="mt-1 text-sm text-stone">{item.description}</p>}
        {item.bodyHtml && (
          <div className="article-prose mt-4 text-sm" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
        )}
      </Card>
    );
  }

  if (item.type === "link") {
    return (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link2 size={16} strokeWidth={2} className="shrink-0 text-stone" />
              <p className="truncate text-sm font-medium text-bone">{item.title}</p>
            </div>
            {item.description && <p className="mt-1 text-sm text-stone">{item.description}</p>}
          </div>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Öppna länk
              <ExternalLink size={12} strokeWidth={2.5} />
            </a>
          )}
        </div>
      </Card>
    );
  }

  // type === "file"
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <File size={16} strokeWidth={2} className="shrink-0 text-stone" />
            <p className="truncate text-sm font-medium text-bone">{item.title}</p>
          </div>
          {item.description && <p className="mt-1 text-sm text-stone">{item.description}</p>}
          <p className="mt-1 text-xs text-stone/70">
            {item.filename}
            {item.contentType && ` · ${item.contentType.split("/")[1]?.toUpperCase()}`}
            {item.size ? ` · ${formatBytes(item.size)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isPdf && item.downloadUrl && (
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-bone/10 px-4 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/15"
            >
              Förhandsgranska
            </a>
          )}
          {item.downloadUrl && (
            <a
              href={item.downloadUrl}
              download={item.filename}
              className="flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              <Download size={12} strokeWidth={2.5} />
              Ladda ner
            </a>
          )}
        </div>
      </div>
      {isImage && item.downloadUrl && (
        <div className="mt-4">
          <ImagePreview url={item.downloadUrl} title={item.title} />
        </div>
      )}
    </Card>
  );
}
