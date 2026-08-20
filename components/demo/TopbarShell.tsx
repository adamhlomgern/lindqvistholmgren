import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TopbarShellProps = {
  left: ReactNode;
  right: ReactNode;
  // Route back to this demo's marketing page — kept separate from `left` so
  // it's always the first, unmissable thing in the bar instead of getting
  // buried among product-specific content.
  backHref: string;
};

export function TopbarShell({ left, right, backHref }: TopbarShellProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-demo-border bg-demo-surface/95 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          title="Tillbaka till lindqvistholmgren.se"
          className="flex items-center gap-1.5 rounded-full border border-demo-border px-3 py-1.5 text-xs font-medium text-demo-text-muted transition-colors hover:border-demo-text-faint hover:text-demo-text"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Tillbaka</span>
        </Link>
        <div className="h-5 w-px shrink-0 bg-demo-border" />
        <div className="flex items-center gap-2">{left}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">{right}</div>
    </header>
  );
}
