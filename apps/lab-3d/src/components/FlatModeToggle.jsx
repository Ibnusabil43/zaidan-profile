/**
 * The always-visible switch between the 3D rig and the flat reading mode
 * (lab-3d.md §4.3). Not a hidden setting — parallax and rotation are real
 * vestibular triggers for some visitors, so this needs to be reachable before
 * any scene has scrolled past.
 *
 * Fixed position, high in the DOM (App.jsx renders it before <main>) so it is
 * one of the first focusable elements a keyboard user reaches.
 */
export default function FlatModeToggle({ flat, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!flat)}
      aria-pressed={flat}
      className="fixed right-4 top-4 z-50 rounded-full border border-[var(--d-line)] bg-[var(--d-plane)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--d-muted)] shadow-sm transition-colors hover:border-[var(--d-accent)] hover:text-[var(--d-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-accent)]"
    >
      {flat ? 'Enable 3D' : 'Flat mode'}
    </button>
  )
}
