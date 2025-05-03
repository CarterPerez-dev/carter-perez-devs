import { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook for creating and controlling data stream animations
 * 
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @param {Object} config - Configuration options for the data stream
 * @returns {Object} - Methods to control the data stream
 */
export const useDataStream = (
  canvasRef,
  {
    density = 70,
    speed = 5,
    direction = 'right',
    mode = 'continuous',
    primaryColor = null,
    secondaryColor = null
  } = {}
) => {
  const { theme } = useTheme();
  const configRef = useRef({
    density,
    speed,
    direction,
    mode,
    primaryColor: primaryColor || (theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)'),
    secondaryColor: secondaryColor || 'rgba(255, 61, 61, 0.8)'
  });
  
  const streamRef = useRef({
    active: false,
    animationId: null,
    particles: [],
    lastFrameTime: 0
  });
  
  // Parse CSS variable to RGB values
  const parseColor = useCallback((color) => {
    // Handle CSS variables
    if (color.startsWith('var(')) {
      // Since we can't access computed styles directly here,
      // use predefined fallbacks for common variables
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
  
  // Create a data particle
  const createParticle = useCallback((canvas, config) => {
    const { width, height } = canvas;
    const { direction, primaryColor, secondaryColor } = config;
    
    // Set particle position based on direction
    let x, y;
    
    switch (direction) {
      case 'right':
        x = 0;
        y = Math.random() * height;
        break;
      case 'left':
        x = width;
        y = Math.random() * height;
        break;
      case 'up':
        x = Math.random() * width;
        y = height;
        break;
      case 'down':
        x = Math.random() * width;
        y = 0;
        break;
      default:
        x = 0;
        y = Math.random() * height;
    }
    
    // Randomly choose color
    const color = Math.random() > 0.7 ? secondaryColor : primaryColor;
    const parsedColor = parseColor(color);
    
    // Create particle
    return {
      x,
      y,
      size: 1 + Math.random() * 3,
      speed: (0.5 + Math.random() * 1.5) * config.speed / 5,
      color: `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${0.3 + Math.random() * 0.7})`,
      trail: [], // Store previous positions for trail effect
      trailLength: Math.floor(5 + Math.random() * 15),
      pulsePhase: Math.random() * Math.PI * 2, // For pulsing mode
      waveOffset: Math.random() * Math.PI * 2 // For wave mode
    };
  }, [parseColor]);
  
  // Update particle position
  const updateParticle = useCallback((particle, canvas, config, deltaTime) => {
    const { direction, mode } = config;
    const { width, height } = canvas;
    
    // Store current position in trail
    particle.trail.unshift({ x: particle.x, y: particle.y });
    
    // Limit trail length
    if (particle.trail.length > particle.trailLength) {
      particle.trail.pop();
    }
    
    // Calculate base movement
    let dx = 0;
    let dy = 0;
    
    switch (direction) {
      case 'right':
        dx = particle.speed * deltaTime / 16;
        break;
      case 'left':
        dx = -particle.speed * deltaTime / 16;
        break;
      case 'up':
        dy = -particle.speed * deltaTime / 16;
        break;
      case 'down':
        dy = particle.speed * deltaTime / 16;
        break;
    }
    
    // Apply movement patterns based on mode
    if (mode === 'wave') {
      // Add sine wave pattern perpendicular to movement
      particle.waveOffset += 0.1 * deltaTime / 16;
      
      const amplitude = 2 + Math.random() * 3;
      const waveFactor = Math.sin(particle.waveOffset) * amplitude;
      
      if (direction === 'right' || direction === 'left') {
        dy += waveFactor;
      } else {
        dx += waveFactor;
      }
    } else if (mode === 'pulse') {
      // Pulse size and opacity
      particle.pulsePhase += 0.1 * deltaTime / 16;
      
      if (particle.pulsePhase > Math.PI * 2) {
        particle.pulsePhase -= Math.PI * 2;
      }
    }
    
    // Update position
    particle.x += dx;
    particle.y += dy;
    
    // Check if particle is out of bounds
    const isOutOfBounds = 
      particle.x < -particle.size * 2 || 
      particle.x > width + particle.size * 2 || 
      particle.y < -particle.size * 2 || 
      particle.y > height + particle.size * 2;
    
    return isOutOfBounds;
  }, []);
  
  // Draw a single particle
  const drawParticle = useCallback((ctx, particle, config) => {
    const { mode } = config;
    
    // For pulse mode, adjust size and opacity
    let size = particle.size;
    let opacity = 1;
    
    if (mode === 'pulse') {
      const pulseFactor = 0.7 + 0.3 * Math.sin(particle.pulsePhase);
      size *= pulseFactor;
      opacity *= pulseFactor;
    }
    
    // Draw trail first (behind particle)
    if (particle.trail.length > 0) {
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      
      for (let i = 0; i < particle.trail.length; i++) {
        const point = particle.trail[i];
        const trailOpacity = opacity * (1 - i / particle.trail.length);
        
        if (i === 0) {
          ctx.lineTo(point.x, point.y);
        } else {
          // Use quadratic curves for smoother trails
          const prevPoint = particle.trail[i - 1];
          const midX = (prevPoint.x + point.x) / 2;
          const midY = (prevPoint.y + point.y) / 2;
          
          ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
        }
      }
      
      // Get base color without alpha
      const baseColor = particle.color.substring(0, particle.color.lastIndexOf(',') + 1);
      
      // Create gradient along trail
      const gradient = ctx.createLinearGradient(
        particle.x, particle.y,
        particle.trail[particle.trail.length - 1].x,
        particle.trail[particle.trail.length - 1].y
      );
      
      gradient.addColorStop(0, `${baseColor} ${opacity})`);
      gradient.addColorStop(1, `${baseColor} 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = size / 2;
      ctx.stroke();
    }
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
    ctx.fill();
    
    // Add glow effect
    const glowSize = size * 3;
    const glow = ctx.createRadialGradient(
      particle.x, particle.y, size * 0.5,
      particle.x, particle.y, glowSize
    );
    
    const baseColor = particle.color.substring(0, particle.color.lastIndexOf(',') + 1);
    glow.addColorStop(0, `${baseColor} ${opacity * 0.5})`);
    glow.addColorStop(1, `${baseColor} 0)`);
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
  }, []);
  
  // Animation loop for the data stream
  const animateStream = useCallback((timestamp) => {
    if (!canvasRef.current || !streamRef.current.active) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const config = configRef.current;
    
    // Calculate time delta
    const deltaTime = timestamp - streamRef.current.lastFrameTime;
    streamRef.current.lastFrameTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add new particles based on density
    const particlesNeeded = Math.max(5, Math.floor(config.density / 10));
    const newParticlesCount = Math.max(0, particlesNeeded - streamRef.current.particles.length);
    
    // Add new particles with probability based on density and delta time
    if (Math.random() < config.density / 1000 * deltaTime / 16) {
      for (let i = 0; i < Math.min(newParticlesCount, 3); i++) {
        streamRef.current.particles.push(createParticle(canvas, config));
      }
    }
    
    // Update and draw particles
    for (let i = streamRef.current.particles.length - 1; i >= 0; i--) {
      const particle = streamRef.current.particles[i];
      
      // Update position and check if out of bounds
      const isOutOfBounds = updateParticle(particle, canvas, config, deltaTime);
      
      if (isOutOfBounds) {
        // Replace with new particle
        streamRef.current.particles.splice(i, 1);
        continue;
      }
      
      // Draw particle
      drawParticle(ctx, particle, config);
    }
    
    // Schedule next frame
    streamRef.current.animationId = requestAnimationFrame(animateStream);
  }, [canvasRef, createParticle, drawParticle, updateParticle]);
  
  // Start the data stream animation
  const startStream = useCallback(() => {
    if (!canvasRef.current || streamRef.current.active) return;
    
    // Initialize canvas
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Reset particles
    streamRef.current.particles = [];
    
    // Initialize with some particles
    const initialParticles = Math.max(5, Math.floor(configRef.current.density / 20));
    
    for (let i = 0; i < initialParticles; i++) {
      streamRef.current.particles.push(
        createParticle(canvas, configRef.current)
      );
    }
    
    // Start animation
    streamRef.current.active = true;
    streamRef.current.lastFrameTime = performance.now();
    streamRef.current.animationId = requestAnimationFrame(animateStream);
  }, [canvasRef, createParticle, animateStream]);
  
  // Stop the data stream animation
  const stopStream = useCallback(() => {
    if (!streamRef.current.active) return;
    
    streamRef.current.active = false;
    
    if (streamRef.current.animationId) {
      cancelAnimationFrame(streamRef.current.animationId);
      streamRef.current.animationId = null;
    }
  }, []);
  
  // Update stream configuration
  const updateStreamConfig = useCallback((newConfig) => {
    configRef.current = {
      ...configRef.current,
      ...newConfig
    };
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current.animationId) {
        cancelAnimationFrame(streamRef.current.animationId);
      }
    };
  }, []);
  
  return {
    startStream,
    stopStream,
    updateStreamConfig
  };
};

export default useDataStream;
