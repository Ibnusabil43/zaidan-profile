import { useEffect, useState } from 'react'

function ancestorsOf(path) {
  const parts = path.split('/').filter(Boolean)
  const out = []
  let acc = ''
  for (const p of parts) {
    acc = acc ? `${acc}/${p}` : p
    out.push(acc)
  }
  return out
}

function Row({ node, depth, cwd, expanded, onToggle, onCommand }) {
  const isDir = node.type === 'dir'
  const isActive = isDir && node.path === cwd
  const isOpen = expanded.has(node.path)

  return (
    <div>
      <div className="flex items-center" style={{ backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent' }}>
        <span style={{ width: `${depth * 12}px` }} aria-hidden="true" />
        {isDir ? (
          <button
            type="button"
            onClick={() => onToggle(node.path)}
            aria-label={isOpen ? `Collapse ${node.name}` : `Expand ${node.name}`}
            aria-expanded={isOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-xs"
            style={{ color: 'var(--t-dim)' }}
          >
            {isOpen ? '▾' : '▸'}
          </button>
        ) : (
          <span className="h-11 w-11 shrink-0" aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={() => onCommand(isDir ? `cd ${node.path === '' ? '~' : node.path}` : `cat ${node.path}`, node)}
          className="min-h-11 flex-1 truncate py-2 pr-3 text-left text-sm"
          style={{ color: isDir ? 'var(--t-dir)' : 'var(--t-fg)' }}
        >
          {node.name}
          {isDir ? '/' : ''}
        </button>
      </div>
      {isDir &&
        isOpen &&
        node.children.map((child) => (
          <Row
            key={child.path}
            node={child}
            depth={depth + 1}
            cwd={cwd}
            expanded={expanded}
            onToggle={onToggle}
            onCommand={onCommand}
          />
        ))}
    </div>
  )
}

/**
 * File tree (TERM-B1). Reads the same `root` built once in App.jsx — this is
 * a view over the filesystem, not a second copy of it.
 *
 * Clicking a row runs the equivalent command through the shared shell
 * (TERM-B2: `cd <path>` for a folder, `cat <path>` for a file) rather than
 * navigating silently — the visitor sees the command form in the prompt,
 * which is the whole teaching mechanism this sidebar exists for (§3).
 *
 * The disclosure chevron is a separate 44×44px target from the name button
 * (DESIGN §7) — clicking the chevron only expands/collapses, so a visitor
 * can peek into a folder without leaving the directory they're actually in.
 * `cwd` changing (whether from typing `cd` or from this component's own
 * click) always expands that path's ancestor chain — that's TERM-B3's two-
 * way sync, and it falls out of `cwd` being the single shared source of
 * truth rather than something this component tracks separately.
 */
export default function Sidebar({ root, cwd, onCommand }) {
  const [expanded, setExpanded] = useState(() => new Set(ancestorsOf(cwd)))

  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev)
      for (const a of ancestorsOf(cwd)) next.add(a)
      return next
    })
  }, [cwd])

  function toggle(path) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  return (
    <nav aria-label="File tree" className="h-full overflow-y-auto py-2" style={{ backgroundColor: 'var(--t-panel)' }}>
      {root.children.map((child) => (
        <Row key={child.path} node={child} depth={0} cwd={cwd} expanded={expanded} onToggle={toggle} onCommand={onCommand} />
      ))}
    </nav>
  )
}
