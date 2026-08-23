import { useEffect, useState } from 'react'

/**
 * Whether the visitor has asked for reduced motion.
 *
 * The professional site gets this from Framer Motion's `useReducedMotion`. The
 * lab has no Framer Motion (CLAUDE.md > Tech stack keeps the two motion
 * libraries apart), so it needs its own — but it must behave identically, since
 * PRO-B4 already set the pattern and a second, subtly different approach is
 * exactly what CLAUDE.md warns against.
 *
 * Note what reduced motion means here, per DESIGN.md §6: transitions stop,
 * the relationship between scrolling and position does NOT. Scrolling still
 * moves the traveller; it just arrives instead of travelling.
 */
const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  // Start from the real value rather than `false`, so the first paint is already
  // correct. Guarded for the build-time render, where there is no window.
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
