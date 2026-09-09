import { LoaderCircle } from "lucide-react";

// Same rationale as app/admin/(protected)/loading.tsx: shown instantly on
// navigation while the new page's server data loads, so clicking around the
// portal reads as "loading" instead of frozen.
export default function CustomerLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoaderCircle size={22} className="animate-spin text-stone motion-reduce:animate-none" />
    </div>
  );
}
