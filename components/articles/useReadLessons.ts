"use client";

import { useCallback, useSyncExternalStore } from "react";

// Vilka lektioner (artiklar) besökaren har läst, sparat i webbläsaren. Inget
// konto behövs; rensas webbläsaren börjar man om, vilket är okej för en
// läsbekräftelse. Alla läsningar/skrivningar tål att localStorage saknas.
const KEY = "lh-kunskapsbanken-lasta";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  try {
    cache = window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    cache = cache ?? "[]";
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useReadLessons() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const read_ = new Set<string>(JSON.parse(raw) as string[]);

  const markRead = useCallback((slug: string) => {
    const current = new Set<string>(JSON.parse(read()) as string[]);
    if (current.has(slug)) return;
    current.add(slug);
    const next = JSON.stringify([...current]);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Privat läge e.d. — progress sparas bara för den här visningen.
    }
    cache = next;
    listeners.forEach((l) => l());
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    cache = "[]";
    listeners.forEach((l) => l());
  }, []);

  return { read: read_, markRead, reset };
}
