import type { ReactNode } from "react";
import { File as FileIcon } from "lucide-react";

export function FileThumb({
  filename,
  contentType,
  url,
  action,
  badge,
}: {
  filename: string;
  contentType?: string;
  url: string | null;
  action?: ReactNode;
  badge?: ReactNode;
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
          // A transparent-background logo rendered edge-to-edge with
          // object-cover gets cropped and sits on whatever the card's own
          // background is. object-contain on a neutral checkerboard (not a
          // flat white/dark fill — white logos disappear on white, dark ones
          // on dark) shows the whole image predictably instead.
          <div className="absolute inset-0 bg-checkered">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URLs, not a static/optimizable asset */}
            <img src={url} alt={filename} className="h-full w-full object-contain p-3" />
          </div>
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
      {badge && <div className="absolute left-1 top-1">{badge}</div>}
    </div>
  );
}
