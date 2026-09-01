import type { ReactNode } from "react";
import { File as FileIcon } from "lucide-react";

export function FileThumb({
  filename,
  contentType,
  url,
  action,
}: {
  filename: string;
  contentType?: string;
  url: string | null;
  action?: ReactNode;
}) {
  const isImage = contentType?.startsWith("image/");

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-bone/10 bg-bone/5">
      <a
        href={url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center"
      >
        {isImage && url ? (
          // eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URLs, not a static/optimizable asset
          <img src={url} alt={filename} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <FileIcon size={22} strokeWidth={1.75} className="text-stone" />
            <span className="line-clamp-2 text-[11px] text-stone">{filename}</span>
          </>
        )}
      </a>
      {isImage && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-charcoal/90 to-transparent px-2 pb-1.5 pt-4 text-[11px] text-bone">
          {filename}
        </span>
      )}
      {action && <div className="absolute right-1 top-1">{action}</div>}
    </div>
  );
}
