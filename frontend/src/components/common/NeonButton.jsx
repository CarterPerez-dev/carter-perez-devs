import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';

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
  const sizeClass = getSizeClass(size);
  const variantClass = getVariantClass(variant);
  
  // Determine component (button or anchor)
  const Component = href ? 'a' : 'button';
  
  // Generate dynamic styles based on props
  const dynamicStyles = {
    '--button-color': color,
    '--button-hover-color': color,
    '--button-active-color': color,
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
      className={`neon-button-container ${className}`}
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
        className={`neon-button ${sizeClass} ${variantClass} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        href={href}
        disabled={disabled}
        type={!href ? type : undefined}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="neon-button-icon left">{icon}</span>
        )}
        
        <span className="neon-button-text">{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className="neon-button-icon right">{icon}</span>
        )}
        
        <span className="neon-button-glow"></span>
        <span className="neon-button-border"></span>
      </Component>
      
      <style jsx>{`
        .neon-button-container {
          position: relative;
          display: inline-block;
          overflow: hidden;
          border-radius: var(--border-radius-sm);
        }
        
        .neon-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all var(--transition-normal);
          background-color: transparent;
          border: none;
          color: var(--button-color);
          outline: none;
          cursor: none;
          overflow: hidden;
          text-decoration: none;
          width: 100%;
          z-index: 1;
        }
        
        .neon-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(var(--button-color-rgb), 0.2) 50%,
            transparent 100%
          );
          transition: left var(--transition-normal);
          z-index: -1;
        }
        
        .neon-button:hover::before {
          left: 100%;
        }
        
        .neon-button.disabled::before {
          display: none;
        }
        
        .neon-button-text {
          position: relative;
          z-index: 2;
        }
        
        .neon-button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        
        .neon-button-icon.left {
          margin-right: var(--space-xs);
        }
        
        .neon-button-icon.right {
          margin-left: var(--space-xs);
        }
        
        .neon-button-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0;
          transition: opacity var(--transition-normal);
          background: radial-gradient(
            circle at center,
            rgba(var(--button-color-rgb), 0.3) 0%,
            transparent 70%
          );
        }
        
        .neon-button:hover .neon-button-glow {
          opacity: 1;
        }
        
        .neon-button-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid var(--button-color);
          border-radius: var(--border-radius-sm);
          z-index: 0;
        }
        
        /* Size variants */
        .neon-button-size-small {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          min-width: 100px;
        }
        
        .neon-button-size-medium {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-width: 150px;
        }
        
        .neon-button-size-large {
          padding: 1rem 2rem;
          font-size: 1.2rem;
          min-width: 200px;
        }
        
        /* Style variants */
        .neon-button-variant-primary {
          background-color: rgba(var(--button-color-rgb), 0.1);
        }
        
        .neon-button-variant-outline {
          background-color: transparent;
        }
        
        .neon-button-variant-ghost {
          background-color: transparent;
        }
        
        .neon-button-variant-ghost .neon-button-border {
          border-style: dashed;
          opacity: 0.7;
        }
        
        .neon-button-variant-filled {
          background-color: var(--button-color);
          color: var(--bg-primary);
        }
        
        .neon-button-variant-filled:hover {
          background-color: transparent;
          color: var(--button-color);
        }
        
        /* Disabled state */
        .neon-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

// Helper functions
function getSizeClass(size) {
  switch (size) {
    case 'small':
      return 'neon-button-size-small';
    case 'medium':
      return 'neon-button-size-medium';
    case 'large':
      return 'neon-button-size-large';
    default:
      return 'neon-button-size-medium';
  }
}

function getVariantClass(variant) {
  switch (variant) {
    case 'primary':
      return 'neon-button-variant-primary';
    case 'outline':
      return 'neon-button-variant-outline';
    case 'ghost':
      return 'neon-button-variant-ghost';
    case 'filled':
      return 'neon-button-variant-filled';
    default:
      return 'neon-button-variant-primary';
  }
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
