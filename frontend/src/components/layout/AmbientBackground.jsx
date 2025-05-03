import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AmbientBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [performanceLevel, setPerformanceLevel] = useState(() => {
    return parseInt(localStorage.getItem('performanceLevel') || '3', 10);
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Colors based on theme - making them more visible (less transparent)
    const primaryColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)';
    const secondaryColor = theme === 'dark' ? 'rgba(255, 61, 61, 0.8)' : 'rgba(255, 61, 61, 0.8)';
    const bgColor = theme === 'dark' ? 'rgba(5, 5, 5, 0.85)' : 'rgba(245, 245, 245, 0.85)';
    const gridColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.2)' : 'rgba(77, 77, 255, 0.2)';
    
    // Create grid lines
    const gridLines = [];
    const gridSize = performanceLevel > 1 ? 40 : 60; // Larger grid cells for lower performance
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
    
    // Create moving particles - increasing count
    const particleCount = performanceLevel * 30; // Increased from 20
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5, // Increased size
        speedX: (Math.random() - 0.5) * 0.8, // Increased speed
        speedY: (Math.random() - 0.5) * 0.4, // Increased speed
        color: Math.random() > 0.8 ? secondaryColor : primaryColor,
        pulseRate: 0.01 + Math.random() * 0.02,
        pulseOffset: Math.random() * Math.PI * 2,
        connections: []
      });
    }
    
    // Animation parameters
    const gridSpeed = 0.5; // Increased grid movement speed
    let offset = 0;
    
    const render = () => {
      // Clear canvas with slight opacity for trail effect
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update grid offset
      offset += gridSpeed;
      if (offset >= gridSize) {
        offset = 0;
      }
      
      // Draw grid lines - increased opacity
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      for (const line of gridLines) {
        ctx.beginPath();
        
        if (line.direction === 'horizontal') {
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
        } else {
          // Move vertical lines for scrolling effect
          const x = line.x1 - offset;
          ctx.moveTo(x, line.y1);
          ctx.lineTo(x, line.y2);
        }
        
        ctx.stroke();
      }
      
      // Reset particle connections
      particles.forEach(particle => {
        particle.connections = [];
      });
      
      // Update particles
      for (const particle of particles) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Pulse effect
        particle.pulseOffset += particle.pulseRate;
        const pulseFactor = 0.7 + Math.sin(particle.pulseOffset) * 0.3;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Add glow effect to particles
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        const glowColor = particle.color.replace('0.8)', '0.2)');
        ctx.fillStyle = glowColor;
        ctx.fill();
        
        // Find connections to nearby particles
        if (performanceLevel > 1) { // Reduced requirement so more devices show connections
          for (const otherParticle of particles) {
            if (particle === otherParticle) continue;
            
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) { // Increased connection distance
              // Avoid duplicate connections
              if (!particle.connections.includes(otherParticle) && 
                  !otherParticle.connections.includes(particle)) {
                particle.connections.push(otherParticle);
                
                // Draw connection
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                
                // Fade opacity based on distance, but higher base opacity
                const opacity = 0.2 + (1 - distance / 120) * 0.4;
                ctx.strokeStyle = theme === 'dark' 
                  ? `rgba(0, 255, 245, ${opacity})` 
                  : `rgba(77, 77, 255, ${opacity})`;
                ctx.lineWidth = 1.5; // Thicker lines
                ctx.stroke();
              }
            }
          }
        }
      }
    };
    
    // Animation loop
    let animationId;
    const animate = () => {
      render();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, performanceLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none'
      }}
    />
  );
};

export default AmbientBackground;
