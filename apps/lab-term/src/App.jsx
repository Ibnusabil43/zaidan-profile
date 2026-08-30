import { useMemo, useState } from 'react'
import * as data from '@zaidan/data'
import { buildFilesystem, findNodeByUrlPath, toUrlPath } from './lib/filesystem.js'
import { useRouter } from './lib/useRouter.js'
import TitleBar from './components/TitleBar.jsx'
import StatusBar from './components/StatusBar.jsx'
import Terminal from './components/Terminal.jsx'

/**
 * Resolves the URL the visitor actually landed on into a starting cwd and
 * seed history — a file lands already `cat`-ted (TERM-A4: "/#/projects/
 * t24-toolkit mendarat langsung di file itu"), a directory just becomes the
 * starting cwd, and an unresolvable path falls back to root with a one-line
 * explanation rather than silently pretending it was never there.
 */
function resolveInitial(root, initialPath) {
  if (initialPath === '') {
    return { cwd: '', entries: [{ type: 'output', lines: [{ text: "Type 'help' to see available commands.", tone: 'hint' }] }] }
  }

  const node = findNodeByUrlPath(root, initialPath)
  if (!node) {
    return {
      cwd: '',
      entries: [{ type: 'output', lines: [{ text: `No such path: ${initialPath}`, tone: 'err' }] }],
    }
  }

  if (node.type === 'dir') {
    return { cwd: node.path, entries: [] }
  }

  const parentCwd = node.path.includes('/') ? node.path.slice(0, node.path.lastIndexOf('/')) : ''
  return {
    cwd: parentCwd,
    entries: [
      { type: 'command', cwd: parentCwd, text: `cat ${node.name}` },
      { type: 'output', lines: node.render().split('\n').map((text) => ({ text, tone: 'fg' })) },
    ],
  }
}

export default function App() {
  const root = useMemo(() => buildFilesystem(data), [])
  const { initialPath, syncPath } = useRouter()
  const [initial] = useState(() => resolveInitial(root, initialPath))
  const [cwd, setCwd] = useState(initial.cwd)

  function onCwdChange(next) {
    setCwd(next)
    syncPath(toUrlPath(next))
  }

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: 'var(--t-bg)' }}>
      <TitleBar cwd={cwd} />
      <div className="min-h-0 flex-1">
        <Terminal root={root} cwd={cwd} onCwdChange={onCwdChange} initialEntries={initial.entries} />
      </div>
      <StatusBar cwd={cwd} />
    </div>
  )
}
