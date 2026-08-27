import { useReducedMotion } from '../lib/useReducedMotion'

/**
 * The chassis status strip (DESIGN.md §5.4/§4.3): mono, uppercase, tracked, a
 * hard `.scanline` texture, and fields whose width never changes while the map
 * is being used — position ("03/07") and the active checkpoint's label.
 *
 * Purely decorative from a screen-reader's point of view: the real
 * announcement already happens through the live region in App.jsx (one region
 * that speaks is correct; a second one describing the same change is a screen
 * reader saying it twice), so the whole strip is `aria-hidden`.
 *
 * The one animation here — and the only infinite one in the whole system
 * (DESIGN.md §5.4/§6) — is a hard-stepped `▌` blink. `useReducedMotion` swaps
 * it for a static cursor; the CSS catch-all in index.css is the same rule's
 * second, JS-independent floor.
 */
export default function HUD({ index, count, label }) {
  const reduceMotion = useReducedMotion()
  const position = `${String(index + 1).padStart(2, '0')}/${String(count).padStart(2, '0')}`

  return (
    <div
      aria-hidden="true"
      className="scanline sticky top-0 z-[var(--z-hud)] flex items-center gap-4 border-b-2 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em]"
      style={{
        backgroundColor: 'var(--lab-raised)',
        borderColor: 'var(--color-ink-950)',
        color: 'var(--lab-ink-muted)',
        // Hard offset shadow, zero blur (DESIGN.md §4.3/§5.4) — 3px here, the
        // HUD's own value, distinct from the 4px `--shadow-hard` cards use.
        boxShadow: '0 3px 0 0 var(--color-ink-950)',
      }}
    >
      <span
        className={reduceMotion ? 'opacity-100' : 'hud-cursor'}
        style={{ color: 'var(--lab-accent-line)' }}
      >
        ▌
      </span>

      {/* Width locked to the longest possible value ("99/99") so the field
          never resizes while the map is scrubbed — DESIGN.md §5.4. */}
      <span
        className="inline-block min-w-[4ch] font-bold tabular-nums"
        style={{ color: 'var(--lab-ink)' }}
      >
        {position}
      </span>

      <span className="truncate" style={{ color: 'var(--lab-ink)' }}>
        {label}
      </span>
    </div>
  )
}
