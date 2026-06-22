import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import { experience } from '../../data/portfolio'

function ExperienceItem({ job, idx }) {
  const [open, setOpen] = useState(idx === 0)

  return (
    <Reveal delay={Math.min(idx * 0.04, 0.2)}>
      <div className="group relative border-b border-ink-200 dark:border-ink-800">
        <button
          onClick={() => setOpen((o) => !o)}
          className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 py-7 text-left sm:gap-8"
        >
          <span className="font-mono text-xs text-ink-400 dark:text-ink-600">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span>
            <span className="block font-display text-lg font-semibold text-ink-950 transition-colors group-hover:text-ink-600 sm:text-xl dark:text-ink-50 dark:group-hover:text-ink-300">
              {job.title}
            </span>
            <span className="mt-1 block text-sm text-ink-500 dark:text-ink-400">
              {job.company}
              {job.location && <span className="text-ink-400 dark:text-ink-600"> — {job.location}</span>}
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden whitespace-nowrap font-mono text-xs text-ink-400 sm:block dark:text-ink-500">
              {job.period}
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 flex-none text-ink-400 transition-transform duration-300 dark:text-ink-500 ${open ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>

        <div
          className={`grid transition-all duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2.5 pb-7 pl-[calc(1.5rem+1ch)] sm:pl-[calc(2rem+2ch)]">
              <li className="mb-3 font-mono text-xs text-ink-400 sm:hidden dark:text-ink-500">{job.period}</li>
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  <span className="mt-2 h-px w-3 flex-none bg-ink-300 dark:bg-ink-700" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" title="Experience" label={`${experience.length} positions`} />
        <div className="border-t border-ink-200 dark:border-ink-800">
          {experience.map((job, idx) => (
            <ExperienceItem key={`${job.title}-${idx}`} job={job} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
