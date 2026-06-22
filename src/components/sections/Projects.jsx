import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import ProjectCard from '../ui/ProjectCard'
import FillerCell, { fillerCount } from '../ui/FillerCell'
import { projects } from '../../data/portfolio'

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const featured = projects.filter((p) => p.featured)
  const visible = showAll ? projects : featured

  return (
    <section id="projects" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" title="Selected Work" label={`${projects.length} projects`} />

        <div className="grid gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-ink-800 dark:bg-ink-800">
          {visible.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {Array.from({ length: fillerCount(visible.length) }).map((_, i) => (
            <FillerCell key={`fill-${i}`} label="github.com/ibnusabil43" />
          ))}
        </div>

        {!showAll && projects.length > featured.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-300 px-6 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-ink-0 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ink-50 dark:hover:bg-ink-50 dark:hover:text-ink-950"
            >
              Show all {projects.length} projects
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
