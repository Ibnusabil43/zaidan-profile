import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import { achievements } from '../../data/portfolio'

function fillerCount2(n) {
  return (2 - (n % 2)) % 2
}

export default function Achievements() {
  return (
    <section id="achievements" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="05" title="Achievements" label="Honors & recognition" />

        <div className="grid gap-px overflow-hidden border border-ink-200 bg-ink-200 md:grid-cols-2 dark:border-ink-800 dark:bg-ink-800">
          {achievements.map((a, idx) => (
            <Reveal
              key={idx}
              delay={Math.min(idx * 0.04, 0.2)}
              className="group flex flex-col bg-ink-0 p-7 transition-colors hover:bg-ink-50 dark:bg-ink-950 dark:hover:bg-ink-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-ink-200 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:border-ink-800 dark:text-ink-400">
                  {a.category}
                </span>
                <span className="font-display text-2xl font-semibold text-ink-200 transition-colors group-hover:text-ink-950 dark:text-ink-800 dark:group-hover:text-ink-50">
                  {a.year}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold leading-snug text-ink-950 dark:text-ink-50">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {a.description}
              </p>
              <p className="mt-4 border-t border-ink-200 pt-3 font-mono text-[11px] text-ink-400 dark:border-ink-800 dark:text-ink-500">
                {a.institution}
              </p>
            </Reveal>
          ))}
          {fillerCount2(achievements.length) === 1 && (
            <div className="relative hidden overflow-hidden bg-ink-0 p-7 md:flex md:items-end dark:bg-ink-950">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.6] dark:opacity-[0.5]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, color-mix(in srgb, currentColor 6%, transparent) 0 1px, transparent 1px 12px)',
                }}
              />
              <span className="relative font-mono text-[11px] uppercase tracking-widest text-ink-300 dark:text-ink-700">
                More to come
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
