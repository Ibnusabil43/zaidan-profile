import { useEffect, useRef, useState } from 'react'
import { complete } from '../lib/completion.js'
import { getSuggestions } from '../lib/suggestions.js'
import { findNode } from '../lib/filesystem.js'
import { useReducedMotion } from '../lib/useReducedMotion.js'

const TONE_COLOR = {
  fg: 'var(--t-fg)',
  dir: 'var(--t-dir)',
  err: 'var(--t-err)',
  ok: 'var(--t-ok)',
  hint: 'var(--t-hint)',
  dim: 'var(--t-dim)',
}

function displayPath(cwd) {
  return cwd === '' ? '~' : `~/${cwd}`
}

/**
 * History + prompt. `cwd`/`history`/`onSubmit` come from useShell (TERM-2) —
 * this component no longer owns the session itself, so the sidebar can drive
 * it too. A real `<input>`, not a fake cursor over a div — that's what gives
 * this native keyboard handling, IME support, and a screen reader announcing
 * it as a textbox for free, instead of reimplementing all of that by hand.
 *
 * Output renders instantly rather than typing itself out character by
 * character. DESIGN.md §6 names "output muncul bertahap" as one of this
 * lab's two allowed motions, but a literal per-character reveal at its
 * documented 30ms/char on a `cat` dump of several hundred characters would
 * take multi-second to display — directly against the read-fast goal this
 * whole project holds everywhere else (PRD P-1, "ini dibaca bukan
 * dikerjain"). Deferred rather than half-built against an unspecified
 * scope — see lab-term-roadmap.md's TERM-1 notes.
 */
export default function Terminal({ root, cwd, history, onSubmit, focusTrigger, onOpenPreview }) {
  const [input, setInput] = useState('')
  const [caretPos, setCaretPos] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(null)
  const [completions, setCompletions] = useState(null)
  const commandLog = useRef([])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  // Re-focuses the input when `focusTrigger` (App.jsx passes `sidebarOpen`)
  // transitions true → false — closing the mobile drawer (via the sidebar's
  // own command, or tapping the backdrop) hands keyboard focus straight
  // back to the prompt instead of leaving it stranded on whatever the
  // backdrop click landed on. Deliberately not on every change: refocusing
  // when the drawer *opens* would yank focus away from someone about to Tab
  // through the sidebar itself. Found by testing the close path for real —
  // without this, closing the drawer silently dropped focus and the next
  // keystrokes went nowhere.
  const wasOpen = useRef(focusTrigger)
  useEffect(() => {
    if (wasOpen.current && !focusTrigger) inputRef.current?.focus()
    wasOpen.current = focusTrigger
  }, [focusTrigger])

  function focusInput() {
    inputRef.current?.focus()
  }

  // The visual cursor block doesn't ride on the real (invisible) caret —
  // `caretColor: transparent` on the input hides it on purpose, since a
  // native caret and this block blinking independently would look like two
  // cursors. Bug found by testing real arrow-key navigation, not caught by
  // reading the code: the block was hardcoded to `input.length`, so
  // Left/Right (and clicking mid-text) moved the real caret but left the
  // visible block stranded at the end. React's `onSelect` prop looked like
  // the fix but doesn't reliably fire for a plain collapsed-caret move (no
  // actual text selected) in this setup — verified directly: a
  // `setSelectionRange` call updates `input.selectionStart` but never
  // triggers `onSelect`. `document`'s native `selectionchange` event does
  // fire every time, so that's what this listens to instead — scoped to
  // "only while this input is focused" so it doesn't react to selection
  // changes elsewhere on the page (the sidebar, the history pane).
  useEffect(() => {
    function onSelectionChange() {
      if (document.activeElement === inputRef.current) {
        setCaretPos(inputRef.current.selectionStart ?? 0)
      }
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [])

  function submit(raw) {
    const text = raw.trim()
    if (text) commandLog.current = [...commandLog.current, text]
    setHistoryIndex(null)
    setCompletions(null)
    onSubmit(raw)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      submit(input)
      setInput('')
      setCaretPos(0)
      return
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      const result = complete(root, cwd, input)
      if (!result) return
      setInput(result.input)
      setCaretPos(result.input.length)
      setCompletions(result.candidates)
      return
    }
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      setCompletions(null)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandLog.current.length === 0) return
      const nextIndex = historyIndex === null ? commandLog.current.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandLog.current[nextIndex])
      setCaretPos(commandLog.current[nextIndex].length)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === null) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= commandLog.current.length) {
        setHistoryIndex(null)
        setInput('')
        setCaretPos(0)
      } else {
        setHistoryIndex(nextIndex)
        setInput(commandLog.current[nextIndex])
        setCaretPos(commandLog.current[nextIndex].length)
      }
    }
  }

  const cwdNode = findNode(root, cwd)
  const suggestions = cwdNode ? getSuggestions(root, cwd, cwdNode) : []

  return (
    <div className="flex h-full flex-col font-mono text-sm" style={{ color: 'var(--t-fg)' }}>
      <div
        className="flex-1 overflow-y-auto px-4 py-3"
        ref={scrollRef}
        onClick={focusInput}
        aria-live="polite"
        aria-atomic="false"
      >
        {history.map((entry, i) =>
          entry.type === 'command' ? (
            <div key={i} className="flex gap-2">
              <span style={{ color: 'var(--t-accent)' }}>{displayPath(entry.cwd)} $</span>
              <span>{entry.text}</span>
            </div>
          ) : (
            <div key={i}>
              {entry.lines.map((l, j) => (
                <div key={j} style={{ color: TONE_COLOR[l.tone] ?? TONE_COLOR.fg, whiteSpace: 'pre-wrap' }}>
                  {l.text || ' '}
                </div>
              ))}
              {entry.previewable && (
                <button
                  type="button"
                  onClick={() => onOpenPreview(entry.previewable)}
                  className="mt-1 underline underline-offset-2"
                  style={{ color: 'var(--t-accent)' }}
                >
                  [ open in preview ]
                </button>
              )}
            </div>
          )
        )}
      </div>

      <div className="border-t px-4 pt-2" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
        {suggestions.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => submit(s.command)}
                className="rounded border px-2 py-1 text-xs transition-colors"
                style={{ borderColor: 'rgba(148, 163, 184, 0.25)', color: 'var(--t-muted)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {completions && completions.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: 'var(--t-dim)' }}>
            {completions.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pb-3">
          <span style={{ color: 'var(--t-accent)' }}>{displayPath(cwd)} $</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setCaretPos(e.target.selectionStart)
                setCompletions(null)
              }}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent outline-none"
              style={{ color: 'var(--t-fg)', caretColor: 'transparent' }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal command input"
            />
            <span
              aria-hidden="true"
              data-testid="cursor"
              className={reducedMotion ? '' : 'term-cursor'}
              style={{
                position: 'absolute',
                left: `${caretPos}ch`,
                top: 0,
                width: '0.6em',
                height: '1.2em',
                backgroundColor: 'var(--t-fg)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
