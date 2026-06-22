import Reveal from './Reveal'

export default function ProjectCard({ project, idx, featured = false }) {
  return (
    <Reveal
      delay={Math.min(idx * 0.05, 0.25)}
      className={featured ? 'sm:col-span-2 lg:col-span-1' : ''}
    >
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-full flex-col justify-between overflow-hidden border border-ink-200 bg-ink-0 p-7 transition-colors duration-300 hover:bg-ink-950 dark:border-ink-800 dark:bg-ink-950 dark:hover:bg-ink-50"
      >
        <div>
          <div className="mb-6 flex items-start justify-between">
            <span className="font-mono text-xs text-ink-400 transition-colors group-hover:text-ink-400 dark:text-ink-500 dark:group-hover:text-ink-500">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="flex items-center gap-2">
              {project.featured && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 transition-colors group-hover:text-ink-400 dark:text-ink-500 dark:group-hover:text-ink-500">
                  Featured
                </span>
              )}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-ink-950 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-0 dark:text-ink-50 dark:group-hover:text-ink-950"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-ink-0 dark:text-ink-50 dark:group-hover:text-ink-950">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 transition-colors group-hover:text-ink-300 dark:text-ink-300 dark:group-hover:text-ink-600">
            {project.description}
          </p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-ink-200 px-2.5 py-1 font-mono text-[11px] text-ink-500 transition-colors group-hover:border-ink-700 group-hover:text-ink-300 dark:border-ink-800 dark:text-ink-300 dark:group-hover:border-ink-300 dark:group-hover:text-ink-600"
            >
              {t}
            </li>
          ))}
        </ul>
      </a>
    </Reveal>
  )
}
