import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import SceneStage from '../SceneStage'
import { useScrollProgress } from '../../lib/useScrollProgress'
import { ProfileStatus, ProfileName, ProfileSummary } from '../sections/ProfileHeader'

/**
 * Scene 0 · Approach · verb: EMERGE (lab-3d.md §2.0, §1.1).
 *
 * Three layers of the profile header rise from different depths toward the
 * reading plane (Z: 0) as the visitor scrolls. They are the same
 * ProfileStatus/ProfileName/ProfileSummary pieces FlatContent renders in plain
 * flow — composed differently here, not re-authored (lab-3d.md §4.3).
 *
 * Scrubbing follows animejs-v4-notes.md exactly: one `animate()` per layer,
 * `autoplay: false`, driven every frame via `anim.progress = p`. `ease:
 * 'linear'` is mandatory here — progress is driven by scroll position, so the
 * visitor's own scrolling IS the easing function; any curve on top would make
 * the layers lag or overtake the scroll.
 */
const LAYERS = [
  { Content: ProfileStatus, fromZ: -800 },
  { Content: ProfileName, fromZ: -400 },
  { Content: ProfileSummary, fromZ: 0 },
]

export default function ApproachScene({ flat }) {
  const [trackRef, progress] = useScrollProgress()
  const layerRefs = useRef([])
  const animRefs = useRef([])

  useEffect(() => {
    if (flat) return
    animRefs.current = layerRefs.current.map((el, i) =>
      el
        ? animate(el, {
            translateZ: [LAYERS[i].fromZ, 0],
            // Floor of 0.08, not 0. At progress 0 (before any scroll) a visitor
            // must see SOMETHING — a hint that there is content to reveal — or
            // the first screen is just blank white with no affordance to
            // scroll. Fully-transparent-at-rest was the first version of this
            // and it was a real defect, not a style choice.
            opacity: [0.08, 1],
            duration: 1000,
            ease: 'linear',
            autoplay: false,
          })
        : null
    )
    return () => {
      // .revert(), not .pause() — pause leaves the last scrubbed inline
      // transform/opacity behind on the element (animejs-v4-notes.md).
      animRefs.current.forEach((a) => a?.revert())
      animRefs.current = []
    }
  }, [flat])

  useEffect(() => {
    if (flat) return
    animRefs.current.forEach((a) => {
      if (a) a.progress = progress
    })
  }, [progress, flat])

  if (flat) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="space-y-4">
          <ProfileStatus />
          <ProfileName />
          <ProfileSummary />
        </div>
      </section>
    )
  }

  return (
    <SceneStage trackRef={trackRef} heightVh={200}>
      <div className="mx-auto flex h-full max-w-3xl flex-col justify-center gap-4 px-6">
        {LAYERS.map(({ Content }, i) => (
          <div
            key={i}
            ref={(el) => {
              layerRefs.current[i] = el
            }}
            style={{ transform: `translateZ(${LAYERS[i].fromZ}px)`, opacity: 0.08 }}
          >
            <Content />
          </div>
        ))}
      </div>
    </SceneStage>
  )
}
