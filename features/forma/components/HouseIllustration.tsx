"use client";

import { useId } from "react";
import { facadeOptions, roofOptions } from "@/features/forma/data/options";
import { getHouseGeometry, type WindowRect } from "@/features/forma/components/houseGeometry";
import { shade } from "@/features/forma/utils/color";
import type { FacadeId, ModelId, RoofId, WindowId } from "@/features/forma/types/configuration";

type HouseIllustrationProps = {
  model: ModelId;
  facade: FacadeId;
  roof: RoofId;
  windows: WindowId;
  className?: string;
};

function swatch(list: { id: string; swatch: string }[], id: string): string {
  return list.find((o) => o.id === id)?.swatch ?? "#c9b89a";
}

// Soft warm graphite rather than near-black — frames/foundation should read
// as a material tone, not a hard outline. See the "ta bort den svarta
// lådan" correction.
const FRAME = "#4a453c";
const FOUNDATION = "#57503f";

function WindowUnit({ x, y, w, h, uid, mullions }: WindowRect & { uid: string; mullions?: number }) {
  const frameInset = 3;
  const mullionCount = mullions ?? (w > 140 ? Math.round(w / 90) : 1);
  return (
    <g>
      {/* Reveal — soft, low-contrast wall-thickness cue, not a drawn outline. */}
      <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} rx={1.5} fill="#000" opacity={0.07} />
      <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} rx={1.5} fill={FRAME} opacity={0.55} />
      <rect x={x} y={y} width={w} height={h} rx={1} fill={`url(#${uid}-glass)`} />
      {Array.from({ length: mullionCount }, (_, i) => x + ((i + 1) * w) / (mullionCount + 1)).map((mx) => (
        <line key={mx} x1={mx} y1={y + frameInset} x2={mx} y2={y + h - frameInset} stroke={FRAME} strokeWidth={1} opacity={0.35} />
      ))}
    </g>
  );
}

// No photography/3D asset pipeline exists for this demo, so the house is a
// bespoke layered SVG rendered as a very shallow oblique projection — a
// flat, legible front elevation with only a hinted receding side (roughly
// 5-10% of the wall width), enough to read as a simplified architectural
// render rather than a flat icon, without tipping into a "3D model" look.
// Materials are single base colors shaded lighter/darker at render time
// (see utils/color.ts) rather than hand-authored palettes, and every "dark"
// tone stays soft/tonal — no near-black fills — so depth comes from subtle
// contrast, not drawn outlines. Crossfades (roof shape, window style) stay
// opacity-based so nothing remounts when a selection changes.
export function HouseIllustration({ model, facade, roof, windows, className }: HouseIllustrationProps) {
  const uid = useId();
  const geo = getHouseGeometry(model);
  const facadeColor = swatch(facadeOptions, facade);
  const roofColor = swatch(roofOptions, roof);
  const isPanorama = windows === "panorama";
  const isSadel = roof === "sadel";

  const { wallX, wallY, wallW, wallH, sideDepth, sideRise, doorX, doorW, doorH, doorHasGlass, standardWindows, panoramaWindow, pitchBandHeight } = geo;
  const wallRight = wallX + wallW;
  const wallBottom = wallY + wallH;
  const doorY = wallBottom - doorH;

  const facadeLight = shade(facadeColor, 10);
  const facadeDark = shade(facadeColor, -8);
  const facadeDeep = shade(facadeColor, -9);
  // roofTop: near sloped roof plane (sadel) / slab top face (flat).
  // roofFront: ridge cap + eave fascia (sadel) / front fascia (flat).
  const roofTop = shade(roofColor, 9);
  const roofFront = shade(roofColor, -4);
  const roofSide = shade(roofColor, -9);
  const foundationLight = shade(FOUNDATION, 14);
  const foundationSide = shade(FOUNDATION, -10);

  // ——— Front elevation: we are looking at the LONG facade of the building.
  // The roof ridge runs along that same long axis — parallel to the eave,
  // not perpendicular to it — so the gable (triangular) roof end belongs on
  // the SHORT end of the building, which we only glimpse as a thin turned
  // sliver on the right (the same depth vector used for the side wall).
  // The wall is a plain axis-aligned rectangle (A, B, C, D) with a straight
  // horizontal eave (A-B) — it is NEVER sloped, skewed or turned into a
  // pentagon by either roof type.
  const pointsStr = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const A = { x: wallX, y: wallY };
  const B = { x: wallRight, y: wallY };
  const C = { x: wallRight, y: wallBottom };
  const dx = sideDepth;
  const dy = -sideRise;
  const B2 = { x: B.x + dx, y: B.y + dy };
  const C2 = { x: C.x + dx, y: C.y + dy };

  const foundationH = 8;
  const houseSpanCenterX = wallX + (wallW + sideDepth) / 2;

  // Side wall — the same plain parallelogram (B, B2, C2, C) regardless of
  // roof type: the short end of the building, seen edge-on as a thin hint.
  const sidePoints = pointsStr([B, B2, C2, C]);

  // Flat/pulpet roof — one connected extruded slab: top face, front
  // fascia, side fascia, all sharing exact corners (Aov/B/Aov2/B2 raised
  // by roofThickness). B and B2 are reused directly (no separate right
  // overhang), so the roof's right edge sits exactly on the wall's own
  // corner and on the side wall's own top edge.
  const overhangLeft = 9;
  const roofThickness = 2.5;
  const Aov = { x: A.x - overhangLeft, y: A.y };
  const Aov2 = { x: Aov.x + dx, y: Aov.y + dy };
  const topAov = { x: Aov.x, y: Aov.y - roofThickness };
  const topB = { x: B.x, y: B.y - roofThickness };
  const topAov2 = { x: Aov2.x, y: Aov2.y - roofThickness };
  const topB2 = { x: B2.x, y: B2.y - roofThickness };
  const flatTopFace = pointsStr([topAov, topB, topB2, topAov2]);
  const flatFrontFascia = pointsStr([Aov, B, topB, topAov]);
  const flatSideFascia = pointsStr([B, B2, topB2, topB]);

  // Sadeltak — ridge runs along the long facade, set back at HALF the depth
  // vector (a true gable roof's ridge sits midway between front and back
  // eave), risen by pitchBandHeight above the eave line. RidgeL/RidgeR span
  // the full wall width, exactly like the eave (A-B) does.
  const RidgeL = { x: A.x + dx / 2, y: A.y + dy / 2 - pitchBandHeight };
  const RidgeR = { x: B.x + dx / 2, y: B.y + dy / 2 - pitchBandHeight };

  // Eave overhang — the roof plane itself extends past the wall's left
  // corner (not just a fascia board tacked on below it), so its own left
  // edge is one continuous diagonal running from the overhang tip up to
  // the ridge, instead of stopping flush at the wall with a separate
  // horizontal strip poking out underneath it.
  const eaveOverhang = 7;
  const AeaveOv = { x: A.x - eaveOverhang, y: A.y };

  // Near roof pitch — the ONE sloped plane this camera angle can actually
  // see (the far pitch is hidden behind the ridge, as in a real photo).
  // Wide and shallow (full wall width, modest rise) so it reads as a
  // low-pitched roof slab, not a tall wall.
  const nearPitchPoints = pointsStr([AeaveOv, B, RidgeR, RidgeL]);

  // A thin ridge cap — a sliver of visible thickness right at the ridge —
  // stands in for the (unseen) far pitch, giving the two-plane read
  // without drawing a plane the camera angle wouldn't show.
  const ridgeCapRise = 3;
  const RidgeCapL = { x: RidgeL.x, y: RidgeL.y - ridgeCapRise };
  const RidgeCapR = { x: RidgeR.x, y: RidgeR.y - ridgeCapRise };
  const ridgeCapPoints = pointsStr([RidgeL, RidgeR, RidgeCapR, RidgeCapL]);

  // Front eave fascia — the thin board along the underside of that same
  // overhung edge, sharing AeaveOv/B exactly with the roof plane above it
  // so the two never separate.
  const eaveThickness = 2;
  const eaveFasciaPoints = pointsStr([
    AeaveOv,
    B,
    { x: B.x, y: B.y + eaveThickness },
    { x: AeaveOv.x, y: AeaveOv.y + eaveThickness },
  ]);

  // Gable end — the SHORT end of the building, sitting on top of the side
  // wall sliver it shares an edge with (B-B2), peaking at the ridge's own
  // right end (RidgeR) — so it is geometrically locked to both the wall
  // and the ridge, not independently positioned.
  // No separate verge-overhang cap behind this triangle: B and B2 already
  // sit exactly on the side wall's own top edge, and B-RidgeR is already
  // shared exactly with the near-pitch plane, so the triangle alone meets
  // the wall and the roof with no gap. A uniform outward margin here
  // (tried earlier) pushed the B/B2 base corners down past those shared
  // edges into the wall below, which is what read as a dark separator
  // strip at the roof-to-wall junction.
  const gableTrianglePoints = pointsStr([B, RidgeR, B2]);

  return (
    <svg viewBox="40 95 400 240" className={className} role="img" aria-label="Illustration av konfigurerat hus">
      <defs>
        {/* Front-wall light: brightest upper-left, fading to neutral — the
            house's one consistent light source (upper left) for every
            surface. */}
        <linearGradient id={`${uid}-wallLight`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="55%" stopColor="#fff" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.08} />
        </linearGradient>
        <linearGradient id={`${uid}-roofShine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.04} />
        </linearGradient>
        {/* Subtle sky-to-ground tonal shift, no distinct shine line — the
            "realism" comes from the gradient itself, not an added stroke. */}
        <linearGradient id={`${uid}-glass`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ccd9e0" />
          <stop offset="45%" stopColor="#dcdccb" />
          <stop offset="100%" stopColor="#eee1cb" />
        </linearGradient>
        <linearGradient id={`${uid}-door`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f453b" />
          <stop offset="100%" stopColor="#382e24" />
        </linearGradient>
        <clipPath id={`${uid}-sideClip`}>
          <polygon points={sidePoints} />
        </clipPath>
        <radialGradient id={`${uid}-ground`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9b89a" stopOpacity={0.32} />
          <stop offset="100%" stopColor="#c9b89a" stopOpacity={0} />
        </radialGradient>
        <filter id={`${uid}-tightBlur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id={`${uid}-softBlur`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id={`${uid}-lift`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#171714" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Studio ground — a soft warm glow, not an environment. */}
      <ellipse cx={houseSpanCenterX} cy={wallBottom + foundationH + 2} rx={(wallW + sideDepth) * 0.72} ry={40} fill={`url(#${uid}-ground)`} />

      {/* Contact shadow sits tight against the foundation, then a much
          larger, very soft ambient shadow fades it out — not a second hard
          ring, so the house doesn't read as floating above a product-icon
          puck. */}
      <ellipse cx={houseSpanCenterX} cy={wallBottom + foundationH} rx={(wallW + sideDepth) * 0.36} ry={3.5} fill="#171714" opacity={0.2} filter={`url(#${uid}-tightBlur)`} />
      <ellipse cx={houseSpanCenterX} cy={wallBottom + foundationH + 1} rx={(wallW + sideDepth) * 0.5} ry={14} fill="#171714" opacity={0.045} filter={`url(#${uid}-softBlur)`} />

      <g filter={`url(#${uid}-lift)`}>
        {/* Side wall (long side, seen edge-on) — drawn first so the front
            wall's edge sits cleanly on top of it. Same shape for both roof
            types now that the gable lives on the front. Gets the same
            light gradient and a couple of continuation cladding lines as
            the front wall (clipped to its own shape) so it reads as the
            same material turning a corner, not a separately-coloured shape
            stuck on. */}
        <polygon points={sidePoints} fill={facadeDeep} className="transition-[fill] duration-500" />
        <g clipPath={`url(#${uid}-sideClip)`}>
          <rect x={wallRight - 4} y={wallY - pitchBandHeight - 20} width={sideDepth + 8} height={wallH + pitchBandHeight + 60} fill={`url(#${uid}-wallLight)`} opacity={0.5} />
          {[0.32, 0.64].map((t) => (
            <line
              key={t}
              x1={B.x + dx * t}
              y1={B.y + dy * t}
              x2={C.x + dx * t}
              y2={C.y + dy * t}
              stroke="#000"
              strokeOpacity={0.05}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Foundation */}
        <rect x={wallX} y={wallBottom} width={wallW} height={foundationH} fill={FOUNDATION} />
        <rect x={wallX} y={wallBottom} width={wallW} height={1.5} fill={foundationLight} opacity={0.4} />
        <polygon
          points={`${C.x},${C.y} ${C2.x},${C2.y} ${C2.x},${C2.y + foundationH} ${C.x},${C.y + foundationH}`}
          fill={foundationSide}
        />

        {/* Front wall */}
        <rect x={wallX} y={wallY} width={wallW} height={wallH} fill={facadeColor} className="transition-[fill] duration-500" />
        <rect x={wallX} y={wallY} width={wallW} height={wallH} fill={`url(#${uid}-wallLight)`} />
        {/* Cladding lines with two subtly recolored panels for material
            variation — thin, low-opacity, tonal rather than a hard grid. */}
        {Array.from({ length: 11 }, (_, i) => wallX + ((i + 1) * wallW) / 12).map((x) => (
          <line key={x} x1={x} y1={wallY + 2} x2={x} y2={wallBottom - 2} stroke="#000" strokeOpacity={0.028} strokeWidth={1} />
        ))}
        <rect x={wallX + wallW * 0.22} y={wallY} width={wallW * 0.07} height={wallH} fill={facadeLight} opacity={0.12} />
        <rect x={wallX + wallW * 0.68} y={wallY} width={wallW * 0.06} height={wallH} fill={facadeDark} opacity={0.1} />

        {/* Roof — flat/pulpet: top face, front fascia and side fascia are
            one connected slab — every seam shares an exact edge, drawn
            neutrally first (no gradient/shadow) so the geometry itself has
            to read as physical before any light gets added. */}
        <g className="transition-opacity duration-500" style={{ opacity: isSadel ? 0 : 1 }}>
          <polygon points={flatSideFascia} fill={roofSide} />
          <polygon points={flatFrontFascia} fill={roofFront} />
          <polygon points={flatTopFace} fill={roofTop} />
          <polygon points={flatTopFace} fill={`url(#${uid}-roofShine)`} />
        </g>

        {/* Roof — sadeltak: ridge runs along the long facade. We draw, in
            order: the gable end wall (its own edges already shared exactly
            with the side wall and the near-pitch plane below/beside it —
            no separate cap layer), then the one visible sloped roof plane
            (near pitch) with its ridge cap and front eave fascia. Nothing
            here fakes a plane the camera angle wouldn't actually show. */}
        <g className="transition-opacity duration-500" style={{ opacity: isSadel ? 1 : 0 }}>
          <polygon points={gableTrianglePoints} fill={shade(facadeColor, 6)} />
          <polygon points={nearPitchPoints} fill={roofTop} />
          <polygon points={nearPitchPoints} fill={`url(#${uid}-roofShine)`} />
          <polygon points={ridgeCapPoints} fill={roofFront} />
          <polygon points={eaveFasciaPoints} fill={roofFront} />
        </g>

        {/* Standard window(s) */}
        <g className="transition-opacity duration-500" style={{ opacity: isPanorama ? 0 : 1 }}>
          {standardWindows.map((w) => (
            <WindowUnit key={`${w.x}-${w.y}`} {...w} uid={uid} />
          ))}
        </g>

        {/* Panorama window — sits behind the door in z-order, same as a
            continuous glass wall the door is set into. */}
        <g className="transition-opacity duration-500" style={{ opacity: isPanorama ? 1 : 0 }}>
          <WindowUnit {...panoramaWindow} uid={uid} />
        </g>

        {/* Door — dark wood/graphite gradient, thin frame, soft light side. */}
        <g>
          <rect x={doorX - 1} y={doorY - 1} width={doorW + 2} height={doorH + 1} fill={FRAME} opacity={0.45} rx={1.5} />
          <rect x={doorX} y={doorY} width={doorW} height={doorH} fill={`url(#${uid}-door)`} rx={1} />
          <rect x={doorX + doorW * 0.14} y={doorY + doorH * 0.1} width={doorW * 0.72} height={doorH * 0.42} fill="#000" opacity={0.06} rx={1} />
          {doorHasGlass && (
            <rect x={doorX + doorW * 0.68} y={doorY + doorH * 0.08} width={doorW * 0.2} height={doorH * 0.5} fill={`url(#${uid}-glass)`} opacity={0.85} rx={0.5} />
          )}
          <rect x={doorX + doorW - 2} y={doorY} width={2} height={doorH} fill="#000" opacity={0.08} />
          <circle cx={doorX + doorW * 0.16} cy={doorY + doorH * 0.55} r={1.6} fill="#c9b89a" />
        </g>
      </g>
    </svg>
  );
}
