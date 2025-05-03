import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Contexts
import { useTheme } from './contexts/ThemeContext'
import { useAudio } from './contexts/AudioContext'

// Layouts
import HolographicNav from './components/layout/HolographicNav'
import DigitalFooter from './components/layout/DigitalFooter'
import AmbientBackground from './components/layout/AmbientBackground'
import CyberLoader from './components/common/CyberLoader'

// Eager loaded components
import HeroSection from './components/sections/HeroSection'

// Lazy loaded components for code splitting
const ProjectsGrid = lazy(() => import('./components/sections/ProjectsGrid'))
const HolographicTimeline = lazy(() => import('./components/sections/HolographicTimeline'))
const TechStackGalaxy = lazy(() => import('./components/sections/TechStackGalaxy'))
const AITerminal = lazy(() => import('./components/sections/AITerminal'))
const ContactPortal = lazy(() => import('./components/sections/ContactPortal'))
const ResumeHologram = lazy(() => import('./components/sections/ResumeHologram'))

function App() {
  const location = useLocation()
  const { theme } = useTheme()
  const { initializeAudio } = useAudio()
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulating content loading
  useEffect(() => {
    // Wait for boot sequence to complete in index.html
    const bootSequence = document.getElementById('boot-sequence')
    
    const checkBoot = () => {
      if (bootSequence && bootSequence.style.display === 'none') {
        // Boot sequence completed, now load the main app with a delay
        setTimeout(() => {
          setIsLoading(false)
          // Initialize audio after user interaction
          window.addEventListener('click', initializeAudio, { once: true })
        }, 500)
      } else {
        setTimeout(checkBoot, 100) // Check again in 100ms
      }
    }
    
    checkBoot()
    
    // Clean up
    return () => {
      window.removeEventListener('click', initializeAudio)
    }
  }, [initializeAudio])
  
  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.className = 'cyber-cursor'
    document.body.appendChild(cursor)
    
    const cursorDot = document.createElement('div')
    cursorDot.className = 'cyber-cursor-dot'
    document.body.appendChild(cursorDot)
    
    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      
      cursorDot.style.left = `${e.clientX}px`
      cursorDot.style.top = `${e.clientY}px`
    }
    
    window.addEventListener('mousemove', moveCursor)
    
    // Interactive elements cursor effect
    const handleMouseEnter = () => {
      cursor.classList.add('expand')
    }
    
    const handleMouseLeave = () => {
      cursor.classList.remove('expand')
    }
    
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })
    
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.removeChild(cursor)
      document.body.removeChild(cursorDot)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])
  
  if (isLoading) {
    return <CyberLoader />
  }
  
  return (
    <div className={`app-container ${theme}-theme`}>
      <AmbientBackground />
      
      <HolographicNav />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <>
                  <HeroSection />
                  <Suspense fallback={<CyberLoader />}>
                    <ProjectsGrid />
                    <TechStackGalaxy />
                    <HolographicTimeline />
                  </Suspense>
                </>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <ProjectsGrid fullPage={true} />
                </Suspense>
              } 
            />
            <Route 
              path="/experience" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <HolographicTimeline fullPage={true} />
                </Suspense>
              } 
            />
            <Route 
              path="/tech-stack" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <TechStackGalaxy fullPage={true} />
                </Suspense>
              } 
            />
            <Route 
              path="/terminal" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <AITerminal />
                </Suspense>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <ContactPortal />
                </Suspense>
              } 
            />
            <Route 
              path="/resume" 
              element={
                <Suspense fallback={<CyberLoader />}>
                  <ResumeHologram />
                </Suspense>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      
      <DigitalFooter />
    </div>
  )
}

export default App
