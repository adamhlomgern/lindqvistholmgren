"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/projects/Lightbox";

type ProjectHeroImageProps = {
  src: string;
  alt: string;
};

export function ProjectHeroImage({ src, alt }: ProjectHeroImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 500px, 100vw"
          quality={90}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/70 text-bone opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Expand size={16} />
        </span>
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
