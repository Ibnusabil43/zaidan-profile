import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'lab-term-terminal-size'
const DEFAULT_HEIGHT_PERCENT = 40
const MIN_HEIGHT_PERCENT = 15
const MAX_HEIGHT_PERCENT = 85
const MINIMIZED_PX = 40

function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return typeof parsed.heightPercent === 'number' ? parsed : null
  } catch {
    return null
  }
}

/**
 * Desktop terminal window state — resize by dragging the divider, minimize
 * to a thin bar, maximize over the preview (lab-term.md §2.2). Only the
 * *size* persists to localStorage ("pengunjung yang ngecilin terminal nggak
 * mau nemu dia gede lagi tiap pindah file"); `cwd` and command history stay
 * in memory only — those are progress, and §1.1 refuses to track progress.
 */
export function useTerminalSize() {
  const [heightPercent, setHeightPercentState] = useState(() => readStored()?.heightPercent ?? DEFAULT_HEIGHT_PERCENT)
  const [state, setStateRaw] = useState(() => readStored()?.state ?? 'normal')
  const containerRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ heightPercent, state }))
    } catch {
      // No persistence available (private browsing etc.) — session still works in memory.
    }
  }, [heightPercent, state])

  function setHeightPercent(next) {
    setHeightPercentState(Math.min(MAX_HEIGHT_PERCENT, Math.max(MIN_HEIGHT_PERCENT, next)))
  }

  function toggleMinimized() {
    setStateRaw((s) => (s === 'minimized' ? 'normal' : 'minimized'))
  }
  function toggleMaximized() {
    setStateRaw((s) => (s === 'maximized' ? 'normal' : 'maximized'))
  }

  function onDividerPointerDown(e) {
    if (state !== 'normal') return
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onDividerPointerMove(e) {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const fromBottom = rect.bottom - e.clientY
    setHeightPercent((fromBottom / rect.height) * 100)
  }

  function onDividerPointerUp() {
    dragging.current = false
  }

  function onDividerKeyDown(e) {
    if (state !== 'normal') return
    const step = 4
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHeightPercent(heightPercent + step)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHeightPercent(heightPercent - step)
    }
  }

  const resolvedHeight = state === 'minimized' ? `${MINIMIZED_PX}px` : state === 'maximized' ? '100%' : `${heightPercent}%`

  return {
    containerRef,
    heightPercent,
    state,
    resolvedHeight,
    toggleMinimized,
    toggleMaximized,
    dividerHandlers: {
      onPointerDown: onDividerPointerDown,
      onPointerMove: onDividerPointerMove,
      onPointerUp: onDividerPointerUp,
      onKeyDown: onDividerKeyDown,
    },
  }
}
