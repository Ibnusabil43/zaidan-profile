import { useState } from 'react'
import { runCommand } from './commands.js'

/**
 * Owns `cwd` and `history` — lifted out of Terminal.jsx (TERM-1) so the
 * sidebar can drive the same session (TERM-B2: clicking a file runs `cat`,
 * clicking a folder runs `cd`, exactly as if it had been typed). One
 * `submit()`, two callers.
 *
 * Deliberately does NOT own `input` or arrow-key history recall — those are
 * about the prompt's own keyboard behavior, not the session, and stay local
 * to Terminal.jsx.
 */
export function useShell(root, initial) {
  const [cwd, setCwd] = useState(initial.cwd)
  const [history, setHistory] = useState(initial.entries ?? [])

  function submit(raw) {
    const text = raw.trim()
    const entry = { type: 'command', cwd, text }
    const result = runCommand(root, cwd, text)

    if (result.clearScreen) {
      setHistory([])
    } else {
      setHistory((h) => [...h, entry, { type: 'output', lines: result.lines }])
    }

    if (result.cwd !== cwd) setCwd(result.cwd)
    if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener,noreferrer')
    return result
  }

  return { cwd, history, submit }
}
