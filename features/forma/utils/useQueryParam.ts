"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getServerSnapshot() {
  return null;
}

// Hydration-safe way to read a URL query param in a client component — see
// the identical hook in booking-platform/utils for the full rationale.
// Copied (not imported) so this feature module stays self-contained.
export function useQueryParam(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    getServerSnapshot,
  );
}
