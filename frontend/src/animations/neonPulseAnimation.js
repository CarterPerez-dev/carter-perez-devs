/**
 * Neon pulse animation utilities
 * Functions for creating cyberpunk-style neon glow effects and pulsing animations
 */

// Create a pulsing neon glow effect on an element
export const createNeonPulse = (element, color = '#00fff5', intensity = 5, duration = 2000) => {
  if (!element) return;
  
  // Save original styles
  const originalStyles = {
    boxShadow: window.getComputedStyle(element).boxShadow,
    textShadow: window.getComputedStyle(element).textShadow,
    color: window.getComputedStyle(element).color,
    transition: window.getComputedStyle(element).transition
  };
  
  // Convert intensity to pixel values
  const minGlow = 2;
  const maxGlow = minGlow + intensity;
  
  // Set transition
  element.style.transition = `all ${duration / 2000}s ease-in-out`;
  
  // Check if element is text-only or has a border
  const isTextElement = element.children.length === 0 && element.textContent.trim() !== '';
  const hasBorder = window.getComputedStyle(element).border !== '0px none rgb(0, 0, 0)';
  
  // Start animation loop
  let isPulsing = true;
  let pulseIn = true;
  
  const pulseLoop = () => {
    if (!isPulsing) return;
    
    if (pulseIn) {
      // Pulse in (increase glow)
      if (isTextElement) {
        element.style.color = color;
        element.style.textShadow = `0 0 ${maxGlow}px ${color}, 0 0 ${maxGlow * 1.5}px ${color}`;
      }
      
      if (hasBorder) {
        element.style.boxShadow = `0 0 ${maxGlow}px ${color}, inset 0 0 ${maxGlow / 2}px ${color}`;
      }
    } else {
      // Pulse out (decrease glow)
      if (isTextElement) {
        element.style.textShadow = `0 0 ${minGlow}px ${color}, 0 0 ${minGlow * 1.5}px ${color}`;
      }
      
      if (hasBorder) {
        element.style.boxShadow = `0 0 ${minGlow}px ${color}, inset 0 0 ${minGlow / 2}px ${color}`;
      }
    }
    
    // Toggle pulse direction
    pulseIn = !pulseIn;
    
    // Schedule next pulse
    setTimeout(pulseLoop, duration / 2);
  };
  
  // Start the animation
  pulseLoop();
  
  // Return a function to stop the animation
  return () => {
    isPulsing = false;
    
    // Restore original styles
    element.style.boxShadow = originalStyles.boxShadow;
    element.style.textShadow = originalStyles.textShadow;
    element.style.color = originalStyles.color;
    element.style.transition = originalStyles.transition;
  };
};

// Apply neon highlight effect on hover
export const neonHoverEffect = (element, color = '#00fff5', intensity = 5) => {
  if (!element) return;
  
  // Save original styles
  const originalStyles = {
    boxShadow: element.style.boxShadow || '',
    textShadow: element.style.textShadow || '',
    color: element.style.color || '',
    borderColor: element.style.borderColor || '',
    transition: element.style.transition || ''
  };
  
  // Set up transition
  element.style.transition = 'all 0.3s ease';
  
  // Convert intensity to pixel values
  const glowSize = intensity * 2;
  
  // Mouse enter event - apply neon effect
  const mouseEnterHandler = () => {
    element.style.color = color;
    element.style.borderColor = color;
    element.style.boxShadow = `0 0 ${glowSize}px ${color}, inset 0 0 ${glowSize / 2}px ${color}`;
    element.style.textShadow = `0 0 ${glowSize / 2}px ${color}`;
  };
  
  // Mouse leave event - restore original styles
  const mouseLeaveHandler = () => {
    element.style.boxShadow = originalStyles.boxShadow;
    element.style.textShadow = originalStyles.textShadow;
    element.style.color = originalStyles.color;
    element.style.borderColor = originalStyles.borderColor;
  };
  
  // Add event listeners
  element.addEventListener('mouseenter', mouseEnterHandler);
  element.addEventListener('mouseleave', mouseLeaveHandler);
  
  // Return a cleanup function
  return () => {
    element.removeEventListener('mouseenter', mouseEnterHandler);
    element.removeEventListener('mouseleave', mouseLeaveHandler);
    
    // Restore original styles
    element.style.boxShadow = originalStyles.boxShadow;
    element.style.textShadow = originalStyles.textShadow;
    element.style.color = originalStyles.color;
    element.style.borderColor = originalStyles.borderColor;
    element.style.transition = originalStyles.transition;
  };
};

// Create a text neon sign effect with flickering
export const neonSignEffect = (element, color = '#00fff5', flickerIntensity = 0.05) => {
  if (!element) return;
  
  // Save original styles
  const originalStyles = {
    color: element.style.color || '',
    textShadow: element.style.textShadow || '',
    transition: element.style.transition || ''
  };
  
  // Apply base neon effect
  element.style.color = color;
  element.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`;
  
  // Create random flicker
  let isFlickering = true;
  
  const flicker = () => {
    if (!isFlickering) return;
    
    // Random chance to flicker
    if (Math.random() < flickerIntensity) {
      // Turn off (brief flicker)
      element.style.opacity = 0.8;
      element.style.textShadow = 'none';
      
      // Randomly decide when to turn back on
      setTimeout(() => {
        element.style.opacity = 1;
        element.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`;
      }, Math.random() * 100);
    }
    
    // Schedule next potential flicker
    setTimeout(flicker, 100 + Math.random() * 1000);
  };
  
  // Start flickering
  flicker();
  
  // Return cleanup function
  return () => {
    isFlickering = false;
    
    // Restore original styles
    element.style.color = originalStyles.color;
    element.style.textShadow = originalStyles.textShadow;
    element.style.transition = originalStyles.transition;
    element.style.opacity = 1;
  };
};

export default {
  createNeonPulse,
  neonHoverEffect,
  neonSignEffect
};
