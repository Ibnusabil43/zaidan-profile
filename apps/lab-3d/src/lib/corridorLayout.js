/**
 * Pure geometry and selection logic for the Corridor scene (lab-3d.md §2.1).
 * Kept DOM-free so the sequencing can be checked without a browser.
 *
 * Gate 0 is the newest role (closest to the camera, Z nearest 0); the last
 * gate is the oldest (furthest away). Scrolling forward increases the
 * world's own translateZ, which brings each gate's NET depth (its fixed
 * position plus the world offset) toward 0 in that same order — newest
 * arrives first, oldest last. That is what "sekarang paling dekat, 2020
 * paling jauh" means in Z terms, not just narrative framing.
 */

export const GATE_MARGIN = 200 // Z distance from camera to the very first gate, at scale 1
export const GATE_STEP = 650 // Z distance between consecutive gates, at scale 1

/** Sorts newest-first — the order gate index assumes. Does not mutate. */
export function sortNewestFirst(experience) {
  return [...experience].sort((a, b) => b.start.localeCompare(a.start))
}

/**
 * Fixed Z position of gate `i` (0 = newest/closest). Always negative or 0.
 *
 * `scale` shrinks GATE_MARGIN/GATE_STEP together (default 1 = the original,
 * desktop-calibrated geometry every existing call site and test assumes).
 * CorridorScene passes a smaller scale on narrow viewports: with --d-perspective
 * fixed at 1200px, a ghost gate whose netZ creeps close to that value gets
 * magnified toward infinity by the CSS perspective projection — on a 1368px
 * desktop viewport the resulting oversized box still fits and reads as a
 * subtle depth blur, but on a 375px phone the same absolute pixel width
 * overflows and clips mid-word. Shrinking the Z geometry keeps every gate
 * further from the perspective plane, which is the actual lever that
 * controls how large that projection can blow something up to — no amount
 * of CSS overflow/clamping on the content itself reaches this, because the
 * oversized box is a post-transform rendering size, not a layout width.
 */
export function gateZ(i, scale = 1) {
  return -(GATE_MARGIN * scale + i * GATE_STEP * scale)
}

/**
 * Total scroll-driven travel distance the world's translateZ animates across.
 *
 * Deliberately (count - 1) gate-steps, not count: the world only needs to
 * travel far enough to bring the LAST gate (index count - 1) to netZ = 0 —
 * one GATE_STEP further than that just closes gate (count - 1) again with
 * nothing left to open behind it, so the scroll ends on a blank frame. Caught
 * by scrolling to the very bottom in a real browser and finding every mounted
 * gate at opacity 0 — the parity check couldn't catch this because it checks
 * content is IN THE DOM, not that anything is actually visible when the
 * track ends.
 */
export function totalDepth(count, scale = 1) {
  if (count <= 0) return GATE_MARGIN * scale
  return GATE_MARGIN * scale + (count - 1) * GATE_STEP * scale
}

/** World's own translateZ at a given scroll progress (0..1), always >= 0. */
export function worldZ(progress, count, scale = 1) {
  return progress * totalDepth(count, scale)
}

/** Net depth of gate `i` once the world has moved — 0 means "at the camera". */
export function netZ(i, progress, count, scale = 1) {
  return gateZ(i, scale) + worldZ(progress, count, scale)
}

/** Index of whichever gate is currently nearest the camera. */
export function activeIndex(progress, count, scale = 1) {
  if (count <= 0) return 0
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < count; i++) {
    const dist = Math.abs(netZ(i, progress, count, scale))
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

/**
 * Which gate indices to actually mount, centred on the active one.
 * lab-3d.md §3.2: "maksimal 5 gerbang di DOM" is a hard budget, not a
 * suggestion — ten textured gates at once measurably drops frames on a
 * mid-range phone.
 */
export function visibleIndices(active, count, radius = 2) {
  const start = Math.max(0, active - radius)
  const end = Math.min(count - 1, active + radius)
  const out = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

/**
 * 0 (fully closed/dim) to 1 (fully open/at the reading plane), from how far
 * gate `i` is from the camera right now. Distance GATE_STEP away is closed;
 * distance 0 is open. Used for the "gerbang aktif membuka" visual, computed
 * directly in React render rather than via a separate per-gate animation —
 * there is nothing to scrub here beyond the progress value already driving
 * the world.
 */
export function openness(i, progress, count, scale = 1) {
  const dist = Math.abs(netZ(i, progress, count, scale))
  return Math.max(0, 1 - dist / (GATE_STEP * scale))
}
