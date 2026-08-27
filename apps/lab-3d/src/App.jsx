import FlatContent from './components/FlatContent'

/*
 * Phase 2 scaffold: renders the full content baseline with no 3D chrome yet.
 * This IS the flat-mode / reduced-motion target that later phases (3D-1
 * onward) layer scenes on top of — see lab-3d.md §4.3. Nothing here should be
 * deleted as scenes are added; scenes wrap this content, they do not replace
 * it.
 *
 * No anime.js code yet, per CLAUDE.md: motion is written only in a session
 * that has read docs/animejs-v4-notes.md, which starts in 3D-1.
 */
export default function App() {
  return <FlatContent />
}
