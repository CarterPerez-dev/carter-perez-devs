import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useGlitch } from '../../hooks/useGlitch';
import styles from './GlitchText.module.css';

const GlitchText = ({
  text,
  color = 'var(--accent-cyan)',
  secondaryColor = 'var(--accent-magenta)',
  size = 'medium',
  intensity = 'medium',
  className = '',
  onHover = false,
  onClick = null,
  glitchOnMount = false,
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(glitchOnMount);
  const textRef = useRef(null);
  const { startGlitch, stopGlitch } = useGlitch(textRef, {
    intensity: getIntensityValue(intensity),
    duration: 1500,
    continuousGlitch: isGlitching
  });
  
  // Convert size prop to CSS class
  const sizeClass = getSizeClass(size);
  
  // Apply initial glitch effect on mount if enabled
  useEffect(() => {
    if (glitchOnMount) {
      startGlitch();
    }
    
    return () => stopGlitch();
  }, [glitchOnMount, startGlitch, stopGlitch]);
  
  // Handle hover events if onHover is true
  const handleMouseEnter = () => {
    if (onHover) {
      setIsGlitching(true);
      startGlitch();
    }
  };
  
  const handleMouseLeave = () => {
    if (onHover) {
      setIsGlitching(false);
      stopGlitch();
    }
  };
  
  // Handle click events
  const handleClick = (e) => {
    // Trigger a short glitch effect on click
    startGlitch({ duration: 500 });
    
    // Call onClick prop if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  // Set the pseudo-element styles dynamically
  const containerStyle = {
    '--text-shadow-color': color,
    '--secondary-text-shadow-color': secondaryColor,
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <motion.div
      ref={textRef}
      className={`${styles.glitchTextContainer} ${className} ${isGlitching ? styles.glitchActive : styles.glitchInactive}`}
      data-text={text}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={containerStyle}
      {...props}
    >
      <span 
        className={`${styles.glitchText} ${styles[sizeClass]}`} 
        style={{ color }}
      >
        {text}
      </span>
      <style>{`
        .${styles.glitchTextContainer}::before {
          text-shadow: 1px 0 ${secondaryColor};
        }
        
        .${styles.glitchTextContainer}::after {
          text-shadow: -1px 0 ${color};
        }
      `}</style>
    </motion.div>
  );
};

// Helper functions
function getIntensityValue(intensity) {
  switch (intensity) {
    case 'low':
      return 3;
    case 'medium':
      return 5;
    case 'high':
      return 8;
    case 'extreme':
      return 10;
    default:
      return parseInt(intensity, 10) || 5;
  }
}

function getSizeClass(size) {
  switch (size) {
    case 'small':
      return 'glitchTextSizeSmall';
    case 'medium':
      return 'glitchTextSizeMedium';
    case 'large':
      return 'glitchTextSizeLarge';
    case 'xlarge':
      return 'glitchTextSizeXlarge';
    default:
      return 'glitchTextSizeMedium';
  }
}

GlitchText.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
    PropTypes.string
  ]),
  intensity: PropTypes.oneOfType([
    PropTypes.oneOf(['low', 'medium', 'high', 'extreme']),
    PropTypes.number,
    PropTypes.string
  ]),
  className: PropTypes.string,
  onHover: PropTypes.bool,
  onClick: PropTypes.func,
  glitchOnMount: PropTypes.bool
};

export default GlitchText;
