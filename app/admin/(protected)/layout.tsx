import type { ReactNode } from "react";
import { verifySession } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await verifySession();

  return (
    <div className="flex flex-col bg-forest text-bone md:h-screen md:flex-row">
      <AdminSidebar email={user.email ?? ""} />
      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-10 md:overflow-y-auto md:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
