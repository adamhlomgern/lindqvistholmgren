import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";
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
      <PrepperToastProvider>{children}</PrepperToastProvider>
    </div>
  );
}
