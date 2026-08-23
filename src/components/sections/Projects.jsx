import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import ProjectCard from '../ui/ProjectCard'
import Reveal from '../ui/Reveal'
import FillerCell, { fillerCount } from '../ui/FillerCell'
import { projects, earlierWork } from '../../data/portfolio'

const GRID =
  'grid gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-2 dark:border-ink-800 dark:bg-ink-800'

function SubHeading({ children, label }) {
  return (
    <Reveal className="mt-20 mb-10 flex items-baseline gap-4 border-b border-ink-200 pb-4 dark:border-ink-800">
      <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950 dark:text-ink-50">
        {children}
      </h3>
      {label && (
        <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-widest text-ink-400 sm:block dark:text-ink-400">
          {label}
        </span>
      )}
    </Reveal>
  )
}

export default function Projects() {
  const [showEarlier, setShowEarlier] = useState(false)
  const tier1 = projects.filter((p) => p.tier === 1)
  const tier2 = projects.filter((p) => p.tier === 2)

  return (
    <section id="projects" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" title="Selected Work" label={`${projects.length} projects`} />

        <div className={GRID}>
          {tier1.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {Array.from({ length: fillerCount(tier1.length, 2) }).map((_, i) => (
            <FillerCell key={`fill-1-${i}`} label="github.com/ibnusabil43" />
          ))}
        </div>

        <SubHeading label={`${tier2.length} projects`}>Also shipped</SubHeading>

        <div className={GRID}>
          {tier2.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={tier1.length + idx} compact />
          ))}
          {Array.from({ length: fillerCount(tier2.length, 2) }).map((_, i) => (
            <FillerCell key={`fill-2-${i}`} label="github.com/ibnusabil43" />
          ))}
        </div>

        <SubHeading label={`${earlierWork.length} projects`}>Earlier work</SubHeading>

        <Reveal>
          <p className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">
            Student and side projects from 2023–2025, kept for reference rather than as a
            reflection of what I build now.
          </p>
        </Reveal>

        {!showEarlier ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowEarlier(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-300 px-6 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-ink-0 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ink-50 dark:hover:bg-ink-50 dark:hover:text-ink-950"
            >
              Show {earlierWork.length} earlier projects
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </button>
          </div>
        ) : (
          <ul className="border-t border-ink-200 dark:border-ink-800">
            {earlierWork.map((w, idx) => (
              <Reveal key={w.title} as="li" delay={Math.min(idx * 0.03, 0.15)}>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-ink-200 py-5 sm:gap-8 dark:border-ink-800"
                >
                  <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{w.year}</span>
                  <span>
                    <span className="block font-display text-base font-semibold text-ink-950 transition-colors group-hover:text-ink-600 dark:text-ink-50 dark:group-hover:text-ink-300">
                      {w.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-500 dark:text-ink-300">
                      {w.note}
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden whitespace-nowrap font-mono text-[11px] text-ink-400 sm:block dark:text-ink-500">
                      {w.tech}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 flex-none text-ink-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-ink-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
