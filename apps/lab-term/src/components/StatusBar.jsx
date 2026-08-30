/**
 * Path only — no progress meter, no "explored X/38" counter. Terminal Lab
 * deliberately has no game layer above the shell (PRD FR-23, lab-term.md
 * §1.1); the status bar is the slot most tempting to smuggle one into, so
 * it stays a plain fact, not a score.
 */
export default function StatusBar({ cwd }) {
  const displayPath = cwd === '' ? '~/zaidan' : `~/zaidan/${cwd}`
  return (
    <div
      className="flex h-6 items-center px-4 font-mono text-[11px]"
      style={{ backgroundColor: 'var(--t-panel)', color: 'var(--t-dim)' }}
    >
      {displayPath}
    </div>
  )
}
