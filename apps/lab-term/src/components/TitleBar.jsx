/**
 * `user@host: path`, updates live with cwd — the cheapest single signal that
 * this is a session into another machine, not a chat widget (lab-term.md §2.2).
 */
export default function TitleBar({ cwd }) {
  const displayPath = cwd === '' ? '~' : `~/${cwd}`
  return (
    <div
      className="flex h-9 items-center gap-2 border-b px-4 font-mono text-xs"
      style={{ backgroundColor: 'var(--t-panel)', borderColor: 'rgba(148, 163, 184, 0.15)', color: 'var(--t-muted)' }}
    >
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-err)', opacity: 0.6 }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-hint)', opacity: 0.6 }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-ok)', opacity: 0.6 }} />
      </span>
      <span>
        zaidan@portfolio: <span style={{ color: 'var(--t-fg)' }}>{displayPath}</span>
      </span>
    </div>
  )
}
