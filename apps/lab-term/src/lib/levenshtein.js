/**
 * Plain edit-distance, no dependency (TERM-B5: "jarak Levenshtein sederhana
 * ke daftar yang ada — jangan narik dependency fuzzy-search buat delapan
 * perintah dan pohon sekecil ini"). O(n*m), which is fine for command names
 * and single path segments — nothing here is ever more than a few dozen
 * characters.
 */
export function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  const prev = new Array(n + 1)
  const curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

/**
 * Closest candidate to `target` from `candidates`, or null if nothing is
 * close enough to be a plausible typo rather than a genuinely different
 * word. Threshold scales a little with word length — "cd" vs "cx" (distance
 * 1 on a 2-char word) should still suggest, but a totally different short
 * word shouldn't.
 */
export function closestMatch(target, candidates) {
  if (!target || candidates.length === 0) return null
  const maxDistance = Math.max(2, Math.ceil(target.length / 3))
  let best = null
  let bestDistance = Infinity
  for (const candidate of candidates) {
    const d = levenshtein(target, candidate)
    if (d < bestDistance) {
      bestDistance = d
      best = candidate
    }
  }
  return bestDistance <= maxDistance ? best : null
}
