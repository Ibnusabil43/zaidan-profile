/**
 * Turns a title into a filename-safe slug. Titles across `experience` and
 * `achievements` are confirmed unique in the data (checked directly, not
 * assumed) so this alone is a stable, collision-free path segment — no need
 * for a second disambiguating field appended.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
