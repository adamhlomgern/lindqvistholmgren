import type { ReactNode } from "react";
import { verifyCustomerSession } from "@/lib/auth/customer";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  await verifyCustomerSession();

  return (
    <div className="min-h-screen bg-forest text-bone">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
