import { useEffect, useRef, useState } from 'react'

/**
 * Scroll position along the career path, as 0–1.
 *
 * anime.js is an animation engine, not a scroll library, so this piece is ours to
 * write. Keeping it this small is the whole reason we do not need GSAP
 * ScrollTrigger — see CLAUDE.md > Tech stack. Resist growing it: if this file
 * starts wanting pinning, snapping and callbacks, that is the moment to
 * reconsider the dependency rather than reimplement one badly.
 *
 * The reader scrolls through a tall track element while the map sits stuck to the
 * viewport inside it. Progress is how far through that track they are.
 */

/**
 * Pure so it can be checked without a DOM.
 *
 * `trackTop` is the track's distance from the top of the document, not from the
 * viewport — a viewport-relative value flips sign as you scroll past and makes
 * the arithmetic much easier to get subtly wrong.
 */
export function progressFor({ scrollY, trackTop, trackHeight, viewportHeight }) {
  const travel = trackHeight - viewportHeight

  // A track no taller than the viewport has nothing to scroll through. Report the
  // start rather than dividing by zero and handing NaN to an animation.
  if (travel <= 0) return 0

  const scrolled = scrollY - trackTop
  return Math.min(1, Math.max(0, scrolled / travel))
}

export function useProgress(trackRef) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const rect = track.getBoundingClientRect()
      setProgress(
        progressFor({
          scrollY: window.scrollY,
          trackTop: rect.top + window.scrollY,
          trackHeight: rect.height,
          viewportHeight: window.innerHeight,
        })
      )
    }

    // Scroll fires far more often than the screen repaints; coalescing to one
    // measurement per frame keeps this off the critical path.
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [trackRef])

  return progress
}

/**
 * Which checkpoint a progress value lands on, and how far into the leg it is.
 * Checkpoints sit at evenly spaced progress values, first at 0 and last at 1.
 */
export function checkpointAt(progress, count) {
  if (count <= 1) return 0
  return Math.min(count - 1, Math.round(progress * (count - 1)))
}
