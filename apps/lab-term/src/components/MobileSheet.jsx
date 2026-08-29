import { useState } from 'react'

// Fixed heights, not a continuous drag — three deliberate stops
// (lab-term.md §2.2: "sheet punya tiga posisi: bar tipis · setengah ·
// penuh"), reached by tapping the handle. A real drag gesture would also
// satisfy the spec, but a tap-cycle is simpler, works identically with a
// keyboard or switch device, and needs no extra a11y wiring — chosen
// deliberately over drag rather than a scope cut; see TERM-3's checkpoint.
const POSITIONS = ['peek', 'half', 'full']
const HEIGHTS = { peek: '44px', half: '45vh', full: '90vh' }
const NEXT = { peek: 'half', half: 'full', full: 'peek' }

export default function MobileSheet({ children }) {
  const [position, setPosition] = useState('peek')

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col border-t"
      style={{ height: HEIGHTS[position], borderColor: 'rgba(148, 163, 184, 0.15)', backgroundColor: 'var(--t-bg)' }}
    >
      <button
        type="button"
        onClick={() => setPosition(NEXT[position])}
        aria-label={`Terminal, ${position === 'peek' ? 'collapsed' : position === 'half' ? 'half open' : 'fully open'} — tap to resize`}
        className="flex h-11 shrink-0 items-center justify-center"
        style={{ backgroundColor: 'var(--t-panel)' }}
      >
        <span aria-hidden="true" className="h-1 w-10 rounded-full" style={{ backgroundColor: 'var(--t-dim)' }} />
      </button>
      {position !== 'peek' && <div className="min-h-0 flex-1">{children}</div>}
    </div>
  )
}
