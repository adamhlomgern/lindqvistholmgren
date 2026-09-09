import { CustomerPortalDemoProvider } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";
import { DemoSidebar } from "@/features/customer-portal-demo/components/DemoSidebar";
import { DemoBanner } from "@/features/customer-portal-demo/components/DemoBanner";

export default function KundportalDemoLayout({ children }: LayoutProps<"/demo/kundportal">) {
  return (
    <CustomerPortalDemoProvider>
      <div className="flex flex-col bg-forest text-bone md:h-screen">
        <DemoBanner />
        <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
          <DemoSidebar />
          <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-10 md:overflow-y-auto md:px-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </CustomerPortalDemoProvider>
  );
}
