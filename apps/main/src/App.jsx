import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Achievements from './components/sections/Achievements'
import Lab from './components/sections/Lab'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="grain relative min-h-screen bg-ink-0 text-ink-950 dark:bg-ink-950 dark:text-ink-50">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Lab />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
