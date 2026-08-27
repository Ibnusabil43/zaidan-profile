import { profile } from '@zaidan/data'

/**
 * Profile identity, as plain semantic HTML.
 *
 * Shared by FlatContent (rendered as-is) and ApproachScene (rendered inside
 * three Z-depth layers). This is the section split lab-3d.md §4.3 requires:
 * "DOM-nya sama, cuma CSS yang beda" only holds if the content markup exists
 * once and is composed differently, not written twice.
 */
export function ProfileStatus() {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--d-dim)]">
      {profile.status}
    </p>
  )
}

export function ProfileName() {
  return (
    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--d-ink)] sm:text-6xl">
      {profile.name}
    </h1>
  )
}

export function ProfileSummary() {
  return (
    <p className="max-w-[65ch] text-base leading-relaxed text-[var(--d-muted)]">
      {profile.summary}
    </p>
  )
}

export default function ProfileHeader() {
  return (
    <header className="space-y-4">
      <ProfileStatus />
      <ProfileName />
      <ProfileSummary />
    </header>
  )
}
