import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

const HolographicNav = () => {
  const { theme, toggleTheme } = useTheme();
  const { audioEnabled, toggleAudio, playSound } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [menuHoveredItem, setMenuHoveredItem] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Toggle the menu
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    playSound('click');
  };

  // Handle hover on menu items
  const handleMenuHover = (index) => {
    setMenuHoveredItem(index);
  };

  // Navigation items
  const navItems = [
    { title: 'HOME', path: '/', icon: '⌂' },
    { title: 'PROJECTS', path: '/projects', icon: '⚙' },
    { title: 'EXPERIENCE', path: '/experience', icon: '⚡' },
    { title: 'TECH STACK', path: '/tech-stack', icon: '⚛' },
    { title: 'TERMINAL', path: '/terminal', icon: '>' },
    { title: 'RESUME', path: '/resume', icon: '⊞' },
    { title: 'CONTACT', path: '/contact', icon: '✉' },
  ];

  // Animation variants for the menu
  const menuVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header className="holographic-nav" ref={navRef}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={() => playSound('click')}>
            <div className="logo-container">
              <div className="logo-symbol">C</div>
              <div className="logo-text">PORTFOLIO</div>
            </div>
          </Link>
        </div>

        <div className="nav-controls">
          <button 
            className="theme-toggle" 
            onClick={() => {
              toggleTheme();
              playSound('click');
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          
          <button 
            className="audio-toggle" 
            onClick={() => {
              toggleAudio();
              playSound('click');
            }}
            aria-label={`${audioEnabled ? 'Disable' : 'Enable'} audio`}
          >
            {audioEnabled ? '♫' : '♪'}
          </button>
          
          <button 
            className={`menu-toggle ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="menu-toggle-line"></div>
            <div className="menu-toggle-line"></div>
            <div className="menu-toggle-line"></div>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            className="nav-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="menu-background holographic"></div>
            <div className="menu-content">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div 
                    key={index}
                    className={`menu-item ${isActive ? 'active' : ''}`}
                    variants={itemVariants}
                    onMouseEnter={() => handleMenuHover(index)}
                    onMouseLeave={() => handleMenuHover(null)}
                  >
                    <Link 
                      to={item.path} 
                      className={`menu-link ${menuHoveredItem === index ? 'hovered' : ''}`}
                      onClick={() => playSound('click')}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-title">{item.title}</span>
                      {isActive && (
                        <span className="menu-active-indicator"></span>
                      )}
                    </Link>
                    {menuHoveredItem === index && (
                      <div className="menu-hover-effect"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .holographic-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: var(--z-dropdown);
          font-family: var(--font-display);
        }
        
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: var(--header-height);
          padding: 0 1.5rem;
          background-color: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--accent-cyan);
          position: relative;
          overflow: hidden;
        }
        
        .nav-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 245, 0.1), transparent);
          animation: nav-glow 8s linear infinite;
          pointer-events: none;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
        }
        
        .logo-symbol {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-shadow: 0 0 10px rgba(0, 255, 245, 0.7);
          margin-right: 0.5rem;
          position: relative;
        }
        
        .logo-symbol::before {
          content: 'C';
          position: absolute;
          top: 0;
          left: 0;
          color: var(--accent-magenta);
          filter: blur(4px);
          opacity: 0.7;
          animation: logo-glitch 5s infinite alternate;
        }
        
        .logo-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 2px;
        }
        
        .nav-controls {
          display: flex;
          align-items: center;
        }
        
        .theme-toggle,
        .audio-toggle,
        .menu-toggle {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.2rem;
          margin-left: 1rem;
          cursor: none;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .theme-toggle:hover,
        .audio-toggle:hover {
          background-color: rgba(0, 255, 245, 0.1);
          color: var(--accent-cyan);
          transform: translateY(-2px);
        }
        
        .menu-toggle {
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          position: relative;
        }
        
        .menu-toggle-line {
          width: 100%;
          height: 2px;
          background-color: var(--text-primary);
          transition: all 0.3s ease;
        }
        
        .menu-toggle.active .menu-toggle-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
          background-color: var(--accent-cyan);
        }
        
        .menu-toggle.active .menu-toggle-line:nth-child(2) {
          opacity: 0;
        }
        
        .menu-toggle.active .menu-toggle-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
          background-color: var(--accent-cyan);
        }
        
        .menu-toggle:hover .menu-toggle-line {
          background-color: var(--accent-cyan);
        }
        
        .nav-menu {
          position: absolute;
          top: var(--header-height);
          right: 0;
          width: 250px;
          background-color: rgba(10, 10, 10, 0.95);
          border-left: 1px solid var(--accent-cyan);
          border-bottom: 1px solid var(--accent-cyan);
          max-height: calc(100vh - var(--header-height));
          overflow-y: auto;
          backdrop-filter: blur(10px);
        }
        
        .menu-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        
        .menu-content {
          padding: 1rem 0;
          position: relative;
          z-index: 1;
        }
        
        .menu-item {
          position: relative;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .menu-link::after {
          display: none;
        }
        
        .menu-icon {
          margin-right: 1rem;
          font-size: 1.2rem;
          color: var(--accent-cyan);
          transition: all 0.3s ease;
        }
        
        .menu-title {
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        
        .menu-active-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 255, 245, 0.7);
        }
        
        .menu-link.hovered {
          color: var(--text-primary);
          background-color: rgba(0, 255, 245, 0.1);
          transform: translateX(5px);
        }
        
        .menu-link.hovered .menu-icon {
          color: var(--accent-magenta);
        }
        
        .menu-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(0, 255, 245, 0.05) 0%, 
            rgba(0, 255, 245, 0.02) 40%, 
            transparent 100%);
          pointer-events: none;
        }
        
        /* Light theme styles */
        .light-theme .nav-container {
          background-color: rgba(245, 245, 245, 0.8);
          border-bottom: 1px solid var(--accent-blue);
        }
        
        .light-theme .nav-container::before {
          background: linear-gradient(90deg, transparent, rgba(77, 77, 255, 0.1), transparent);
        }
        
        .light-theme .logo-symbol {
          color: var(--accent-blue);
          text-shadow: 0 0 10px rgba(77, 77, 255, 0.7);
        }
        
        .light-theme .logo-symbol::before {
          color: var(--accent-magenta);
        }
        
        .light-theme .menu-toggle-line {
          background-color: var(--text-primary);
        }
        
        .light-theme .menu-toggle.active .menu-toggle-line:nth-child(1),
        .light-theme .menu-toggle.active .menu-toggle-line:nth-child(3),
        .light-theme .menu-toggle:hover .menu-toggle-line {
          background-color: var(--accent-blue);
        }
        
        .light-theme .nav-menu {
          background-color: rgba(245, 245, 245, 0.95);
          border-left: 1px solid var(--accent-blue);
          border-bottom: 1px solid var(--accent-blue);
        }
        
        .light-theme .menu-icon {
          color: var(--accent-blue);
        }
        
        .light-theme .menu-active-indicator {
          background-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(77, 77, 255, 0.7);
        }
        
        .light-theme .menu-link.hovered {
          background-color: rgba(77, 77, 255, 0.1);
        }
        
        .light-theme .menu-hover-effect {
          background: linear-gradient(90deg, 
            rgba(77, 77, 255, 0.05) 0%, 
            rgba(77, 77, 255, 0.02) 40%, 
            transparent 100%);
        }
        
        @keyframes nav-glow {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        
        @keyframes logo-glitch {
          0%, 100% {
            transform: translate(0);
            opacity: 0.7;
          }
          20% {
            transform: translate(-1px, 1px);
            opacity: 0.5;
          }
          40% {
            transform: translate(1px, -1px);
            opacity: 0.7;
          }
          60% {
            transform: translate(-1px, -1px);
            opacity: 0.5;
          }
          80% {
            transform: translate(1px, 1px);
            opacity: 0.7;
          }
        }
        
        /* Media queries */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }
          
          .logo-text {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default HolographicNav;
