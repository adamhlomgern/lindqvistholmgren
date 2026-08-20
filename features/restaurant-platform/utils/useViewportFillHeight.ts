"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_BREAKPOINT_PX = 1024; // matches Tailwind's `lg:`

// Measures how far the element sits from the top of the viewport and
// returns a height that fills the rest of it, down to `bottomGapPx` from
// the bottom edge. Self-measuring rather than a hardcoded
// `calc(100vh - Npx)` — it doesn't need to know the topbar/demo-nav's exact
// height, and keeps working if that chrome ever changes.
//
// Returns `undefined` below the desktop breakpoint so callers can skip the
// constraint entirely on small screens, where a fixed-height board with
// internal scrolling reads as cramped rather than helpful.
export function useViewportFillHeight(bottomGapPx = 16) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function update() {
      if (!ref.current || window.innerWidth < DESKTOP_BREAKPOINT_PX) {
        setHeight(undefined);
        return;
      }
      const top = ref.current.getBoundingClientRect().top;
      setHeight(Math.max(420, window.innerHeight - top - bottomGapPx));
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [bottomGapPx]);

  return { ref, height };
}
