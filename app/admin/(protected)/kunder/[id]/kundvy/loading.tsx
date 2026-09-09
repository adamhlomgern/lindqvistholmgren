import { LoaderCircle } from "lucide-react";

// Same reasoning as the parent workspace's loading.tsx — the kundvy preview
// has its own tab bar (Översikt/Meddelanden/Material) one segment deeper,
// so it needs its own boundary too.
export default function CustomerKundvyLoading() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <LoaderCircle size={20} className="animate-spin text-stone motion-reduce:animate-none" />
    </div>
  );
}
