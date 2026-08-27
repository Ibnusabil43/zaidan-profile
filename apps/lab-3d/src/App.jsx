import ApproachScene from './components/scenes/ApproachScene'
import ProfileHeader from './components/sections/ProfileHeader'
import FlatContent from './components/FlatContent'
import FlatModeToggle from './components/FlatModeToggle'
import { useFlatMode } from './lib/useFlatMode'

/**
 * Single <main> landmark for the whole page. Header/scene and the rest of the
 * content share it — they used to each own their own <main>, which is invalid
 * page structure (one main landmark per page).
 *
 * flat is true either because the visitor toggled it, or because the OS says
 * prefers-reduced-motion (useFlatMode handles both). Scenes ship one at a
 * time (3D-1 Approach now; Corridor/Vault/Lattice/Case/Exit in the phases
 * after) — until they all exist, everything past the header renders through
 * FlatContent regardless of mode. That is not a shortcut: it is the same
 * "release each layer before starting the next" rule as everywhere else in
 * this project (PRD G-4), applied to individual scenes instead of phases.
 */
export default function App() {
  const [flat, setFlat] = useFlatMode()

  return (
    <>
      <FlatModeToggle flat={flat} onChange={setFlat} />
      <main>
        {flat ? (
          <div className="mx-auto max-w-3xl px-6 pt-20">
            <ProfileHeader />
          </div>
        ) : (
          <ApproachScene flat={false} />
        )}
        <FlatContent />
      </main>
    </>
  )
}
