"use client";

import { useEffect } from "react";

// Error boundaries must be Client Components. `retry` (not `reset`) is the
// stable recovery prop as of Next 16.3 — it re-fetches and re-renders the
// segment instead of just clearing local error state.
export default function CustomerError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="font-display text-lg font-bold text-bone">Något gick fel</h2>
      <p className="max-w-sm text-sm text-stone">
        Sidan kunde inte laddas just nu. Prova igen, eller hör av dig till oss om felet kvarstår.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
      >
        Försök igen
      </button>
    </div>
  );
}
