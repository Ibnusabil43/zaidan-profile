import { checkpointYears } from '../lib/timeline'
import { layoutPoints, canvasSize, smoothPath } from '../lib/path'

/**
 * The horizontal career path. Shown from `md` up; narrower screens read the
 * vertical StaticTimeline instead (DESIGN.md §7).
 *
 * Phase 2 renders it still: the path, the markers, the labels. Nothing moves and
 * nothing is selectable yet — Phase 3 (LAB-D) adds the traveller, the status
 * transitions and the three ways of getting along it.
 *
 * The `<path>` is deliberately one continuous element with an id: LAB-D2 feeds it
 * straight to anime.js `createMotionPath`.
 */
export default function CareerMap({ checkpoints }) {
  const points = layoutPoints(checkpoints.length)
  const { width, height } = canvasSize(checkpoints.length)
  const d = smoothPath(points)

  return (
    <div className="hidden overflow-x-auto px-6 py-16 md:block">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="mx-auto block max-w-none"
        role="img"
        aria-label={`Career path, ${checkpoints[0]?.startYear} to now. The same information is listed below.`}
      >
        <path
          id="career-path"
          d={d}
          fill="none"
          stroke="var(--color-ink-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {checkpoints.map((cp, i) => {
          const p = points[i]
          const labelAbove = i % 2 === 0
          return (
            <g key={cp.id} aria-hidden="true">
              <circle cx={p.x} cy={p.y} r="7" fill="var(--color-ink-950)" />
              <text
                x={p.x}
                y={labelAbove ? p.y - 26 : p.y + 34}
                textAnchor="middle"
                className="fill-[var(--color-ink-400)] font-mono text-[11px] tracking-widest"
              >
                {checkpointYears(cp)}
              </text>
              <text
                x={p.x}
                y={labelAbove ? p.y - 44 : p.y + 54}
                textAnchor="middle"
                className="fill-[var(--color-ink-950)] font-display text-[15px] font-semibold"
              >
                {cp.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
