import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useCyberCursor } from './hooks/useCyberCursor';

// Contexts
import { useTheme } from './contexts/ThemeContext'


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


function useTabVisibilityOptimizer() {
  useEffect(() => {
    let hidden, visibilityChange;
    
    // Set the name of the hidden property and the change event for visibility
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    
    const handleVisibilityChange = () => {
      if (document[hidden]) {
        // Tab is hidden, pause animations by adding a class to body
        document.body.classList.add('tab-hidden');
      } else {
        // Tab is visible, resume animations
        document.body.classList.remove('tab-hidden');
      }
    };
    
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);
}


function App() {
  useTabVisibilityOptimizer();
  useCyberCursor(); 
  const location = useLocation()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    const bootSequence = document.getElementById('boot-sequence');

    const checkBoot = () => {
      if (bootSequence && bootSequence.style.display === 'none') {
        setTimeout(() => {
          setIsLoading(false);
        }, 500); 
      } else {
        setTimeout(checkBoot, 100);
      }
    };

    checkBoot();

  }, []); 
    
  
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
