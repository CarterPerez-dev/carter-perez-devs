import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useHolographicEffect } from '../../hooks/useHolographicEffect';

const HolographicCard = ({
  children,
  width = '100%',
  height = 'auto',
  color = 'auto',
  borderSize = 'medium',
  glowIntensity = 'medium',
  interactive = true,
  glassEffect = true,
  corners = 'standard',
  header,
  footer,
  className = '',
  style = {},
  ...props
}) => {
  const { theme } = useTheme();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate color based on theme if color is set to auto
  const cardColor = color === 'auto'
    ? theme === 'dark' ? 'var(--accent-cyan)' : 'var(--accent-blue)'
    : color;
  
  // Convert props to CSS values
  const borderWidth = getBorderSize(borderSize);
  const borderRadius = getCornerSize(corners);
  const glowSize = getGlowIntensity(glowIntensity);
  
  // Initialize holographic effect
  const { 
    startHolographicEffect,
    stopHolographicEffect,
    updateHolographicConfig 
  } = useHolographicEffect(cardRef, {
    color: cardColor,
    intensity: getNumberFromIntensity(glowIntensity),
    interactive
  });
  
  // Apply holographic effect when card is mounted
  useEffect(() => {
    if (interactive) {
      startHolographicEffect();
    }
    
    return () => stopHolographicEffect();
  }, [interactive, startHolographicEffect, stopHolographicEffect]);
  
  // Update effect config when props change
  useEffect(() => {
    updateHolographicConfig({
      color: cardColor,
      intensity: getNumberFromIntensity(glowIntensity)
    });
  }, [cardColor, glowIntensity, updateHolographicConfig]);
  
  // Handle hover events
  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`holographic-card ${className} ${glassEffect ? 'glass-effect' : ''}`}
      style={{
        width,
        height,
        borderWidth,
        borderRadius,
        borderColor: cardColor,
        boxShadow: `0 0 ${glowSize}px ${isHovered ? glowSize * 2 : glowSize}px ${cardColor}`,
        ...style
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {header && (
        <div className="holographic-card-header">
          {header}
        </div>
      )}
      
      <div className="holographic-card-content">
        {children}
      </div>
      
      {footer && (
        <div className="holographic-card-footer">
          {footer}
        </div>
      )}
      
      <style jsx>{`
        .holographic-card {
          position: relative;
          border-style: solid;
          background-color: ${theme === 'dark' 
            ? 'rgba(10, 10, 10, 0.7)' 
            : 'rgba(245, 245, 245, 0.7)'};
          overflow: hidden;
          transition: all 0.3s ease-out;
          display: flex;
          flex-direction: column;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .holographic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(${cardColor === 'var(--accent-cyan)' 
              ? '0, 255, 245' 
              : cardColor === 'var(--accent-blue)' 
                ? '77, 77, 255' 
                : '0, 255, 245'}, 0.1) 50%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
          transform: translateZ(1px);
          opacity: ${isHovered ? 0.8 : 0.3};
          transition: opacity 0.3s ease;
        }
        
        .holographic-card.glass-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          backdrop-filter: blur(8px);
          z-index: -1;
        }
        
        .holographic-card-header {
          padding: 1rem;
          border-bottom: 1px solid ${cardColor};
          z-index: 2;
        }
        
        .holographic-card-content {
          padding: 1rem;
          flex: 1;
          z-index: 2;
          position: relative;
        }
        
        .holographic-card-footer {
          padding: 1rem;
          border-top: 1px solid ${cardColor};
          z-index: 2;
        }
      `}</style>
    </motion.div>
  );
};

// Helper functions
function getBorderSize(size) {
  switch (size) {
    case 'none':
      return '0';
    case 'small':
      return '1px';
    case 'medium':
      return '2px';
    case 'large':
      return '3px';
    default:
      return size;
  }
}

function getCornerSize(corners) {
  switch (corners) {
    case 'sharp':
      return '0';
    case 'standard':
      return 'var(--border-radius-md)';
    case 'rounded':
      return 'var(--border-radius-lg)';
    case 'circular':
      return '50%';
    default:
      return corners;
  }
}

function getGlowIntensity(intensity) {
  switch (intensity) {
    case 'none':
      return '0';
    case 'low':
      return '5px';
    case 'medium':
      return '10px';
    case 'high':
      return '20px';
    case 'extreme':
      return '30px';
    default:
      return intensity;
  }
}

function getNumberFromIntensity(intensity) {
  switch (intensity) {
    case 'none':
      return 0;
    case 'low':
      return 3;
    case 'medium':
      return 5;
    case 'high':
      return 8;
    case 'extreme':
      return 10;
    default:
      return 5;
  }
}

HolographicCard.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  borderSize: PropTypes.oneOfType([
    PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    PropTypes.string
  ]),
  glowIntensity: PropTypes.oneOfType([
    PropTypes.oneOf(['none', 'low', 'medium', 'high', 'extreme']),
    PropTypes.string
  ]),
  interactive: PropTypes.bool,
  glassEffect: PropTypes.bool,
  corners: PropTypes.oneOfType([
    PropTypes.oneOf(['sharp', 'standard', 'rounded', 'circular']),
    PropTypes.string
  ]),
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default HolographicCard;
