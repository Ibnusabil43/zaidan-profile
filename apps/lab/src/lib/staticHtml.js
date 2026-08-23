/**
 * Renders the timeline as plain HTML at build time, for the `<noscript>` block.
 *
 * Why this exists at all: this is a client-rendered React app, so with JavaScript
 * disabled the page is blank — `#root` never gets filled. PRD FR-12 and
 * acceptance criterion §9.8 require the content to stay readable anyway, so the
 * markup has to be produced during the build and shipped inside index.html.
 *
 * This is a SECOND renderer alongside CheckpointPanel.jsx, which is duplication
 * and worth being honest about: add a field to the panel and you must add it
 * here too. It is deliberate — pulling react-dom/server plus JSX transformation
 * into vite.config.js to share one renderer costs more than these few lines. Keep
 * this one minimal; it only owes the reader the words, not the design.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c])
}

export function renderStaticTimeline(checkpoints, years) {
  const sections = checkpoints
    .map((cp) => {
      const roles = cp.roles
        .map(
          (role) => `
        <div class="mt-6">
          <h3 class="font-display text-base font-semibold text-ink-950">${esc(role.title)}</h3>
          <p class="mt-1 text-sm text-ink-500">${esc(role.company)}${
            role.location ? ` · ${esc(role.location)}` : ''
          }</p>
          <p class="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-400">${esc(
            role.period
          )} · ${esc(role.type)}</p>
          <ul class="mt-4 space-y-2">
            ${role.responsibilities
              .map((r) => `<li class="text-sm leading-relaxed text-ink-600">${esc(r)}</li>`)
              .join('\n            ')}
          </ul>
        </div>`
        )
        .join('')

      return `
      <article class="border-t border-ink-200 py-8">
        <div class="flex items-baseline gap-4">
          <span class="font-mono text-xs tracking-widest text-ink-400">${esc(years(cp))}</span>
          <h2 class="font-display text-xl font-semibold tracking-tight text-ink-950">${esc(
            cp.label
          )}</h2>
        </div>${roles}
      </article>`
    })
    .join('')

  return `
  <div class="mx-auto max-w-3xl px-6 py-20">
    <p class="font-mono text-xs uppercase tracking-[0.25em] text-ink-500">Career map · ${esc(
      checkpoints[0].startYear
    )}–now</p>
    <h1 class="mt-6 font-display text-4xl font-bold tracking-tight text-ink-950">Where I have been working.</h1>
    <p class="mt-6 text-sm leading-relaxed text-ink-600">
      The interactive map needs JavaScript. Everything it shows is written out below.
    </p>
    ${sections}
  </div>`
}
