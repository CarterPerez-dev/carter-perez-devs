import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './HolographicNav.module.css';

const HolographicNav = () => {
  const { theme, toggleTheme } = useTheme();
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
    <header className={styles.holographicNav} ref={navRef}>
      <div className={styles.navContainer}>
        {/* --- FIX: Link should wrap the logo content --- */}
        <div className={styles.navLogo}>
          <Link to="/" className={styles.logoLink}> {/* Added Link here */}
            <div className={styles.logoContainer}>
              <div className={styles.logoSymbol}>C</div>
              <div className={styles.logoText}>PORTFOLIO</div>
            </div>
          </Link> {/* Closed Link here */}
        </div>
        {/* --- END FIX --- */}
  
        <div className={styles.navControls}>
          <button
            className={styles.themeToggle}
            onClick={() => {
              toggleTheme();
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
  
          <button
            className={`${styles.menuToggle} ${isOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <div className={styles.menuToggleLine}></div>
            <div className={styles.menuToggleLine}></div>
            <div className={styles.menuToggleLine}></div>
          </button>
        </div>
      </div> {/* This div (navContainer) now closes correctly */}
  
      {/* --- Conditional rendering structure is correct --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className={styles.navMenu}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className={`${styles.menuBackground} holographic`}></div>
            <div className={styles.menuContent}>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
  
                return (
                  <motion.div
                    key={index}
                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                    variants={itemVariants}
                    onMouseEnter={() => handleMenuHover(index)}
                    onMouseLeave={() => handleMenuHover(null)}
                  >
                    <Link
                      to={item.path}
                      className={`${styles.menuLink} ${menuHoveredItem === index ? styles.hovered : ''}`}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuTitle}>{item.title}</span>
                      {isActive && (
                        <span className={styles.menuActiveIndicator}></span>
                      )}
                    </Link>
                    {menuHoveredItem === index && (
                      <div className={styles.menuHoverEffect}></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header> /* Header closes correctly */
  );
};

export default HolographicNav;
