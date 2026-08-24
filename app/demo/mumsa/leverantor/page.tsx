import { CourierDashboard } from "@/features/restaurant-platform/components/courier/CourierDashboard";

// No heading here on purpose — CourierDashboard owns its whole header (title,
// date, availability toggle) since they need to sit on one visual row, which
// a plain server component can't share with client state. Same split as
// restaurang/page.tsx and agare/page.tsx.
export default function MumsaCourierPage() {
  return <CourierDashboard />;
}
