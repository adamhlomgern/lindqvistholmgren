"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PartyPopper, Sparkle } from "lucide-react";

type ToastLevel = "default" | "celebration";
type ToastEntry = { id: number; message: string; level: ToastLevel };

const ToastContext = createContext<((message: string, level?: ToastLevel) => void) | null>(null);

const DEFAULT_MESSAGES = ["Klart ✓", "En sak mindre att tänka på.", "Bra jobbat."];

// Short, warm confirmations — never the same generic "Saved!" every time,
// and deliberately not celebratory (that's reserved for whole
// sections/checklists, per the brief) so a single item check doesn't feel
// like confetti-on-every-click.
export function pickDefaultToastMessage() {
  return DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
}

export function PrepperToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, level: ToastLevel = "default") => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, level }]);
    const duration = level === "celebration" ? 3200 : 1800;
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={
                toast.level === "celebration"
                  ? "flex items-center gap-2 rounded-full bg-prepper-inverse-bg px-5 py-3 text-sm font-medium text-prepper-inverse-text shadow-lg"
                  : "flex items-center gap-2 rounded-full bg-prepper-surface px-4 py-2.5 text-sm font-medium text-prepper-text shadow-md ring-1 ring-prepper-border"
              }
            >
              {toast.level === "celebration" ? (
                <PartyPopper size={16} strokeWidth={2} className="text-prepper-accent" />
              ) : (
                <Sparkle size={14} strokeWidth={2} className="text-prepper-primary" />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function usePrepperToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("usePrepperToast måste användas inuti PrepperToastProvider");
  return ctx;
}
