import React, { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { throttle } from '../../utils/performance';

// Use memo to prevent unnecessary re-renders
const AmbientBackground = memo(() => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [performanceLevel, setPerformanceLevel] = useState(() => {
    // Retrieve from localStorage or compute based on device capability
    const savedLevel = localStorage.getItem('performanceLevel');
    return savedLevel ? parseInt(savedLevel) : 3;
  });
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  const fpsLimit = 20; // Further reduced FPS limit for background

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Super throttled resize handler
    const handleResize = throttle(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, 500); // Increase throttle time for better performance
    
    window.addEventListener('resize', handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Colors based on theme
    const gridColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.15)' : 'rgba(77, 77, 255, 0.15)';
    
    // Create grid lines - DRASTICALLY REDUCED number of lines
    const gridSize = performanceLevel > 2 ? 160 : 240; // Even larger grid cells = much fewer lines
    
    // Cache grid calculation instead of recalculating each frame
    const prepareGrid = () => {
      const cols = Math.ceil(canvas.width / gridSize) + 1;
      const rows = Math.ceil(canvas.height / gridSize);
      
      return { cols, rows };
    };
    
    const { cols, rows } = prepareGrid();
    
    // Animation parameters - reduce speed further
    const gridSpeed = 0.15; // Reduced significantly from original 0.5
    let offset = 0;
    
    // Modified render with significant optimizations
    const render = (timestamp) => {
      // Calculate time difference & limit FPS
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const elapsed = timestamp - previousTimeRef.current;
      
      if (elapsed > 1000 / fpsLimit) {
        previousTimeRef.current = timestamp;
        
        // Clear canvas with background color - only once per frame
        ctx.fillStyle = theme === 'dark' ? 'rgba(5, 5, 5, 0.9)' : 'rgba(15, 8, 8, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update grid offset more slowly
        offset += gridSpeed;
        if (offset >= gridSize) {
          offset = 0;
        }
        
        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5; // Thinner lines for better performance
        
        // Draw reduced horizontal lines - only every 2nd line
        for (let y = 0; y <= rows; y += 2) {
          const yPos = y * gridSize;
          // Only draw lines that would be visible
          if (yPos >= 0 && yPos <= canvas.height) {
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(canvas.width, yPos);
            ctx.stroke();
          }
        }
        
        // Draw reduced vertical lines - only every 2nd line with scrolling effect
        for (let x = 0; x <= cols; x += 2) {
          const xPos = x * gridSize - offset;
          // Only draw lines that would be visible
          if (xPos >= 0 && xPos <= canvas.width) {
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height);
            ctx.stroke();
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(render);
    };
    
    // Only run animation when tab is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      } else {
        if (!requestRef.current) {
          requestRef.current = requestAnimationFrame(render);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    requestRef.current = requestAnimationFrame(render);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [theme, performanceLevel]);

  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10,
    pointerEvents: 'none',
    willChange: 'transform' // Hint for browser optimization
  };

  return (
    <canvas
      ref={canvasRef}
      className="ambient-background"
      style={canvasStyle}
      aria-hidden="true" // Add for accessibility
    />
  );
});

// Helper functions moved outside component for better memory usage
function getDensityValue(density) {
  switch (density) {
    case 'low': return 20;
    case 'medium': return 50;
    case 'high': return 80;
    default: return parseInt(density, 10) || 50;
  }
}

function getSpeedValue(speed) {
  switch (speed) {
    case 'slow': return 1;
    case 'medium': return 5;
    case 'fast': return 10;
    default: return parseInt(speed, 10) || 5;
  }
}

// Add display name for debugging
AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
