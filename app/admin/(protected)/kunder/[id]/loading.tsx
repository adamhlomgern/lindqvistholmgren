import { LoaderCircle } from "lucide-react";

// Without this, switching between the customer workspace's tabs (Översikt,
// Projekt, Meddelanden, ...) had no loading boundary of its own — the root
// admin loading.tsx only fires when the shared layout itself changes, not
// when you're just swapping the leaf tab underneath it, so tab clicks felt
// completely frozen instead of "loading". The header and tab bar (this
// segment's layout) stay put; only the content below flashes to this
// spinner while the new tab's data streams in.
export default function CustomerWorkspaceLoading() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <LoaderCircle size={20} className="animate-spin text-stone motion-reduce:animate-none" />
    </div>
  );
}
