import CheckpointPanel from './CheckpointPanel'

/**
 * The whole career as a plain readable column.
 *
 * This is not a fallback bolted on afterwards. It is one of two views of the same
 * data (PRD FR-12): it is what narrow screens get instead of a horizontal path
 * (DESIGN.md §7), and what a reader who takes the skip link gets. Phase 2 builds
 * it first on purpose — a map that is correct when still is easy to animate; one
 * that animates over wrong data is not.
 */
export default function StaticTimeline({ checkpoints }) {
  return (
    <section id="timeline" className="mx-auto max-w-3xl px-6 pb-24">
      {checkpoints.map((cp) => (
        <CheckpointPanel key={cp.id} checkpoint={cp} />
      ))}
    </section>
  )
}
