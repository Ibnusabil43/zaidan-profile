import { useEffect, useRef } from 'react'
import { animate, createMotionPath } from 'animejs'
import { checkpointYears } from '../lib/timeline'
import { layoutPoints, canvasSize, smoothPath } from '../lib/path'

/** Checkpoint disc radius, in SVG user units (1 unit = 1px here — see path.js).
 *  Constant across all three states (DESIGN.md §5.2): nothing may reflow when a
 *  node changes status, only its fill/border/glyph. */
const NODE_R = 14

/** Inline glyphs, never emoji (CLAUDE.md, DESIGN.md §5.2). Sized to sit inside
 *  the disc and centred on the caller's <g transform="translate(x, y)">. */
function LockGlyph({ color }) {
  return (
    <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-4.5" y="-1" width="9" height="6.5" rx="1" />
      <path d="M -2.5 -1 V -3.2 a 2.5 2.5 0 0 1 5 0 V -1" />
    </g>
  )
}

function CheckGlyph({ color }) {
  return (
    <path
      d="M -4.5 0.5 L -1.5 3.5 L 5 -3.5"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/** locked / active / cleared, from position relative to the active checkpoint. */
function statusOf(i, activeIndex) {
  if (i === activeIndex) return 'active'
  return i < activeIndex ? 'cleared' : 'locked'
}

/**
 * The career path, with a traveller that moves along it as the visitor scrolls.
 *
 * Structure is load-bearing for accessibility. The <svg> is decoration and is
 * `aria-hidden`; the checkpoints are real HTML <button>s layered over it. The
 * tempting shortcut — putting role="tab" on the SVG <circle>s — puts focusable
 * elements inside an aria-hidden subtree, which produces focus with no accessible
 * name. HTML buttons also give native activation and a real :focus-visible ring
 * for free.
 *
 * Visual language is CARTRIDGE (DESIGN.md §4/§5.1/§5.2) — this is a reskin of
 * the motion pipeline below, not a change to it. Colour is never the only
 * signal: each of the three states also has its own glyph and border, so the
 * map still reads correctly in grayscale.
 *
 * anime.js API notes and v3 traps: docs/animejs-v4-notes.md. Do not consult the
 * installed /animejs skill; it documents v3.
 */
export default function CareerMap({
  checkpoints,
  activeIndex,
  progress,
  onSelect,
  onKeyDown,
  tabRefs,
}) {
  const points = layoutPoints(checkpoints.length)
  const { width, height } = canvasSize(checkpoints.length)
  const d = smoothPath(points)

  const pathRef = useRef(null)
  const travellerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    const traveller = travellerRef.current
    if (!path || !traveller) return

    // Returns undefined for anything that is not an SVGGeometryElement, warning
    // to the console rather than throwing — so guard before spreading.
    const motion = createMotionPath(path)
    if (!motion) return

    animationRef.current = animate(traveller, {
      ...motion,
      duration: 1000,
      // Explicitly linear. v4's default ease is 'out(2)', which would decouple
      // the traveller from the scroll and read as lag (DESIGN.md §6).
      ease: 'linear',
      autoplay: false,
    })

    return () => {
      // revert(), not pause(): pause stops the loop but leaves inline styles on
      // the element, which is the leak that survives re-renders.
      animationRef.current?.revert()
      animationRef.current = null
    }
  }, [d])

  // Scrubbing. `.progress` is a real setter that pauses internally before
  // seeking, so it is safe to write every frame. Reduced motion needs no branch
  // here: scrubbing is instant positioning, and DESIGN.md §6 keeps the
  // scroll-to-position relationship even when transitions are off.
  useEffect(() => {
    if (animationRef.current) animationRef.current.progress = progress
  }, [progress])

  return (
    <div className="relative mx-auto" style={{ width, height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        className="pointer-events-none block"
      >
        {/* Base route: the whole path, dashed, in the quiet ink ramp — this is
            the part not yet walked. Kept as the `pathRef` element, since
            createMotionPath needs the one continuous path it was built from. */}
        <path
          id="career-path"
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--color-ink-300)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />

        {/* Passed route: a duplicate of the same `d`, re-stroked solid in the
            amber *line* token (never the fill token — DESIGN.md §4.1) and
            revealed up to `progress` with the pathLength/dashoffset trick, so
            progress reads at a glance without a second geometry source. */}
        <path
          d={d}
          pathLength="1"
          fill="none"
          stroke="var(--lab-accent-line)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />

        {points.map((p, i) => {
          const status = statusOf(i, activeIndex)
          const fill =
            status === 'locked'
              ? 'transparent'
              : status === 'active'
                ? 'var(--lab-accent)'
                : 'var(--lab-surface)'
          const stroke =
            status === 'locked'
              ? 'var(--lab-ink-dim)'
              : status === 'active'
                ? 'var(--lab-accent-line)'
                : 'var(--lab-success)'
          // Number/glyph colour, chosen for contrast against `fill` above —
          // see DESIGN.md §5.2's per-state contrast figures.
          const markColor =
            status === 'locked'
              ? 'var(--lab-ink-dim)'
              : status === 'active'
                ? 'var(--lab-ink)'
                : 'var(--lab-success)'

          return (
            <g key={checkpoints[i].id}>
              {/* Active-only outer ring — the non-colour half of "filled disc +
                  ring" (DESIGN.md §5.2's "cakram terisi + cincin luar"). */}
              {status === 'active' && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={NODE_R + 6}
                  fill="none"
                  stroke="var(--lab-accent-line)"
                  strokeWidth="1.5"
                  strokeDasharray="3 4"
                />
              )}

              <circle
                cx={p.x}
                cy={p.y}
                r={NODE_R}
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
              />

              {status === 'locked' && (
                <g transform={`translate(${p.x}, ${p.y})`}>
                  <LockGlyph color={markColor} />
                </g>
              )}
              {status === 'cleared' && (
                <g transform={`translate(${p.x}, ${p.y})`}>
                  <CheckGlyph color={markColor} />
                </g>
              )}
              {status === 'active' && (
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontWeight="700"
                  fontSize="12"
                  fill={markColor}
                >
                  {i + 1}
                </text>
              )}
            </g>
          )
        })}

        {/* The traveller. anime.js writes transforms onto this element. */}
        <g ref={travellerRef}>
          <circle r="7" fill="var(--lab-accent)" stroke="var(--lab-ink)" strokeWidth="2" />
          <circle r="13" fill="none" stroke="var(--lab-ink)" strokeWidth="1" />
        </g>
      </svg>

      <div
        role="tablist"
        aria-label="Career checkpoints"
        aria-orientation="horizontal"
        className="absolute inset-0"
      >
        {checkpoints.map((cp, i) => {
          const p = points[i]
          const labelAbove = i % 2 === 0
          const isActive = i === activeIndex
          return (
            <button
              key={cp.id}
              ref={tabRefs[i]}
              role="tab"
              id={`tab-${cp.id}`}
              aria-controls={`panel-${cp.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(i, 'click')}
              onKeyDown={onKeyDown}
              style={{ left: p.x, top: p.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius)] p-4"
            >
              <span className="sr-only">
                {cp.roles[0].title}, {cp.label}, {cp.roles[0].period}
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.12em] uppercase ${
                  isActive ? 'text-[var(--lab-ink-muted)]' : 'text-[var(--lab-ink-dim)]'
                } ${labelAbove ? 'bottom-full mb-3' : 'top-full mt-3'}`}
              >
                {checkpointYears(cp)}
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[15px] font-semibold ${
                  isActive ? 'text-[var(--lab-ink)]' : 'text-[var(--lab-ink-dim)]'
                } ${labelAbove ? 'bottom-full mb-8' : 'top-full mt-8'}`}
              >
                {cp.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
