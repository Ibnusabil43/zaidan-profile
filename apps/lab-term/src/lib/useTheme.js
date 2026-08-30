import { useEffect, useState } from 'react'

const STORAGE_KEY = 'lab-term-theme'

function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === 'light' || raw === 'dark' ? raw : null
  } catch {
    return null
  }
}

/**
 * Light/dark toggle. Defaults to **dark**, not the OS preference — unlike
 * apps/main (defaults light) or apps/lab-3d's flat-mode (follows
 * prefers-reduced-motion, an accessibility signal). This lab's whole visual
 * identity was dark-only until light mode was added as an explicit opt-in
 * (lab-term.md §4, DESIGN §5.4); defaulting to dark keeps that identity the
 * first thing a visitor sees, with light as something they reach for, not
 * something the OS silently picks for them.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => readStored() ?? 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // No persistence available — session still works, just resets next visit.
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme, setTheme }
}
