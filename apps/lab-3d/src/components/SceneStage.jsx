/**
 * The camera rig every 3D scene sits inside.
 *
 * lab-3d.md §3.1 is blunt about this: `transform-style: preserve-3d` is NOT
 * inherited through an element that creates a new stacking context. One
 * stray `overflow: hidden`, `filter`, or `opacity < 1` anywhere in this chain
 * silently flattens everything below it — no console error, the objects
 * still render, they just stop looking 3D. So this file is the one place
 * that chain is allowed to be defined, and nothing downstream may add
 * overflow/filter/opacity to `.lab3d-camera` or `.lab3d-world`.
 *
 * Structure: a tall `track` div provides the scroll distance a scene scrubs
 * across; a `position: sticky` `viewport` pins the actual 3D content while
 * the track scrolls past it. `heightVh` controls how much scroll the scene
 * consumes — more vh means slower, more deliberate motion per pixel scrolled.
 */
export default function SceneStage({ trackRef, heightVh = 300, children, className = '' }) {
  return (
    <section ref={trackRef} className={className} style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="lab3d-camera relative h-full w-full"
          style={{ perspective: 'var(--d-perspective)' }}
        >
          <div
            className="lab3d-world absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
