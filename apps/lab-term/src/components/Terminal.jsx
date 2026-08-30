import { useEffect, useRef, useState } from 'react'
import { runCommand } from '../lib/commands.js'
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
 * History + prompt. A real `<input>`, not a fake cursor over a div — that's
 * what gives this native keyboard handling, IME support, and a screen
 * reader announcing it as a textbox for free, instead of reimplementing all
 * of that by hand.
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
export default function Terminal({ root, cwd, onCwdChange, initialEntries }) {
  const [history, setHistory] = useState(initialEntries ?? [])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(null)
  const commandLog = useRef([])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  function focusInput() {
    inputRef.current?.focus()
  }

  function submit(raw) {
    const text = raw.trim()
    const entry = { type: 'command', cwd, text }
    const result = runCommand(root, cwd, text)

    if (text) commandLog.current = [...commandLog.current, text]
    setHistoryIndex(null)

    if (result.clearScreen) {
      setHistory([])
    } else {
      setHistory((h) => [...h, entry, { type: 'output', lines: result.lines }])
    }

    if (result.cwd !== cwd) onCwdChange(result.cwd)
    if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener,noreferrer')
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      submit(input)
      setInput('')
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandLog.current.length === 0) return
      const nextIndex = historyIndex === null ? commandLog.current.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandLog.current[nextIndex])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === null) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= commandLog.current.length) {
        setHistoryIndex(null)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(commandLog.current[nextIndex])
      }
    }
  }

  return (
    <div
      className="flex h-full flex-col overflow-y-auto px-4 py-3 font-mono text-sm"
      style={{ color: 'var(--t-fg)' }}
      ref={scrollRef}
      onClick={focusInput}
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
                {l.text || ' '}
              </div>
            ))}
          </div>
        )
      )}

      <div className="flex gap-2 pb-2">
        <span style={{ color: 'var(--t-accent)' }}>{displayPath(cwd)} $</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
              left: `${input.length}ch`,
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
  )
}
