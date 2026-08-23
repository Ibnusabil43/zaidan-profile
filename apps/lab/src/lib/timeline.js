/**
 * Turns the `experience` array into the chronological checkpoint list the career
 * map walks along.
 *
 * This is the ONE place where the data array's own order is overridden. The
 * professional site renders `experience` as authored (BRI first, because that is
 * the headline); the map needs it oldest-first. Do not reorder the array itself
 * to "fix" either site — see CLAUDE.md > Data.
 *
 * Roles are grouped by `org`, an explicit field on each entry rather than a name
 * match on `company`. Matching on company text would be fragile: "Telkom
 * University" and "Informatics Laboratory, Telkom University" are the same place,
 * while "Telkom University" and "Telkom Indonesia" are not.
 */

/** Months since year 0, so two "YYYY-MM" strings can be compared and subtracted. */
function monthIndex(ym) {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + m
}

/** A role still running has no end date; treat it as reaching past everything. */
const OPEN_ENDED = Number.POSITIVE_INFINITY

function endIndex(role) {
  return role.end ? monthIndex(role.end) : OPEN_ENDED
}

/**
 * Two stints at the same org become one checkpoint when they overlap or nearly
 * touch. Beyond this gap they read as genuinely separate chapters and get their
 * own checkpoint — which is what should happen to Ordinat: IT Support ended Jan
 * 2025, the freelance work started Jul 2026, eighteen months later.
 */
const SAME_CHAPTER_GAP_MONTHS = 3

export function buildTimeline(experience) {
  const byOrg = new Map()
  for (const role of experience) {
    if (!byOrg.has(role.org)) byOrg.set(role.org, [])
    byOrg.get(role.org).push(role)
  }

  const checkpoints = []

  for (const [org, roles] of byOrg) {
    const sorted = [...roles].sort((a, b) => monthIndex(a.start) - monthIndex(b.start))

    let cluster = null
    let clusterReach = -Infinity

    for (const role of sorted) {
      const startsAfterGap = monthIndex(role.start) > clusterReach + SAME_CHAPTER_GAP_MONTHS

      if (!cluster || startsAfterGap) {
        cluster = { org, roles: [] }
        checkpoints.push(cluster)
        clusterReach = -Infinity
      }

      cluster.roles.push(role)
      clusterReach = Math.max(clusterReach, endIndex(role))
    }
  }

  // Within a checkpoint, show the most senior/most recent role first — it is the
  // one a reader should see before the supporting ones.
  for (const cp of checkpoints) {
    cp.roles.sort((a, b) => monthIndex(b.start) - monthIndex(a.start))
    cp.start = cp.roles.reduce((min, r) => (monthIndex(r.start) < monthIndex(min) ? r.start : min), cp.roles[0].start)
    cp.ongoing = cp.roles.some((r) => !r.end)
    cp.end = cp.ongoing
      ? null
      : cp.roles.reduce((max, r) => (monthIndex(r.end) > monthIndex(max) ? r.end : max), cp.roles[0].end)
    cp.startYear = cp.start.slice(0, 4)
    cp.endYear = cp.end ? cp.end.slice(0, 4) : null
    cp.id = `${cp.org}-${cp.start}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    // `org` doubles as the map label: short enough to sit under a checkpoint,
    // where a full legal name like "Bangkit Academy led by Google, Tokopedia,
    // Gojek & Traveloka" would not fit. The full name still shows in the panel.
    cp.label = cp.org
  }

  return checkpoints.sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
}

/** "2020" for a one-year stint, "2023–25" for a longer one, "2026–" if ongoing. */
export function checkpointYears(cp) {
  if (cp.ongoing) return `${cp.startYear}–`
  if (cp.endYear === cp.startYear) return cp.startYear
  return `${cp.startYear}–${cp.endYear.slice(2)}`
}
