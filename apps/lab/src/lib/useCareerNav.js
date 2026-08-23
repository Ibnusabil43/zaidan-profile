import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Which checkpoint is active, and how the visitor got there.
 *
 * Three ways in — scroll, keyboard, click — and each must work on its own
 * (PRD §9.6). They all funnel through one `select(index, source)` so the three
 * paths cannot drift apart.
 *
 * `source` is not bookkeeping, it decides who announces. Keyboard and click move
 * DOM focus, and the browser already announces a newly focused tab; writing to the
 * live region as well makes a screen reader say it twice. Scroll is the only path
 * that changes the active checkpoint without moving focus, so it is the only one
 * that writes.
 */
export function useCareerNav(count, { onFocusRequest } = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const lastAnnounced = useRef(-1)
  const settleTimer = useRef(0)

  const select = useCallback(
    (next, source, describe) => {
      if (next < 0 || next >= count) return
      setActiveIndex((current) => {
        if (current === next) return current

        if (source === 'scroll') {
          // Announce only once the scrolling settles. Flicking past three
          // checkpoints to land on a fourth should say the fourth, not queue all
          // four — `polite` queues rather than interrupts, so without this the
          // reader hears stale positions long after the page stopped moving.
          clearTimeout(settleTimer.current)
          settleTimer.current = setTimeout(() => {
            if (lastAnnounced.current === next) return
            lastAnnounced.current = next
            setAnnouncement(describe(next))
          }, 150)
        } else {
          // Focus moves, so the browser announces. Keep the region in step
          // without speaking, or the next scroll-driven change may look
          // unchanged and stay silent.
          clearTimeout(settleTimer.current)
          lastAnnounced.current = next
          setAnnouncement('')
          onFocusRequest?.(next)
        }

        return next
      })
    },
    [count, onFocusRequest]
  )

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  /**
   * APG tab keys. Arrow up/down are deliberately NOT handled: they scroll the
   * page, and scrolling is one of the three ways through the map. Swallowing them
   * would break an input mode to serve the widget.
   */
  const onKeyDown = useCallback(
    (event, describe) => {
      const last = count - 1
      let next = null

      switch (event.key) {
        case 'ArrowRight':
          next = activeIndex === last ? 0 : activeIndex + 1
          break
        case 'ArrowLeft':
          next = activeIndex === 0 ? last : activeIndex - 1
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = last
          break
        case 'Enter':
        case ' ':
          // Activation already followed focus. Still swallow Space so it does not
          // scroll the page out from under someone who pressed it to activate.
          event.preventDefault()
          return
        default:
          return
      }

      event.preventDefault()
      select(next, 'keyboard', describe)
    },
    [activeIndex, count, select]
  )

  return { activeIndex, announcement, select, onKeyDown }
}

/** What the live region says. Position first — that is what scrolling hides. */
export function describeCheckpoint(checkpoints, index) {
  const cp = checkpoints[index]
  if (!cp) return ''
  const role = cp.roles[0]
  return `Checkpoint ${index + 1} of ${checkpoints.length}. ${role.title}, ${cp.label}. ${role.period}.`
}
