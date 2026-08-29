import { findNode } from '../lib/filesystem.js'
import { parseMarkdown, parseInline } from '../lib/markdown.js'

function renderInline(text, keyPrefix) {
  return parseInline(text).map((token, i) => {
    const key = `${keyPrefix}-${i}`
    if (token.type === 'bold') return <strong key={key}>{token.text}</strong>
    if (token.type === 'code') return <code key={key}>{token.text}</code>
    if (token.type === 'link') {
      return (
        <a key={key} href={token.href} target="_blank" rel="noreferrer" style={{ color: 'var(--t-accent)' }}>
          {token.text}
        </a>
      )
    }
    return token.text
  })
}

function Block({ block, index }) {
  if (block.type === 'hr') {
    return <hr key={index} style={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} className="my-6" />
  }
  if (block.type === 'heading') {
    const Tag = block.level === 1 ? 'h1' : 'h2'
    const size = block.level === 1 ? 'text-2xl' : 'text-lg'
    return (
      <Tag key={index} className={`${size} mt-6 font-semibold first:mt-0`} style={{ color: 'var(--t-fg)' }}>
        {renderInline(block.text, index)}
      </Tag>
    )
  }
  if (block.type === 'list') {
    return (
      <ul key={index} className="mt-3 space-y-1.5 pl-5" style={{ color: 'var(--t-muted)' }}>
        {block.items.map((item, i) => (
          <li key={i} className="list-disc leading-relaxed">
            {renderInline(item, `${index}-${i}`)}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p key={index} className="mt-3 leading-relaxed" style={{ color: 'var(--t-muted)' }}>
      {renderInline(block.text, index)}
    </p>
  )
}

function ResumeCard({ resume, mainUrl }) {
  const href = resume.available ? `${mainUrl}/${resume.filename}` : undefined
  return (
    <div className="border p-6 text-center" style={{ borderColor: 'rgba(148, 163, 184, 0.2)' }}>
      <p className="font-mono text-xs" style={{ color: 'var(--t-dim)' }}>
        {resume.filename}
      </p>
      {resume.available ? (
        <a
          href={href}
          download
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: 'var(--t-accent)', color: 'var(--t-bg)' }}
        >
          {resume.label}
        </a>
      ) : (
        <>
          <span
            aria-disabled="true"
            className="mt-4 inline-block rounded px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: 'var(--t-panel)', color: 'var(--t-dim)' }}
          >
            {resume.label}
          </span>
          <p className="mt-2 text-xs" style={{ color: 'var(--t-dim)' }}>
            Coming soon — not uploaded yet.
          </p>
        </>
      )}
    </div>
  )
}

/**
 * The document-reading surface (lab-term.md §2.3). Renders whichever file
 * `cat` (or a sidebar click) most recently marked previewable — same
 * `node.render()` markdown the terminal prints, just parsed into real
 * typography here instead of shown raw. `resume.pdf` isn't a document, so it
 * gets its own small branch instead of going through the markdown reader.
 */
export default function Preview({ root, previewPath, mainUrl }) {
  if (!previewPath) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm" style={{ color: 'var(--t-dim)' }}>
        Select a file to read it here — click the sidebar, or `cat` it in the terminal.
      </div>
    )
  }

  const node = findNode(root, previewPath)
  if (!node || node.type !== 'file') {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm" style={{ color: 'var(--t-dim)' }}>
        Nothing to show.
      </div>
    )
  }

  if (node.kind === 'resume') {
    return (
      <div className="h-full overflow-y-auto p-6">
        <ResumeCard resume={node.data} mainUrl={mainUrl} />
      </div>
    )
  }

  const blocks = parseMarkdown(node.render())

  return (
    <div className="h-full overflow-y-auto p-6">
      <article className="prose-doc">
        {blocks.map((block, i) => (
          <Block key={i} block={block} index={i} />
        ))}
      </article>
    </div>
  )
}
