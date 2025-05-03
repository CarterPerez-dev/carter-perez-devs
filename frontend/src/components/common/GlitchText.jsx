import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useGlitch } from '../../hooks/useGlitch';

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
  
  return (
    <motion.div
      ref={textRef}
      className={`glitch-text-container ${className}`}
      data-text={text}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <span className={`glitch-text ${sizeClass}`} style={{ color }}>
        {text}
      </span>
      
      <style jsx>{`
        .glitch-text-container {
          position: relative;
          display: inline-block;
          cursor: ${onClick ? 'pointer' : 'default'};
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .glitch-text-size-small {
          font-size: 1rem;
        }
        
        .glitch-text-size-medium {
          font-size: 1.5rem;
        }
        
        .glitch-text-size-large {
          font-size: 2.5rem;
        }
        
        .glitch-text-size-xlarge {
          font-size: 4rem;
        }
        
        .glitch-text-container::before,
        .glitch-text-container::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: ${color};
          opacity: 0.8;
          clip: rect(0, 0, 0, 0);
        }
        
        .glitch-text-container::before {
          left: -2px;
          text-shadow: 1px 0 ${secondaryColor};
          animation: ${isGlitching ? 'glitch-anim-1 3s infinite linear alternate-reverse' : 'none'};
        }
        
        .glitch-text-container::after {
          left: 2px;
          text-shadow: -1px 0 ${color};
          animation: ${isGlitching ? 'glitch-anim-2 2s infinite linear alternate-reverse' : 'none'};
        }
        
        @keyframes glitch-anim-1 {
          0%, 100% { clip: rect(0, 9999px, 5px, 0); transform: skewX(0.2deg); }
          20% { clip: rect(0, 9999px, 51px, 0); transform: skewX(0.1deg); }
          40% { clip: rect(0, 9999px, 32px, 0); transform: skewX(0.2deg); }
          60% { clip: rect(0, 9999px, 92px, 0); transform: skewX(-0.1deg); }
          80% { clip: rect(0, 9999px, 18px, 0); transform: skewX(-0.2deg); }
        }
        
        @keyframes glitch-anim-2 {
          0%, 100% { clip: rect(0, 9999px, 24px, 0); transform: skewX(0.3deg); }
          20% { clip: rect(0, 9999px, 63px, 0); transform: skewX(-0.1deg); }
          40% { clip: rect(0, 9999px, 79px, 0); transform: skewX(0.1deg); }
          60% { clip: rect(0, 9999px, 35px, 0); transform: skewX(0.4deg); }
          80% { clip: rect(0, 9999px, 46px, 0); transform: skewX(0deg); }
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
      return 'glitch-text-size-small';
    case 'medium':
      return 'glitch-text-size-medium';
    case 'large':
      return 'glitch-text-size-large';
    case 'xlarge':
      return 'glitch-text-size-xlarge';
    default:
      return 'glitch-text-size-medium';
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
