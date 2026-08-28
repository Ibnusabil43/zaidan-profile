import { useEffect, useState } from 'react'

/**
 * Whether the 3D rig should be flattened: either the visitor asked for it
 * explicitly, or the OS-level prefers-reduced-motion says to (lab-3d.md §4.3 —
 * this is a required feature, not a nice-to-have, because parallax and
 * rotation are real vestibular triggers for some visitors).
 *
 * Persisted to localStorage so an explicit toggle survives navigation between
 * scenes. The OS preference is re-checked live via matchMedia, same pattern as
 * apps/main's reduced-motion handling.
 */
const STORAGE_KEY = 'lab3d-flat-mode'
const QUERY = '(prefers-reduced-motion: reduce)'

function readStoredPreference() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === null ? null : raw === 'true'
  } catch {
    // Private browsing / storage disabled — fall back to the OS preference only.
    return null
  }
}

export function useFlatMode() {
  const [osReduced, setOsReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )
  const [manualOverride, setManualOverride] = useState(readStoredPreference)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setOsReduced(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const flat = manualOverride ?? osReduced

  const setFlat = (value) => {
    setManualOverride(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // Nothing to persist to; the in-memory override for this session still works.
    }
  }

  return [flat, setFlat]
}
