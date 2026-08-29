/**
 * Three contextual command suggestions shown near the prompt (TERM-B6) —
 * one of the three mandatory hint layers (lab-term.md §3). Recomputed
 * whenever `cwd` changes, so the hint always matches where the visitor
 * actually is instead of a fixed, quickly-stale list.
 */
export function getSuggestions(root, cwd, node) {
  const suggestions = []

  if (cwd !== '') {
    suggestions.push({ label: 'cd ..', command: 'cd ..' })
  } else {
    suggestions.push({ label: 'ls', command: 'ls' })
  }

  const firstDir = node.children.find((c) => c.type === 'dir')
  const firstFile = node.children.find((c) => c.type === 'file')

  if (firstFile) {
    suggestions.push({ label: `cat ${firstFile.name}`, command: `cat ${firstFile.name}` })
  }
  if (firstDir) {
    suggestions.push({ label: `cd ${firstDir.name}`, command: `cd ${firstDir.name}` })
  }
  if (suggestions.length < 3) {
    suggestions.push({ label: 'tree', command: 'tree' })
  }

  return suggestions.slice(0, 3)
}
