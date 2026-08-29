/**
 * Sun/moon glyphs, hand-drawn rather than pulled from an icon library — same
 * "small and self-authored" call as markdown.js (lab-term.md §2.3): two
 * shapes don't earn a dependency. Monoline, `currentColor`, sized to match
 * the hamburger's 9x9 tap target.
 */
function SunIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5z" />
    </svg>
  )
}

/**
 * Mirrors the "Enter" arrow `apps/main`'s LabLink uses to send visitors into
 * a lab (`M5 12h14M13 6l6 6-6 6`) — same shape, flipped, for the trip back.
 */
function ExitIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 10H4M9 5 4 10l5 5" />
    </svg>
  )
}

/**
 * `user@host: path`, updates live with cwd — the cheapest single signal that
 * this is a session into another machine, not a chat widget (lab-term.md §2.2).
 *
 * Below `lg` the sidebar becomes a drawer (§2.2 — that breakpoint was
 * synced here from "md" during TERM-2, matching the 3-pane workspace spec
 * this now sits inside), so this bar also carries the drawer toggle on
 * narrow screens. `lg:hidden` rather than a separate mobile component: it's
 * one button, not worth a second render path.
 *
 * Theme toggle (lab-term.md §4) sits here too, but unlike the drawer button
 * it has no `lg:hidden` — light/dark applies to the whole app regardless of
 * viewport, so it's always visible. Also reachable as a typed command
 * (`theme [dark|light]`, commands.js) — this button and the command drive
 * the exact same `onToggleTheme`/state, neither is a second source of truth.
 *
 * `mainUrl` — the trip back out to the professional site (PRD FR-14, mirrors
 * LabLink in apps/main which sends visitors the other way). Same guard
 * LabLink itself uses: render nothing when the env var isn't set, so this
 * can't ship a dead link before the other app is actually deployed.
 */
export default function TitleBar({ cwd, onToggleSidebar, theme, onToggleTheme, mainUrl }) {
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
      <span className="min-w-0 flex-1 truncate">
        zaidan@portfolio: <span style={{ color: 'var(--t-fg)' }}>{displayPath}</span>
      </span>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex h-9 w-9 shrink-0 items-center justify-center text-sm"
        style={{ color: 'var(--t-fg)' }}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
      {mainUrl && (
        <a
          href={mainUrl}
          aria-label="Back to the main portfolio"
          title="Back to the main portfolio"
          className="flex h-9 w-9 shrink-0 items-center justify-center"
          style={{ color: 'var(--t-fg)' }}
        >
          <ExitIcon />
        </a>
      )}
    </div>
  )
}
