import Reveal from './Reveal'

function ArrowIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export default function ProjectCard({ project, idx, compact = false }) {
  const { title, subtitle, role, year, description, highlights = [], tech, links = [], internal } = project

  return (
    <Reveal delay={Math.min(idx * 0.05, 0.25)}>
      <article className="flex h-full flex-col justify-between bg-ink-0 p-7 transition-colors duration-300 hover:bg-ink-50 sm:p-8 dark:bg-ink-950 dark:hover:bg-ink-900">
        <div>
          <div className="mb-6 flex items-start justify-between gap-4">
            <span className="font-mono text-xs text-ink-400 dark:text-ink-500">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
              {internal && (
                <span className="rounded-full border border-ink-300 px-2 py-0.5 dark:border-ink-700">
                  Internal
                </span>
              )}
              {year}
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl dark:text-ink-50">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{subtitle}</p>
          )}
          {role && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
              {role}
            </p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
            {description}
          </p>

          {!compact && highlights.length > 0 && (
            <ul className="mt-6 space-y-2.5 border-t border-ink-200 pt-6 dark:border-ink-800">
              {highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300"
                >
                  <span className="mt-2 h-px w-3 flex-none bg-ink-300 dark:bg-ink-700" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-7">
          <ul className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-ink-200 px-2.5 py-1 font-mono text-[11px] text-ink-500 dark:border-ink-800 dark:text-ink-300"
              >
                {t}
              </li>
            ))}
          </ul>

          {links.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink-200 pt-5 dark:border-ink-800">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-ink-950 dark:text-ink-50"
                >
                  <span className="underline decoration-ink-300 decoration-1 underline-offset-4 transition-colors group-hover/link:decoration-ink-950 dark:decoration-ink-700 dark:group-hover/link:decoration-ink-50">
                    {l.label}
                  </span>
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-6 border-t border-ink-200 pt-5 font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:border-ink-800 dark:text-ink-500">
              Internal project, source not public
            </p>
          )}
        </div>
      </article>
    </Reveal>
  )
}
