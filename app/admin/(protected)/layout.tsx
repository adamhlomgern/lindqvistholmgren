import type { ReactNode } from "react";
import { unstable_cache } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getRecentInquiriesCount } from "@/lib/data/inquiries";
import { getInvoiceStats } from "@/lib/data/invoices";
import { getActiveClientProjectsCount } from "@/lib/data/client-projects";
import { getWaitingChatThreadCount } from "@/lib/data/customer-messages";
import { resolveAdminDisplayName } from "@/lib/format";
import { RECENT_INQUIRY_WINDOW_DAYS } from "@/lib/constants";

// This layout wraps every admin page, so these four queries used to run on
// every single navigation (auth alone can't be cached — it's checked fresh
// below via verifySession — but these are just sidebar badge counts, not
// the page content itself). Caching them briefly trades up to ~20s of badge
// staleness for cutting four Supabase round trips off of every click. Pages
// that actually show this data (dashboard, Fakturor, Projekt, Inkorg) call
// the same underlying functions directly, uncached, so their own content is
// always current — only the sidebar numbers lag.
const getCachedSidebarCounts = unstable_cache(
  async () => {
    const [newInquiriesCount, invoiceStats, activeProjectsCount, waitingChatCount] = await Promise.all([
      getRecentInquiriesCount(RECENT_INQUIRY_WINDOW_DAYS),
      getInvoiceStats(),
      getActiveClientProjectsCount(),
      getWaitingChatThreadCount(),
    ]);
    return {
      newInquiriesCount,
      overdueInvoicesCount: invoiceStats.overdueCount,
      activeProjectsCount,
      waitingChatCount,
    };
  },
  ["admin-sidebar-counts"],
  { revalidate: 20 },
);

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [{ user }, counts] = await Promise.all([verifySession(), getCachedSidebarCounts()]);

  return (
    <div className="flex flex-col bg-forest text-bone md:h-screen md:flex-row">
      <AdminSidebar
        email={user.email ?? ""}
        displayName={resolveAdminDisplayName(user)}
        newInquiriesCount={counts.newInquiriesCount}
        overdueInvoicesCount={counts.overdueInvoicesCount}
        activeProjectsCount={counts.activeProjectsCount}
        waitingChatCount={counts.waitingChatCount}
      />
      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-10 md:overflow-y-auto md:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
