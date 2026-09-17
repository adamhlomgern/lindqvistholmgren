import type { ReactNode } from "react";
import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";

// Deliberately outside app/admin/(protected) — that layout forces its own
// forest/bone sidebar chrome onto every child route, which a visually
// distinct sub-app (Prepper) needs to escape entirely. This layout calls the
// same verifySession() the protected admin area uses (lib/auth/dal.ts), so
// every route under /admin/appar/* gets the exact same server-side auth gate
// as the rest of admin — no new auth logic, just reused here directly.
//
// Deliberately no visible chrome here (no header bar, no theme): each app
// under /admin/appar owns its own visual identity end to end (see
// app/admin/appar/page.tsx and app/admin/appar/prepper/layout.tsx for their
// own back-navigation), so nothing here should leak the admin panel's dark
// forest/bone look into a differently-themed sub-app.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function ApparLayout({ children }: { children: ReactNode }) {
  await verifySession();
  return children;
}
