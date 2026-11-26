import type { ReactNode } from "react";
import { PrepperToastProvider } from "@/components/prepper/Toast";

// Prepper använder sajtens typsnitt (Poppins för rubriker, Geist för text) via
// --font-prepper-display/--font-prepper-sans i app/globals.css, så att appen
// ser ut som resten av admin.
export default function PrepperLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-prepper-background font-prepper-sans text-prepper-text">
      <PrepperToastProvider>{children}</PrepperToastProvider>
    </div>
  );
}
