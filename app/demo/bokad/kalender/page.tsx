import { BookingQueue } from "@/features/booking-platform/components/kalender/BookingQueue";

// No page heading/explainer here on purpose — same reasoning as Mumsa's
// restaurang/page.tsx: this is an operational screen, not a dashboard.
// BookingQueue's own status bar carries that weight instead.
export default function BokadKalenderPage() {
  return <BookingQueue />;
}
