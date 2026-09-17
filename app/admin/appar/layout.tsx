import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { logout } from "@/lib/actions/auth";

// Deliberately outside app/admin/(protected) — that layout forces its own
// forest/bone sidebar chrome onto every child route, which a visually
// distinct sub-app (Prepper) needs to escape entirely. This layout calls the
// same verifySession() the protected admin area uses (lib/auth/dal.ts), so
// every route under /admin/appar/* gets the exact same server-side auth gate
// as the rest of admin — no new auth logic, just reused here directly.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function ApparLayout({ children }: { children: ReactNode }) {
  await verifySession();

  return (
    <div className="min-h-screen bg-forest text-bone">
      <div className="flex items-center justify-between border-b border-bone/10 px-4 py-3 sm:px-6">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-stone transition-colors hover:text-bone"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Admin
        </Link>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-coral"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
