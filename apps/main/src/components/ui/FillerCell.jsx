/**
 * Decorative cell used to complete a hairline grid row so trailing
 * gaps read as intentional negative space, not an empty box.
 */
export default function FillerCell({ label = '' }) {
  return (
    <div className="relative hidden items-end overflow-hidden bg-ink-0 p-6 lg:flex dark:bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.6] dark:opacity-[0.5]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, color-mix(in srgb, currentColor 6%, transparent) 0 1px, transparent 1px 12px)',
        }}
      />
      <span className="relative font-mono text-[11px] uppercase tracking-widest text-ink-300 dark:text-ink-700">
        {label}
      </span>
    </div>
  )
}

/** Number of filler cells needed to fill the last row of an N-column grid. */
export function fillerCount(itemCount, cols = 3) {
  return (cols - (itemCount % cols)) % cols
}
