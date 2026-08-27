// Mixes a hex color toward white (positive percent) or black (negative
// percent) — used to derive light/dark tonal variants of a single base color
// (facade, roof, ...) at render time instead of hand-authoring a light/dark/
// base triplet per material. See HouseIllustration.tsx.
export function shade(hex: string, percent: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const target = percent < 0 ? 0 : 255;
  const amount = Math.min(Math.abs(percent), 100) / 100;
  const mix = (channel: number) => clamp(Math.round(channel + (target - channel) * amount));
  return `#${[mix(r), mix(g), mix(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}
