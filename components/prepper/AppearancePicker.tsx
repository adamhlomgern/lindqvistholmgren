"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import {
  DEFAULT_PREPPER_ACCENT_COLOR,
  isPrepperAccentColor,
  prepperAccentBadgeClasses,
  prepperAccentColors,
  prepperAccentLabels,
  prepperAccentSwatchClasses,
  prepperIconCategories,
  type PrepperAccentColor,
} from "@/lib/design/prepperAccents";

const RECENT_ICONS_KEY = "prepper-recent-icons";
const MAX_RECENT = 6;

function loadRecentIcons(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_ICONS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentIcon(name: string) {
  try {
    const current = loadRecentIcons().filter((n) => n !== name);
    window.localStorage.setItem(RECENT_ICONS_KEY, JSON.stringify([name, ...current].slice(0, MAX_RECENT)));
  } catch {
    // Per-viewer convenience only — a blocked/private-mode localStorage just
    // means no "recently used" row next time, nothing else breaks.
  }
}

export function AppearancePicker({
  icon,
  color,
  onSave,
  onClose,
}: {
  icon?: string;
  color?: string;
  onSave: (icon: string, color: string) => void;
  onClose: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState<PrepperAccentColor>(
    isPrepperAccentColor(color) ? color : DEFAULT_PREPPER_ACCENT_COLOR,
  );
  const [search, setSearch] = useState("");
  // Only ever mounted client-side after a tap (not part of the initial
  // server-rendered HTML), so reading localStorage in the lazy initializer
  // is safe — no hydration mismatch risk.
  const [recentIcons, setRecentIcons] = useState<string[]>(() => loadRecentIcons());

  function handleColorSelect(next: PrepperAccentColor) {
    setSelectedColor(next);
    if (icon) onSave(icon, next);
  }

  function handleIconSelect(name: string) {
    saveRecentIcon(name);
    setRecentIcons(loadRecentIcons());
    onSave(name, selectedColor);
    onClose();
  }

  const query = search.trim().toLowerCase();
  const filteredGroups = prepperIconCategories
    .map((group) => ({
      ...group,
      icons: query ? group.icons.filter((i) => i.name.toLowerCase().includes(query)) : group.icons,
    }))
    .filter((group) => group.icons.length > 0);

  const recentEntries = recentIcons
    .map((name) => prepperIconCategories.flatMap((g) => g.icons).find((i) => i.name === name))
    .filter((i): i is { name: string; Icon: (typeof prepperIconCategories)[0]["icons"][0]["Icon"] } => !!i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-prepper-ink/40"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 mx-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-prepper-background px-5 pb-8 pt-4 shadow-xl sm:bottom-8 sm:rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[15px] text-prepper-text">Välj ikon</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Stäng"
              className="flex h-9 w-9 items-center justify-center rounded-full text-prepper-text-muted hover:bg-prepper-surface-soft"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {prepperAccentColors.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleColorSelect(key)}
                aria-label={prepperAccentLabels[key]}
                aria-pressed={selectedColor === key}
                className={`h-8 w-8 rounded-full ${prepperAccentSwatchClasses[key]} transition-shadow ${
                  selectedColor === key ? "ring-2 ring-prepper-text ring-offset-2 ring-offset-prepper-background" : ""
                }`}
              />
            ))}
          </div>

          <div className="relative mt-4">
            <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-prepper-text-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök ikoner…"
              className="w-full rounded-xl border border-prepper-border bg-prepper-surface py-2 pl-9 pr-3 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
            />
          </div>

          {!query && recentEntries.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-prepper-text-faint">
                Senast använda
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentEntries.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleIconSelect(name)}
                    aria-label={name}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${prepperAccentBadgeClasses[selectedColor]} hover:opacity-80`}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredGroups.map((group) => (
            <div key={group.category} className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-prepper-text-faint">
                {group.category}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.icons.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleIconSelect(name)}
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-prepper-surface-soft text-prepper-text transition-colors hover:bg-prepper-accent/30"
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
