"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  delay?: number;
  // Hur långt innehållet glider upp (px). 0 = bara tona in.
  y?: number;
};

// Tonar och glider in innehåll när det kommer in i bild, en gång. Ger sidorna
// liv utan att bli ett trick: korta tider, liten rörelse, och ingenting alls
// för den som valt "minska rörelse" i sitt operativsystem.
export function Reveal({ children, delay = 0, y = 16, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(props as object)}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
