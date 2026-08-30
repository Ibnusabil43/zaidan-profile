import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'

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

/**
 * One card per lab. Renders whether or not the env var is set — a lab that
 * isn't deployed yet still shows up, honestly marked "Coming soon" (same
 * call as the resume card and the T24 screenshot placeholder), rather than
 * disappearing the way the old single-destination LabLink did.
 */
function LabCard({ idx, kicker, title, description, url }) {
  const available = Boolean(url)
  const Wrapper = available ? 'a' : 'div'
  const wrapperProps = available ? { href: url, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Reveal delay={idx * 0.06}>
      <Wrapper
        {...wrapperProps}
        className={`group flex h-full flex-col justify-between bg-ink-0 p-7 transition-colors duration-300 sm:p-8 dark:bg-ink-950 ${
          available ? 'hover:bg-ink-50 dark:hover:bg-ink-900' : ''
        }`}
      >
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-400 dark:text-ink-500">
            {kicker}
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl dark:text-ink-50">
            {title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-200">{description}</p>
        </div>

        <div className="mt-7 border-t border-ink-200 pt-5 dark:border-ink-800">
          {available ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-950 dark:text-ink-50">
              <span className="underline decoration-ink-300 decoration-1 underline-offset-4 transition-colors group-hover:decoration-ink-950 dark:decoration-ink-700 dark:group-hover:decoration-ink-50">
                Enter
              </span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
              Coming soon
            </span>
          )}
        </div>
      </Wrapper>
    </Reveal>
  )
}

export default function Lab() {
  const lab3dUrl = import.meta.env.VITE_LAB3D_URL
  const labTermUrl = import.meta.env.VITE_LABTERM_URL

  return (
    <section id="lab" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="06" title="The Lab" label="Same content, different shape" />

        <div className="grid gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-2 dark:border-ink-800 dark:bg-ink-800">
          <LabCard
            idx={0}
            kicker="CSS 3D · anime.js"
            title="3D Lab"
            description="The same record, walked through as a 3D space with five scenes and one camera rig, built from real HTML text rather than a canvas."
            url={lab3dUrl}
          />
          <LabCard
            idx={1}
            kicker="cd · ls · cat"
            title="Terminal Lab"
            description="The same record as a filesystem you read with real shell commands (cd, ls, cat), plus a sidebar for anyone who'd rather click."
            url={labTermUrl}
          />
        </div>
      </div>
    </section>
  )
}
