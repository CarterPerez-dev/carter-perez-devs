import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';
import styles from './DigitalFooter.module.css';

const DigitalFooter = () => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    memory: 0,
    latency: 0
  });

  // Performance mode state
  const [performanceMode, setPerformanceMode] = useState(() => {
    return localStorage.getItem('performanceMode') || 'balanced';
  });
  
  // Toggle performance mode function
  const togglePerformanceMode = () => {
    const newMode = performanceMode === 'high' ? 'balanced' : 'high';
    setPerformanceMode(newMode);
    localStorage.setItem('performanceMode', newMode);
    localStorage.setItem('performanceLevel', newMode === 'high' ? '2' : '4');
    
    // Reload to apply changes
    window.location.reload();
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId;

    const updateStats = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        // Calculate FPS
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        // Simulate memory usage (in MB)
        const memory = Math.round(100 + Math.random() * 50);
        
        // Simulate network latency (in ms)
        const latency = Math.round(20 + Math.random() * 30);
        
        setPerformanceStats({
          fps,
          memory,
          latency
        });
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      frameId = requestAnimationFrame(updateStats);
    };

    frameId = requestAnimationFrame(updateStats);

    return () => cancelAnimationFrame(frameId);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format date as YYYY.MM.DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  };

  // Footer links
  const footerLinks = [
    { text: 'Home', path: '/' },
    { text: 'Projects', path: '/projects' },
    { text: 'Contact', path: '/contact' },
  ];

  // Social links
  const socialLinks = [
    { text: 'GitHub', url: 'https://github.com/username', icon: 'G' },
    { text: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'L' },
    { text: 'Twitter', url: 'https://twitter.com/username', icon: 'T' }
  ];

  return (
    <footer className={styles.digitalFooter}>
      <div className={styles.footerBackground}></div>
      
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <div className={styles.systemStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>FPS</span>
              <span className={styles.statValue}>{performanceStats.fps}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>MEM</span>
              <span className={styles.statValue}>{performanceStats.memory}MB</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>NET</span>
              <span className={styles.statValue}>{performanceStats.latency}ms</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>PERFORMANCE ENHANCER</span>
              <button
                className={styles.performanceToggle}
                onClick={togglePerformanceMode}
                title={`Performance Mode: ${performanceMode === 'high' ? 'High Performance' : 'Balanced'}`}
              >
                {performanceMode === 'high' ? '⚡' : '🔋'}
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.footerCenter}>
          <div className={styles.footerLinks}>
            {footerLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link 
                  to={link.path}
                  className={styles.footerLink}
                  onClick={() => playSound('click')}
                >
                  {link.text}
                </Link>
                {index < footerLinks.length - 1 && <span className={styles.divider}>|</span>}
              </React.Fragment>
            ))}
          </div>
          
          <div className={styles.copyright}>
            <span className={styles.copyrightSymbol}>©</span> {new Date().getFullYear()} Carter Perez Portfolio
          </div>
        </div>
        
        <div className={styles.footerRight}>
          <div className={styles.timeDisplay}>
            <div className={styles.timeValue}>{formatTime(currentTime)}</div>
            <div className={styles.dateValue}>{formatDate(currentTime)}</div>
          </div>
          
          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                onClick={() => playSound('click')}
              >
                <span className={styles.socialIcon}>{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DigitalFooter;
