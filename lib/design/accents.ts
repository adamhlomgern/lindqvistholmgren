export const accents = ["emerald", "moss", "peach", "lavender", "coral", "sky", "rose"] as const;
export type Accent = (typeof accents)[number];

export const badgeClasses: Record<Accent, string> = {
  emerald: "bg-emerald/15 text-emerald",
  moss: "bg-moss/15 text-moss",
  peach: "bg-peach/15 text-peach",
  lavender: "bg-lavender/15 text-lavender",
  coral: "bg-coral/15 text-coral",
  sky: "bg-sky/15 text-sky",
  rose: "bg-rose/15 text-rose",
};

export const iconTextClasses: Record<Accent, string> = {
  emerald: "text-emerald",
  moss: "text-moss",
  peach: "text-peach",
  lavender: "text-lavender",
  coral: "text-coral",
  sky: "text-sky",
  rose: "text-rose",
};

export const blobClasses: Record<Accent, { big: string; small: string }> = {
  emerald: { big: "bg-emerald/10", small: "bg-emerald/[0.06]" },
  moss: { big: "bg-moss/10", small: "bg-moss/[0.06]" },
  peach: { big: "bg-peach/10", small: "bg-peach/[0.06]" },
  lavender: { big: "bg-lavender/10", small: "bg-lavender/[0.06]" },
  coral: { big: "bg-coral/10", small: "bg-coral/[0.06]" },
  sky: { big: "bg-sky/10", small: "bg-sky/[0.06]" },
  rose: { big: "bg-rose/10", small: "bg-rose/[0.06]" },
};

// Hex values matching the CSS custom properties in globals.css, for contexts
// (like generated OG images) that can't resolve Tailwind classes or CSS vars.
export const accentHex: Record<Accent, string> = {
  emerald: "#34d399",
  moss: "#4ca37a",
  peach: "#f5b87e",
  lavender: "#d7b4ea",
  coral: "#e28a87",
  sky: "#8ec5e8",
  rose: "#e8a0c0",
};

// Fixed per-service assignments so the six service cards read as six
// distinct colors wherever the service grid appears (home teaser, /tjanster,
// service category pages).
export const serviceAccents: Record<string, Accent> = {
  webb: "emerald",
  // "moss" reads too close to the forest/olive background to pop as an
  // accent — rose gives SEO real contrast instead of blending in.
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
