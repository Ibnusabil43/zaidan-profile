/**
 * `user@host: path`, updates live with cwd — the cheapest single signal that
 * this is a session into another machine, not a chat widget (lab-term.md §2.2).
 *
 * Below `lg` the sidebar becomes a drawer (§2.2 — that breakpoint was
 * synced here from "md" during TERM-2, matching the 3-pane workspace spec
 * this now sits inside), so this bar also carries the drawer toggle on
 * narrow screens. `lg:hidden` rather than a separate mobile component: it's
 * one button, not worth a second render path.
 */
export default function TitleBar({ cwd, onToggleSidebar }) {
  const displayPath = cwd === '' ? '~' : `~/${cwd}`
  return (
    <div
      className="flex h-9 items-center gap-2 border-b px-4 font-mono text-xs"
      style={{ backgroundColor: 'var(--t-panel)', borderColor: 'rgba(148, 163, 184, 0.15)', color: 'var(--t-muted)' }}
    >
      <span aria-hidden="true" className="hidden gap-1.5 lg:flex">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-err)', opacity: 0.6 }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-hint)', opacity: 0.6 }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--t-ok)', opacity: 0.6 }} />
      </span>
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle file tree"
        className="flex h-9 w-9 shrink-0 items-center justify-center text-sm lg:hidden"
        style={{ color: 'var(--t-fg)' }}
      >
        ☰
      </button>
      <span className="truncate">
        zaidan@portfolio: <span style={{ color: 'var(--t-fg)' }}>{displayPath}</span>
      </span>
    </div>
  )
}
