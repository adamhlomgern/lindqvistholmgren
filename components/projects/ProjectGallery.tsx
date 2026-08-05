"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/projects/Lightbox";

type ProjectGalleryProps = {
  images: string[];
  alt: string;
};

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 768px) 450px, 100vw"
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/70 text-bone opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <Expand size={16} />
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          src={images[openIndex]}
          alt={alt}
          onClose={() => setOpenIndex(null)}
          onPrev={
            images.length > 1
              ? () => setOpenIndex((current) => ((current ?? 0) - 1 + images.length) % images.length)
              : undefined
          }
          onNext={
            images.length > 1
              ? () => setOpenIndex((current) => ((current ?? 0) + 1) % images.length)
              : undefined
          }
        />
      )}
    </>
  );
}
