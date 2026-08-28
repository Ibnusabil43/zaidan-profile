import { useEffect, useRef, useState } from 'react'

/**
 * 0..1 progress through a tall "track" element, for scroll-scrubbed scenes.
 *
 * The math is a pure function on purpose so it can be sanity-checked without a
 * DOM. `trackTop` is measured relative to the document, not the viewport — a
 * viewport-relative value flips sign as you scroll past, which is an easy way
 * to get this subtly wrong.
 */
export function progressFor({ scrollY, trackTop, trackHeight, viewportHeight }) {
  const travel = trackHeight - viewportHeight
  // A track no taller than the viewport has nothing to scroll through — report
  // the start rather than dividing by zero and handing NaN to an animation.
  if (travel <= 0) return 0
  return Math.min(1, Math.max(0, (scrollY - trackTop) / travel))
}

export function useScrollProgress() {
  const trackRef = useRef(null)
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
  }, [])

  return [trackRef, progress]
}
