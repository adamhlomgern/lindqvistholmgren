// Färgskalorna i det nya ljusa designsystemet — samma värden som
// --color-{skala}-{steg} i app/globals.css. Används av /designsystem för att
// visa hexkoder och räkna kontrast.

export const palette = {
  "pine": {
    "50": "#f0faf4",
    "100": "#e1f3e9",
    "200": "#c5e8d6",
    "300": "#a1d7bc",
    "400": "#77c09e",
    "500": "#4ea47f",
    "600": "#258460",
    "700": "#026a49",
    "800": "#005035",
    "900": "#023724",
    "950": "#012416"
  },
  "lilac": {
    "50": "#f9f5fd",
    "100": "#f1eaf9",
    "200": "#e4d8f4",
    "300": "#d3bfe9",
    "400": "#baa1d7",
    "500": "#9f82be",
    "600": "#7f629d",
    "700": "#664b81",
    "800": "#4d3663",
    "900": "#362447",
    "950": "#231630"
  },
  "plum": {
    "50": "#fff4f5",
    "100": "#fee7ea",
    "200": "#fed1d6",
    "300": "#feb0bb",
    "400": "#fa8499",
    "500": "#e25e79",
    "600": "#bf395b",
    "700": "#9e2044",
    "800": "#7a1031",
    "900": "#590420",
    "950": "#3d0013"
  },
  "ink": {
    "50": "#f6f7f6",
    "100": "#eceeed",
    "200": "#dcdede",
    "300": "#c7c9c8",
    "400": "#acafad",
    "500": "#8e9190",
    "600": "#6f7271",
    "700": "#575a59",
    "800": "#404342",
    "900": "#2b2f2d",
    "950": "#1b1e1c"
  }
} as const;

export type ScaleName = keyof typeof palette;
export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
