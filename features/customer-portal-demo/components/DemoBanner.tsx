"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

// Persistent strip across every demo page — the brief explicitly requires
// the case to always read as fictional, plus the try-it shortcuts.
export function DemoBanner() {
  const { approvalStatus, jumpToEnd, reset } = useCustomerPortalDemo();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Samma "Tillbaka" som övriga demos (components/demo/TopbarShell):
            besökaren ska alltid hitta tillbaka till sajten. */}
        <Link
          href="/demos/kundportal"
          title="Tillbaka till lindqvistholmgren.se"
          className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:border-amber-400"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Tillbaka</span>
        </Link>
        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <Sparkles size={13} strokeWidth={2.5} />
          <span className="hidden md:inline">Fiktivt demoprojekt: Glänta Trädgård är påhittat, inget här är en riktig kund</span>
          <span className="md:hidden">Fiktivt demoprojekt</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {approvalStatus !== "approved" && (
          <button
            type="button"
            onClick={jumpToEnd}
            className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-amber-400 hover:text-fg"
          >
            Visa färdig leverans
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-amber-400 hover:text-fg"
        >
          <RotateCcw size={13} strokeWidth={2.25} />
          Återställ demo
        </button>
        <Link
          href="/kontakt"
          className="hidden items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-hover sm:flex"
        >
          Vill ni ha en egen?
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
