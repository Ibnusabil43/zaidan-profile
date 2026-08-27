import {
  profile,
  experience,
  projects,
  earlierWork,
  skills,
  achievements,
  education,
} from '@zaidan/data'

/**
 * Every piece of content EXCEPT the profile header, rendered as a plain
 * readable column.
 *
 * The header is deliberately not here. It is the one section that already has
 * a 3D treatment (ApproachScene, 3D-1) and a flat treatment
 * (sections/ProfileHeader rendered directly), and App.jsx chooses between them
 * at the top level. Duplicating the header here as well would be exactly the
 * "second markup" lab-3d.md §4.3 warns against — two places that can drift.
 *
 * As more scenes ship (Corridor 3D-2, Vault 3D-3, Lattice/Case/Exit 3D-4),
 * their sections move out of this file the same way the header did: extract
 * to `sections/`, wrap in a scene when in 3D mode, render plain here when flat.
 *
 * This is not a fallback bolted on afterwards — it is the content baseline
 * scenes progressively wrap in 3D chrome. PRD FR-15 (content parity) is
 * checked against whatever App.jsx renders in flat mode — see
 * scripts/parity-check.mjs. If a scene later stops importing one of these
 * arrays, the string it should contain disappears from the rendered page and
 * the parity check fails, which is the point.
 */
export default function FlatContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <section aria-labelledby="experience-heading" className="mt-16">
        <h2 id="experience-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Experience
        </h2>
        <ul className="mt-6 space-y-8 border-t border-[var(--d-line)] pt-6">
          {experience.map((role) => (
            <li key={`${role.title}-${role.start}`}>
              <h3 className="font-display text-lg font-semibold text-[var(--d-ink)]">{role.title}</h3>
              <p className="mt-1 text-sm text-[var(--d-muted)]">
                {role.company} · {role.location} · {role.period}
              </p>
              <ul className="mt-3 space-y-1.5">
                {role.responsibilities.map((r, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[var(--d-muted)]">
                    {r}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-heading" className="mt-16">
        <h2 id="projects-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Projects
        </h2>
        <ul className="mt-6 grid gap-6 border-t border-[var(--d-line)] pt-6 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id} id={`project-${p.id}`} className="border border-[var(--d-line)] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-[var(--d-ink)]">{p.title}</h3>
                {p.internal && (
                  <span className="rounded-full border border-[var(--d-line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--d-dim)]">
                    Internal
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--d-dim)]">
                {p.role} · {p.year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--d-muted)]">{p.description}</p>
              {p.highlights?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="text-[13px] leading-relaxed text-[var(--d-muted)]">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[var(--d-line)] px-2 py-0.5 font-mono text-[11px] text-[var(--d-dim)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {p.links?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[var(--d-accent)] underline underline-offset-4"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-lg font-semibold text-[var(--d-ink)]">Earlier work</h3>
        <ul className="mt-4 divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
          {earlierWork.map((w) => (
            <li key={w.title} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-sm font-semibold text-[var(--d-ink)] underline decoration-[var(--d-line)] underline-offset-4"
                >
                  {w.title}
                </a>
                <span className="ml-2 text-xs text-[var(--d-dim)]">{w.note}</span>
              </span>
              <span className="font-mono text-xs text-[var(--d-dim)]">
                {w.year} · {w.tech}
              </span>
            </li>
          ))}
        </ul>
      </section>

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
