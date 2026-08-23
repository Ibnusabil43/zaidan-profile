import { checkpointYears } from '../lib/timeline'

/**
 * One checkpoint's full content. Every word comes from `experience` in
 * @zaidan/data — the typography may differ from the professional site, the text
 * may not (DESIGN.md §5).
 *
 * `status` follows DESIGN.md §5: locked / active / visited. Phase 2 is static, so
 * everything renders as `visited`; Phase 3 (LAB-D3) starts moving it through the
 * other two.
 */
export default function CheckpointPanel({ checkpoint, status = 'visited' }) {
  const dim = status === 'locked'

  return (
    <article
      id={`cp-${checkpoint.id}`}
      className={`border-t border-ink-200 py-8 ${dim ? 'opacity-45' : ''}`}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-widest text-ink-400">
          {checkpointYears(checkpoint)}
        </span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
          {checkpoint.label}
        </h2>
        {checkpoint.roles.length > 1 && (
          <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-ink-400">
            {checkpoint.roles.length} roles
          </span>
        )}
      </div>

      {checkpoint.roles.map((role) => (
        <div key={`${role.title}-${role.start}`} className="mt-6 pl-0 sm:pl-16">
          <h3 className="font-display text-base font-semibold text-ink-950">{role.title}</h3>
          <p className="mt-1 text-sm text-ink-500">
            {role.company}
            {role.location && <span className="text-ink-400"> · {role.location}</span>}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-400">
            {role.period} · {role.type}
          </p>
          <ul className="mt-4 space-y-2">
            {role.responsibilities.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-600">
                <span className="mt-2 h-px w-3 flex-none bg-ink-300" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </article>
  )
}
