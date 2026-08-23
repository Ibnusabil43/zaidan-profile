import { experience, profile } from '@zaidan/data'
import { buildTimeline } from './lib/timeline'
import CareerMap from './components/CareerMap'
import StaticTimeline from './components/StaticTimeline'

const checkpoints = buildTimeline(experience)

export default function App() {
  return (
    <div className="min-h-screen bg-ink-0 text-ink-950">
      <header className="mx-auto max-w-3xl px-6 pt-20 pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500">
          Career map · {checkpoints[0].startYear}–now
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[0.95] tracking-tight">
          Where I have
          <br />
          <span className="text-ink-400">been working.</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-600">
          {checkpoints.length} stops between {checkpoints[0].startYear} and now, drawn from the same
          record as the CV.
        </p>
        <a
          href="#timeline"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-widest text-ink-500 underline decoration-ink-300 underline-offset-4 hover:text-ink-950"
        >
          Skip the map, just read it
        </a>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-ink-400">
          {profile.status}
        </p>
      </header>

      <CareerMap checkpoints={checkpoints} />
      <StaticTimeline checkpoints={checkpoints} />
    </div>
  )
}
