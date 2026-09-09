import { LoaderCircle } from "lucide-react";

// Shown the instant you click a sidebar link, while the new page's data
// loads on the server — without this, dynamic admin pages have no cached
// client-side data to show (Next.js doesn't cache dynamic routes by
// default), so navigation felt frozen rather than just "loading".
export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoaderCircle size={22} className="animate-spin text-stone motion-reduce:animate-none" />
    </div>
  );
}
