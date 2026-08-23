import { profile, experience } from '@zaidan/data'

/*
 * Phase 0 scaffold only. Its single job is to prove the workspace wiring works:
 * this app resolves @zaidan/data and renders real content from it.
 *
 * The career map replaces all of this in Phase 2 (LAB-C3). Deliberately no
 * anime.js code yet — per CLAUDE.md, anime.js is only written in a session that
 * has loaded the /animejs skill, which is Phase 3.
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
