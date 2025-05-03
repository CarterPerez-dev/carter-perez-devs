import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ParticleGridBackground = ({ 
  density = 'medium',
  speed = 'medium',
  direction = 'right', // 'right', 'left', 'up', 'down'
  opacity = 0.5,
  className = '',
  style = {},
  ...props
}) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  
  // Convert props to actual values
  const particleDensity = getDensityValue(density);
  const animationSpeed = getSpeedValue(speed);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Colors based on theme
    const primaryColor = theme === 'dark' ? 'rgba(0, 255, 245, 0.7)' : 'rgba(77, 77, 255, 0.7)';
    const secondaryColor = 'rgba(255, 61, 61, 0.7)';
    const gridColor = theme === 'dark' ? 'rgba(30, 30, 40, 0.3)' : 'rgba(180, 180, 240, 0.3)';
    
    // Create grid
    const gridSize = 40;
    const cols = Math.ceil(canvas.width / gridSize) + 1; // +1 to allow smooth scrolling
    const rows = Math.ceil(canvas.height / gridSize) + 1;
    
    // Create particles
    const particles = [];
    const particleCount = Math.floor(particleDensity * (canvas.width * canvas.height) / 8000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? secondaryColor : primaryColor,
        opacity: 0.3 + Math.random() * 0.5,
        speed: Math.random() * 0.5 + 0.5
      });
    }
    
    // Calculate movement direction
    const getDirectionVector = () => {
      switch (direction) {
        case 'right': return { x: 1, y: 0 };
        case 'left': return { x: -1, y: 0 };
        case 'up': return { x: 0, y: -1 };
        case 'down': return { x: 0, y: 1 };
        default: return { x: 1, y: 0 };
      }
    };
    
    const dirVector = getDirectionVector();
    
    // Animation variables
    let gridOffset = 0;
    let animationId;
    
    const animate = () => {
      // Clear the canvas with a semi-transparent background for trail effect
      ctx.fillStyle = theme === 'dark' 
        ? 'rgba(5, 5, 5, 0.1)' 
        : 'rgba(245, 245, 245, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update grid offset for scrolling effect
      gridOffset = (gridOffset + animationSpeed * 0.2) % gridSize;
      
      // Draw grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Vertical lines with scrolling
      for (let x = 0; x < cols; x++) {
        const posX = x * gridSize - gridOffset * dirVector.x;
        ctx.beginPath();
        ctx.moveTo(posX, 0);
        ctx.lineTo(posX, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines with scrolling
      for (let y = 0; y < rows; y++) {
        const posY = y * gridSize - gridOffset * dirVector.y;
        ctx.beginPath();
        ctx.moveTo(0, posY);
        ctx.lineTo(canvas.width, posY);
        ctx.stroke();
      }
      
      // Update and draw particles
      for (const particle of particles) {
        // Move particle
        particle.x += dirVector.x * particle.speed * animationSpeed;
        particle.y += dirVector.y * particle.speed * animationSpeed;
        
        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity * opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // Continue animation
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, particleDensity, animationSpeed, direction, opacity]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`particle-grid-background ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        ...style
      }}
      {...props}
    />
  );
};

// Helper functions
function getDensityValue(density) {
  switch (density) {
    case 'low': return 0.5;
    case 'medium': return 1;
    case 'high': return 2;
    default: return typeof density === 'number' ? density : 1;
  }
}

function getSpeedValue(speed) {
  switch (speed) {
    case 'slow': return 0.5;
    case 'medium': return 1;
    case 'fast': return 2;
    default: return typeof speed === 'number' ? speed : 1;
  }
}

export default ParticleGridBackground;
