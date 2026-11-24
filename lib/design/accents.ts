export const accents = ["emerald", "moss", "peach", "lavender", "coral", "sky", "rose"] as const;
export type Accent = (typeof accents)[number];

// Varje accent pekar på en skala i designsystemet (app/globals.css). Namnen
// (emerald, peach …) ligger kvar eftersom de kan vara sparade som data, men
// färgerna är nu ljusa toner med mörk text: steg 100 som bakgrund och 800
// som text ger 8–9:1 i kontrast.
export const accentScale: Record<Accent, string> = {
  emerald: "pine",
  moss: "teal",
  peach: "amber",
  lavender: "lilac",
  coral: "red",
  sky: "blue",
  rose: "rose",
};

export const badgeClasses: Record<Accent, string> = {
  emerald: "bg-pine-100 text-pine-800",
  moss: "bg-teal-100 text-teal-800",
  peach: "bg-amber-100 text-amber-800",
  lavender: "bg-lilac-100 text-lilac-800",
  coral: "bg-red-100 text-red-800",
  sky: "bg-blue-100 text-blue-800",
  rose: "bg-rose-100 text-rose-800",
};

// Liten pill för kategorier och taggar (artiklar, projekt, admin-listor).
export const pillClasses: Record<Accent, string> = {
  emerald: "bg-pine-50 text-pine-800 ring-1 ring-inset ring-pine-200",
  moss: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200",
  peach: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  lavender: "bg-lilac-50 text-lilac-800 ring-1 ring-inset ring-lilac-200",
  coral: "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200",
  sky: "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200",
  rose: "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200",
};

export const iconTextClasses: Record<Accent, string> = {
  emerald: "text-pine-700",
  moss: "text-teal-700",
  peach: "text-amber-700",
  lavender: "text-lilac-700",
  coral: "text-red-700",
  sky: "text-blue-700",
  rose: "text-rose-700",
};

export const blobClasses: Record<Accent, { big: string; small: string }> = {
  emerald: { big: "bg-pine-100", small: "bg-pine-50" },
  moss: { big: "bg-teal-100", small: "bg-teal-50" },
  peach: { big: "bg-amber-100", small: "bg-amber-50" },
  lavender: { big: "bg-lilac-100", small: "bg-lilac-50" },
  coral: { big: "bg-red-100", small: "bg-red-50" },
  sky: { big: "bg-blue-100", small: "bg-blue-50" },
  rose: { big: "bg-rose-100", small: "bg-rose-50" },
};

// Hex values matching the CSS custom properties in globals.css, for contexts
// (like generated OG images) that can't resolve Tailwind classes or CSS vars.
export const accentHex: Record<Accent, string> = {
  emerald: "#026a49",
  moss: "#016767",
  peach: "#804b01",
  lavender: "#664b81",
  coral: "#a71116",
  sky: "#015b9f",
  rose: "#96295e",
};

// Ljus ton av samma accent, för ytor i OG-bilder.
export const accentSoftHex: Record<Accent, string> = {
  emerald: "#e1f3e9",
  moss: "#def3f2",
  peach: "#feead7",
  lavender: "#f1eaf9",
  coral: "#ffe8e5",
  sky: "#e2f0fe",
  rose: "#fee7ef",
};

// Fixed per-service assignments so the six service cards read as six
// distinct colors wherever the service grid appears (home teaser, /tjanster,
// service category pages).
export const serviceAccents: Record<string, Accent> = {
  webb: "emerald",
  seo: "rose",
  design: "peach",
  tillvaxt: "lavender",
  automation: "coral",
  support: "sky",
};

export function getServiceAccent(slug: string): Accent {
  return serviceAccents[slug] ?? "emerald";
}

// Deterministic fallback for category strings that aren't known at build
// time (e.g. project categories from Supabase), so the same category always
// lands on the same accent without needing a hand-maintained map.
export function accentForKey(key: string): Accent {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return accents[hash % accents.length];
}
