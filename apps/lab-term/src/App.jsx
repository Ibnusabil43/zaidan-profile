import { useEffect, useMemo, useState } from 'react'
import * as data from '@zaidan/data'
import { buildFilesystem, findNodeByUrlPath, toUrlPath } from './lib/filesystem.js'
import { runCommand } from './lib/commands.js'
import { useRouter } from './lib/useRouter.js'
import { useShell } from './lib/useShell.js'
import { useMediaQuery } from './lib/useMediaQuery.js'
import { useTerminalSize } from './lib/useTerminalSize.js'
import TitleBar from './components/TitleBar.jsx'
import StatusBar from './components/StatusBar.jsx'
import Terminal from './components/Terminal.jsx'
import TerminalWindow from './components/TerminalWindow.jsx'
import MobileSheet from './components/MobileSheet.jsx'
import Sidebar from './components/Sidebar.jsx'
import Preview from './components/Preview.jsx'

// Matches Tailwind's `lg` breakpoint (1024px) used for hidden/lg:block below.
const DESKTOP_QUERY = '(min-width: 1024px)'
const MAIN_URL = import.meta.env.VITE_MAIN_URL

const BANNER = [
  { text: 'Welcome to zaidan/portfolio.', tone: 'fg' },
  { text: "Type 'help' for commands, or click anything in the sidebar.", tone: 'hint' },
]

/**
 * Resolves the URL the visitor actually landed on into a starting cwd, seed
 * history, and preview — a file lands already `cat`-ted **and** open in the
 * preview pane (TERM-A4: "/#/projects/t24-toolkit mendarat langsung di file
 * itu"; TERM-C extends that to the pane that's actually built for reading).
 * Runs the exact same `runCommand('cat ...')` the prompt and sidebar use —
 * not a hand-rolled copy — so a binary file linked directly (`#/resume`)
 * gets the same correct rejection message for free.
 */
function resolveInitial(root, initialPath) {
  const banner = { type: 'output', lines: BANNER }

  if (initialPath === '') {
    return { cwd: '', entries: [banner], previewPath: null }
  }

  const node = findNodeByUrlPath(root, initialPath)
  if (!node) {
    return {
      cwd: '',
      entries: [banner, { type: 'output', lines: [{ text: `No such path: ${initialPath}`, tone: 'err' }] }],
      previewPath: null,
    }
  }

  if (node.type === 'dir') {
    return { cwd: node.path, entries: [banner], previewPath: null }
  }

  const parentCwd = node.path.includes('/') ? node.path.slice(0, node.path.lastIndexOf('/')) : ''
  const result = runCommand(root, parentCwd, `cat ${node.name}`, MAIN_URL)
  return {
    cwd: parentCwd,
    entries: [
      banner,
      { type: 'command', cwd: parentCwd, text: `cat ${node.name}` },
      { type: 'output', lines: result.lines, previewable: result.previewable },
    ],
    previewPath: result.previewable ?? null,
  }
}

export default function App() {
  const root = useMemo(() => buildFilesystem(data), [])
  const { initialPath, syncPath } = useRouter()
  const [initial] = useState(() => resolveInitial(root, initialPath))
  const shell = useShell(root, initial, MAIN_URL)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const terminalSize = useTerminalSize()

  useEffect(() => {
    syncPath(toUrlPath(shell.cwd))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shell.cwd])

  // Sidebar clicks go "straight to preview" for a file (lab-term.md §2.3) —
  // typed `cat` stays more conservative (terminal only, until the `[ open in
  // preview ]` line is clicked) because someone typing in a terminal is more
  // likely just reading the raw output right there; someone clicking a file
  // in a tree view has already expressed the intent to open it.
  function runFromSidebar(command, node) {
    shell.submit(command)
    if (node?.type === 'file') shell.setPreviewPath(node.path)
    setSidebarOpen(false)
  }

  const previewPane = <Preview root={root} previewPath={shell.previewPath} mainUrl={MAIN_URL} />
  const terminalPane = (
    <Terminal
      root={root}
      cwd={shell.cwd}
      history={shell.history}
      onSubmit={shell.submit}
      focusTrigger={sidebarOpen}
      onOpenPreview={shell.setPreviewPath}
    />
  )

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: 'var(--t-bg)' }}>
      <TitleBar cwd={shell.cwd} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex min-h-0 flex-1">
        {isDesktop ? (
          <>
            <div className="w-[280px] shrink-0 border-r" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
              <Sidebar root={root} cwd={shell.cwd} onCommand={(cmd, node) => runFromSidebar(cmd, node)} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col" ref={terminalSize.containerRef}>
              <div className="min-h-0 flex-1">{previewPane}</div>
              <TerminalWindow size={terminalSize}>{terminalPane}</TerminalWindow>
            </div>
          </>
        ) : (
          <div className="relative min-h-0 flex-1">
            {previewPane}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                  <Sidebar root={root} cwd={shell.cwd} onCommand={(cmd, node) => runFromSidebar(cmd, node)} />
                </div>
              </div>
            )}
            <MobileSheet>{terminalPane}</MobileSheet>
          </div>
        )}
      </div>
      <StatusBar cwd={shell.cwd} />
    </div>
  )
}
