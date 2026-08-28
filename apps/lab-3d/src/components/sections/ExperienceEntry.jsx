/**
 * One role's markup — title, company/location/period, responsibilities.
 *
 * Shared by the flat Experience section and CorridorScene's gates, so the
 * content exists once (lab-3d.md §4.3: "DOM sama, CSS beda" only holds if the
 * markup is authored once and composed differently, not written twice).
 */
export default function ExperienceEntry({ role }) {
  return (
    <>
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
    </>
  )
}
