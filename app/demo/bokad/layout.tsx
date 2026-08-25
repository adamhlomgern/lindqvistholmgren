import { BookingPlatformProvider } from "@/features/booking-platform/state/BookingPlatformProvider";
import { AppShell } from "@/features/booking-platform/components/AppShell";

export default function BokadDemoLayout({ children }: LayoutProps<"/demo/bokad">) {
  return (
    <BookingPlatformProvider>
      <AppShell>{children}</AppShell>
    </BookingPlatformProvider>
  );
}
