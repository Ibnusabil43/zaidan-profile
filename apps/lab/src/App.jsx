import { profile, experience } from '@zaidan/data'

/*
 * Scaffold only, restored 2026-08-23. Its single job is to prove the workspace
 * wiring works: this app resolves @zaidan/data and renders real content from
 * it. Everything built on top of this (career map, playground, hub of zones)
 * was reset per user request — see PRD.md §2 and git tag
 * lab-pre-reset-2026-08-23 for what existed and why it was undone.
 *
 * No motion library code here yet, and none should be added until a new
 * direction for the lab is decided.
 */
export default function App() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500">
        Lab — scaffold
      </p>
      <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-ink-950">
        {profile.name}
      </h1>
      <p className="mt-4 font-mono text-sm text-ink-600">{profile.status}</p>
      <p className="mt-10 text-sm text-ink-600">
        Reading <code className="font-mono text-ink-950">@zaidan/data</code>:{' '}
        <strong className="text-ink-950">{experience.length}</strong> experience entries,
        newest is <strong className="text-ink-950">{experience[0].title}</strong> at{' '}
        {experience[0].company}.
      </p>
    </main>
  )
}
