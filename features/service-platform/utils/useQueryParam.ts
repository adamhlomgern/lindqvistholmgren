"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getServerSnapshot() {
  return null;
}

// Hydration-safe way to read a URL query param in a client component: the
// server snapshot is always null, so the first client render matches the
// server-rendered HTML, then this re-renders with the real value once
// mounted — no effect + setState cascade needed.
export function useQueryParam(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    getServerSnapshot,
  );
}
