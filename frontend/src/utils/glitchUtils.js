/**
 * Glitch effect utilities
 * Collection of functions to create and manage cyberpunk glitch effects
 */

// Random characters for text glitching
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Apply a glitch effect to a text string
 * @param {string} text - Original text to glitch
 * @param {number} intensity - Glitch effect intensity (0-100)
 * @returns {string} - Glitched text
 */
export const glitchText = (text, intensity = 20) => {
  if (!text) return '';
  
  // Normalize intensity to 0-100 range
  const normalizedIntensity = Math.max(0, Math.min(100, intensity));
  
  // Calculate how many characters to glitch based on intensity
  const charsToGlitch = Math.ceil(text.length * (normalizedIntensity / 100));
  
  // Convert text to array for manipulation
  const textArray = text.split('');
  
  // Apply glitch to random characters
  for (let i = 0; i < charsToGlitch; i++) {
    const randomIndex = Math.floor(Math.random() * text.length);
    const randomChar = GLITCH_CHARS.charAt(Math.floor(Math.random() * GLITCH_CHARS.length));
    textArray[randomIndex] = randomChar;
  }
  
  return textArray.join('');
};

/**
 * Creates text with split RGB channels effect
 * @param {string} text - Text to apply effect to
 * @param {number} offset - Pixel offset for color channels
 * @returns {Object} - HTML/CSS objects for applying the effect
 */
export const createRGBSplitText = (text, offset = 2) => {
  return {
    container: {
      position: 'relative',
      display: 'inline-block'
    },
    original: {
      visibility: 'hidden'
    },
    red: {
      position: 'absolute',
      top: 0,
      left: -offset + 'px',
      color: 'rgba(255, 0, 0, 0.8)',
      zIndex: 1
    },
    green: {
      position: 'absolute',
      top: 0,
      left: 0,
      color: 'rgba(0, 255, 0, 0.8)',
      zIndex: 2
    },
    blue: {
      position: 'absolute',
      top: 0,
      left: offset + 'px',
      color: 'rgba(0, 0, 255, 0.8)',
      zIndex: 3
    }
  };
};

/**
 * Create a clip-path polygon for glitch effect
 * @param {number} complexity - Number of points in the polygon
 * @param {number} intensity - How severe the glitch distortion is
 * @returns {string} - CSS clip-path polygon function
 */
export const createGlitchClipPath = (complexity = 6, intensity = 10) => {
  // Generate clip-path polygon points
  const points = [];
  
  // Always include corners for base shape
  points.push('0% 0%'); // Top left
  
  // Add random points along top edge
  for (let i = 1; i < complexity - 1; i++) {
    const x = (i * (100 / (complexity - 1))).toFixed(1);
    const y = (Math.random() * intensity).toFixed(1);
    points.push(`${x}% ${y}%`);
  }
  
  points.push('100% 0%'); // Top right
  
  // Add random points along right edge
  for (let i = 1; i < complexity - 1; i++) {
    const y = (i * (100 / (complexity - 1))).toFixed(1);
    const x = (100 - Math.random() * intensity).toFixed(1);
    points.push(`${x}% ${y}%`);
  }
  
  points.push('100% 100%'); // Bottom right
  
  // Add random points along bottom edge
  for (let i = complexity - 2; i > 0; i--) {
    const x = (i * (100 / (complexity - 1))).toFixed(1);
    const y = (100 - Math.random() * intensity).toFixed(1);
    points.push(`${x}% ${y}%`);
  }
  
  points.push('0% 100%'); // Bottom left
  
  // Add random points along left edge
  for (let i = complexity - 2; i > 0; i--) {
    const y = (i * (100 / (complexity - 1))).toFixed(1);
    const x = (Math.random() * intensity).toFixed(1);
    points.push(`${x}% ${y}%`);
  }
  
  return `polygon(${points.join(', ')})`;
};

/**
 * Generate a glitch animation keyframes string
 * @param {number} steps - Number of keyframe steps
 * @param {number} intensity - Glitch intensity
 * @returns {string} - CSS keyframes definition
 */
export const generateGlitchKeyframes = (steps = 5, intensity = 10) => {
  let keyframes = '@keyframes glitch {\n';
  
  // Create keyframe steps
  for (let i = 0; i <= steps; i++) {
    const percent = i === steps ? 100 : Math.floor((i / steps) * 100);
    const translateX = (Math.random() * intensity * 2 - intensity).toFixed(1);
    const translateY = (Math.random() * intensity * 2 - intensity).toFixed(1);
    const scale = (0.95 + Math.random() * 0.1).toFixed(2);
    const rotate = (Math.random() * intensity / 5).toFixed(1);
    const clipPath = createGlitchClipPath(4, intensity);
    
    keyframes += `  ${percent}% {\n`;
    keyframes += `    transform: translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg);\n`;
    keyframes += `    clip-path: ${clipPath};\n`;
    keyframes += `  }\n`;
  }
  
  keyframes += '}';
  return keyframes;
};

/**
 * Apply scanline effect CSS properties
 * @param {number} lineHeight - Height of each scanline in pixels
 * @param {number} opacity - Opacity of scanlines
 * @returns {Object} - CSS properties for scanline effect
 */
export const getScanlineEffect = (lineHeight = 2, opacity = 0.2) => {
  return {
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent ${lineHeight - 1}px,
        rgba(255, 255, 255, ${opacity}) ${lineHeight - 1}px,
        rgba(255, 255, 255, ${opacity}) ${lineHeight}px
      )`,
      pointerEvents: 'none'
    }
  };
};

/**
 * Generate noise background pattern
 * @param {number} opacity - Noise opacity
 * @param {string} color - Base color of noise
 * @returns {string} - CSS background property
 */
export const getNoiseBackground = (opacity = 0.05, color = '255, 255, 255') => {
  const noiseDataUrl = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E`;
  
  return `url("${noiseDataUrl}")`;
};

/**
 * Generate a random digital/binary sequence
 * @param {number} length - Length of sequence
 * @returns {string} - Random sequence of 0s and 1s
 */
export const generateBinarySequence = (length = 16) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 2);
  }
  return result;
};

/**
 * Apply CRT TV effect to an element
 * @param {Object} options - CRT effect options
 * @returns {Object} - CSS properties for CRT effect
 */
export const getCRTEffect = ({
  curvature = 4, // Screen curvature amount
  vignette = 0.6, // Vignette darkness
  scanlines = true, // Show scanlines
  noise = true, // Show noise
  flicker = true // Screen flicker
} = {}) => {
  return {
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      // Curvature effect
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, ${vignette}) 90%
      )`,
      borderRadius: `${curvature}% / ${curvature * 1.5}%`,
      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)',
      pointerEvents: 'none'
    },
    '&::after': scanlines ? {
      // Scanlines
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(
        to bottom,
        transparent 50%,
        rgba(0, 0, 0, 0.1) 51%
      )`,
      backgroundSize: '100% 4px',
      pointerEvents: 'none',
      opacity: 0.4,
      animation: flicker ? 'flicker 0.15s infinite alternate' : 'none'
    } : {}
  };
};

// Export all utilities
export default {
  glitchText,
  createRGBSplitText,
  createGlitchClipPath,
  generateGlitchKeyframes,
  getScanlineEffect,
  getNoiseBackground,
  generateBinarySequence,
  getCRTEffect
};
