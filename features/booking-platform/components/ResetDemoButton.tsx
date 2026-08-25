"use client";

import { RotateCcw } from "lucide-react";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";

export function ResetDemoButton() {
  const { resetDemo } = useBookingPlatform();

  return (
    <button
      type="button"
      onClick={resetDemo}
      className="flex items-center gap-1.5 rounded-full border border-demo-border px-3 py-1.5 text-xs font-medium text-demo-text-muted transition-colors hover:border-demo-text-faint hover:text-demo-text"
      title="Återställ demo till exempeldata"
    >
      <RotateCcw size={13} />
      <span className="hidden sm:inline">Återställ demo</span>
    </button>
  );
}
