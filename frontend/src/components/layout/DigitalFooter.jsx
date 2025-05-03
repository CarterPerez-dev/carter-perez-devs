import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../contexts/AudioContext';

const DigitalFooter = () => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    memory: 0,
    latency: 0
  });

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
    { text: 'Privacy', path: '/privacy' }
  ];

  // Social links
  const socialLinks = [
    { text: 'GitHub', url: 'https://github.com/username', icon: 'G' },
    { text: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'L' },
    { text: 'Twitter', url: 'https://twitter.com/username', icon: 'T' }
  ];

  return (
    <footer className="digital-footer">
      <div className="footer-background"></div>
      
      <div className="footer-container">
        <div className="footer-left">
          <div className="system-stats">
            <div className="stat-item">
              <span className="stat-label">FPS</span>
              <span className="stat-value">{performanceStats.fps}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">MEM</span>
              <span className="stat-value">{performanceStats.memory}MB</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">NET</span>
              <span className="stat-value">{performanceStats.latency}ms</span>
            </div>
          </div>
        </div>
        
        <div className="footer-center">
          <div className="footer-links">
            {footerLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link 
                  to={link.path}
                  className="footer-link"
                  onClick={() => playSound('click')}
                >
                  {link.text}
                </Link>
                {index < footerLinks.length - 1 && <span className="divider">|</span>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="copyright">
            <span className="copyright-symbol">©</span> {new Date().getFullYear()} Carter Perez Portfolio
          </div>
        </div>
        
        <div className="footer-right">
          <div className="time-display">
            <div className="time-value">{formatTime(currentTime)}</div>
            <div className="date-value">{formatDate(currentTime)}</div>
          </div>
          
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => playSound('click')}
              >
                <span className="social-icon">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .digital-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: var(--footer-height);
          z-index: var(--z-dropdown);
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
        
        .footer-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--accent-cyan);
          z-index: -1;
          overflow: hidden;
        }
        
        .footer-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            var(--accent-cyan), 
            transparent
          );
          animation: footer-scan 4s linear infinite;
        }
        
        .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          padding: 0 1.5rem;
        }
        
        .footer-left,
        .footer-center,
        .footer-right {
          display: flex;
          align-items: center;
          height: 100%;
        }
        
        .footer-center {
          flex-direction: column;
          justify-content: center;
        }
        
        .footer-right {
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          min-width: 140px; /* Increased min-width */
          width: auto; /* Allow natural width */
          padding-right: 10px; /* Added padding */
        }
        
        .system-stats {
          display: flex;
          align-items: center;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          margin-right: 1rem;
        }
        
        .stat-label {
          color: var(--text-secondary);
          margin-right: 0.5rem;
        }
        
        .stat-value {
          color: var(--accent-cyan);
          font-weight: 500;
        }
        
        .footer-links {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .footer-link {
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }
        
        .footer-link:hover {
          color: var(--accent-cyan);
        }
        
        .footer-link::after {
          display: none;
        }
        
        .divider {
          margin: 0 0.5rem;
          color: var(--text-tertiary);
        }
        
        .copyright {
          color: var(--text-tertiary);
          font-size: 0.7rem;
        }
        
        .copyright-symbol {
          color: var(--accent-cyan);
        }
        
        .time-display {
          text-align: right;
          margin-top: 0.8rem;
          width: 100%;
          padding: 0 5px; /* Added padding */
          overflow: visible; /* Ensure no clipping */
        }
        
        .time-value {
          color: var(--accent-cyan);
          font-weight: 500;
          font-size: 0.7rem; /* Adjusted font size */
          white-space: nowrap; /* Prevent line breaks */
          letter-spacing: -0.02em; /* Slightly reduce letter spacing */
          padding-right: 5px; /* More padding */
          display: block; /* Make sure it's block-level */
          width: auto; /* Let it size naturally */
        }
        
        .date-value {
          color: var(--text-secondary);
          font-size: 0.65rem;
          white-space: nowrap; /* Prevent line breaks */
          display: block; /* Make sure it's block-level */
          width: auto; /* Let it size naturally */
          margin-bottom: 1px;
        }
        
        .social-links {
          display: flex;
          align-items: center;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(0, 255, 245, 0.1);
          color: var(--accent-cyan);
          margin-left: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 5px;
        }
        
        .social-link:hover {
          background-color: var(--accent-cyan);
          color: var(--bg-primary);
          transform: translateY(-2px);
        }
        
        .social-link::after {
          display: none;
        }
        
        .social-icon {
          font-size: 0.8rem;
          font-weight: 700;
        }
        
        /* Light theme styles */
        .light-theme .footer-background {
          background-color: rgba(245, 245, 245, 0.8);
          border-top: 1px solid var(--accent-blue);
        }
        
        .light-theme .footer-background::before {
          background: linear-gradient(90deg, 
            transparent, 
            var(--accent-blue), 
            transparent
          );
        }
        
        .light-theme .stat-value,
        .light-theme .time-value,
        .light-theme .copyright-symbol {
          color: var(--accent-blue);
        }
        
        .light-theme .footer-link:hover {
          color: var(--accent-blue);
        }
        
        .light-theme .social-link {
          background-color: rgba(77, 77, 255, 0.1);
          color: var(--accent-blue);
        }
        
        .light-theme .social-link:hover {
          background-color: var(--accent-blue);
          color: var(--bg-primary);
        }
        
        @keyframes footer-scan {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        
        /* Media queries */
        @media (max-width: 768px) {
          .footer-container {
            padding: 0 1rem;
          }
          
          .system-stats {
            display: none;
          }
          
          .footer-right {
            min-width: 120px;
            padding-right: 0;
          }
        }
        
        @media (max-width: 480px) {
          .digital-footer {
            position: fixed; /* Keep fixed positioning */
            height: auto;
            min-height: var(--footer-height);
          }
          
          .footer-container {
            flex-wrap: wrap; /* Use flex-wrap instead of flex-direction */
            justify-content: space-between; /* Keep horizontal layout */
            padding: 8px 10px;
            height: auto;
          }
          
          .footer-left {
            display: none; /* Hide stats on mobile */
          }
          
          .footer-center {
            flex: 1;
            order: 1;
            align-items: flex-start;
            margin: 0;
          }
          
          .footer-right {
            flex: 0 0 auto;
            order: 2;
            align-items: flex-end;
            margin: 0;
            min-width: 110px;
          }
          
          .time-display {
            text-align: right;
            margin-bottom: 0;
          }
          
          .time-value {
            font-size: 0.8rem; /* Even smaller on mobile */
          }
          
          .date-value {
            font-size: 0.65rem; /* Even smaller on mobile */
          }
          
          .social-links {
            display: none; /* Hide social links on very small screens */
          }
        }
      `}</style>
    </footer>
  );
};

export default DigitalFooter;
