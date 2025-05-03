import { useCallback, useEffect, useRef } from 'react';

/**
 * A custom hook to create cyberpunk-style glitch effects on elements
 * 
 * @param {React.RefObject} elementRef - React ref object pointing to the element to apply glitch effect
 * @param {Object} options - Configuration options for the glitch effect
 * @param {number} options.intensity - Intensity of the glitch (1-10)
 * @param {number} options.duration - Duration of the glitch effect in ms
 * @param {boolean} options.continuousGlitch - Whether the glitch should continue indefinitely
 * @param {string} options.targetType - What to glitch: 'text', 'element', or 'image'
 * @returns {Object} - Methods to control the glitch effect
 */
export const useGlitch = (
  elementRef,
  {
    intensity = 5,
    duration = 1000,
    continuousGlitch = false,
    targetType = 'auto'
  } = {}
) => {
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isActiveRef = useRef(false);
  
  // Normalize intensity to a value between 1 and 10
  const normalizedIntensity = Math.min(10, Math.max(1, intensity));
  
  // Clean up any existing intervals and timeouts
  const cleanUp = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset element styles if glitch is not active anymore
    if (!isActiveRef.current && elementRef.current) {
      const element = elementRef.current;
      
      // Reset text element
      if (targetType === 'text' || 
         (targetType === 'auto' && (!element.childElementCount || element.childElementCount === 1))) {
        element.style.transform = '';
        element.style.textShadow = '';
        element.style.color = '';
      }
      
      // Reset image element
      if (targetType === 'image' || 
         (targetType === 'auto' && (element.tagName === 'IMG' || element.querySelector('img')))) {
        const img = element.tagName === 'IMG' ? element : element.querySelector('img');
        if (img) {
          img.style.transform = '';
          img.style.filter = '';
          img.style.opacity = '';
        }
      }
      
      // Reset element styles
      element.style.clipPath = '';
    }
  }, [elementRef, targetType]);
  
  // Apply a single glitch frame
  const applyGlitchFrame = useCallback(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    
    // Determine target type if auto
    let effectiveType = targetType;
    if (targetType === 'auto') {
      if (element.tagName === 'IMG' || element.querySelector('img')) {
        effectiveType = 'image';
      } else if (!element.childElementCount || element.childElementCount === 1) {
        effectiveType = 'text';
      } else {
        effectiveType = 'element';
      }
    }
    
    // Apply appropriate glitch effect based on target type
    switch (effectiveType) {
      case 'text': {
        // Text glitch effects
        const glitchChance = normalizedIntensity / 10;
        
        if (Math.random() < glitchChance) {
          // Apply RGB shift
          const shiftX = Math.random() * normalizedIntensity - normalizedIntensity / 2;
          const shiftY = Math.random() * normalizedIntensity - normalizedIntensity / 2;
          
          element.style.textShadow = `
            ${shiftX}px 0 1px rgba(255, 0, 0, 0.7),
            ${-shiftX}px 0 1px rgba(0, 255, 255, 0.7),
            0 ${shiftY}px 1px rgba(0, 255, 0, 0.7)
          `;
        }
        
        if (Math.random() < glitchChance * 0.7) {
          // Apply skew transform
          const skewX = (Math.random() * normalizedIntensity - normalizedIntensity / 2) * 0.5;
          const skewY = (Math.random() * normalizedIntensity - normalizedIntensity / 2) * 0.5;
          
          element.style.transform = `skew(${skewX}deg, ${skewY}deg)`;
        } else {
          element.style.transform = '';
        }
        
        break;
      }
      
      case 'image': {
        // Image glitch effects
        const img = element.tagName === 'IMG' ? element : element.querySelector('img');
        if (!img) return;
        
        const glitchChance = normalizedIntensity / 10;
        
        if (Math.random() < glitchChance) {
          // Apply RGB shift and other filters
          const hueRotate = Math.floor(Math.random() * 360);
          const brightness = 0.8 + Math.random() * 0.4;
          const contrast = 0.8 + Math.random() * 0.4;
          
          img.style.filter = `
            hue-rotate(${hueRotate}deg)
            brightness(${brightness})
            contrast(${contrast})
          `;
          
          // Random displacement
          const translateX = (Math.random() * normalizedIntensity - normalizedIntensity / 2) * 0.5;
          const translateY = (Math.random() * normalizedIntensity - normalizedIntensity / 2) * 0.5;
          
          img.style.transform = `translate(${translateX}px, ${translateY}px)`;
        } else {
          img.style.filter = '';
          img.style.transform = '';
        }
        
        break;
      }
      
      case 'element':
      default: {
        // Element glitch effects
        const glitchChance = normalizedIntensity / 10;
        
        if (Math.random() < glitchChance) {
          // Apply clip-path glitch
          const top = Math.random() * 100;
          const bottom = 100 - Math.random() * 20;
          
          element.style.clipPath = `inset(${top}% 0 ${bottom}% 0)`;
        } else {
          element.style.clipPath = '';
        }
        
        if (Math.random() < glitchChance * 0.5) {
          // Apply transform glitch
          const translateX = (Math.random() * normalizedIntensity - normalizedIntensity / 2) * 0.5;
          
          element.style.transform = `translateX(${translateX}px)`;
        } else {
          element.style.transform = '';
        }
        
        break;
      }
    }
  }, [elementRef, normalizedIntensity, targetType]);
  
  // Reset the glitch effect
  const resetGlitch = useCallback(() => {
    cleanUp();
    isActiveRef.current = false;
    
    if (elementRef.current) {
      const element = elementRef.current;
      
      element.style.transform = '';
      element.style.textShadow = '';
      element.style.clipPath = '';
      element.style.filter = '';
      
      if (element.tagName === 'IMG' || element.querySelector('img')) {
        const img = element.tagName === 'IMG' ? element : element.querySelector('img');
        if (img) {
          img.style.transform = '';
          img.style.filter = '';
        }
      }
    }
  }, [cleanUp, elementRef]);
  
  // Start the glitch effect
  const startGlitch = useCallback((options = {}) => {
    // Merge default options with provided options
    const glitchOptions = {
      intensity: normalizedIntensity,
      duration: duration,
      continuousGlitch: continuousGlitch,
      ...options
    };
    
    // Clean up any existing glitch effects
    cleanUp();
    
    // Set active state
    isActiveRef.current = true;
    
    // Apply initial glitch
    applyGlitchFrame();
    
    // Set up interval for glitching
    const intervalTime = Math.max(30, 200 - glitchOptions.intensity * 15);
    intervalRef.current = setInterval(applyGlitchFrame, intervalTime);
    
    // If not continuous, set timeout to stop glitching
    if (!glitchOptions.continuousGlitch) {
      timeoutRef.current = setTimeout(() => {
        cleanUp();
        isActiveRef.current = false;
        
        // Reset styles smoothly
        if (elementRef.current) {
          elementRef.current.style.transition = 'all 0.3s ease';
          
          setTimeout(() => {
            if (elementRef.current) {
              elementRef.current.style.transform = '';
              elementRef.current.style.textShadow = '';
              elementRef.current.style.clipPath = '';
              
              // Reset transition after styles are reset
              setTimeout(() => {
                if (elementRef.current) {
                  elementRef.current.style.transition = '';
                }
              }, 300);
            }
          }, 50);
        }
      }, glitchOptions.duration);
    }
  }, [
    applyGlitchFrame,
    cleanUp,
    normalizedIntensity,
    duration,
    continuousGlitch,
    elementRef
  ]);
  
  // Stop the glitch effect
  const stopGlitch = useCallback(() => {
    cleanUp();
    isActiveRef.current = false;
    
    // Reset styles smoothly
    if (elementRef.current) {
      elementRef.current.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.style.transform = '';
          elementRef.current.style.textShadow = '';
          elementRef.current.style.clipPath = '';
          
          // Reset transition after styles are reset
          setTimeout(() => {
            if (elementRef.current) {
              elementRef.current.style.transition = '';
            }
          }, 300);
        }
      }, 50);
    }
  }, [cleanUp, elementRef]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => cleanUp();
  }, [cleanUp]);
  
  // Start glitch if continuousGlitch is true on mount
  useEffect(() => {
    if (continuousGlitch) {
      startGlitch({ continuousGlitch: true });
    }
    
    return () => cleanUp();
  }, [continuousGlitch, startGlitch, cleanUp]);
  
  return {
    startGlitch,
    stopGlitch,
    resetGlitch,
    isGlitching: isActiveRef.current
  };
};

export default useGlitch;
