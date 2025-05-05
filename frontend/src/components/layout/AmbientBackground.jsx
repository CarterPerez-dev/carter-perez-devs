// frontend/src/components/layout/AmbientBackground.jsx
import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Use memo to prevent unnecessary re-renders completely
const AmbientBackground = memo(() => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  const gridRef = useRef({
    offset: 0,
    cols: 0,
    rows: 0,
    size: 0,
    color: ''
  });

  // Get performance level from localStorage (set in main.jsx)
  const getPerformanceLevel = () => {
    const level = localStorage.getItem('performanceLevel');
    return level ? parseInt(level) : 3; // Default to medium
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Fixed 300ms debounce for resize - even more performant
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Only update if dimensions actually changed by a significant amount
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        if (Math.abs(canvas.width - newWidth * window.devicePixelRatio) > 10 ||
            Math.abs(canvas.height - newHeight * window.devicePixelRatio) > 10) {
          canvas.width = newWidth * window.devicePixelRatio;
          canvas.height = newHeight * window.devicePixelRatio;
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          setupGrid();
        }
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Colors based on theme
    const gridColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.15)' : 'rgba(77, 77, 255, 0.15)';
    
    // Setup grid based on performance level
    const setupGrid = () => {
      const performanceLevel = getPerformanceLevel();
      
      // Grid size inversely proportional to performance level (larger grid = fewer lines)
      const baseSize = 160;
      const gridSize = baseSize + (5 - performanceLevel) * 40; // Larger grid for lower performance
      
      // Precalculate grid data
      const cols = Math.ceil(canvas.width / gridSize / window.devicePixelRatio) + 1;
      const rows = Math.ceil(canvas.height / gridSize / window.devicePixelRatio) + 1;
      
      // Cache the grid data
      gridRef.current = {
        size: gridSize,
        cols,
        rows,
        color: gridColor,
        // Adjust speed based on performance level
        speed: 0.15 / (5 - Math.min(performanceLevel, 4)),
        // Draw every nth line based on performance level
        lineInterval: 6 - performanceLevel,
        offset: 0
      };
    };
    
    setupGrid();
    
    // Optimized draw function
    const draw = (timestamp) => {
      // Don't calculate time difference on first frame
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const elapsed = timestamp - previousTimeRef.current;
      

      if (elapsed > 66) {
        previousTimeRef.current = timestamp;
        
        const grid = gridRef.current;
        
        // Clear canvas with faster method
        ctx.fillStyle = theme === 'dark' ? 'rgba(5, 5, 5, 0.9)' : 'rgba(15, 8, 8, 0.9)';
        ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        
        // Update grid offset at reduced speed
        grid.offset = (grid.offset + grid.speed * elapsed) % grid.size;
        
        // Draw grid with much fewer lines
        ctx.strokeStyle = grid.color;
        ctx.lineWidth = 0.5;
        
        // Draw far fewer horizontal lines - every nth line
        for (let y = 0; y < grid.rows; y += grid.lineInterval) {
          const yPos = y * grid.size;
          // Only draw lines in viewport
          if (yPos >= 0 && yPos <= canvas.height / window.devicePixelRatio) {
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(canvas.width / window.devicePixelRatio, yPos);
            ctx.stroke();
          }
        }
        
        // Draw far fewer vertical lines with scrolling effect
        for (let x = 0; x < grid.cols; x += grid.lineInterval) {
          const xPos = x * grid.size - grid.offset;
          // Only draw lines in viewport
          if (xPos >= -grid.size && xPos <= canvas.width / window.devicePixelRatio + grid.size) {
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height / window.devicePixelRatio);
            ctx.stroke();
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(draw);
    };
    
    // Visibility API handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Cancel animation when tab not visible
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      } else {
        // Resume animation when tab visible again
        if (!requestRef.current) {
          previousTimeRef.current = 0; // Reset time delta
          requestRef.current = requestAnimationFrame(draw);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    requestRef.current = requestAnimationFrame(draw);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [theme]);

  // Use inline styles with will-change only on the transform property
  // This gives a hint to the browser about what will animate
  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10,
    pointerEvents: 'none',
    willChange: 'transform', // Only hint for transform changes
    opacity: 0.8 // Slightly transparent to improve contrast
  };

  return (
    <canvas
      ref={canvasRef}
      className="ambient-background"
      style={canvasStyle}
      aria-hidden="true"
    />
  );
});

// Add display name for debugging
AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
