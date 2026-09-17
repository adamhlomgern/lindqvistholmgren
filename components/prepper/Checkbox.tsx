"use client";

import { motion } from "motion/react";

// Shared between ItemRow (row-level) and ItemDetailSheet (item + subtask
// rows) — omitting onChange renders a read-only indicator (used for items
// whose completion is derived from their subtasks rather than tappable
// directly, see ItemDetailSheet).
export function Checkbox({
  checked,
  onChange,
  size = 22,
}: {
  checked: boolean;
  onChange?: () => void;
  size?: number;
}) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      disabled={!onChange}
      whileTap={onChange ? { scale: 0.85 } : undefined}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
        checked
          ? "border-prepper-primary bg-prepper-primary text-prepper-on-primary"
          : "border-prepper-border bg-prepper-surface"
      } ${!onChange ? "cursor-default" : ""} focus:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2`}
    >
      {checked && (
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.18 }}
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 16 16"
          fill="none"
        >
          <motion.path
            d="M3 8.5L6.2 11.5L13 4.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
