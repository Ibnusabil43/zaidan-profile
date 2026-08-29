import { useEffect, useMemo, useState } from 'react'
import * as data from '@zaidan/data'
import { buildFilesystem, findNodeByUrlPath, toUrlPath } from './lib/filesystem.js'
import { useRouter } from './lib/useRouter.js'
import { useShell } from './lib/useShell.js'
import { useMediaQuery } from './lib/useMediaQuery.js'
import TitleBar from './components/TitleBar.jsx'
import StatusBar from './components/StatusBar.jsx'
import Terminal from './components/Terminal.jsx'
import Sidebar from './components/Sidebar.jsx'

// Matches Tailwind's `lg` breakpoint (1024px) used for hidden/lg:block below.
const DESKTOP_QUERY = '(min-width: 1024px)'

const BANNER = [
  { text: 'Welcome to zaidan/portfolio.', tone: 'fg' },
  { text: "Type 'help' for commands, or click anything in the sidebar.", tone: 'hint' },
]

/**
 * Resolves the URL the visitor actually landed on into a starting cwd and
 * seed history — a file lands already `cat`-ted (TERM-A4: "/#/projects/
 * t24-toolkit mendarat langsung di file itu"), a directory just becomes the
 * starting cwd, and an unresolvable path falls back to root with a one-line
 * explanation rather than silently pretending it was never there. The
 * banner (TERM-B6) always plays first, same as a real session greets you
 * before you've typed anything.
 */
function resolveInitial(root, initialPath) {
  const banner = { type: 'output', lines: BANNER }

  if (initialPath === '') {
    return { cwd: '', entries: [banner] }
  }

  const node = findNodeByUrlPath(root, initialPath)
  if (!node) {
    return {
      cwd: '',
      entries: [banner, { type: 'output', lines: [{ text: `No such path: ${initialPath}`, tone: 'err' }] }],
    }
  }

  if (node.type === 'dir') {
    return { cwd: node.path, entries: [banner] }
  }

  const parentCwd = node.path.includes('/') ? node.path.slice(0, node.path.lastIndexOf('/')) : ''
  return {
    cwd: parentCwd,
    entries: [
      banner,
      { type: 'command', cwd: parentCwd, text: `cat ${node.name}` },
      { type: 'output', lines: node.render().split('\n').map((text) => ({ text, tone: 'fg' })) },
    ],
  }
}

export default function App() {
  const root = useMemo(() => buildFilesystem(data), [])
  const { initialPath, syncPath } = useRouter()
  const [initial] = useState(() => resolveInitial(root, initialPath))
  const shell = useShell(root, initial)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  useEffect(() => {
    syncPath(toUrlPath(shell.cwd))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shell.cwd])

  function runFromSidebar(command) {
    shell.submit(command)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: 'var(--t-bg)' }}>
      <TitleBar cwd={shell.cwd} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex min-h-0 flex-1">
        {isDesktop ? (
          <div className="w-[280px] shrink-0 border-r" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
            <Sidebar root={root} cwd={shell.cwd} onCommand={shell.submit} />
          </div>
        ) : (
          sidebarOpen && (
            <div className="fixed inset-0 z-40">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                <Sidebar root={root} cwd={shell.cwd} onCommand={runFromSidebar} />
              </div>
            </div>
          )
        )}

        <div className="min-w-0 flex-1">
          <Terminal root={root} cwd={shell.cwd} history={shell.history} onSubmit={shell.submit} focusTrigger={sidebarOpen} />
        </div>
      </div>
      <StatusBar cwd={shell.cwd} />
    </div>
  )
}
