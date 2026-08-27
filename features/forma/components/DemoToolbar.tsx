"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ListChecks, RotateCcw } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";

// Demo-only controls (internal leads view, reset) tucked behind one small
// toggle so they read as tooling, not as part of Forma's own product nav —
// see the brief: these "ska inte konkurrera visuellt med själva varumärket."
export function DemoToolbar({ variant = "default" }: { variant?: "default" | "onPhoto" }) {
  const [open, setOpen] = useState(false);
  const { resetDemo } = useForma();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          variant === "onPhoto"
            ? "flex items-center gap-1 rounded-full border border-white/30 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
            : "flex items-center gap-1 rounded-full border border-forma-border px-3 py-1.5 text-xs font-medium text-forma-text-muted transition-colors hover:border-forma-text-faint hover:text-forma-text"
        }
      >
        Demo
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Click-outside catcher rather than a real popover lib — the only
              interaction this needs. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-forma-border bg-forma-surface p-1.5 shadow-xl shadow-black/10">
            <Link
              href={formaRoutes.leads()}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-forma-text-muted transition-colors hover:bg-forma-surface-hover hover:text-forma-text"
            >
              <ListChecks size={15} />
              Förfrågningar (internt)
            </Link>
            <button
              type="button"
              onClick={() => {
                resetDemo();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-forma-text-muted transition-colors hover:bg-forma-surface-hover hover:text-forma-text"
            >
              <RotateCcw size={15} />
              Återställ demo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
