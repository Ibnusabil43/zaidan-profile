import {
  profile,
  skills,
  achievements,
  education,
} from '@zaidan/data'

/**
 * Every piece of content EXCEPT the profile header, Experience, and Projects,
 * rendered as a plain readable column.
 *
 * Header, Experience, and Projects are not here — each has a 3D treatment
 * (ApproachScene 3D-1, CorridorScene 3D-2, VaultScene 3D-3) and a flat
 * treatment, and App.jsx chooses between them at the top level. Duplicating
 * any of them here would be the "second markup" lab-3d.md §4.3 warns against.
 *
 * As more scenes ship (Lattice/Case/Exit 3D-4), their sections move out of
 * this file the same way. This is not a fallback bolted on afterwards — it
 * is the content baseline scenes progressively wrap in 3D chrome. PRD FR-15
 * (content parity) is checked against whatever App.jsx renders in flat mode
 * — see scripts/parity-check.mjs.
 */
export default function FlatContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <section aria-labelledby="skills-heading" className="mt-16">
        <h2 id="skills-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Skills
        </h2>
        {/* Category order is deliberate — Core Banking first, Mobile last —
            and must never be alphabetized (PRD FR-3). */}
        <div className="mt-6 grid gap-6 border-t border-[var(--d-line)] pt-6 sm:grid-cols-2">
          {Object.entries(skills).map(([category, names]) => (
            <div key={category}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--d-dim)]">
                {category}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {names.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-[var(--d-line)] px-2.5 py-1 text-xs text-[var(--d-muted)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="achievements-heading" className="mt-16">
        <h2 id="achievements-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Achievements
        </h2>
        <ul className="mt-6 space-y-4 border-t border-[var(--d-line)] pt-6">
          {achievements.map((a) => (
            <li key={a.title}>
              <h3 className="font-display text-base font-semibold text-[var(--d-ink)]">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--d-muted)]">{a.description}</p>
              <p className="mt-1 font-mono text-xs text-[var(--d-dim)]">
                {a.institution} · {a.year}
              </p>
            </li>
          ))}
        </ul>

        {education.map((ed) => (
          <div key={ed.institution} className="mt-8 border-t border-[var(--d-line)] pt-6">
            <h3 className="font-display text-base font-semibold text-[var(--d-ink)]">
              {ed.degree}
            </h3>
            <p className="mt-1 text-sm text-[var(--d-muted)]">
              {ed.institution} · {ed.period} · GPA {ed.gpa}
            </p>
            <ul className="mt-3 space-y-1.5">
              {ed.details.map((d, i) => (
                <li key={i} className="text-sm leading-relaxed text-[var(--d-muted)]">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="mt-16 border-t border-[var(--d-line)] pt-6">
        <a
          href={`mailto:${profile.email}`}
          className="font-display text-lg font-semibold text-[var(--d-accent)] underline underline-offset-4"
        >
          {profile.email}
        </a>
      </footer>
    </div>
  )
}
