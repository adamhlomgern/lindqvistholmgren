import { OwnerDashboard } from "@/features/restaurant-platform/components/owner/OwnerDashboard";

// No heading here on purpose — OwnerDashboard owns its whole header (title,
// date, period filter) since the title and the filter dropdown need to sit
// on one visual row, which a plain server component can't share with client
// state. Same split as restaurang/page.tsx.
export default function MumsaOwnerPage() {
  return <OwnerDashboard />;
}
