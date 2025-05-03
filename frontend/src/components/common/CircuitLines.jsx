// frontend/src/components/common/CircuitLines.jsx
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './CircuitLines.module.css';

const CircuitLines = ({
  color = 'auto',
  density = 'medium',
  animate = true,
  pulse = true,
  speed = 'medium',
  width = '100%',
  height = '100%',
  className = '',
  style = {},
  ...props
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Convert props to actual values
  const actualColor = color === 'auto' 
    ? theme === 'dark' ? 'var(--accent-cyan)' : 'var(--accent-blue)'
    : color;
  
  const actualDensity = getDensityValue(density);
  const actualSpeed = getSpeedValue(speed);
  
  // Set canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Set canvas dimensions with device pixel ratio for sharpness
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Store dimensions for calculations
      setDimensions({
        width: rect.width,
        height: rect.height,
        dpr
      });
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Draw circuit pattern
  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !dimensions.height) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height, dpr } = dimensions;
    
    // Scale context for retina/high-DPI displays
    ctx.scale(dpr, dpr);
    
    // Circuit pattern parameters
    const nodeSize = 2;
    const lineWidth = 1;
    const nodeSpacing = Math.max(20, 100 - actualDensity * 5); // More density = less spacing
    
    // Calculate grid parameters
    const cols = Math.ceil(width / nodeSpacing);
    const rows = Math.ceil(height / nodeSpacing);
    
    // Generate nodes
    const nodes = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Add some randomness to node positions
        const randomOffsetX = Math.random() * (nodeSpacing * 0.3);
        const randomOffsetY = Math.random() * (nodeSpacing * 0.3);
        
        // Only add some nodes based on density
        if (Math.random() < actualDensity / 100) {
          nodes.push({
            x: i * nodeSpacing + randomOffsetX,
            y: j * nodeSpacing + randomOffsetY,
            connections: [],
            active: Math.random() < 0.2, // Some nodes start active
            pulsePhase: Math.random() * Math.PI * 2, // Random phase for pulsing
            pulseFactor: 0.7 + Math.random() * 0.6 // Randomize pulse strength
          });
        }
      }
    }
    
    // Connect nodes - each node connects to nearest nodes
    nodes.forEach(node => {
      // Find nearby nodes to connect to
      const maxConnections = 2 + Math.floor(Math.random() * 2); // 2-3 connections per node
      
      // Calculate distances to all other nodes
      const nodeDistances = nodes
        .filter(otherNode => otherNode !== node)
        .map(otherNode => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return { node: otherNode, distance };
        })
        .filter(item => item.distance < nodeSpacing * 2) // Only connect to nearby nodes
        .sort((a, b) => a.distance - b.distance); // Sort by distance
      
      // Connect to nearest nodes
      for (let i = 0; i < Math.min(maxConnections, nodeDistances.length); i++) {
        const otherNode = nodeDistances[i].node;
        
        // Avoid duplicate connections
        if (!node.connections.includes(otherNode) && !otherNode.connections.includes(node)) {
          node.connections.push(otherNode);
        }
      }
    });
    
    // Add some long distance connections for visual interest
    const longConnectionCount = Math.floor(nodes.length * 0.05); // 5% of nodes get long connections
    for (let i = 0; i < longConnectionCount; i++) {
      const nodeA = nodes[Math.floor(Math.random() * nodes.length)];
      const nodeB = nodes[Math.floor(Math.random() * nodes.length)];
      
      if (nodeA !== nodeB && !nodeA.connections.includes(nodeB) && !nodeB.connections.includes(nodeA)) {
        nodeA.connections.push(nodeB);
      }
    }
    
    // Create data packets that will travel along the connections
    const createDataPacket = () => {
      // Select random node to start from
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (!startNode.connections.length) return null;
      
      // Select random connection
      const endNode = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
      
      return {
        startNode,
        endNode,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01 * actualSpeed / 5,
        color: startNode.active && endNode.active 
          ? getHighlightColor(actualColor) 
          : actualColor,
        size: 1.5 + Math.random()
      };
    };
    
    // Animation parameters
    let dataPackets = [];
    const maxDataPackets = Math.max(5, Math.floor(nodes.length * 0.1)); // Up to 10% of nodes have packets
    
    // Initial data packets
    for (let i = 0; i < maxDataPackets / 3; i++) {
      const packet = createDataPacket();
      if (packet) dataPackets.push(packet);
    }
    
    // Animation loop
    let animationId;
    let lastTime = 0;
    
    const animate = (timestamp) => {
      if (!animate) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      // Calculate time delta
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set line properties
      ctx.lineWidth = lineWidth;
      
      // Draw connections
      for (const node of nodes) {
        for (const connectedNode of node.connections) {
          // Determine line color
          const isActive = node.active && connectedNode.active;
          const lineColor = isActive 
            ? getHighlightColor(actualColor)
            : getRgbaFromVar(actualColor, 0.3);
          
          ctx.strokeStyle = lineColor;
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        }
      }
      
      // Draw nodes
      for (const node of nodes) {
        // Update node pulse if enabled
        if (pulse) {
          node.pulsePhase += 0.02 * delta / 16;
          if (node.pulsePhase > Math.PI * 2) node.pulsePhase -= Math.PI * 2;
          
          // Calculate pulse factor
          const pulseFactor = node.pulseFactor * (0.7 + 0.3 * Math.sin(node.pulsePhase));
          
          // Draw glow
          if (node.active) {
            const glowSize = nodeSize * 3;
            const gradient = ctx.createRadialGradient(
              node.x, node.y, nodeSize,
              node.x, node.y, glowSize
            );
            
            const glowColor = getHighlightColor(actualColor);
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowSize * pulseFactor, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Draw node
        ctx.fillStyle = node.active 
          ? getHighlightColor(actualColor)
          : getRgbaFromVar(actualColor, 0.5);
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update and draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i];
        
        // Update progress
        packet.progress += packet.speed * delta / 16;
        
        // Remove if complete
        if (packet.progress >= 1) {
          // Activate end node when packet arrives
          packet.endNode.active = true;
          
          // Remove packet
          dataPackets.splice(i, 1);
          continue;
        }
        
        // Calculate position
        const x = packet.startNode.x + (packet.endNode.x - packet.startNode.x) * packet.progress;
        const y = packet.startNode.y + (packet.endNode.y - packet.startNode.y) * packet.progress;
        
        // Draw packet
        ctx.fillStyle = packet.color;
        ctx.beginPath();
        ctx.arc(x, y, packet.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow
        const glowSize = packet.size * 3;
        const gradient = ctx.createRadialGradient(
          x, y, packet.size,
          x, y, glowSize
        );
        
        gradient.addColorStop(0, packet.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add new data packets occasionally
      if (animate && Math.random() < 0.05 * actualSpeed / 5 && dataPackets.length < maxDataPackets) {
        const packet = createDataPacket();
        if (packet) dataPackets.push(packet);
      }
      
      // Schedule next frame
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation if enabled
    if (animate) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Just draw once
      animate(0);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, actualColor, actualDensity, actualSpeed, theme, animate, pulse]);
  
  return (
    <div 
      className={`${styles.circuitLines} ${className}`}
      style={{ 
        width, 
        height, 
        ...style
      }}
      {...props}
    >
      <canvas 
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  );
};

// Helper functions
function getDensityValue(density) {
  switch (density) {
    case 'low':
      return 20;
    case 'medium':
      return 50;
    case 'high':
      return 80;
    default:
      return parseInt(density, 10) || 50;
  }
}

function getSpeedValue(speed) {
  switch (speed) {
    case 'slow':
      return 1;
    case 'medium':
      return 5;
    case 'fast':
      return 10;
    default:
      return parseInt(speed, 10) || 5;
  }
}

function getRgbaFromVar(cssVar, alpha = 1) {
  // Check if already rgba or rgb
  if (cssVar.startsWith('rgba(') || cssVar.startsWith('rgb(')) {
    return cssVar;
  }
  
  // Check if it's a CSS variable
  if (cssVar.startsWith('var(')) {
    // For demo purposes, return a fallback since we can't access CSS variables here
    if (cssVar.includes('accent-cyan')) {
      return `rgba(0, 255, 245, ${alpha})`;
    } else if (cssVar.includes('accent-blue')) {
      return `rgba(77, 77, 255, ${alpha})`;
    } else if (cssVar.includes('accent-magenta')) {
      return `rgba(255, 61, 61, ${alpha})`;
    }
    
    // Default fallback
    return `rgba(0, 255, 245, ${alpha})`;
  }
  
  // Default for regular color strings like #00fff5
  return cssVar;
}

function getHighlightColor(color) {
  // Check if already rgba or rgb
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    return color;
  }
  
  // Check if it's a CSS variable
  if (color.startsWith('var(')) {
    // For demo purposes, return a fallback since we can't access CSS variables here
    if (color.includes('accent-cyan')) {
      return 'rgba(0, 255, 245, 1)';
    } else if (color.includes('accent-blue')) {
      return 'rgba(77, 77, 255, 1)';
    } else if (color.includes('accent-magenta')) {
      return 'rgba(255, 61, 61, 1)';
    }
    
    // Default fallback
    return 'rgba(0, 255, 245, 1)';
  }
  
  // Default for regular color strings like #00fff5
  return color;
}

CircuitLines.propTypes = {
  color: PropTypes.string,
  density: PropTypes.oneOfType([
    PropTypes.oneOf(['low', 'medium', 'high']),
    PropTypes.number,
    PropTypes.string
  ]),
  animate: PropTypes.bool,
  pulse: PropTypes.bool,
  speed: PropTypes.oneOfType([
    PropTypes.oneOf(['slow', 'medium', 'fast']),
    PropTypes.number,
    PropTypes.string
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object
};

export default CircuitLines;
