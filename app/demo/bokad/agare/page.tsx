import { OwnerDashboard } from "@/features/booking-platform/components/agare/OwnerDashboard";

// No heading here on purpose — OwnerDashboard owns its whole header, same
// split as Mumsa's agare/page.tsx.
export default function BokadAgarePage() {
  return <OwnerDashboard />;
}
