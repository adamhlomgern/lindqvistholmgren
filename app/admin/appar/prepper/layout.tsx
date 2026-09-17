import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { PrepperToastProvider } from "@/components/prepper/Toast";

// Prepper's single typeface — crisp/compact/contemporary, replacing an
// earlier serif per the design audit ("no serif fonts", hierarchy built
// from weight/tracking/contrast, not a second typeface). Loaded only here
// so the rest of the admin app never pays for it. Exposed as
// --font-prepper-manrope, used for both display and body text via
// --font-prepper-display/--font-prepper-sans in app/globals.css.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-prepper-manrope",
  display: "swap",
});

export default function PrepperLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${manrope.variable} min-h-screen bg-prepper-background font-prepper-sans text-prepper-text`}
    >
      <PrepperToastProvider>{children}</PrepperToastProvider>
    </div>
  );
}
