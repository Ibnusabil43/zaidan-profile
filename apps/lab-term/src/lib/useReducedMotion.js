import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Same pattern as apps/lab-3d's useFlatMode/useTheme — live matchMedia, no
 * manual override needed here since Terminal Lab has no toggle UI for it
 * (DESIGN §6's two motions — cursor blink, output reveal — are cheap enough
 * that the OS preference alone is a sufficient guard, unlike 3D Lab's
 * parallax which needs an always-visible manual escape hatch too).
 */
export function useReducedMotion() {
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
