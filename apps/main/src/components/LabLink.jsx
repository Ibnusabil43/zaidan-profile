import Reveal from './ui/Reveal'

/**
 * The one way across to the lab (PRD FR-14, story LAB-F3).
 *
 * Placed after Selected Work, never in the hero. The hero's two CTAs are what a
 * recruiter needs in their first thirty seconds; a third one there weakens all
 * three, and the one that loses most is "Get in touch". Someone who has scrolled
 * past every project is no longer that reader — they are persona P-3, which is
 * who the lab is for.
 *
 * Renders only when VITE_LAB_URL is set. Until the lab is actually deployed
 * production has no such variable, so this cannot ship a dead link; locally,
 * apps/main/.env.development points it at the lab dev server.
 *
 * Copy is deliberately generic — the lab's content was reset to a blank
 * scaffold on 2026-08-23 pending a new direction, so it must not promise a
 * specific experience (it used to say "Walk the career map").
 */
export default function LabLink() {
  const url = import.meta.env.VITE_LAB_URL
  if (!url) return null

  return (
    <Reveal className="mt-20">
      <a
        href={url}
        className="group flex flex-col gap-6 border border-ink-200 p-8 transition-colors hover:border-ink-950 sm:flex-row sm:items-center sm:justify-between sm:p-10 dark:border-ink-800 dark:hover:border-ink-50"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
            Also / The lab
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl dark:text-ink-50">
            Step into the lab
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            A more hands-on space to explore the same work from above.
          </p>
        </div>
        <span className="flex flex-none items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-950 dark:text-ink-50">
          Enter
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
    </Reveal>
  )
}
