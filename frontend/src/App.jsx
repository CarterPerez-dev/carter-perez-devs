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
    // Only enable custom cursor on devices with pointer support
    // (skip on mobile/touch devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Exit early for touch devices
    }
    
    const cursor = document.createElement('div');
    cursor.className = 'cyber-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cyber-cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Throttle function to limit execution frequency
    const throttle = (func, limit) => {
      let lastFunc;
      let lastRan;
      return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    };
    
    // Use requestAnimationFrame for smoother cursor movement
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Throttled mouse move event
    const handleMouseMove = throttle((e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, 5); // Update target position every 5ms
    
    // Animation frame for cursor movement
    const updateCursorPosition = () => {
      // Smooth interpolation
      cursorX += (targetX - cursorX) * 0.2;
      cursorY += (targetY - cursorY) * 0.2;
      
      // Apply transform using hardware acceleration (translateX/Y)
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      
      requestAnimationFrame(updateCursorPosition);
    };
    
    // Start animation loop
    let animationFrame = requestAnimationFrame(updateCursorPosition);
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Use event delegation for hover effects instead of adding listeners to each element
    const handleMouseOver = (e) => {
      let target = e.target;
      // Check if target or its parents match the selector
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      
      if (isInteractive) {
        cursor.classList.add('expand');
      }
    };
    
    const handleMouseOut = (e) => {
      let target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      
      if (isInteractive) {
        cursor.classList.remove('expand');
      }
    };
    
    // Use event delegation instead of querying and attaching to each element
    document.body.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.body.addEventListener('mouseout', handleMouseOut, { passive: true });
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        animationFrame = requestAnimationFrame(updateCursorPosition);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      cancelAnimationFrame(animationFrame);
      
      if (cursor && cursor.parentNode) {
        document.body.removeChild(cursor);
      }
      
      if (cursorDot && cursorDot.parentNode) {
        document.body.removeChild(cursorDot);
      }
    };
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
