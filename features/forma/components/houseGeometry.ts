import type { ModelId } from "@/features/forma/types/configuration";

export type WindowRect = { x: number; y: number; w: number; h: number };

export type HouseGeometry = {
  wallX: number;
  wallY: number;
  wallW: number;
  wallH: number;
  sideDepth: number;
  sideRise: number;
  doorX: number;
  doorY: number;
  doorW: number;
  doorH: number;
  doorHasGlass: boolean;
  standardWindows: WindowRect[];
  // Two large picture windows for the "panorama" upgrade. The door moves
  // to panoramaDoorX (same y/w/h as the standard-mode door) so it never
  // sits underneath — or in the middle of — this much wider glazing.
  panoramaWindows: WindowRect[];
  panoramaDoorX: number;
  pitchBandHeight: number;
};

const wallBottom = 290;

// Purely a rendering concern (window count/size/placement, entry position,
// facade proportions) — kept separate from data/models.ts, which is
// pricing/business data. A normal residential facade, not a storefront:
// every standard window on a given model shares the exact same width and
// height (same "window product" repeated, not a mix of sizes), a near-
// square landscape proportion (~1.1–1.3 : 1), and real solid timber wall
// left above, below, and between every opening — including the door,
// which is a normal entrance with a narrow vertical glass insert, not a
// glazed leaf. Models differ by window COUNT and scale, not by shape.
const geometry: Record<ModelId, HouseGeometry> = {
  "forma-20": {
    wallX: 165,
    wallY: 176,
    wallW: 150,
    wallH: wallBottom - 176,
    sideDepth: 8,
    sideRise: 4,
    standardWindows: [{ x: 181, y: 196, w: 64, h: 54 }],
    doorX: 265,
    doorY: 218,
    doorW: 36,
    doorH: 72,
    doorHasGlass: true,
    panoramaWindows: [
      { x: 229, y: 182, w: 34, h: 102 },
      { x: 273, y: 182, w: 34, h: 102 },
    ],
    panoramaDoorX: 181,
    pitchBandHeight: 24,
  },
  "forma-25": {
    wallX: 115,
    wallY: 158,
    wallW: 214,
    wallH: wallBottom - 158,
    sideDepth: 10,
    sideRise: 5,
    // Two windows, identical size, identical y — a matched pair either
    // side of the door, not a big/small mismatch.
    standardWindows: [
      { x: 131, y: 186, w: 54, h: 48 },
      { x: 259, y: 186, w: 54, h: 48 },
    ],
    doorX: 204,
    doorY: 212,
    doorW: 36,
    doorH: 78,
    doorHasGlass: true,
    panoramaWindows: [
      { x: 185, y: 164, w: 57, h: 122 },
      { x: 256, y: 164, w: 57, h: 122 },
    ],
    panoramaDoorX: 131,
    pitchBandHeight: 26,
  },
  "forma-30": {
    wallX: 72,
    wallY: 170,
    wallW: 290,
    wallH: wallBottom - 170,
    sideDepth: 12,
    sideRise: 6,
    // Same matched-pair system as Forma 25, just scaled up — no third,
    // differently-sized window; the wider facade is carried by more wall
    // and bigger (still matching) windows, not more window types.
    standardWindows: [
      { x: 99, y: 196, w: 66, h: 56 },
      { x: 269, y: 196, w: 66, h: 56 },
    ],
    doorX: 195,
    doorY: 208,
    doorW: 44,
    doorH: 82,
    doorHasGlass: true,
    panoramaWindows: [
      { x: 150, y: 176, w: 90, h: 110 },
      { x: 256, y: 176, w: 90, h: 110 },
    ],
    panoramaDoorX: 88,
    pitchBandHeight: 28,
  },
};

export function getHouseGeometry(model: ModelId): HouseGeometry {
  return geometry[model];
}
