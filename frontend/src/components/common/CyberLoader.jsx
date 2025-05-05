import React, { useEffect, useState } from 'react';
// Removed useTheme import as it's not directly used for styling here anymore
import styles from './css/CyberLoader.module.css'; 

const CyberLoader = ({ message = 'LOADING NEURAL INTERFACE', fullScreen = true }) => {
  // Removed theme context hook
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

  // Construct class names using the styles object
  const containerClassName = `${styles.cyberLoaderContainer} ${fullScreen ? styles.fullscreen : ''}`;
  const statusLightClassName = `${styles.cyberLoaderStatusLight} ${progress < 100 ? styles.active : ''}`;

  return (
    // Use the constructed class names
    <div className={containerClassName}>
      <div className={styles.cyberLoaderContent}>
        <div className={styles.cyberLoading}> {/* Apply the style if needed */}
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div
          // Apply glitch-text class conditionally if needed (styles likely defined elsewhere)
          className={`${styles.cyberLoaderText} ${glitchActive ? 'glitch-text-dynamic' : ''}`}
          data-text={`${loadingText}${dots}`}
        >
          {loadingText}{dots}
        </div>

        <div className={styles.cyberLoaderProgressContainer}>
          <div className={styles.cyberLoaderProgressBar}>
            <div
              className={styles.cyberLoaderProgressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.cyberLoaderProgressText}>
            SYSTEM BOOT: <span className={styles.hexValue}>{hexProgress}</span> / FF
          </div>
        </div>

        <div className={styles.cyberLoaderStatus}>
          <div className={statusLightClassName}></div> {/* Apply conditional class */}
          <div className={styles.cyberLoaderStatusText}>
            {progress < 100 ? 'INITIALIZING' : 'COMPLETE'}
          </div>
        </div>
      </div>

      {/* REMOVED the <style jsx> block */}
    </div>
  );
};

export default CyberLoader;
