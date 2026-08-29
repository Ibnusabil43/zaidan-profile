import { useState } from 'react'
import { runCommand } from './commands.js'

/**
 * Owns `cwd`, `history`, and `previewPath` — lifted out of Terminal.jsx
 * (TERM-1) so the sidebar can drive the same session (TERM-B2: clicking a
 * file runs `cat`, clicking a folder runs `cd`, exactly as if it had been
 * typed) and so `cat` and the sidebar can both offer "show this in the
 * preview pane" (TERM-C1/C3) through one shared piece of state instead of
 * two independent ones that could disagree about what's open.
 *
 * Deliberately does NOT own `input` or arrow-key history recall — those are
 * about the prompt's own keyboard behavior, not the session, and stay local
 * to Terminal.jsx.
 */
export function useShell(root, initial, mainUrl) {
  const [cwd, setCwd] = useState(initial.cwd)
  const [history, setHistory] = useState(initial.entries ?? [])
  const [previewPath, setPreviewPath] = useState(initial.previewPath ?? null)

  function submit(raw) {
    const text = raw.trim()
    const entry = { type: 'command', cwd, text }
    const result = runCommand(root, cwd, text, mainUrl)

    if (result.clearScreen) {
      setHistory([])
    } else {
      setHistory((h) => [...h, entry, { type: 'output', lines: result.lines, previewable: result.previewable }])
    }

    if (result.cwd !== cwd) setCwd(result.cwd)
    if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener,noreferrer')
    return result
  }

  return { cwd, history, previewPath, setPreviewPath, submit }
}
