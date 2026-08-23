import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import { education, profile } from '../../data/portfolio'

const STATS = [
  { value: '3', label: 'Systems live in production' },
  { value: '10', label: 'Roles since 2020' },
  { value: '1', label: 'Published paper (ICoDSA)' },
  { value: '3.83', label: 'GPA, cum laude' },
]

export default function About() {
  const edu = education[0]
  return (
    <section id="about" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" title="About" label="Background" />

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Portrait */}
          <Reveal className="md:col-span-4">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden border border-ink-200 grayscale dark:border-ink-800">
                <img
                  src="/images/pasfoto.jpg"
                  alt="Zaidan Ibnusabil Iryanto"
                  className="h-full w-full object-cover transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-400">
                Zaidan I. Iryanto — 2025
              </p>
            </div>
          </Reveal>

          {/* Copy + education */}
          <div className="md:col-span-8">
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-700 text-balance sm:text-xl dark:text-ink-200">
                Backend engineer working on{' '}
                <span className="text-ink-950 underline decoration-ink-300 underline-offset-4 dark:text-ink-50 dark:decoration-ink-700">
                  core banking
                </span>{' '}
                at BRI, and building{' '}
                <span className="text-ink-950 underline decoration-ink-300 underline-offset-4 dark:text-ink-50 dark:decoration-ink-700">
                  internal systems
                </span>{' '}
                end to end outside it. I like the unglamorous half of the work: the compile step
                nobody automated, the scoring pass still done by hand, and turning it into
                something the team stops thinking about.
              </p>
            </Reveal>

            <Reveal delay={0.05} className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-4 dark:border-ink-800 dark:bg-ink-800">
              {STATS.map((s) => (
                <div key={s.label} className="bg-ink-0 p-5 dark:bg-ink-950">
                  <div className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl dark:text-ink-50">
                    {s.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-400 dark:text-ink-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink-200 pt-6 dark:border-ink-800">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-50">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{edu.institution}</p>
                </div>
                <span className="font-mono text-xs text-ink-400 dark:text-ink-400">{edu.period}</span>
              </div>
              <ul className="mt-5 space-y-2">
                {edu.details.slice(0, 4).map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
                    <span className="mt-2 h-px w-4 flex-none bg-ink-300 dark:bg-ink-700" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
