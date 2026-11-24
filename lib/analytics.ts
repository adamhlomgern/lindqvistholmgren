import { track } from "@vercel/analytics";

// Konverteringshändelser till Vercel Analytics (cookiefri, laddas alltid via
// <Analytics /> i app/layout.tsx). Egna händelser syns under Events i Vercel
// på Pro-planen; på Hobby skickas de men visas inte. Ett fel här får aldrig
// stoppa en knapp, så allt sväljs.
export type ConversionEvent =
  | { name: "cta_click"; location: string }
  | { name: "inquiry_step"; step: number; mode: "full" | "quick" }
  | { name: "inquiry_submit"; mode: "full" | "quick" }
  | { name: "inquiry_quick_mode" };

export function trackConversion(event: ConversionEvent) {
  try {
    const { name, ...props } = event;
    track(name, props);
  } catch {
    // Analytics är aldrig kritiskt.
  }
}
