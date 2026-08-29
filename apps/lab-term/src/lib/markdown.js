/**
 * A hand-rolled markdown reader for exactly the subset this project's own
 * `render()` output uses — headings, lists, bold, inline code, links, `---`,
 * and plain paragraphs (lab-term.md §2.3). Not a general parser: the moment
 * real content needs tables, nested blockquotes, or fenced code, stop
 * patching this and pull in a real library — NFR-2's budget has room for
 * one. Until then this is dozens of lines, not a dependency.
 *
 * `parseInline`'s regex only recognizes explicit delimiter *pairs*
 * (`**bold**`, `` `code` ``, `[text](url)`) — a lone `*` never matches
 * anything and passes through as plain text. That's what keeps
 * "field autocomplete for I_F.* tables" (a real highlight in the data)
 * intact instead of being swallowed as a broken bold marker; see the test
 * in TERM-C1's checkpoint notes for the exact case this protects.
 */

export function parseMarkdown(source) {
  const lines = source.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }
    if (line.trim() === '---') {
      blocks.push({ type: 'hr' })
      i++
      continue
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3) })
      i++
      continue
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: line.slice(2) })
      i++
      continue
    }
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      lines[i].trim() !== '---' &&
      !lines[i].startsWith('# ') &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('- ')
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
  }

  return blocks
}

const INLINE_PATTERN = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/

/** Splits one line of text into `{type, text, href?}` inline tokens. */
export function parseInline(text) {
  const tokens = []
  let rest = text

  while (rest.length > 0) {
    const m = rest.match(INLINE_PATTERN)
    if (!m) {
      tokens.push({ type: 'text', text: rest })
      break
    }
    if (m.index > 0) tokens.push({ type: 'text', text: rest.slice(0, m.index) })
    if (m[1] !== undefined) tokens.push({ type: 'bold', text: m[1] })
    else if (m[2] !== undefined) tokens.push({ type: 'code', text: m[2] })
    else if (m[3] !== undefined) tokens.push({ type: 'link', text: m[3], href: m[4] })
    rest = rest.slice(m.index + m[0].length)
  }

  return tokens
}
