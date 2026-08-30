import { useState } from 'react'

function parseHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

/**
 * Hash-based URL ↔ path sync (TERM-A4). `initialPath` is read once, on
 * mount, for App.jsx to resolve against the filesystem and land directly on
 * — a file if the URL pointed at one, a directory otherwise. `syncPath` is
 * the other direction: called whenever `cd` changes the cwd, so the URL
 * stays shareable. Plain `location.hash` assignment (not
 * pushState/replaceState) deliberately — hash changes already produce
 * sensible back/forward history entries on their own.
 */
export function useRouter() {
  const [initialPath] = useState(parseHash)

  function syncPath(path) {
    const hash = `#/${path}`
    if (window.location.hash !== hash) {
      window.location.hash = hash
    }
  }

  return { initialPath, syncPath }
}
