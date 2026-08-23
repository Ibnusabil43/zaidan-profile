/**
 * Geometry for the career path.
 *
 * The path MUST come out as a single continuous `d` string, not a series of
 * separate segments: Phase 3 hands it to anime.js `createMotionPath`, which walks
 * one path element. Building it as pieces here would force Phase 3 to redo this.
 * See DESIGN.md §5.
 */

/** Layout constants, in SVG user units. */
export const STEP = 260 // distance between checkpoints along the path
export const SWAY = 52 // how far checkpoints alternate off the centre line
export const MARGIN = 130 // space before the first and after the last checkpoint
export const TRACK = 300 // thickness of the band the path sways within

/**
 * Positions checkpoints evenly along the run, alternating either side of centre
 * so the path reads as a route rather than a ruler.
 */
export function layoutPoints(count, horizontal = true) {
  return Array.from({ length: count }, (_, i) => {
    const along = MARGIN + i * STEP
    const across = TRACK / 2 + (i % 2 === 0 ? -SWAY : SWAY)
    return horizontal ? { x: along, y: across } : { x: across, y: along }
  })
}

export function canvasSize(count, horizontal = true) {
  const along = MARGIN * 2 + Math.max(0, count - 1) * STEP
  return horizontal ? { width: along, height: TRACK } : { width: TRACK, height: along }
}

/**
 * Catmull-Rom through the points, converted to cubic béziers, so the curve
 * actually passes through every checkpoint. A plain quadratic smoothing would
 * leave the markers sitting slightly off their own path, which shows up as soon
 * as something animates along it.
 */
export function smoothPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }

    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x} ${p2.y}`
  }

  return d
}
