import { useEffect, useState } from 'react'

/**
 * Dark mode: OS preference by default, overridable and persisted — same shape
 * as useFlatMode.js (live matchMedia + localStorage override layered on top).
 * Applied via an `html.dark` class rather than per-component `dark:` classes:
 * every color in this app already routes through the `--d-*` custom
 * properties in index.css, so overriding those once under `.dark` reaches
 * every component that reads them, which is the same end result CLAUDE.md's
 * "dark: variant written alongside" rule is after, just via this app's own
 * variable-indirection instead of apps/main's utility classes.
 */
const STORAGE_KEY = 'lab3d-dark-mode'
const QUERY = '(prefers-color-scheme: dark)'

function readStoredPreference() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === null ? null : raw === 'true'
  } catch {
    return null
  }
}

export function useTheme() {
  const [osDark, setOsDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )
  const [manualOverride, setManualOverride] = useState(readStoredPreference)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setOsDark(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const dark = manualOverride ?? osDark

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const setDark = (value) => {
    setManualOverride(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // Nothing to persist to; the in-memory override for this session still works.
    }
  }

  return [dark, setDark]
}
