"use client";

import { X } from "lucide-react";

// Shown above the compose row once an image has been picked or pasted but
// not sent yet — lets the sender see exactly what's about to go out (and
// remove it) before it reaches the other person, same reasoning as a mail
// client's attachment preview.
export function PendingImagePreview({ file, previewUrl, onRemove }: { file: File; previewUrl: string; onRemove: () => void }) {
  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-bone/10 bg-bone/5 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- local object URL for a not-yet-uploaded file, not a static asset */}
      <img src={previewUrl} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />
      <p className="min-w-0 flex-1 truncate text-xs text-stone">{file.name}</p>
      <button
        type="button"
        aria-label="Ta bort bilden"
        onClick={onRemove}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-coral"
      >
        <X size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}
