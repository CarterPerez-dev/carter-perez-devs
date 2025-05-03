// frontend/src/components/common/HolographicCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useHolographicEffect } from '../../hooks/useHolographicEffect';
import styles from './HolographicCard.module.css';

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
  
  // Create CSS variables for dynamic styles
  const cardStyle = {
    width,
    height,
    borderWidth,
    borderRadius,
    borderColor: cardColor,
    boxShadow: `0 0 ${glowSize}px ${isHovered ? glowSize * 2 : glowSize}px ${cardColor}`,
    '--card-color': cardColor,
    '--card-bg-color': theme === 'dark' ? 'rgba(10, 10, 10, 0.7)' : 'rgba(245, 245, 245, 0.7)',
    ...style
  };
  
  // Create className with conditional modifiers
  const cardClassName = `
    ${styles.holographicCard} 
    ${glassEffect ? styles.glassEffect : ''} 
    ${className}
  `;

  return (
    <motion.div
      ref={cardRef}
      className={cardClassName}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {header && (
        <div className={styles.header}>
          {header}
        </div>
      )}
      
      <div className={styles.content}>
        {children}
      </div>
      
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
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
