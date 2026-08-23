import { useEffect, useRef } from 'react'
import { animate, createMotionPath } from 'animejs'
import { checkpointYears } from '../lib/timeline'
import { layoutPoints, canvasSize, smoothPath } from '../lib/path'

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
        <path
          id="career-path"
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--color-ink-200)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <circle
            key={checkpoints[i].id}
            cx={p.x}
            cy={p.y}
            r={i === activeIndex ? 9 : 6}
            fill={i <= activeIndex ? 'var(--color-ink-950)' : 'none'}
            stroke={i <= activeIndex ? 'none' : 'var(--color-ink-300)'}
            strokeWidth="1.5"
          />
        ))}

        {/* The traveller. anime.js writes transforms onto this element. */}
        <g ref={travellerRef}>
          <circle r="16" fill="none" stroke="var(--color-ink-950)" strokeWidth="1" />
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
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-4 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-950"
            >
              <span className="sr-only">
                {cp.roles[0].title}, {cp.label}, {cp.roles[0].period}
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-widest ${
                  isActive ? 'text-ink-500' : 'text-ink-400'
                } ${labelAbove ? 'bottom-full mb-3' : 'top-full mt-3'}`}
              >
                {checkpointYears(cp)}
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[15px] font-semibold ${
                  isActive ? 'text-ink-950' : 'text-ink-400'
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
