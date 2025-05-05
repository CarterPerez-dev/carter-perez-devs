import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { throttle, getPerformanceLevel } from '../../utils/performance';

const AmbientBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [performanceLevel, setPerformanceLevel] = useState(() => {
    return getPerformanceLevel();
  });
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  const fpsLimit = 30; // Limit to 30 FPS

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Handle resize - with throttle
    const handleResize = throttle(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, 250);
    
    window.addEventListener('resize', handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Colors based on theme
    const gridColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.2)' : 'rgba(77, 77, 255, 0.2)';
    
    // Create grid lines - REDUCED number of lines
    const gridLines = [];
    const gridSize = performanceLevel > 1 ? 80 : 120; // Larger grid cells = fewer lines
    const cols = Math.ceil(canvas.width / gridSize) + 1; // Add one extra for smooth scrolling
    const rows = Math.ceil(canvas.height / gridSize);
    
    // Horizontal lines
    for (let y = 0; y <= rows; y++) {
      gridLines.push({
        x1: 0,
        y1: y * gridSize,
        x2: canvas.width,
        y2: y * gridSize,
        offset: 0,
        direction: 'horizontal'
      });
    }
    
    // Vertical lines
    for (let x = 0; x <= cols; x++) {
      gridLines.push({
        x1: x * gridSize,
        y1: 0,
        x2: x * gridSize,
        y2: canvas.height,
        offset: 0,
        direction: 'vertical'
      });
    }
    
    // Animation parameters
    const gridSpeed = 0.3; // Reduced from 0.5
    let offset = 0;
    
    const render = (timestamp) => {
      // Calculate time difference & limit FPS
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const elapsed = timestamp - previousTimeRef.current;
      
      if (elapsed > 1000 / fpsLimit) {
        previousTimeRef.current = timestamp;
        
        // Clear canvas with background color
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = theme === 'dark' ? 'rgba(5, 5, 5, 0.85)' : 'rgba(15, 8, 8, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update grid offset
        offset += gridSpeed;
        if (offset >= gridSize) {
          offset = 0;
        }
        
        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        // Only render grid lines in viewport plus margin
        const margin = 100;
        const viewportTop = -margin;
        const viewportBottom = canvas.height + margin;
        const viewportLeft = -margin;
        const viewportRight = canvas.width + margin;
        
        for (const line of gridLines) {
          if (line.direction === 'horizontal') {
            if (line.y1 < viewportTop || line.y1 > viewportBottom) continue;
            
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
          } else {
            // Move vertical lines for scrolling effect
            const x = line.x1 - offset;
            if (x < viewportLeft || x > viewportRight) continue;
            
            ctx.beginPath();
            ctx.moveTo(x, line.y1);
            ctx.lineTo(x, line.y2);
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
    willChange: 'transform'
  };

  return (
    <canvas
      ref={canvasRef}
      className="ambient-background"
      style={canvasStyle}
    />
  );
};

export default React.memo(AmbientBackground);
