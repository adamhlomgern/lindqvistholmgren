"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

// Hand-rolled rather than a Radix Dialog (not a dependency in this project
// yet) — same overlay+panel+focus-trap-free pattern already used for the
// mobile sidebar menus in AdminSidebar/CustomerSidebar, just anchored right
// instead of full-screen.
export function SlideOver({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-bone/10 bg-forest shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-bone/10 px-6 py-5">
          <h2 className="font-display text-base font-bold text-bone">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
          >
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="scroll-area-dark flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
