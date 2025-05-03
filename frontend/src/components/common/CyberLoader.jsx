import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const CyberLoader = ({ message = 'LOADING NEURAL INTERFACE', fullScreen = true }) => {
  const { theme } = useTheme();
  const [loadingText, setLoadingText] = useState(message);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Simulate loading progress
  useEffect(() => {
    if (progress >= 100) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [progress]);

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) {
          return '';
        }
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Randomly trigger glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      
      setTimeout(() => {
        setGlitchActive(false);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate random loading messages
  useEffect(() => {
    const messages = [
      'LOADING NEURAL INTERFACE',
      'CALIBRATING DIGITAL CORTEX',
      'SYNCING QUANTUM DATA',
      'BOOTSTRAPPING CYBERNETIC MODULES',
      'INITIALIZING REALITY MATRIX',
      'COMPILING NEURAL NETWORKS',
      'RENDERING DIGITAL ENVIRONMENT',
      'PROCESSING QUANTUM ALGORITHMS',
      'DECRYPTING NEURAL PATHWAYS'
    ];

    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setLoadingText(randomMessage);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Format progress as hex
  const hexProgress = Math.floor(progress).toString(16).padStart(2, '0').toUpperCase();

  return (
    <div className={`cyber-loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="cyber-loader-content">
        <div className="cyber-loading">
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <div className={`cyber-loader-text ${glitchActive ? 'glitch-text' : ''}`} data-text={`${loadingText}${dots}`}>
          {loadingText}{dots}
        </div>
        
        <div className="cyber-loader-progress-container">
          <div className="cyber-loader-progress-bar">
            <div 
              className="cyber-loader-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="cyber-loader-progress-text">
            SYSTEM BOOT: <span className="hex-value">{hexProgress}</span> / FF
          </div>
        </div>
        
        <div className="cyber-loader-status">
          <div className={`cyber-loader-status-light ${progress < 100 ? 'active' : ''}`}></div>
          <div className="cyber-loader-status-text">
            {progress < 100 ? 'INITIALIZING' : 'COMPLETE'}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .cyber-loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--bg-primary);
          z-index: 100;
        }
        
        .cyber-loader-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .cyber-loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 400px;
          padding: 2rem;
          border: 1px solid var(--accent-cyan);
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.8);
          box-shadow: 0 0 20px rgba(0, 255, 245, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .cyber-loader-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 245, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }
        
        .cyber-loader-text {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: var(--accent-cyan);
          margin: 1.5rem 0;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .cyber-loader-progress-container {
          width: 100%;
          margin-bottom: 1rem;
        }
        
        .cyber-loader-progress-bar {
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .cyber-loader-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta));
          border-radius: 2px;
          transition: width 0.2s ease;
        }
        
        .cyber-loader-progress-text {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: right;
        }
        
        .hex-value {
          color: var(--accent-cyan);
        }
        
        .cyber-loader-status {
          display: flex;
          align-items: center;
          margin-top: 1rem;
        }
        
        .cyber-loader-status-light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--accent-magenta);
          margin-right: 0.5rem;
        }
        
        .cyber-loader-status-light.active {
          animation: blink 1s infinite;
        }
        
        .cyber-loader-status-text {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--accent-magenta);
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        /* Theme specific adjustments */
        .light-theme .cyber-loader-content {
          background-color: rgba(245, 245, 245, 0.9);
          border-color: var(--accent-blue);
          box-shadow: 0 0 20px rgba(77, 77, 255, 0.3);
        }
        
        .light-theme .cyber-loader-content::before {
          background-image: 
            linear-gradient(rgba(77, 77, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(77, 77, 255, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default CyberLoader;
