"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/components/consent/CookieConsentProvider";

export function CookieBanner() {
  const { bannerOpen, acceptAll, rejectAll } = useCookieConsent();
  const pathname = usePathname();

  // The admin panel is an internal tool for a logged-in user, not a public
  // visitor — the GA consent prompt has no audience there.
  if (!bannerOpen || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-charcoal/95 p-5 shadow-pop backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Cookie size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-relaxed text-fg-muted">
            Vi använder cookies för att mäta besökarstatistik (Google Analytics). Det sätts bara om du
            godkänner det.{" "}
            <Link href="/integritetspolicy" className="text-fg underline underline-offset-2 hover:text-primary">
              Läs mer i vår integritetspolicy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={rejectAll}
            className="flex-1 rounded-full bg-fg/10 px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-fg/15 sm:flex-none"
          >
            Endast nödvändiga
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover sm:flex-none"
          >
            Godkänn alla
          </button>
        </div>
      </div>
    </div>
  );
}
