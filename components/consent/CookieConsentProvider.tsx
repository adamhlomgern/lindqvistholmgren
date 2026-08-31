"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Consent = "accepted" | "rejected";

type CookieConsentContextValue = {
  consent: Consent | null;
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  openPreferences: () => void;
};

const STORAGE_KEY = "cookie-consent";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function clearAnalyticsCookies() {
  const domain = window.location.hostname.replace(/^www\./, "");
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name && /^_ga|^_gid|^_gat/.test(name)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    }
  });
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(stored);
    } else {
      setBannerOpen(true);
    }
    setHydrated(true);
  }, []);

  function persist(value: Consent) {
    setConsent(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    setBannerOpen(false);
    if (value === "rejected") {
      clearAnalyticsCookies();
    }
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent: hydrated ? consent : null,
        bannerOpen: hydrated && bannerOpen,
        acceptAll: () => persist("accepted"),
        rejectAll: () => persist("rejected"),
        openPreferences: () => setBannerOpen(true),
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
