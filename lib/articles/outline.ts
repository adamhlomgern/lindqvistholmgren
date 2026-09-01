export type OutlineHeading = { id: string; level: number; text: string };

// Anchor ids for the table-of-contents sidebar. Duplicate heading text
// produces duplicate ids (the second heading's link would jump to the
// first) — an accepted, rare edge case rather than added bookkeeping to
// dedupe across edits.
export function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "rubrik";
}
