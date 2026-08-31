"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useCookieConsent } from "@/components/consent/CookieConsentProvider";

const GA_MEASUREMENT_ID = "G-Z7KLXKREBF";

export function AnalyticsGate() {
  const { consent } = useCookieConsent();

  if (consent !== "accepted") {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
