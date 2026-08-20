import { RestaurantPlatformProvider } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { AppShell } from "@/features/restaurant-platform/components/AppShell";

export default function MumsaDemoLayout({ children }: LayoutProps<"/demo/mumsa">) {
  return (
    <RestaurantPlatformProvider>
      <AppShell>{children}</AppShell>
    </RestaurantPlatformProvider>
  );
}
