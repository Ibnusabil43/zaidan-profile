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
 * A second gap showed up once CorridorScene (3D-2) shipped: it virtualizes
 * its content, so a SINGLE snapshot at scrollY=0 only sees the few gates
 * nearest the top and reports the rest as missing — which they are not, they
 * are just not scrolled to yet. So this check scrolls through the page in
 * SCROLL_STEPS even increments and unions what was visible at each stop,
 * rather than trusting one frozen moment.
 *
 * Add a surface by appending to SURFACES — nothing else in this file changes.
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const data = await import(join(root, 'packages/data/portfolio.js'))

const SURFACES = [{ name: '3D Lab', distDir: 'apps/lab-3d/dist' }]

// How many even scroll steps to sample. Raise this if a future scene needs a
// finer sweep to reveal everything it owns — don't special-case that scene.
const SCROLL_STEPS = 12

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

/**
 * Renders `port`'s page, scrolls through it, and returns the union of visible
 * text across every stop. The probe is written into `absDir` as a sibling of
 * the real index.html (not fetched-and-reinjected over HTTP) so the built
 * page's relative asset URLs — Vite's hashed JS/CSS filenames — resolve
 * exactly as they do for a real visitor.
 *
 * MUST use execFile (async), not execFileSync: the static server above runs
 * in-process on Node's event loop, and a synchronous child-process call
 * freezes that loop while waiting for Chrome — which means Chrome's own
 * request to the server can never be accepted. That deadlock manifests as
 * this command hanging forever with zero output. Cost a debugging session to
 * find once already; do not reintroduce it.
 */
async function renderedText(chrome, absDir, port) {
  const probeName = '__parity_probe.html'
  const realHtml = readFileSync(join(absDir, 'index.html'), 'utf8')
  const probeScript = `
<script>
// Two things had to be fixed here after the first version silently under-read:
//
// 1. Uses textContent, not innerText. innerText is layout-dependent — Chrome
//    computes it from the live rendered box tree, and reading it immediately
//    after a DOM change (before layout/paint settle) can return stale or
//    partial text with no error. textContent reads the DOM tree directly, so
//    it can't be timing-flaky the same way. It doesn't tell us anything is
//    "visible" — but CorridorScene's virtualization actually MOUNTS AND
//    UNMOUNTS gates (not just CSS-hides them), so "present in the DOM" is
//    exactly the thing worth checking anyway.
//
// 2. Fires a 'resize' event alongside each 'scroll', not just 'scroll' on its
//    own. useScrollProgress's scroll handler coalesces through a single
//    requestAnimationFrame gate (see useScrollProgress.js) — real visitors
//    never notice because real compositor frames keep arriving, but in this
//    headless + --virtual-time-budget combination that rAF fires reliably
//    ONCE per page load (needed to satisfy --dump-dom's own render) and never
//    again, so every 'scroll' after step 0 was silently dropped and every
//    read reflected the SAME initial mount — indistinguishable from "still
//    only one snapshot," the exact bug this rewrite exists to fix. The
//    hook's 'resize' listener calls measure() directly with no rAF gate, so
//    dispatching it forces the same remeasurement a real frame would have,
//    without touching the production listener.
window.addEventListener('load', () => {
  // A plain setTimeout wait, not requestAnimationFrame — rAF is tied to
  // compositor frame production, which does not reliably fire under
  // --virtual-time-budget in headless --dump-dom mode (confirmed: the first
  // version of this probe using raf hung until the whole budget elapsed and
  // never reported back). setTimeout is exactly what --virtual-time-budget
  // is meant to accelerate deterministically, so it is the correct primitive
  // here even though rAF is normally the "right" way to wait for a render.
  const settle = () => new Promise((r) => setTimeout(r, 80));
  (async () => {
    await new Promise((r) => setTimeout(r, 400));
    const snapshots = [];
    const steps = ${SCROLL_STEPS};
    const maxY = Math.max(0, document.body.scrollHeight - window.innerHeight);
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, Math.round((maxY * i) / steps));
      window.dispatchEvent(new Event('scroll'));
      // CorridorScene's useScrollProgress coalesces 'scroll' through a single
      // requestAnimationFrame gate (only measure once per pending frame). In
      // this exact headless + --virtual-time-budget combination that rAF
      // fires reliably ONCE per page load (needed to satisfy --dump-dom's
      // own render) and then never again — so after step 0, frame.current
      // stays truthy forever and every later 'scroll' is silently dropped.
      // Real visitors never hit this because real compositor frames keep
      // coming; only this synthetic probe does. The hook's OTHER listener,
      // 'resize', calls measure() directly with no rAF gate at all, so firing
      // it here forces the same synchronous remeasurement a real frame would
      // have produced, without changing the production listener itself.
      window.dispatchEvent(new Event('resize'));
      await settle();
      snapshots.push(document.body.textContent);
    }
    // Joined with a separator, not deduped line-by-line: React's rendered
    // text has no reliable line structure to split on (JSX collapses
    // whitespace between elements), so this just concatenates every
    // snapshot and lets the caller do a plain substring search across all
    // of them at once.
    document.title = 'PARITY:' + encodeURIComponent(snapshots.join(' <<SNAPSHOT>> '));
  })();
});
</script>`
  writeFileSync(join(absDir, probeName), realHtml.replace('</body>', `${probeScript}</body>`))

  try {
    const { stdout } = await execFileAsync(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--virtual-time-budget=20000',
        '--dump-dom',
        `http://127.0.0.1:${port}/${probeName}`,
      ],
      { encoding: 'utf8', maxBuffer: 1024 * 1024 * 32, timeout: 30_000 }
    )
    const match = stdout.match(/<title>PARITY:(.*?)<\/title>/s)
    if (!match) throw new Error('Probe did not report back — page may have errored before mount.')
    return decodeURIComponent(match[1])
  } finally {
    unlinkSync(join(absDir, probeName))
  }
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
    const text = await renderedText(chrome, absDir, port)
    const missing = required.filter((item) => !text.includes(item.needle))

    if (missing.length === 0) {
      console.log(`✓ ${surface.name}: all ${required.length} content items rendered across a full scroll`)
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
  console.log('\nParity check passed for all registered surfaces (verified against rendered DOM, scrolled through).')
}
