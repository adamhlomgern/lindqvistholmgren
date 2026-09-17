import type { MaterialFolder, MaterialItem } from "@/lib/types";

export type MaterialSortMode = "custom" | "name" | "created" | "updated" | "type";
export type MaterialViewMode = "list" | "grid-sm" | "grid-lg";

const VIEW_MODES: MaterialViewMode[] = ["list", "grid-sm", "grid-lg"];
const SORT_MODES: MaterialSortMode[] = ["custom", "name", "created", "updated", "type"];

function readStorage<T extends string>(key: string, allowed: T[], fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored && (allowed as string[]).includes(stored)) return stored as T;
  } catch {
    // Private browsing / blocked storage — fall through to the default.
  }
  return fallback;
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to recover — the choice just won't persist this session.
  }
}

// Per-viewer convenience, not shared state — two admins (or an admin and
// the customer, via separate keys below) can browse the same library in
// different view/sort modes without stepping on each other, same reasoning
// as any other browser-storage UI preference in this app.
//
// Each mode is a useSyncExternalStore-shaped module store (cache +
// subscribe), not read-in-an-effect-then-setState — that pattern causes an
// extra render and is flagged by this project's lint config.
// getServerSnapshot returns the same default the server rendered, so
// hydration never mismatches.
function createModeStore<T extends string>(key: string, allowed: T[], fallback: T) {
  let cache: T | null = null;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot(): T {
      if (cache === null) cache = readStorage(key, allowed, fallback);
      return cache;
    },
    getServerSnapshot(): T {
      return fallback;
    },
    set(value: T) {
      cache = value;
      writeStorage(key, value);
      listeners.forEach((listener) => listener());
    },
  };
}

const adminView = createModeStore<MaterialViewMode>("material-view-mode", VIEW_MODES, "list");
const adminSort = createModeStore<MaterialSortMode>("material-sort-mode", SORT_MODES, "custom");
const customerView = createModeStore<MaterialViewMode>("customer-material-view-mode", VIEW_MODES, "list");
const customerSort = createModeStore<MaterialSortMode>("customer-material-sort-mode", SORT_MODES, "custom");

export const subscribeMaterialView = adminView.subscribe;
export const getMaterialViewModeSnapshot = adminView.getSnapshot;
export const getMaterialViewModeServerSnapshot = adminView.getServerSnapshot;
export const setMaterialViewMode = adminView.set;

export const subscribeMaterialSort = adminSort.subscribe;
export const getMaterialSortModeSnapshot = adminSort.getSnapshot;
export const getMaterialSortModeServerSnapshot = adminSort.getServerSnapshot;
export const setMaterialSortMode = adminSort.set;

export const subscribeCustomerMaterialView = customerView.subscribe;
export const getCustomerMaterialViewModeSnapshot = customerView.getSnapshot;
export const getCustomerMaterialViewModeServerSnapshot = customerView.getServerSnapshot;
export const setCustomerMaterialViewMode = customerView.set;

export const subscribeCustomerMaterialSort = customerSort.subscribe;
export const getCustomerMaterialSortModeSnapshot = customerSort.getSnapshot;
export const getCustomerMaterialSortModeServerSnapshot = customerSort.getServerSnapshot;
export const setCustomerMaterialSortMode = customerSort.set;

export function sortFolders<T extends MaterialFolder>(folders: T[], mode: MaterialSortMode): T[] {
  const sorted = [...folders];
  switch (mode) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    case "created":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "updated":
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "type":
    case "custom":
    default:
      return sorted.sort((a, b) => a.position - b.position);
  }
}

// Pinned items always float to the top regardless of sort mode — same rule
// the server already applies (lib/data/material.ts), just re-derived
// client-side so re-sorting doesn't have to re-fetch.
export function sortItems<T extends MaterialItem>(items: T[], mode: MaterialSortMode): T[] {
  function compare(a: T, b: T): number {
    switch (mode) {
      case "name":
        return a.title.localeCompare(b.title, "sv");
      case "created":
        return b.createdAt.localeCompare(a.createdAt);
      case "updated":
        return b.updatedAt.localeCompare(a.updatedAt);
      case "type":
        return a.type.localeCompare(b.type) || (a.filename ?? "").localeCompare(b.filename ?? "");
      case "custom":
      default:
        return a.position - b.position;
    }
  }

  return [...items].sort((a, b) => (a.pinned === b.pinned ? compare(a, b) : a.pinned ? -1 : 1));
}
