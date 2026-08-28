#!/usr/bin/env node
/**
 * Checks that the 3D scene rig's transform-style chain is intact
 * (lab-3d.md §3.1). This exists because the failure mode is silent: a stray
 * `overflow: hidden`, `filter`, or `opacity < 1` on `.lab3d-camera` or
 * `.lab3d-world` flattens every scene inside it, with zero console error and
 * the objects still rendering — just flat. "Looks fine, isn't" is exactly the
 * kind of bug that needs an automated check instead of a human staring at it.
 *
 * Reuses the render-and-inspect approach from parity-check.mjs (async
 * execFile, not execFileSync — see that file for why the sync version
 * deadlocks against an in-process static server).
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const root = dirname(dirname(fileURLToPath(import.meta.url)))

const SURFACES = [{ name: '3D Lab', distDir: 'apps/lab-3d/dist' }]

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]
function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p))
  if (!found) throw new Error('No headless-capable Chrome/Chromium found.')
  return found
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }
function serveDir(absDir) {
  const server = createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0]
    const filePath = join(absDir, decodeURIComponent(urlPath))
    if (!existsSync(filePath)) return res.writeHead(404).end()
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(readFileSync(filePath))
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

// --dump-dom can't execute arbitrary JS and hand back a structured result, so
// the probe below writes its findings into document.title (readable straight
// out of the dumped HTML) instead of pulling in a full CDP client for one
// value. It's copied into a sibling file next to the real build rather than
// served inline, so relative asset paths in the built index.html keep working.

const required = SURFACES
let anyBroken = false

for (const surface of required) {
  const absDir = join(root, surface.distDir)
  if (!existsSync(join(absDir, 'index.html'))) {
    throw new Error(`${surface.distDir} has no index.html — build it before running this check.`)
  }

  const html = readFileSync(join(absDir, 'index.html'), 'utf8')
  const probeScript = `
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const results = [];
    document.querySelectorAll('.lab3d-camera').forEach((camera, i) => {
      const world = camera.querySelector('.lab3d-world');
      const cameraCS = getComputedStyle(camera);
      const worldCS = world ? getComputedStyle(world) : null;
      results.push({
        index: i,
        cameraPerspective: cameraCS.perspective,
        cameraOverflow: cameraCS.overflow,
        cameraFilter: cameraCS.filter,
        cameraOpacity: cameraCS.opacity,
        worldTransformStyle: worldCS ? worldCS.transformStyle : 'MISSING .lab3d-world',
        worldOverflow: worldCS ? worldCS.overflow : null,
        worldFilter: worldCS ? worldCS.filter : null,
        worldOpacity: worldCS ? worldCS.opacity : null,
      });
    });
    document.title = 'PRESERVE3D:' + JSON.stringify(results);
  }, 400);
});
</script>`
  const injectedHtml = html.replace('</body>', `${probeScript}</body>`)
  const probeFilePath = join(absDir, '__preserve3d_probe.html')
  const { writeFileSync, unlinkSync } = await import('node:fs')
  writeFileSync(probeFilePath, injectedHtml)

  const server = await serveDir(absDir)
  const port = server.address().port
  try {
    const chrome = findChrome()
    const { stdout } = await execFileAsync(
      chrome,
      ['--headless=new', '--disable-gpu', '--virtual-time-budget=6000', '--dump-dom', `http://127.0.0.1:${port}/__preserve3d_probe.html`],
      { encoding: 'utf8', maxBuffer: 1024 * 1024 * 32, timeout: 20_000 }
    )
    const match = stdout.match(/<title>PRESERVE3D:(.*?)<\/title>/s)
    if (!match) {
      anyBroken = true
      console.error(`✗ ${surface.name}: probe did not report back — page may have errored before mount`)
      continue
    }
    const results = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))

    if (results.length === 0) {
      console.log(`- ${surface.name}: no .lab3d-camera elements found (no scenes shipped yet)`)
      continue
    }

    for (const r of results) {
      const problems = []
      if (r.cameraPerspective === 'none') problems.push('camera perspective is "none"')
      if (r.cameraOverflow !== 'visible') problems.push(`camera overflow is "${r.cameraOverflow}", must be visible`)
      if (r.cameraFilter !== 'none') problems.push(`camera filter is "${r.cameraFilter}", must be none`)
      if (r.cameraOpacity !== '1') problems.push(`camera opacity is ${r.cameraOpacity}, must be 1`)
      if (r.worldTransformStyle !== 'preserve-3d') problems.push(`world transform-style is "${r.worldTransformStyle}", must be preserve-3d`)
      if (r.worldOverflow !== 'visible') problems.push(`world overflow is "${r.worldOverflow}", must be visible`)
      if (r.worldFilter !== 'none') problems.push(`world filter is "${r.worldFilter}", must be none`)
      if (r.worldOpacity !== '1') problems.push(`world opacity is ${r.worldOpacity}, must be 1`)

      if (problems.length === 0) {
        console.log(`✓ ${surface.name} scene ${r.index}: preserve-3d chain intact`)
      } else {
        anyBroken = true
        console.error(`✗ ${surface.name} scene ${r.index}: chain broken —`)
        problems.forEach((p) => console.error(`    - ${p}`))
      }
    }
  } finally {
    server.close()
    unlinkSync(probeFilePath)
  }
}

if (anyBroken) {
  console.error('\npreserve-3d check failed. See lab-3d.md §3.1.')
  process.exit(1)
} else {
  console.log('\npreserve-3d check passed.')
}
