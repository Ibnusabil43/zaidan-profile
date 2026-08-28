import ApproachScene from './components/scenes/ApproachScene'
import CorridorScene from './components/scenes/CorridorScene'
import VaultScene from './components/scenes/VaultScene'
import ProfileHeader from './components/sections/ProfileHeader'
import FlatContent from './components/FlatContent'
import FlatModeToggle from './components/FlatModeToggle'
import ThemeToggle from './components/ThemeToggle'
import { useFlatMode } from './lib/useFlatMode'
import { useTheme } from './lib/useTheme'

/**
 * Single <main> landmark for the whole page. Header/scene and the rest of the
 * content share it — they used to each own their own <main>, which is invalid
 * page structure (one main landmark per page).
 *
 * flat is true either because the visitor toggled it, or because the OS says
 * prefers-reduced-motion (useFlatMode handles both). Scenes ship one at a
 * time (3D-1 Approach, 3D-2 Corridor, 3D-3 Vault now; Lattice/Case/Exit in
 * the phase after) — until they all exist, everything past Vault renders
 * through FlatContent regardless of mode. That is not a shortcut: it is the
 * same "release each layer before starting the next" rule as everywhere else
 * in this project (PRD G-4), applied to individual scenes instead of phases.
 */
export default function App() {
  const [flat, setFlat] = useFlatMode()
  const [dark, setDark] = useTheme()

  return (
    <>
      <FlatModeToggle flat={flat} onChange={setFlat} />
      <ThemeToggle dark={dark} onChange={setDark} />
      <main>
        {flat ? (
          <div className="mx-auto max-w-3xl px-6 pt-20">
            <ProfileHeader />
          </div>
        ) : (
          <ApproachScene flat={false} />
        )}
        <CorridorScene flat={flat} />
        <VaultScene flat={flat} />
        <FlatContent />
      </main>
    </>
  )
}
