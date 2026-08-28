import { findNode, resolvePath } from './filesystem.js'

/**
 * Eight commands, no more (lab-term.md §2.1) — a command that isn't load-
 * bearing for reading content is a memorization tax with no payoff. Adding
 * a ninth needs to answer "what content is unreachable without this."
 *
 * Kept DOM-free and side-effect-free on purpose, same discipline as
 * corridorLayout.js in the 3D Lab: `runCommand` returns a plain description
 * of what happened — output lines, a new cwd, a clear signal, a URL to open
 * — and the React layer is the only place that actually touches
 * `window.open` or mutates state. That split is what makes this testable
 * without a browser.
 *
 * `Did you mean:` suggestions for unknown commands/paths (TERM-B5) are
 * deliberately NOT here yet — that's the next phase's story, not this one's.
 */
export const COMMANDS = [
  { name: 'ls', usage: 'ls [path]', help: 'list a directory' },
  { name: 'cd', usage: 'cd [path]', help: 'change directory' },
  { name: 'cat', usage: 'cat <path>', help: 'print a file' },
  { name: 'pwd', usage: 'pwd', help: 'print the current path' },
  { name: 'tree', usage: 'tree [path]', help: 'show the tree from here down' },
  { name: 'clear', usage: 'clear', help: 'clear the screen' },
  { name: 'help', usage: 'help', help: 'list commands' },
  { name: 'open', usage: 'open <path>', help: "open a project's link" },
]

function line(text, tone = 'fg') {
  return { text, tone }
}

function listing(node) {
  if (node.type !== 'dir') return null
  return node.children.map((c) => line(c.type === 'dir' ? `${c.name}/` : c.name, c.type === 'dir' ? 'dir' : 'fg'))
}

function treeLines(node, prefix = '', isRoot = true) {
  const out = []
  if (isRoot) out.push(line(`${node.name}/`, 'dir'))
  if (node.type !== 'dir') return out
  node.children.forEach((child, i) => {
    const last = i === node.children.length - 1
    const branch = last ? '└── ' : '├── '
    const nextPrefix = prefix + (last ? '    ' : '│   ')
    out.push(line(prefix + branch + (child.type === 'dir' ? `${child.name}/` : child.name), child.type === 'dir' ? 'dir' : 'fg'))
    if (child.type === 'dir') out.push(...treeLines(child, nextPrefix, false))
  })
  return out
}

function displayPath(cwd) {
  return cwd === '' ? '~' : `~/${cwd}`
}

/** Where `open` should send the browser for a given file node, if anywhere. */
function openTarget(node) {
  if (!node || node.type !== 'file') return { none: true }
  if (node.kind === 'project') {
    if (node.data.internal) return { internal: true }
    if (node.data.links?.length > 0) return { url: node.data.links[0].href, label: node.data.links[0].label }
    return { none: true }
  }
  if (node.kind === 'earlierWork') return { url: node.data.href, label: node.data.title }
  return { unsupported: true }
}

/**
 * Runs one command line against `root` from `cwd`. Returns
 * `{ lines, cwd, clearScreen, openUrl }` — `cwd` is the (possibly unchanged)
 * new working directory, `openUrl` is set only when `open` resolves to a
 * real link the caller should navigate to.
 */
export function runCommand(root, cwd, input) {
  const trimmed = input.trim()
  if (trimmed === '') return { lines: [], cwd }

  const [name, ...args] = trimmed.split(/\s+/)
  const arg = args.join(' ')

  switch (name) {
    case 'pwd':
      return { lines: [line(displayPath(cwd))], cwd }

    case 'clear':
      return { lines: [], cwd, clearScreen: true }

    case 'help':
      return {
        lines: COMMANDS.map((c) => line(`${c.usage.padEnd(14)} ${c.help}`)),
        cwd,
      }

    case 'ls': {
      const target = arg ? resolvePath(cwd, arg) : cwd
      const node = findNode(root, target)
      if (!node) return { lines: [line(`ls: ${arg}: No such file or directory`, 'err')], cwd }
      if (node.type === 'file') return { lines: [line(node.name)], cwd }
      const entries = listing(node)
      return { lines: entries.length > 0 ? entries : [line('(empty)', 'dim')], cwd }
    }

    case 'tree': {
      const target = arg ? resolvePath(cwd, arg) : cwd
      const node = findNode(root, target)
      if (!node) return { lines: [line(`tree: ${arg}: No such file or directory`, 'err')], cwd }
      return { lines: treeLines(node), cwd }
    }

    case 'cd': {
      const target = resolvePath(cwd, arg || '~')
      const node = findNode(root, target)
      if (!node) return { lines: [line(`cd: ${arg}: No such directory`, 'err')], cwd }
      if (node.type !== 'dir') return { lines: [line(`cd: ${arg}: Not a directory`, 'err')], cwd }
      return { lines: [], cwd: target }
    }

    case 'cat': {
      if (!arg) return { lines: [line('usage: cat <path>', 'hint')], cwd }
      const target = resolvePath(cwd, arg)
      const node = findNode(root, target)
      if (!node) return { lines: [line(`cat: ${arg}: No such file or directory`, 'err')], cwd }
      if (node.type === 'dir') return { lines: [line(`cat: ${arg}: Is a directory`, 'err')], cwd }
      return { lines: node.render().split('\n').map((l) => line(l)), cwd }
    }

    case 'open': {
      if (!arg) return { lines: [line('usage: open <path>', 'hint')], cwd }
      const target = resolvePath(cwd, arg)
      const node = findNode(root, target)
      if (!node) return { lines: [line(`open: ${arg}: No such file or directory`, 'err')], cwd }
      const result = openTarget(node)
      if (result.internal) {
        return { lines: [line('This repository is internal — no public link available.', 'hint')], cwd }
      }
      if (result.url) {
        return { lines: [line(`Opening ${result.label}: ${result.url}`, 'ok')], cwd, openUrl: result.url }
      }
      if (result.unsupported) {
        return { lines: [line(`open: ${arg}: not a linkable file`, 'err')], cwd }
      }
      return { lines: [line('No public link available.', 'hint')], cwd }
    }

    default:
      return { lines: [line(`${name}: command not found`, 'err')], cwd }
  }
}
