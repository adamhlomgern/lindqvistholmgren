"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Mail } from "lucide-react";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { useProjectInquiry } from "@/components/contact/ProjectInquiryContext";
import { useCookieConsent } from "@/components/consent/CookieConsentProvider";

// Fast knapprad längst ned på mobilen. Dyker upp först när man scrollat förbi
// heron (där knappen redan syns), och döljs på kontaktsidorna och när
// cookiebannern eller förfrågan är öppen, så att den aldrig ligger i vägen.
const HIDDEN_ON = ["/kontakt", "/starta-ett-projekt"];
const SHOW_AFTER_PX = 640;

export function MobileCtaBar() {
  const pathname = usePathname();
  const { isOpen } = useProjectInquiry();
  const { bannerOpen } = useCookieConsent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrolled && !isOpen && !bannerOpen && !HIDDEN_ON.includes(pathname ?? "");

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <StartProjectButton trackingLocation="mobil-fast-knapp" className="flex-1" tabIndex={visible ? 0 : -1}>
          Få ett förslag
          <ChevronRight size={16} strokeWidth={2.5} />
        </StartProjectButton>
        <a
          href="mailto:info@lindqvistholmgren.se"
          aria-label="Mejla oss"
          tabIndex={visible ? 0 : -1}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg ring-1 ring-inset ring-line-strong transition-colors hover:bg-surface-sunken"
        >
          <Mail size={18} strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
