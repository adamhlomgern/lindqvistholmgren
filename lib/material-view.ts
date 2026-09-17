import type { MaterialFolder, MaterialItem } from "@/lib/types";

export type MaterialSortMode = "custom" | "name" | "created" | "updated" | "type";
export type MaterialViewMode = "list" | "grid-sm" | "grid-lg";

const VIEW_MODE_KEY = "material-view-mode";
const SORT_MODE_KEY = "material-sort-mode";
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

// Per-viewer convenience, not shared state — two admins can browse the same
// customer's library in different view/sort modes without stepping on each
// other, same reasoning as any other browser-storage UI preference in this
// app.
//
// Exposed as a useSyncExternalStore-shaped module store (cache + subscribe),
// not read-in-an-effect-then-setState — that pattern causes an extra
// render and is flagged by this project's lint config. getServerSnapshot
// returns the same default the server rendered, so hydration never mismatches.
let viewModeCache: MaterialViewMode | null = null;
let sortModeCache: MaterialSortMode | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeMaterialView(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMaterialViewModeSnapshot(): MaterialViewMode {
  if (viewModeCache === null) viewModeCache = readStorage(VIEW_MODE_KEY, VIEW_MODES, "list");
  return viewModeCache;
}

export function getMaterialViewModeServerSnapshot(): MaterialViewMode {
  return "list";
}

export function setMaterialViewMode(mode: MaterialViewMode) {
  viewModeCache = mode;
  writeStorage(VIEW_MODE_KEY, mode);
  notify();
}

export function getMaterialSortModeSnapshot(): MaterialSortMode {
  if (sortModeCache === null) sortModeCache = readStorage(SORT_MODE_KEY, SORT_MODES, "custom");
  return sortModeCache;
}

export function getMaterialSortModeServerSnapshot(): MaterialSortMode {
  return "custom";
}

export function setMaterialSortMode(mode: MaterialSortMode) {
  sortModeCache = mode;
  writeStorage(SORT_MODE_KEY, mode);
  notify();
}

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
