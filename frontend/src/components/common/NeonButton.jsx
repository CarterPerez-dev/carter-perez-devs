// frontend/src/components/common/NeonButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';
import styles from './NeonButton.module.css';

const NeonButton = ({
  children,
  color = 'var(--accent-cyan)',
  size = 'medium',
  variant = 'primary',
  onClick,
  disabled = false,
  href,
  className = '',
  type = 'button',
  animate = true,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const { playSound } = useAudio();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef(null);
  
  // Handle button interactions
  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
      playSound('hover');
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
    }
  };
  
  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false);
    }
  };
  
  const handleClick = (e) => {
    if (!disabled) {
      playSound('click');
      if (onClick) {
        onClick(e);
      }
    }
  };
  
  // Add neon glow animation effect
  useEffect(() => {
    if (!buttonRef.current || !animate || disabled) return;
    
    const button = buttonRef.current;
    
    // Create keyframe animation for glow effect
    const pulseAnimation = button.animate(
      [
        { boxShadow: `0 0 5px ${color}, 0 0 10px ${color}` },
        { boxShadow: `0 0 10px ${color}, 0 0 20px ${color}` },
        { boxShadow: `0 0 5px ${color}, 0 0 10px ${color}` }
      ],
      {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      }
    );
    
    // Pause animation by default if not hovered
    if (!isHovered) {
      pulseAnimation.pause();
    } else {
      pulseAnimation.play();
    }
    
    return () => {
      pulseAnimation.cancel();
    };
  }, [animate, color, disabled, isHovered]);
  
  // Get size and variant classes
  const sizeClass = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`];
  const variantClass = styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const disabledClass = disabled ? styles.disabled : '';
  
  // Determine component (button or anchor)
  const Component = href ? 'a' : 'button';
  
  // Generate dynamic styles based on props
  const dynamicStyles = {
    '--button-color': color,
    '--button-color-rgb': colorToRGB(color)
  };
  
  // Animation variants for motion
  const buttonVariants = {
    hover: { 
      y: -2,
      boxShadow: `0 0 15px ${color}, 0 0 5px ${color}`,
      transition: { duration: 0.2 }
    },
    pressed: { 
      y: 1, 
      boxShadow: `0 0 5px ${color}`,
      transition: { duration: 0.1 }
    },
    disabled: {
      opacity: 0.6,
      boxShadow: 'none',
      cursor: 'not-allowed'
    }
  };
  
  return (
    <motion.div
      className={`${styles.container} ${className}`}
      initial={false}
      animate={
        disabled 
          ? 'disabled' 
          : isPressed 
            ? 'pressed' 
            : isHovered 
              ? 'hover' 
              : 'initial'
      }
      variants={buttonVariants}
      style={dynamicStyles}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
    >
      <Component
        ref={buttonRef}
        className={`${styles.button} ${sizeClass} ${variantClass} ${disabledClass}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        href={href}
        disabled={disabled}
        type={!href ? type : undefined}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className={`${styles.icon} ${styles.left}`}>{icon}</span>
        )}
        
        <span className={styles.text}>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className={`${styles.icon} ${styles.right}`}>{icon}</span>
        )}
        
        <span className={styles.glow}></span>
        <span className={styles.border}></span>
      </Component>
    </motion.div>
  );
};

// Helper function to convert color values to RGB for CSS variables
function colorToRGB(color) {
  // Handle CSS variables
  if (color.startsWith('var(--accent-cyan)')) {
    return '0, 255, 245';
  } else if (color.startsWith('var(--accent-magenta)')) {
    return '255, 61, 61';
  } else if (color.startsWith('var(--accent-blue)')) {
    return '77, 77, 255';
  }
  
  // Default fallback for unknown variables
  return '0, 255, 245';
}

NeonButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'outline', 'ghost', 'filled']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  animate: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default NeonButton;
