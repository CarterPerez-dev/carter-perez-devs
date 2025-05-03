/**
 * Cyberpunk-style glitch animation utilities
 * These functions create different types of glitch effects for text and images
 */

// Text glitch effect - shifts character positions and adds color artifacts
export const glitchText = (element, intensity = 5, duration = 500) => {
  if (!element) return;
  
  const originalContent = element.textContent;
  const originalHTML = element.innerHTML;
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  const colors = ['#00fff5', '#ff3d3d', '#4d4dff', '#ffffff'];
  
  let iterations = 0;
  const maxIterations = Math.floor(duration / 50); // 20 frames per second
  
  // Save original styles
  const originalStyles = {
    color: window.getComputedStyle(element).color,
    textShadow: window.getComputedStyle(element).textShadow
  };
  
  const interval = setInterval(() => {
    if (iterations >= maxIterations) {
      clearInterval(interval);
      element.innerHTML = originalHTML;
      element.style.color = originalStyles.color;
      element.style.textShadow = originalStyles.textShadow;
      return;
    }
    
    // Create glitched text
    element.textContent = originalContent
      .split('')
      .map((char, index) => {
        // Only glitch some characters randomly
        if (Math.random() < intensity / 100) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      })
      .join('');
    
    // Add color glitch
    if (Math.random() < 0.3) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const glitchX = Math.random() * 3 - 1.5;
      const glitchY = Math.random() * 2 - 1;
      
      element.style.color = randomColor;
      element.style.textShadow = `${glitchX}px ${glitchY}px 3px rgba(255,0,0,0.5), 
                                 ${-glitchX}px ${-glitchY}px 3px rgba(0,255,255,0.5), 
                                 0 0 5px rgba(255,255,255,0.7)`;
    }
    
    iterations++;
  }, 50);
  
  return interval;
};

// Image glitch effect - applies CSS filters and clip-path distortions
export const glitchImage = (element, intensity = 5, duration = 500) => {
  if (!element || element.tagName !== 'IMG') return;
  
  const originalStyles = {
    filter: element.style.filter || 'none',
    clipPath: element.style.clipPath || 'none',
    transform: element.style.transform || 'none'
  };
  
  let iterations = 0;
  const maxIterations = Math.floor(duration / 50);
  
  const interval = setInterval(() => {
    if (iterations >= maxIterations) {
      clearInterval(interval);
      element.style.filter = originalStyles.filter;
      element.style.clipPath = originalStyles.clipPath;
      element.style.transform = originalStyles.transform;
      return;
    }
    
    // Apply random distortion effects
    if (Math.random() < 0.33) {
      // RGB shift
      const shiftX = (Math.random() * intensity) - (intensity / 2);
      const shiftY = (Math.random() * intensity) - (intensity / 2);
      element.style.filter = `
        hue-rotate(${Math.random() * 360}deg) 
        contrast(${1 + Math.random() * 0.4}) 
        saturate(${1 + Math.random() * 0.5})
      `;
      element.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    }
    
    // Apply clip-path glitch
    if (Math.random() < 0.33) {
      const y1 = Math.random() * 100;
      const y2 = Math.random() * 100;
      element.style.clipPath = `polygon(0 ${y1}%, 100% ${y2}%, 100% 100%, 0 100%)`;
    }
    
    iterations++;
  }, 50);
  
  return interval;
};

// Page glitch effect - applies temporary glitches to the entire viewport
export const glitchScreen = (intensity = 3, duration = 300) => {
  const glitchOverlay = document.createElement('div');
  
  glitchOverlay.style.position = 'fixed';
  glitchOverlay.style.top = '0';
  glitchOverlay.style.left = '0';
  glitchOverlay.style.width = '100vw';
  glitchOverlay.style.height = '100vh';
  glitchOverlay.style.pointerEvents = 'none';
  glitchOverlay.style.zIndex = '999999';
  glitchOverlay.style.mixBlendMode = 'difference';
  glitchOverlay.style.animation = `glitchScreen ${duration}ms linear`;
  
  // Create keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitchScreen {
      0% { opacity: 0; background-color: transparent; }
      10% { opacity: 0.1; background-color: rgba(0, 255, 245, 0.1); transform: translateX(${(Math.random() - 0.5) * intensity * 10}px); }
      20% { opacity: 0; background-color: transparent; }
      30% { opacity: 0.1; background-color: rgba(255, 61, 61, 0.1); transform: translateY(${(Math.random() - 0.5) * intensity * 10}px); }
      40% { opacity: 0; background-color: transparent; }
      50% { opacity: 0.2; background-color: rgba(255, 255, 255, 0.2); clip-path: inset(${Math.random() * 100}% 0 0 0); }
      60% { opacity: 0; background-color: transparent; }
      70% { opacity: 0.15; background-color: rgba(0, 255, 245, 0.1); transform: scale(${1 + Math.random() * 0.1}); }
      80% { opacity: 0; background-color: transparent; }
      90% { opacity: 0.2; background-color: rgba(255, 61, 61, 0.1); transform: translateX(${(Math.random() - 0.5) * intensity * 5}px); }
      100% { opacity: 0; background-color: transparent; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(glitchOverlay);
  
  // Remove after animation completes
  setTimeout(() => {
    document.body.removeChild(glitchOverlay);
    document.head.removeChild(style);
  }, duration);
};

export default {
  glitchText,
  glitchImage,
  glitchScreen
};
