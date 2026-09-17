import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrepperToastProvider } from "@/components/prepper/Toast";

// Prepper's own display serif — warm/editorial, deliberately distinct from
// the marketing site's Space Grotesk. Loaded only here so the rest of the
// app never pays for this font. Exposed as --font-prepper-serif, mapped to
// --font-prepper-display in app/globals.css's .theme-prepper-scoped tokens.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-prepper-serif",
  display: "swap",
});

export default function PrepperLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} min-h-screen bg-prepper-background font-sans text-prepper-text`}
    >
      <div className="px-4 pt-4 sm:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-prepper-text-muted transition-colors hover:text-prepper-text"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Till admin
        </Link>
      </div>
      <PrepperToastProvider>{children}</PrepperToastProvider>
    </div>
  );
}
