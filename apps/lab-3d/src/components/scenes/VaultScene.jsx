import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { projects, earlierWork } from '@zaidan/data'
import SceneStage from '../SceneStage'
import { useScrollProgress } from '../../lib/useScrollProgress'
import {
  activeProjectIndex,
  faceProgress,
  baseRotation,
  snapToNearestFace,
  DRAG_DEGREES_PER_PIXEL,
} from '../../lib/vaultLayout'

/**
 * Scene 2 · Vault · verb: ROTATE (lab-3d.md §2.2) — projects as a four-face
 * prism you read around, not a page you flip.
 *
 * Unlike Corridor, the camera never moves here — the object does. One
 * project is active at a time; the overall scroll track is split into six
 * equal segments (one per project), and within a segment scroll rotates that
 * project's own prism through all four faces in order. The prism can also be
 * dragged by hand; releasing it snaps to whichever face is nearest so it
 * never rests at an unreadable angle (§2.2's "inersianya berhenti pas nyantol
 * ke muka terdekat").
 *
 * Faces sit at `rotateY(-i * 90deg) translateZ(RADIUS)` — see vaultLayout.js
 * for why that makes face `i` front-facing exactly when the container's own
 * rotateY reaches `i * 90`. RADIUS (240px) keeps every face's net DEPTH well
 * under --d-perspective (1200px), so this scene doesn't have Corridor's
 * exact failure mode (a ghost gate's netZ creeping toward the perspective
 * distance itself). But a rotated, translateZ-offset plane still swings
 * sideways across the screen as it turns — physically correct (a spinning
 * door's near edge visibly arcs toward the viewer), and on a wide desktop
 * viewport that arc stays comfortably inside the frame. On a narrow one it
 * doesn't: caught by scrolling for real at 375px and watching the front
 * face's face card swing to a `getBoundingClientRect()` right edge past
 * 477px. Same fix family as Corridor's: shrink the geometry (RADIUS and the
 * card's own width) on narrow viewports so the whole swing stays in frame.
 */
const HEIGHT_VH_PER_PROJECT = 100
const RADIUS = 240
const CARD_MAX_WIDTH = 480
const CARD_HEIGHT = 360

// Below this viewport width the prism's geometry shrinks proportionally —
// same reasoning as CorridorScene's SCALE_REFERENCE_WIDTH. Simulated the
// worst-case on-screen half-width across a full 360° rotation sweep to pick
// this: at the full-size geometry (scale 1), the swing's projected edge
// reaches ~354px from center, so anything below ~708px needs shrinking.
// 760 keeps real margin rather than sitting right at that edge.
const SCALE_REFERENCE_WIDTH = 760

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(1, window.innerWidth / SCALE_REFERENCE_WIDTH)
}

function ProjectFront({ project }) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--d-dim)]">
        {project.year} · {project.role}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--d-ink)]">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--d-muted)]">{project.subtitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--d-muted)]">{project.description}</p>
    </div>
  )
}

function ProjectRight({ project }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--d-dim)]">Highlights</p>
      {project.highlights?.length > 0 ? (
        <ul className="mt-3 space-y-2 text-left">
          {project.highlights.map((h, i) => (
            <li key={i} className="text-[13px] leading-relaxed text-[var(--d-muted)]">
              {h}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--d-dim)]">{project.description}</p>
      )}
    </div>
  )
}

function ProjectLeft({ project }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--d-dim)]">Stack</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-full border border-[var(--d-line)] px-2.5 py-1 font-mono text-xs text-[var(--d-muted)]"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectBack({ project }) {
  return (
    <div className="text-center">
      {project.internal ? (
        <span className="rounded-full border border-[var(--d-line)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[var(--d-dim)]">
          Internal
        </span>
      ) : project.links?.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {project.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--d-accent)] underline underline-offset-4"
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--d-dim)]">No public link yet.</p>
      )}
    </div>
  )
}

// Order matches the ASCII diagram in lab-3d.md §2.2: front, right, back, left.
const FACES = [ProjectFront, ProjectRight, ProjectBack, ProjectLeft]

function EarlierWorkCard({ work, index, count, scale }) {
  const spread = count > 1 ? (index / (count - 1) - 0.5) * 2 : 0 // -1..1 across the row
  const tilt = index % 2 === 0 ? 16 : -16
  return (
    <a
      href={work.href}
      target="_blank"
      rel="noreferrer"
      className="absolute left-1/2 top-1/2 block w-40 -translate-x-1/2 -translate-y-1/2 border border-[var(--d-line)] bg-[var(--d-plane)] p-3 text-left no-underline"
      style={{
        transform: `translate(-50%, -50%) translateX(${spread * 260 * scale}px) translateZ(${-520 * scale}px) rotateY(${tilt}deg)`,
      }}
    >
      <p className="font-display text-xs font-semibold text-[var(--d-ink)]">{work.title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-[var(--d-dim)]">{work.note}</p>
      <p className="mt-1 font-mono text-[10px] text-[var(--d-dim)]">
        {work.year} · {work.tech}
      </p>
    </a>
  )
}

export default function VaultScene({ flat }) {
  const count = projects.length
  const [trackRef, progress] = useScrollProgress()
  const activeIdx = activeProjectIndex(progress, count)
  const fp = faceProgress(progress, count)
  const scrollTheta = baseRotation(fp)
  const activeProject = projects[activeIdx]

  const [manualOffset, setManualOffset] = useState(0)
  const [scale, setScale] = useState(computeScale)
  const dragRef = useRef(null)
  const snapAnimRef = useRef(null)

  // A new prism swapped in — start it clean rather than carrying over the
  // previous project's drag offset onto an unrelated object.
  useEffect(() => {
    snapAnimRef.current?.revert()
    dragRef.current = null
    setManualOffset(0)
  }, [activeIdx])

  useEffect(() => () => snapAnimRef.current?.revert(), [])

  useEffect(() => {
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (flat) {
    return (
      <section aria-labelledby="projects-heading" className="mx-auto mt-16 max-w-3xl px-6">
        <h2 id="projects-heading" className="font-display text-2xl font-semibold text-[var(--d-ink)]">
          Projects
        </h2>
        <ul className="mt-6 grid gap-6 border-t border-[var(--d-line)] pt-6 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id} id={`project-${p.id}`} className="border border-[var(--d-line)] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-[var(--d-ink)]">{p.title}</h3>
                {p.internal && (
                  <span className="rounded-full border border-[var(--d-line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--d-dim)]">
                    Internal
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--d-dim)]">{p.subtitle}</p>
              <p className="mt-1 text-xs text-[var(--d-dim)]">
                {p.role} · {p.year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--d-muted)]">{p.description}</p>
              {p.highlights?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="text-[13px] leading-relaxed text-[var(--d-muted)]">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[var(--d-line)] px-2 py-0.5 font-mono text-[11px] text-[var(--d-dim)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {p.links?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[var(--d-accent)] underline underline-offset-4"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-lg font-semibold text-[var(--d-ink)]">Earlier work</h3>
        <ul className="mt-4 divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
          {earlierWork.map((w) => (
            <li key={w.title} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-sm font-semibold text-[var(--d-ink)] underline decoration-[var(--d-line)] underline-offset-4"
                >
                  {w.title}
                </a>
                <span className="ml-2 text-xs text-[var(--d-dim)]">{w.note}</span>
              </span>
              <span className="font-mono text-xs text-[var(--d-dim)]">
                {w.year} · {w.tech}
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const theta = scrollTheta + manualOffset

  const onPointerDown = (e) => {
    snapAnimRef.current?.revert()
    dragRef.current = { startX: e.clientX, startOffset: manualOffset }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    setManualOffset(dragRef.current.startOffset + dx * DRAG_DEGREES_PER_PIXEL)
  }
  const onPointerUp = () => {
    if (!dragRef.current) return
    dragRef.current = null
    const snappedTotal = snapToNearestFace(scrollTheta + manualOffset)
    const targetOffset = snappedTotal - scrollTheta
    const tween = { value: manualOffset }
    snapAnimRef.current = animate(tween, {
      value: targetOffset,
      duration: 350,
      ease: 'outCubic',
      onUpdate: () => setManualOffset(tween.value),
    })
  }

  // scale already tracks viewport width (1 at >=700px, shrinking below that),
  // so it alone governs how far the card and its swing radius shrink — no
  // separate vw-based clamp needed on top of it.
  const cardWidth = Math.min(CARD_MAX_WIDTH * scale, window.innerWidth * 0.85)
  const radius = RADIUS * scale

  return (
    <SceneStage trackRef={trackRef} heightVh={HEIGHT_VH_PER_PROJECT * count}>
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {earlierWork.map((w, i) => (
          <EarlierWorkCard key={w.title} work={w} index={i} count={earlierWork.length} scale={scale} />
        ))}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative"
          style={{
            width: cardWidth,
            height: CARD_HEIGHT * scale,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${theta}deg)`,
            cursor: 'grab',
          }}
        >
          {FACES.map((Face, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center border border-[var(--d-line)] bg-[var(--d-plane)] p-8"
              style={{
                transform: `rotateY(${-i * 90}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <Face project={activeProject} />
            </div>
          ))}
        </div>
      </div>
    </SceneStage>
  )
}
