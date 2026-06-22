import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import FillerCell, { fillerCount } from '../ui/FillerCell'
import { skills } from '../../data/portfolio'

export default function Skills() {
  const categories = Object.entries(skills)
  const allSkills = categories.flatMap(([, items]) => items)

  return (
    <section id="skills" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" title="Skills" label="What I work with" />
      </div>

      {/* Full-bleed marquee */}
      <div className="marquee-group relative mb-16 flex overflow-hidden border-y border-ink-200 py-5 dark:border-ink-800">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-0 to-transparent dark:from-ink-950" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-0 to-transparent dark:from-ink-950" />
        <div className="marquee-track flex shrink-0 items-center gap-8 pr-8">
          {[...allSkills, ...allSkills].map((s, i) => (
            <span key={i} className="flex items-center gap-8 font-display text-2xl font-medium text-ink-300 sm:text-3xl dark:text-ink-500">
              {s}
              <span className="text-ink-950 dark:text-ink-50">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-ink-800 dark:bg-ink-800">
          {categories.map(([category, items], idx) => (
            <Reveal
              key={category}
              delay={idx * 0.04}
              className="group bg-ink-0 p-6 transition-colors hover:bg-ink-50 dark:bg-ink-950 dark:hover:bg-ink-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink-950 dark:text-ink-50">
                  {category}
                </h3>
                <span className="font-mono text-[11px] text-ink-400 dark:text-ink-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600 transition-colors group-hover:border-ink-300 dark:border-ink-800 dark:text-ink-200 dark:group-hover:border-ink-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          {Array.from({ length: fillerCount(categories.length) }).map((_, i) => (
            <FillerCell key={`fill-${i}`} label="Always learning" />
          ))}
        </div>
      </div>
    </section>
  )
}
