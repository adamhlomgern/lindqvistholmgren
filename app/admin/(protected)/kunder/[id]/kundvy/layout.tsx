import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { BackLink } from "@/components/admin/BackLink";
import { CustomerKundvyTabs } from "@/components/admin/CustomerKundvyTabs";
import { getCustomerById } from "@/lib/data/customers";

type Props = { children: ReactNode; params: Promise<{ id: string }> };

// Renders the actual components/customer/* views with admin-fetched data —
// not a separate mockup — so if OverviewPage/MessagesPanel/MaterialLibrary
// ever leak something they shouldn't, this preview shows it too instead of
// silently diverging from what customers really see.
export default async function CustomerKundvyLayout({ children, params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <BackLink href={`/admin/kunder/${id}`} label="Tillbaka till kundkortet" />

      <div className="flex items-center gap-2.5 rounded-xl bg-lavender/10 px-4 py-3 text-sm text-lavender">
        <Eye size={16} strokeWidth={2.25} className="shrink-0" />
        Förhandsvisning — så här ser {customer.company || customer.name} sin kundportal. Inget härifrån går att skicka
        eller ändra.
      </div>

      <div className="mt-6">
        <CustomerKundvyTabs customerId={id} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
