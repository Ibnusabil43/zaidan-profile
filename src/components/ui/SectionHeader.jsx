import Reveal from './Reveal'

/**
 * Editorial numbered section header — e.g. "01 / About".
 */
export default function SectionHeader({ index, title, label }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4 border-b border-ink-200 pb-5 dark:border-ink-800">
        <span className="font-mono text-xs tracking-widest text-ink-400 dark:text-ink-500">
          {index}
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl dark:text-ink-50">
          {title}
        </h2>
        {label && (
          <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-widest text-ink-400 sm:block dark:text-ink-500">
            {label}
          </span>
        )}
      </div>
    </Reveal>
  )
}
