"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Rounding = "2xl" | "full";

const roundingClasses: Record<Rounding, { left: string; right: string }> = {
  "2xl": { left: "rounded-l-2xl", right: "rounded-r-2xl" },
  full: { left: "rounded-l-full", right: "rounded-r-full" },
};

type HorizontalScrollerProps = {
  children: ReactNode;
  className?: string;
  // Tailwind "from-*" token matching the scrolled content's own background,
  // so the fade blends in instead of showing a seam.
  fadeFrom?: string;
  rounding?: Rounding;
};

// Wraps any wide, horizontally-scrollable content (tables, chip rows) with
// edge fades that only appear when there's actually more to scroll to in
// that direction — the fade disappears once you've scrolled all the way,
// rather than just permanently implying "there's more" like a static hint.
export function HorizontalScroller({
  children,
  className = "",
  fadeFrom = "from-demo-surface",
  rounding = "2xl",
}: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  return (
    <div className="relative">
      <div ref={scrollRef} className={`overflow-x-auto ${className}`}>
        {children}
      </div>
      {canScrollLeft && (
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 ${roundingClasses[rounding].left} bg-gradient-to-r ${fadeFrom} to-transparent`}
        />
      )}
      {canScrollRight && (
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 ${roundingClasses[rounding].right} bg-gradient-to-l ${fadeFrom} to-transparent`}
        />
      )}
    </div>
  );
}
