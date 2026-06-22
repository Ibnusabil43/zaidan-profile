import Reveal from '../ui/Reveal'
import { profile } from '../../data/portfolio'

const LINKS = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'in/ibnusabil', href: profile.linkedin },
  { label: 'GitHub', value: 'ibnusabil43', href: profile.github },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
]

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-400 dark:text-ink-500">
            06 / Contact
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-ink-950 text-balance dark:text-ink-50">
            Let's build
            <br />
            <span className="text-ink-400 dark:text-ink-600">something.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-10 inline-flex items-center gap-3 font-display text-lg font-medium text-ink-950 sm:text-2xl dark:text-ink-50"
          >
            <span className="underline decoration-ink-300 decoration-1 underline-offset-8 transition-colors group-hover:decoration-ink-950 dark:decoration-ink-700 dark:group-hover:decoration-ink-50">
              {profile.email}
            </span>
            <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 grid gap-px overflow-hidden border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-ink-800 dark:bg-ink-800">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group flex flex-col gap-2 bg-ink-0 p-6 transition-colors hover:bg-ink-950 dark:bg-ink-950 dark:hover:bg-ink-50"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 transition-colors group-hover:text-ink-500 dark:text-ink-500">
                {l.label}
              </span>
              <span className="text-sm text-ink-800 transition-colors group-hover:text-ink-0 dark:text-ink-200 dark:group-hover:text-ink-950">
                {l.value}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
