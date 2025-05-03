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
    
    // Colors based on theme
    const primaryColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.5)' : 'rgba(77, 77, 255, 0.5)';
    const secondaryColor = theme === 'dark' ? 'rgba(255, 61, 61, 0.5)' : 'rgba(255, 61, 61, 0.5)';
    const bgColor = theme === 'dark' ? 'rgba(5, 5, 5, 0.7)' : 'rgba(245, 245, 245, 0.7)';
    
    // Create grid nodes
    const grid = [];
    const gridSize = performanceLevel > 1 ? 30 : 50; // Larger grid cells for lower performance
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const posX = x * gridSize;
        const posY = y * gridSize;
        
        // Add some randomness to grid
        const random = Math.random();
        if (random > 0.7 || performanceLevel < 2) {
          grid.push({
            x: posX,
            y: posY,
            active: random > 0.9, // Some nodes start active
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.5 + Math.random() * 0.5
          });
        }
      }
    }
    
    // Create moving particles
    const particleCount = performanceLevel * 20; // Scale with performance level
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? secondaryColor : primaryColor
      });
    }
    
    // Variables for scan line effect
    let scanLineY = -100;
    let scanLineDirection = 1;
    let scanLineActive = false;
    
    const render = () => {
      // Clear canvas with slight opacity for trail effect
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid (if performance level allows)
      if (performanceLevel > 1) {
        ctx.strokeStyle = theme === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(210, 210, 210, 0.5)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
      
      // Update and draw particles
      for (const particle of particles) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
      
      // Calculate and draw connections between nearby particles (if performance level allows)
      if (performanceLevel > 2) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              
              // Fade opacity based on distance
              const opacity = 1 - distance / 100;
              ctx.strokeStyle = `rgba(0, 255, 245, ${opacity * 0.2})`;
              ctx.stroke();
            }
          }
        }
      }
      
      // Draw grid nodes
      for (const node of grid) {
        // Update pulse
        node.pulsePhase += 0.01 * node.pulseSpeed;
        if (node.pulsePhase > Math.PI * 2) node.pulsePhase -= Math.PI * 2;
        
        // Draw node
        const pulse = 0.5 + Math.sin(node.pulsePhase) * 0.5;
        const radius = node.active ? 2 + pulse : 1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.active 
          ? (theme === 'dark' ? `rgba(0, 255, 245, ${0.3 + pulse * 0.5})` : `rgba(77, 77, 255, ${0.3 + pulse * 0.5})`)
          : (theme === 'dark' ? 'rgba(100, 100, 100, 0.3)' : 'rgba(150, 150, 150, 0.3)');
        ctx.fill();
      }
      
      // Draw scan line (if performance level allows)
      if (performanceLevel > 3) {
        // Randomly trigger scan line
        if (!scanLineActive && Math.random() < 0.005) {
          scanLineActive = true;
          scanLineY = -100;
          scanLineDirection = 1;
        }
        
        if (scanLineActive) {
          // Draw scan line
          ctx.beginPath();
          ctx.moveTo(0, scanLineY);
          ctx.lineTo(canvas.width, scanLineY);
          ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 255, 245, 0.5)' : 'rgba(77, 77, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Add glow effect
          ctx.shadowColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.8)' : 'rgba(77, 77, 255, 0.8)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, scanLineY);
          ctx.lineTo(canvas.width, scanLineY);
          ctx.stroke();
          ctx.shadowBlur = 0;
          
          // Move scan line
          scanLineY += 5 * scanLineDirection;
          
          // Deactivate when off screen
          if (scanLineY > canvas.height + 100) {
            scanLineActive = false;
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
