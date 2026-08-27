import { useCallback, useEffect, useMemo, useRef } from 'react'
import { experience, profile } from '@zaidan/data'
import { buildTimeline } from './lib/timeline'
import { useProgress, checkpointAt } from './lib/useProgress'
import { useReducedMotion } from './lib/useReducedMotion'
import { useCareerNav, describeCheckpoint } from './lib/useCareerNav'
import { canvasSize } from './lib/path'
import CareerMap from './components/CareerMap'
import CheckpointPanel from './components/CheckpointPanel'
import StaticTimeline from './components/StaticTimeline'
import HUD from './components/HUD'

const checkpoints = buildTimeline(experience)

export default function App() {
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const progress = useProgress(trackRef)
  const reduceMotion = useReducedMotion()

  const tabRefs = useMemo(
    () => checkpoints.map(() => ({ current: null })),
    []
  )

  const focusTab = useCallback((index) => tabRefs[index]?.current?.focus(), [tabRefs])
  const { activeIndex, announcement, select, onKeyDown } = useCareerNav(checkpoints.length, {
    onFocusRequest: focusTab,
  })

  const describe = useCallback((i) => describeCheckpoint(checkpoints, i), [])

  // Scroll is one of the three ways through the map, and the only one that does
  // not move focus.
  useEffect(() => {
    select(checkpointAt(progress, checkpoints.length), 'scroll', describe)
  }, [progress, select, describe])

  // Clicking or arrowing to a checkpoint scrolls the page to it, so all three
  // input modes leave the reader in the same place. Instant when reduced motion
  // is asked for; the mapping itself is untouched either way.
  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current
      if (!track) return
      const travel = track.offsetHeight - window.innerHeight
      const target =
        track.offsetTop + (travel * index) / Math.max(1, checkpoints.length - 1)
      window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    [reduceMotion]
  )

  const handleSelect = useCallback(
    (index, source) => {
      select(index, source, describe)
      scrollToIndex(index)
    },
    [select, describe, scrollToIndex]
  )

  const handleKeyDown = useCallback(
    (event) => {
      onKeyDown(event, describe)
      if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        const last = checkpoints.length - 1
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : event.key === 'ArrowRight'
                ? activeIndex === last
                  ? 0
                  : activeIndex + 1
                : activeIndex === 0
                  ? last
                  : activeIndex - 1
        scrollToIndex(next)
      }
    },
    [onKeyDown, describe, activeIndex, scrollToIndex]
  )

  // Slide the map so the traveller stays on screen. The map is wider than any
  // viewport by design; this is what "following" means here.
  const { width: mapWidth } = canvasSize(checkpoints.length)
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const overflow = Math.max(0, mapWidth - viewport.clientWidth)
    viewport.scrollLeft = overflow * progress
  }, [progress, mapWidth])

  const active = checkpoints[activeIndex]

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--lab-surface)', color: 'var(--lab-ink)' }}
    >
      <HUD index={activeIndex} count={checkpoints.length} label={active.label} />

      <header className="mx-auto max-w-3xl px-6 pt-20 pb-10">
        <p
          className="font-mono text-xs uppercase tracking-[0.25em]"
          style={{ color: 'var(--lab-ink-muted)' }}
        >
          Career map · {checkpoints[0].startYear}–now
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[0.95] tracking-tight">
          Where I have
          <br />
          <span style={{ color: 'var(--lab-ink-dim)' }}>been working.</span>
        </h1>
        <p
          className="mt-6 max-w-xl text-sm leading-relaxed"
          style={{ color: 'var(--lab-ink-muted)' }}
        >
          {checkpoints.length} stops between {checkpoints[0].startYear} and now, drawn from the same
          record as the CV. Scroll, use the arrow keys, or click a stop.
        </p>
        <a
          href="#timeline"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.12em] underline underline-offset-4 hover:text-[var(--lab-ink)]"
          style={{ color: 'var(--lab-ink-muted)', textDecorationColor: 'var(--lab-ink-dim)' }}
        >
          Skip the map, just read it
        </a>
        <p
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--lab-ink-dim)' }}
        >
          {profile.status}
        </p>
      </header>

      {/* Present from first paint and empty, so the first change is announced. */}
      <div role="status" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Tall track: scrolling through it is what moves the traveller. Hidden
          below md, where the vertical timeline is the whole experience. */}
      <section
        ref={trackRef}
        aria-hidden="true"
        className="hidden md:block"
        style={{ height: `${checkpoints.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div ref={viewportRef} className="overflow-hidden">
            <CareerMap
              checkpoints={checkpoints}
              activeIndex={activeIndex}
              progress={progress}
              onSelect={handleSelect}
              onKeyDown={handleKeyDown}
              tabRefs={tabRefs}
            />
          </div>

          <div
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            tabIndex={0}
            className="mx-auto mt-10 max-h-[40vh] w-full max-w-3xl overflow-y-auto px-6"
          >
            <CheckpointPanel checkpoint={active} status="active" />
          </div>
        </div>
      </section>

      <StaticTimeline checkpoints={checkpoints} />
    </div>
  )
}
