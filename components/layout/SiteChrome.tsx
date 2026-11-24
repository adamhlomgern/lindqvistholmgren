"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isKund = pathname?.startsWith("/kund");
  const isProductDemo = pathname?.startsWith("/demo/");
  const isDesignSystem = pathname?.startsWith("/designsystem");

  if (isAdmin || isKund || isProductDemo || isDesignSystem) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
