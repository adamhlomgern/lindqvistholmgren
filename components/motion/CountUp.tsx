"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Räknar upp till ett tal när det syns. Text runt talet ("+", "%", " h")
// skickas som prefix/suffix så att skärmläsare och den som inte ser
// animationen ändå får rätt värde direkt.
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={`${prefix}${to}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  );
}
