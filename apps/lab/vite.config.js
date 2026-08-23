import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { experience } from '@zaidan/data'
import { buildTimeline, checkpointYears } from './src/lib/timeline.js'
import { renderStaticTimeline } from './src/lib/staticHtml.js'

/**
 * Writes the whole timeline into a <noscript> block at build time (LAB-C5).
 *
 * Without this the page is blank with JavaScript off, since nothing fills #root.
 * Generating it here rather than hand-maintaining static markup means the
 * fallback cannot drift away from the data.
 */
function noscriptTimeline() {
  return {
    name: 'lab-noscript-timeline',
    transformIndexHtml(html) {
      const checkpoints = buildTimeline(experience)
      const markup = renderStaticTimeline(checkpoints, checkpointYears)
      return html.replace('<div id="root"></div>', `<div id="root"></div>\n    <noscript>${markup}</noscript>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), noscriptTimeline()],
  // Distinct port so both apps can run side by side.
  server: { port: 5174 },
})
