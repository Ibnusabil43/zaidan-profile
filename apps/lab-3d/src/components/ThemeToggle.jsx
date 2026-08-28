/**
 * Manual light/dark override, stacked below FlatModeToggle so both
 * always-visible switches stay reachable without overlapping.
 */
export default function ThemeToggle({ dark, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!dark)}
      aria-pressed={dark}
      className="fixed right-4 top-16 z-50 rounded-full border border-[var(--d-line)] bg-[var(--d-plane)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--d-muted)] shadow-sm transition-colors hover:border-[var(--d-accent)] hover:text-[var(--d-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-accent)]"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
