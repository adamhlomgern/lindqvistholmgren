"use client";

import { useEffect, useRef } from "react";

type AutoGrowTextareaProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  maxHeight?: number;
};

// Grows with content instead of scrolling internally or clipping — a plain
// fixed-rows textarea forces a scroll-inside-scroll for anything longer
// than it was sized for, which is exactly what's worst on a small screen.
export function AutoGrowTextarea({
  name,
  value,
  onChange,
  placeholder,
  required,
  readOnly,
  className = "",
  maxHeight,
}: AutoGrowTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = maxHeight ? Math.min(el.scrollHeight, maxHeight) : el.scrollHeight;
    el.style.height = `${next}px`;
  }, [value, maxHeight]);

  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      rows={1}
      className={`resize-none overflow-y-auto ${className}`}
    />
  );
}
