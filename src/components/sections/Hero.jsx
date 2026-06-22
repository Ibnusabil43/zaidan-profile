import { motion } from 'framer-motion'
import { profile } from '../../data/portfolio'

const ROLES = ['Mobile Developer', 'ML Engineer', 'Web Developer']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      {/* faint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl"
      >
        <motion.div variants={item} className="mb-8 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-400 opacity-75 dark:bg-ink-500" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ink-950 dark:bg-ink-50" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
            Available for work · Cirebon, ID
          </p>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.75rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight text-ink-950 text-balance dark:text-ink-50"
        >
          Zaidan
          <br />
          <span className="text-ink-400 dark:text-ink-600">Ibnusabil</span>
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-ink-600 dark:text-ink-300"
        >
          {ROLES.map((r, i) => (
            <span key={r} className="flex items-center gap-3">
              {i > 0 && <span className="text-ink-300 dark:text-ink-700">/</span>}
              {r}
            </span>
          ))}
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-base leading-relaxed text-ink-600 text-balance sm:text-lg dark:text-ink-300"
        >
          {profile.summary}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-medium text-ink-0 transition-colors hover:bg-ink-700 dark:bg-ink-50 dark:text-ink-950 dark:hover:bg-ink-200"
          >
            View selected work
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-6 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-ink-0 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ink-50 dark:hover:bg-ink-50 dark:hover:text-ink-950"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
