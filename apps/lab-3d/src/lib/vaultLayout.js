/**
 * Pure geometry and selection logic for the Vault scene (lab-3d.md §2.2).
 * Kept DOM-free so the sequencing can be checked without a browser, same
 * discipline as corridorLayout.js.
 *
 * One project is "active" at a time — the camera never moves in Vault (unlike
 * Corridor's dolly); it's the object that rotates. The overall scroll track
 * is split into one equal segment per project; within a project's own
 * segment, scroll rotates its prism through all four faces in order.
 */

export const FACE_COUNT = 4
export const DRAG_DEGREES_PER_PIXEL = 0.5 // sensitivity for manual rotation

/** Index of whichever project is currently active, from overall progress (0..1). */
export function activeProjectIndex(progress, count) {
  if (count <= 0) return 0
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
}

/** Progress (0..1) through the ACTIVE project's own segment. */
export function faceProgress(progress, count) {
  if (count <= 0) return 0
  const seg = 1 / count
  const idx = activeProjectIndex(progress, count)
  const local = (progress - idx * seg) / seg
  return Math.min(1, Math.max(0, local))
}

/**
 * Scroll-driven rotation angle (degrees) for the active prism. Sweeps 0→270
 * across the segment — three 90° turns, enough to bring all four faces to
 * the front in order (the fourth arrives without a turn back, since it
 * started there before the first).
 */
export function baseRotation(faceP) {
  return faceP * (FACE_COUNT - 1) * 90
}

/**
 * Which face (0 = front, 1 = right, 2 = back, 3 = left) is currently facing
 * the camera, for any rotation angle including ones from manual dragging
 * (so not restricted to the 0..270 scroll range).
 *
 * Faces are placed at `rotateY(-i * 90deg)` (see VaultScene.jsx) so that
 * rotating the container by `rotateY(theta)` brings face `i` to the front
 * exactly when theta === i * 90 (mod 360) — this is the inverse of that.
 */
export function faceIndex(theta) {
  const norm = ((theta % 360) + 360) % 360
  return Math.round(norm / 90) % FACE_COUNT
}

/** Nearest face-aligned angle to `theta` — what a released drag snaps to. */
export function snapToNearestFace(theta) {
  return Math.round(theta / 90) * 90
}
