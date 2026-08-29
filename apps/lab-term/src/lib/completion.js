import { findNode, resolvePath } from './filesystem.js'
import { COMMAND_NAMES } from './commands.js'

function longestCommonPrefix(strings) {
  if (strings.length === 0) return ''
  let prefix = strings[0]
  for (const s of strings.slice(1)) {
    let i = 0
    while (i < prefix.length && i < s.length && prefix[i] === s[i]) i++
    prefix = prefix.slice(0, i)
    if (prefix === '') break
  }
  return prefix
}

/**
 * Tab completion (TERM-B4) for both the command name and its path argument.
 * Pure and DOM-free like the rest of this lib — takes the raw input string
 * and returns what the input should become plus, when more than one
 * candidate matches, the full list to show as a hint (real shells print the
 * list rather than guessing which one you meant).
 *
 * Returns `null` when there's nothing to complete (no candidates at all).
 */
export function complete(root, cwd, input) {
  const hasTrailingSpace = /\s$/.test(input)
  const parts = input.split(/\s+/).filter(Boolean)

  // Still typing the command name itself (no space yet): complete against
  // the fixed command list.
  if (parts.length === 0 || (parts.length === 1 && !hasTrailingSpace)) {
    const partial = parts[0] ?? ''
    const matches = COMMAND_NAMES.filter((c) => c.startsWith(partial))
    if (matches.length === 0) return null
    if (matches.length === 1) return { input: `${matches[0]} `, candidates: null }
    const prefix = longestCommonPrefix(matches)
    return { input: prefix, candidates: matches }
  }

  // Completing a path argument: only the last segment is completed, against
  // the children of whatever directory the rest of the path resolves to.
  const command = parts[0]
  const pathArg = hasTrailingSpace ? '' : (parts[parts.length - 1] ?? '')
  const lastSlash = pathArg.lastIndexOf('/')
  const dirPart = lastSlash >= 0 ? pathArg.slice(0, lastSlash) : ''
  const segmentPart = lastSlash >= 0 ? pathArg.slice(lastSlash + 1) : pathArg

  const targetDir = findNode(root, resolvePath(cwd, dirPart || '.'))
  if (!targetDir || targetDir.type !== 'dir') return null

  // '.' and '..' are always valid path segments, but only offered once the
  // visitor has actually typed a '.' — same as a real shell hiding dot-
  // entries from a bare Tab so they don't clutter every empty completion.
  const childNames = targetDir.children.map((c) => (c.type === 'dir' ? `${c.name}/` : c.name))
  const allNames = segmentPart.startsWith('.') ? ['./', '../', ...childNames] : childNames
  const matches = allNames.filter((name) => name.startsWith(segmentPart))
  if (matches.length === 0) return null

  const before = parts.slice(0, -1).concat(hasTrailingSpace ? [pathArg] : [])
  const prefix = `${command} ${before.slice(1).join(' ')}`.trimEnd()
  const rebuild = (segment) => (prefix === command ? `${command} ${dirPart ? `${dirPart}/` : ''}${segment}` : `${prefix} ${dirPart ? `${dirPart}/` : ''}${segment}`)

  if (matches.length === 1) {
    const full = matches[0]
    return { input: `${rebuild(full)}${full.endsWith('/') ? '' : ' '}`, candidates: null }
  }
  const commonPrefix = longestCommonPrefix(matches)
  return { input: rebuild(commonPrefix), candidates: matches }
}
