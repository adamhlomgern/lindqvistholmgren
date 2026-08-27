"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formaConfig, formaRoutes } from "@/features/forma/config/product";
import { DemoToolbar } from "@/features/forma/components/DemoToolbar";
import { LeadCta } from "@/features/forma/components/LeadCta";

const navLinks = [
  { href: `${formaRoutes.home()}#modeller`, label: "Modeller" },
  { href: `${formaRoutes.home()}#sa-fungerar-det`, label: "Så fungerar det" },
];

// Deliberately not components/demo/TopbarShell — no sidebar, no app-shell
// chrome. Forma's own product nav (wordmark, a couple of real links, one
// CTA) is kept visually separate from the demo-only controls, which live
// behind DemoToolbar's single "Demo" toggle — see the brief: those "ska inte
// konkurrera visuellt med själva varumärket."
export function FormaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // Only the landing page has a full-bleed photo hero directly under the
  // header — everywhere else needs the normal opaque light bar. Positioned
  // absolute (not sticky) here so it overlays the photo instead of pushing
  // it down; it scrolls away with the hero rather than staying pinned.
  const isLanding = pathname === formaRoutes.home();
  const onPhotoHero = isLanding;
  const variant = onPhotoHero ? "onPhoto" : "default";

  return (
    <div className="min-h-screen bg-forma-bg font-forma text-forma-text">
      <header
        className={
          onPhotoHero
            ? "absolute inset-x-0 top-0 z-40"
            : "sticky top-0 z-40 border-b border-forma-border/70 bg-forma-bg/90 backdrop-blur-md"
        }
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href={formaRoutes.home()}
            className={`text-lg font-bold tracking-tight ${onPhotoHero ? "text-white" : "text-forma-text"}`}
          >
            {formaConfig.name.toUpperCase()}
          </Link>

          {isLanding && (
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    onPhotoHero ? "text-white/80 hover:text-white" : "text-forma-text-muted hover:text-forma-text"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <LeadCta variant={variant} />
            {/* Redundant once already inside the configurator flow — keep
                this CTA landing-only so the in-flow header stays compact,
                per the master brief's "kompakt och funktionellt" for the
                configurator chrome. */}
            {isLanding && (
              <Link
                href={formaRoutes.configure()}
                className="group hidden items-center gap-1.5 rounded-full bg-forma-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-forma-accent-hover sm:flex"
              >
                Börja konfigurera
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <DemoToolbar variant={variant} />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
