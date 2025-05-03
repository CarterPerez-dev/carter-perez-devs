import { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook for creating holographic effects on elements
 * 
 * @param {React.RefObject} elementRef - React ref to the element to apply effect to
 * @param {Object} config - Configuration options for the holographic effect
 * @returns {Object} - Methods to control the holographic effect
 */
export const useHolographicEffect = (
  elementRef,
  {
    color = null,
    intensity = 5,
    interactive = true,
    glowOnHover = true,
    perspective = 1000,
    hoverScale = 1.02,
    rotationFactor = 10
  } = {}
) => {
  const { theme } = useTheme();
  const configRef = useRef({
    color: color || (theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)'),
    intensity: Math.min(10, Math.max(0, intensity)), // Clamp between 0-10
    interactive,
    glowOnHover,
    perspective,
    hoverScale,
    rotationFactor
  });
  
  const stateRef = useRef({
    active: false,
    mousePosition: { x: 0, y: 0 },
    isHovered: false,
    rotation: { x: 0, y: 0 },
    animationId: null
  });
  
  // Parse color to RGB values
  const parseColor = useCallback((color) => {
    // Handle CSS variables
    if (color.startsWith('var(')) {
      // Since we can't access computed styles here, use predefined values
      if (color.includes('accent-cyan')) {
        return { r: 0, g: 255, b: 245 };
      } else if (color.includes('accent-blue')) {
        return { r: 77, g: 77, b: 255 };
      } else if (color.includes('accent-magenta')) {
        return { r: 255, g: 61, b: 61 };
      }
      
      // Default fallback
      return { r: 0, g: 255, b: 245 };
    }
    
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }
    
    // Handle rgba colors
    if (color.startsWith('rgba(')) {
      const values = color.substring(5, color.length - 1).split(',');
      return {
        r: parseInt(values[0], 10),
        g: parseInt(values[1], 10),
        b: parseInt(values[2], 10)
      };
    }
    
    // Handle rgb colors
    if (color.startsWith('rgb(')) {
      const values = color.substring(4, color.length - 1).split(',');
      return {
        r: parseInt(values[0], 10),
        g: parseInt(values[1], 10),
        b: parseInt(values[2], 10)
      };
    }
    
    // Default fallback
    return { r: 0, g: 255, b: 245 };
  }, []);
  
  // Update element with holographic effect
  const updateHolographicEffect = useCallback(() => {
    if (!elementRef.current || !stateRef.current.active) return;
    
    const element = elementRef.current;
    const { interactive, rotationFactor, hoverScale, glowOnHover, intensity, color } = configRef.current;
    const { isHovered, mousePosition, rotation } = stateRef.current;
    
    if (!interactive) {
      // Reset all transformations if not interactive
      element.style.transform = '';
      return;
    }
    
    // Apply rotation based on mouse position
    if (isHovered) {
      // Target rotation based on mouse position
      const targetRotationX = -(mousePosition.y * rotationFactor);
      const targetRotationY = mousePosition.x * rotationFactor;
      
      // Smoothly interpolate current rotation towards target
      rotation.x += (targetRotationX - rotation.x) * 0.1;
      rotation.y += (targetRotationY - rotation.y) * 0.1;
    } else {
      // When not hovered, smoothly return to neutral position
      rotation.x *= 0.9;
      rotation.y *= 0.9;
    }
    
    // Apply transform with rotation and optional scale
    const scale = isHovered ? hoverScale : 1;
    element.style.transform = `
      perspective(${configRef.current.perspective}px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      scale(${scale})
    `;
    
    // Apply glow effect on hover if enabled
    if (glowOnHover) {
      // Parse color to create glow
      const parsedColor = parseColor(color);
      const glowIntensity = isHovered ? intensity * 2 : intensity;
      const glowSize = isHovered ? 10 + glowIntensity * 2 : 5 + glowIntensity;
      
      element.style.boxShadow = isHovered
        ? `0 0 ${glowSize}px rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, 0.8)`
        : `0 0 ${glowSize / 2}px rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, 0.3)`;
      
      element.style.borderColor = color;
    }
    
    // Request next frame if still active
    if (stateRef.current.active) {
      stateRef.current.animationId = requestAnimationFrame(updateHolographicEffect);
    }
  }, [elementRef, parseColor]);
  
  // Handle mouse events for interactive holographic effect
  const setupMouseEvents = useCallback(() => {
    if (!elementRef.current || !configRef.current.interactive) return;
    
    const element = elementRef.current;
    
    const handleMouseMove = (e) => {
      if (!stateRef.current.active) return;
      
      const rect = element.getBoundingClientRect();
      
      // Calculate mouse position relative to element center (-1 to 1)
      stateRef.current.mousePosition = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
      };
    };
    
    const handleMouseEnter = () => {
      if (!stateRef.current.active) return;
      
      stateRef.current.isHovered = true;
      
      // Add a CSS transition for smoother effect
      element.style.transition = 'transform 0.2s, box-shadow 0.5s';
      
      setTimeout(() => {
        if (element && stateRef.current.isHovered) {
          element.style.transition = 'box-shadow 0.5s';
        }
      }, 200);
    };
    
    const handleMouseLeave = () => {
      if (!stateRef.current.active) return;
      
      stateRef.current.isHovered = false;
      
      // Add a CSS transition for smoother effect
      element.style.transition = 'transform 0.5s, box-shadow 0.5s';
      
      setTimeout(() => {
        if (element && !stateRef.current.isHovered) {
          element.style.transition = '';
        }
      }, 500);
    };
    
    // Add event listeners
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);
  
  // Start holographic effect
  const startHolographicEffect = useCallback(() => {
    if (!elementRef.current || stateRef.current.active) return;
    
    stateRef.current.active = true;
    
    // Setup mouse events for interactive effect
    const cleanupMouseEvents = setupMouseEvents();
    
    // Start animation loop
    stateRef.current.animationId = requestAnimationFrame(updateHolographicEffect);
    
    // Return function to stop effect
    return () => {
      if (cleanupMouseEvents) cleanupMouseEvents();
      stopHolographicEffect();
    };
  }, [elementRef, setupMouseEvents, updateHolographicEffect]);
  
  // Stop holographic effect
  const stopHolographicEffect = useCallback(() => {
    if (!stateRef.current.active) return;
    
    stateRef.current.active = false;
    
    if (stateRef.current.animationId) {
      cancelAnimationFrame(stateRef.current.animationId);
      stateRef.current.animationId = null;
    }
    
    // Reset element styles if it still exists
    if (elementRef.current) {
      const element = elementRef.current;
      
      element.style.transform = '';
      element.style.transition = '';
    }
  }, [elementRef]);
  
  // Update holographic effect configuration
  const updateHolographicConfig = useCallback((newConfig) => {
    configRef.current = {
      ...configRef.current,
      ...newConfig,
      // Ensure intensity is clamped
      intensity: newConfig.intensity !== undefined 
        ? Math.min(10, Math.max(0, newConfig.intensity))
        : configRef.current.intensity
    };
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.animationId) {
        cancelAnimationFrame(stateRef.current.animationId);
      }
    };
  }, []);
  
  return {
    startHolographicEffect,
    stopHolographicEffect,
    updateHolographicConfig
  };
};

export default useHolographicEffect;
