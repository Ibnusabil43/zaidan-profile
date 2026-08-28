import { useEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'animejs'
import { experience } from '@zaidan/data'
import SceneStage from '../SceneStage'
import { useScrollProgress } from '../../lib/useScrollProgress'
import ExperienceEntry from '../sections/ExperienceEntry'
import {
  sortNewestFirst,
  gateZ,
  totalDepth,
  activeIndex,
  visibleIndices,
  openness,
} from '../../lib/corridorLayout'

/**
 * Scene 1 · Corridor · verb: DOLLY (lab-3d.md §2.1) — the main showcase.
 *
 * All ten roles sit at fixed Z positions (newest closest, oldest furthest —
 * corridorLayout.js has the exact reasoning). Scrolling animates the WORLD's
 * own translateZ forward, which is what makes gates arrive at the camera in
 * sequence; individual gates are not animated themselves; their "openness" is
 * a plain function of how close they currently are, recomputed on every
 * progress update, not a second animation system layered on top of the first.
 *
 * Only `visibleIndices()` (max 5) are ever mounted — lab-3d.md §3.2 calls this
 * a hard budget, not an optimization to add later.
 */
const HEIGHT_VH_PER_GATE = 90

// Below this viewport width the Z geometry shrinks proportionally (see the
// `scale` param on corridorLayout.js's functions) — with --d-perspective
// fixed at 1200px, a ghost gate approaching that distance gets magnified by
// the CSS perspective projection to a post-transform width that comfortably
// fits a desktop viewport but overflows and clips mid-word on a phone.
// Shrinking Z keeps every gate further from the perspective plane instead.
const SCALE_REFERENCE_WIDTH = 900

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(1, window.innerWidth / SCALE_REFERENCE_WIDTH)
}

export default function CorridorScene({ flat }) {
  const gates = useMemo(() => sortNewestFirst(experience), [])
  const count = gates.length
  const [trackRef, progress] = useScrollProgress()
  const [scale, setScale] = useState(computeScale)
  const worldRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (flat) return
    const el = worldRef.current
    if (!el) return
    animRef.current = animate(el, {
      translateZ: [0, totalDepth(count, scale)],
      duration: 1000,
      ease: 'linear',
      autoplay: false,
    })
    return () => {
      animRef.current?.revert()
      animRef.current = null
    }
  }, [flat, count, scale])

  useEffect(() => {
    if (flat && animRef.current) return
    if (animRef.current) animRef.current.progress = progress
  }, [progress, flat])

  if (flat) {
    return (
      <section aria-labelledby="experience-heading" className="mx-auto mt-16 max-w-3xl px-6">
        <h2 id="experience-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Experience
        </h2>
        <ul className="mt-6 space-y-8 border-t border-[var(--d-line)] pt-6">
          {gates.map((role) => (
            <li key={`${role.title}-${role.start}`}>
              <ExperienceEntry role={role} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const active = activeIndex(progress, count, scale)
  const visible = visibleIndices(active, count)

  return (
    <SceneStage trackRef={trackRef} heightVh={HEIGHT_VH_PER_GATE * count}>
      <div ref={worldRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {visible.map((i) => {
          const gate = gates[i]
          const open = Math.min(1, openness(i, progress, count, scale) * 1.4)
          return (
            <div
              key={`${gate.title}-${gate.start}`}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `translateZ(${gateZ(i, scale)}px)` }}
            >
              {/* The frame: two panels that slide apart as the gate opens. Purely
                  decorative — the real content sits centred, independent of them. */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 h-64 w-2 -translate-y-1/2 border-[var(--d-line)]"
                style={{
                  left: '50%',
                  transform: `translate(calc(-50% - ${open * 220}px), -50%)`,
                  borderRightWidth: 2,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute top-1/2 h-64 w-2 -translate-y-1/2 border-[var(--d-line)]"
                style={{
                  left: '50%',
                  transform: `translate(calc(-50% + ${open * 220}px), -50%)`,
                  borderLeftWidth: 2,
                }}
              />

              <div
                className="max-w-xl px-6 text-center"
                style={{ opacity: open, transform: `scale(${0.94 + open * 0.06})` }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--d-dim)]">
                  {gate.period}
                </p>
                <div className="mt-2 text-left">
                  <ExperienceEntry role={gate} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SceneStage>
  )
}
