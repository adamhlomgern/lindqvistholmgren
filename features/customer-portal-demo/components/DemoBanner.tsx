"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

// Persistent strip across every demo page — the brief explicitly requires
// the case to always read as fictional, plus the try-it shortcuts.
export function DemoBanner() {
  const { approvalStatus, jumpToEnd, reset } = useCustomerPortalDemo();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-peach/20 bg-peach/10 px-4 py-2.5 sm:px-6">
      <p className="flex items-center gap-1.5 text-xs font-medium text-peach">
        <Sparkles size={13} strokeWidth={2.5} />
        Fiktivt demoprojekt — Glänta Trädgård är påhittat, inget här är en riktig kund
      </p>
      <div className="flex items-center gap-2">
        {approvalStatus !== "approved" && (
          <button
            type="button"
            onClick={jumpToEnd}
            className="rounded-full border border-bone/15 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:border-bone/25 hover:text-bone"
          >
            Visa färdig leverans
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:border-bone/25 hover:text-bone"
        >
          <RotateCcw size={13} strokeWidth={2.25} />
          Återställ demo
        </button>
      </div>
    </div>
  );
}
