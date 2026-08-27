"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { formatSek } from "@/features/forma/utils/format";

// Counts smoothly from the previous value to `amount` whenever it changes —
// see the brief's "Prisanimationen får gärna vara mjuk när värdet ändras."
export function AnimatedPrice({ amount, className }: { amount: number; className?: string }) {
  const [displayed, setDisplayed] = useState(amount);
  const previous = useRef(amount);

  useEffect(() => {
    const controls = animate(previous.current, amount, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (value) => setDisplayed(value),
    });
    previous.current = amount;
    return () => controls.stop();
  }, [amount]);

  return <span className={className}>{formatSek(Math.round(displayed))}</span>;
}
