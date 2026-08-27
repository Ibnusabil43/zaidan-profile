#!/usr/bin/env node
/**
 * Content parity check (PRD FR-15).
 *
 * Reads @zaidan/data and confirms every identifying piece of content (project
 * ids/titles, experience roles, skills, achievements, education) actually
 * APPEARS IN THE RENDERED DOM of every surface registered below — not just
 * "the data got bundled somewhere."
 *
 * That distinction matters and was not academic: an earlier version of this
 * script grepped the built JS bundle as text. It passed even after a project
 * was removed via `.filter()` at render time, because the full data module
 * (including the filtered-out item's strings) still ships in the bundle
 * whether or not a component chooses to render it. A parity check that can't
 * catch a runtime filter isn't testing parity, it's testing "did this module
 * get imported" — so this version serves the real build and reads the
 * rendered page's text content in headless Chrome instead.
 *
 * Add a surface by appending to SURFACES — nothing else in this file changes.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const data = await import(join(root, 'packages/data/portfolio.js'))

const SURFACES = [{ name: '3D Lab', distDir: 'apps/lab-3d/dist' }]

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p))
  if (!found) {
    throw new Error(
      'No headless-capable Chrome/Chromium found in the known locations. ' +
        'This check needs one to read the rendered DOM — see CHROME_CANDIDATES in this file.'
    )
  }
  return found
}

function requiredStrings() {
  const items = []
  for (const e of data.experience) {
    items.push({ label: `experience: ${e.title} @ ${e.company}`, needle: e.title })
    items.push({ label: `experience company: ${e.company}`, needle: e.company })
  }
  for (const p of data.projects) {
    items.push({ label: `project title: ${p.title}`, needle: p.title })
  }
  for (const w of data.earlierWork) {
    items.push({ label: `earlierWork: ${w.title}`, needle: w.title })
  }
  for (const [category, names] of Object.entries(data.skills)) {
    items.push({ label: `skill category: ${category}`, needle: category })
    for (const skill of names) items.push({ label: `skill: ${skill}`, needle: skill })
  }
  for (const a of data.achievements) {
    items.push({ label: `achievement: ${a.title}`, needle: a.title })
  }
  for (const ed of data.education) {
    items.push({ label: `education: ${ed.institution}`, needle: ed.institution })
  }
  return items
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }

function serveDir(absDir) {
  const server = createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0]
    const filePath = join(absDir, decodeURIComponent(urlPath))
    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end()
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(readFileSync(filePath))
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function renderedText(chrome, url) {
  // MUST be async (execFile, not execFileSync). The static server below runs
  // in-process on Node's event loop; a synchronous child-process call freezes
  // that loop while waiting for Chrome, which means Chrome's own request to
  // the server can never be accepted — a deadlock that manifests as this
  // command just hanging forever with zero output. Cost a debugging session
  // to find; do not "simplify" this back to execFileSync.
  //
  // --dump-dom needs scripting enabled and enough virtual time for React to
  // mount. There is no reliable "wait for React" signal from the CLI, so this
  // budget is generous; if this check ever starts flaking, raise it before
  // suspecting the app.
  const { stdout } = await execFileAsync(
    chrome,
    ['--headless=new', '--disable-gpu', '--virtual-time-budget=8000', '--dump-dom', url],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 32, timeout: 20_000 }
  )
  return stdout
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
}

const required = requiredStrings()
const chrome = findChrome()
let anyMissing = false

for (const surface of SURFACES) {
  const absDir = join(root, surface.distDir)
  if (!existsSync(join(absDir, 'index.html'))) {
    throw new Error(`${surface.distDir} has no index.html — build it before running parity-check.`)
  }

  const server = await serveDir(absDir)
  const port = server.address().port
  try {
    const text = await renderedText(chrome, `http://127.0.0.1:${port}/`)
    const missing = required.filter((item) => !text.includes(item.needle))

    if (missing.length === 0) {
      console.log(`✓ ${surface.name}: all ${required.length} content items rendered`)
    } else {
      anyMissing = true
      console.error(`✗ ${surface.name}: ${missing.length}/${required.length} items MISSING from rendered DOM`)
      for (const m of missing.slice(0, 20)) console.error(`    - ${m.label}`)
      if (missing.length > 20) console.error(`    ...and ${missing.length - 20} more`)
    }
  } finally {
    server.close()
  }
}

if (anyMissing) {
  console.error('\nParity check failed. See CLAUDE.md > Data and PRD.md FR-15.')
  process.exit(1)
} else {
  console.log('\nParity check passed for all registered surfaces (verified against rendered DOM).')
}
