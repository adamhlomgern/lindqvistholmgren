"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

// Plain fixed-position overlay, no Radix Portal — nothing in this app's
// ancestor chain sets a transform/filter that would break position: fixed,
// so a portal isn't needed to escape it.
export function ImageLightbox({ url, alt, onClose }: { url: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Stäng förhandsvisning"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-bone/10 text-bone transition-colors hover:bg-bone/20"
      >
        <X size={18} strokeWidth={2.25} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL preview, not a static asset next/image can optimize */}
      <img
        src={url}
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
