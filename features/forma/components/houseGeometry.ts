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
  doorW: number;
  doorH: number;
  doorHasGlass: boolean;
  standardWindows: WindowRect[];
  panoramaWindow: WindowRect;
  pitchBandHeight: number;
};

const wallBottom = 290;

// Purely a rendering concern (window count/size/placement, entry position,
// facade proportions) — kept separate from data/models.ts, which is
// pricing/business data. Each model is a distinct small composition, not
// the same box scaled: Forma 20 is compact and asymmetric (single window,
// off-center door), Forma 25 is the symmetric, generously-glazed "hero",
// Forma 30 is wider with an intentionally asymmetric window pairing (one
// standard + one larger picture window) and an off-center entry.
const geometry: Record<ModelId, HouseGeometry> = {
  "forma-20": {
    wallX: 165,
    wallY: 176,
    wallW: 150,
    wallH: wallBottom - 176,
    sideDepth: 8,
    sideRise: 4,
    doorX: 269,
    doorW: 32,
    doorH: 58,
    doorHasGlass: false,
    standardWindows: [{ x: 183, y: 196, w: 48, h: 40 }],
    panoramaWindow: { x: 173, y: 186, w: 134, h: 96 },
    pitchBandHeight: 24,
  },
  "forma-25": {
    wallX: 115,
    wallY: 158,
    wallW: 214,
    wallH: wallBottom - 158,
    sideDepth: 10,
    sideRise: 5,
    doorX: 203,
    doorW: 38,
    doorH: 70,
    doorHasGlass: true,
    standardWindows: [
      { x: 129, y: 180, w: 58, h: 50 },
      { x: 257, y: 180, w: 58, h: 50 },
    ],
    panoramaWindow: { x: 123, y: 168, w: 198, h: 114 },
    pitchBandHeight: 26,
  },
  "forma-30": {
    wallX: 72,
    wallY: 170,
    wallW: 290,
    wallH: wallBottom - 170,
    sideDepth: 12,
    sideRise: 6,
    doorX: 170,
    doorW: 44,
    doorH: 64,
    doorHasGlass: true,
    standardWindows: [
      { x: 90, y: 182, w: 64, h: 54 },
      { x: 246, y: 178, w: 92, h: 58 },
    ],
    panoramaWindow: { x: 80, y: 180, w: 274, h: 102 },
    pitchBandHeight: 28,
  },
};

export function getHouseGeometry(model: ModelId): HouseGeometry {
  return geometry[model];
}
