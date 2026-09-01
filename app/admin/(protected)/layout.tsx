import type { ReactNode } from "react";
import { verifySession } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getRecentInquiriesCount } from "@/lib/data/inquiries";
import { getInvoiceStats } from "@/lib/data/invoices";
import { getActiveClientProjectsCount } from "@/lib/data/client-projects";
import { RECENT_INQUIRY_WINDOW_DAYS } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [{ user }, newInquiriesCount, invoiceStats, activeProjectsCount] = await Promise.all([
    verifySession(),
    getRecentInquiriesCount(RECENT_INQUIRY_WINDOW_DAYS),
    getInvoiceStats(),
    getActiveClientProjectsCount(),
  ]);

  return (
    <div className="flex flex-col bg-forest text-bone md:h-screen md:flex-row">
      <AdminSidebar
        email={user.email ?? ""}
        newInquiriesCount={newInquiriesCount}
        overdueInvoicesCount={invoiceStats.overdueCount}
        activeProjectsCount={activeProjectsCount}
      />
      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-10 md:overflow-y-auto md:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
