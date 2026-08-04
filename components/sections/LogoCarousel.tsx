"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { partners } from "@/lib/data/partners";

const ITEM_WIDTH = 128;
const GAP = 64;
const STEP = ITEM_WIDTH + GAP;
const HOLD_MS = 5000;
const GLIDE_MS = 900;

export function LogoCarousel() {
  const track = [...partners, ...partners];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next === partners.length) {
          setTimeout(() => {
            setAnimate(false);
            setIndex(0);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setAnimate(true));
            });
          }, GLIDE_MS);
        }
        return next;
      });
    }, HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-y border-bone/5 bg-forest py-10">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex w-max items-center gap-16 ${
            animate ? "transition-transform ease-in-out" : ""
          }`}
          style={{
            transform: `translateX(-${index * STEP}px)`,
            transitionDuration: `${GLIDE_MS}ms`,
          }}
        >
          {track.map((partner, i) => (
            <div key={`${partner.file}-${i}`} className="relative h-8 w-32 shrink-0">
              <Image
                src={`/images/logo/${partner.file}`}
                alt={partner.name}
                fill
                sizes="128px"
                className="object-contain opacity-70 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
