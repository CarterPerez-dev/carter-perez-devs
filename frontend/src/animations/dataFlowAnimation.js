/**
 * Data flow animation utilities
 * Creates particle and line animations to visualize data flow in a cyberpunk style
 */

// Create streaming data particles along a path
export const createDataStream = (
  canvas, 
  startPoint, 
  endPoint, 
  color = '#00fff5', 
  particleCount = 20,
  speed = 2,
  spread = 5,
  size = 2
) => {
  if (!canvas || !canvas.getContext) return null;
  
  const ctx = canvas.getContext('2d');
  
  // Calculate direction vector
  const directionX = endPoint.x - startPoint.x;
  const directionY = endPoint.y - startPoint.y;
  const distance = Math.sqrt(directionX * directionX + directionY * directionY);
  
  // Normalize direction
  const normalX = directionX / distance;
  const normalY = directionY / distance;
  
  // Perpendicular vector for spread
  const perpX = -normalY;
  const perpY = normalX;
  
  // Create particles
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    // Position along path
    const progress = Math.random();
    const pathX = startPoint.x + directionX * progress;
    const pathY = startPoint.y + directionY * progress;
    
    // Add perpendicular spread
    const spreadFactor = (Math.random() - 0.5) * spread;
    const particleX = pathX + perpX * spreadFactor;
    const particleY = pathY + perpY * spreadFactor;
    
    // Create particle
    particles.push({
      x: particleX,
      y: particleY,
      progress,
      size: Math.random() * size + 1,
      speed: (Math.random() * 0.5 + 0.5) * speed,
      alpha: Math.random() * 0.7 + 0.3
    });
  }
  
  // Animation variables
  let animationId;
  let active = true;
  
  // Animation loop
  const animate = () => {
    if (!active) return;
    
    // Clear canvas or specific portion
    ctx.clearRect(
      Math.min(startPoint.x, endPoint.x) - spread - size,
      Math.min(startPoint.y, endPoint.y) - spread - size,
      Math.abs(directionX) + spread * 2 + size * 2,
      Math.abs(directionY) + spread * 2 + size * 2
    );
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Update progress
      particle.progress += particle.speed / distance;
      
      // Reset if reached end
      if (particle.progress > 1) {
        particle.progress = 0;
        
        // Randomize spread again
        const spreadFactor = (Math.random() - 0.5) * spread;
        particle.x = startPoint.x + perpX * spreadFactor;
        particle.y = startPoint.y + perpY * spreadFactor;
        particle.alpha = Math.random() * 0.7 + 0.3;
      } else {
        // Calculate new position
        particle.x = startPoint.x + directionX * particle.progress + perpX * (Math.random() - 0.5) * 2;
        particle.y = startPoint.y + directionY * particle.progress + perpY * (Math.random() - 0.5) * 2;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', `, ${particle.alpha})`).replace('rgb', 'rgba');
      ctx.fill();
      
      // Optional glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', `, ${particle.alpha * 0.3})`).replace('rgb', 'rgba');
      ctx.fill();
    }
    
    animationId = requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // Return control object
  return {
    stop: () => {
      active = false;
      cancelAnimationFrame(animationId);
    },
    
    update: (newStartPoint, newEndPoint) => {
      startPoint = newStartPoint;
      endPoint = newEndPoint;
      
      // Recalculate vectors
      const dirX = endPoint.x - startPoint.x;
      const dirY = endPoint.y - startPoint.y;
      const dist = Math.sqrt(dirX * dirX + dirY * dirY);
      
      const normX = dirX / dist;
      const normY = dirY / dist;
      
      const perpendX = -normY;
      const perpendY = normX;
      
      // Reset particles along new path
      for (let i = 0; i < particles.length; i++) {
        const progress = Math.random();
        const spreadFactor = (Math.random() - 0.5) * spread;
        
        particles[i].x = startPoint.x + dirX * progress + perpendX * spreadFactor;
        particles[i].y = startPoint.y + dirY * progress + perpendY * spreadFactor;
        particles[i].progress = progress;
      }
    }
  };
};

// Create a grid of flowing data
export const createDataGrid = (
  canvas,
  color = '#00fff5',
  cellSize = 40,
  pulseSpeed = 2,
  lineWidth = 1
) => {
  if (!canvas || !canvas.getContext) return null;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Calculate grid dimensions
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  
  // Create active cells array (which cells have data flowing)
  const activeCells = [];
  const maxActiveCells = Math.floor((rows * columns) * 0.2); // 20% of cells active
  
  // Animation variables
  let animationId;
  let active = true;
  
  // Function to activate a random cell
  const activateRandomCell = () => {
    if (activeCells.length >= maxActiveCells) return;
    
    const col = Math.floor(Math.random() * columns);
    const row = Math.floor(Math.random() * rows);
    
    // Check if already active
    for (let i = 0; i < activeCells.length; i++) {
      if (activeCells[i].col === col && activeCells[i].row === row) {
        return;
      }
    }
    
    // Add new active cell
    activeCells.push({
      col,
      row,
      progress: 0,
      direction: Math.floor(Math.random() * 4), // 0: right, 1: down, 2: left, 3: up
      speed: (Math.random() * 0.5 + 0.5) * pulseSpeed
    });
  };
  
  // Initialize with some active cells
  const initialActiveCells = Math.floor(maxActiveCells / 3);
  for (let i = 0; i < initialActiveCells; i++) {
    activateRandomCell();
  }
  
  // Animation loop
  const animate = () => {
    if (!active) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
    ctx.lineWidth = lineWidth / 2;
    
    // Draw vertical lines
    for (let x = 0; x <= columns; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }
    
    // Draw active data flows
    ctx.lineWidth = lineWidth;
    
    for (let i = activeCells.length - 1; i >= 0; i--) {
      const cell = activeCells[i];
      
      // Calculate start and end points based on direction
      let startX, startY, endX, endY;
      
      switch (cell.direction) {
        case 0: // right
          startX = cell.col * cellSize;
          startY = cell.row * cellSize + cellSize / 2;
          endX = (cell.col + 1) * cellSize;
          endY = startY;
          break;
        case 1: // down
          startX = cell.col * cellSize + cellSize / 2;
          startY = cell.row * cellSize;
          endX = startX;
          endY = (cell.row + 1) * cellSize;
          break;
        case 2: // left
          startX = (cell.col + 1) * cellSize;
          startY = cell.row * cellSize + cellSize / 2;
          endX = cell.col * cellSize;
          endY = startY;
          break;
        case 3: // up
          startX = cell.col * cellSize + cellSize / 2;
          startY = (cell.row + 1) * cellSize;
          endX = startX;
          endY = cell.row * cellSize;
          break;
      }
      
      // Update progress
      cell.progress += cell.speed / 100;
      
      // Draw data pulse
      const pulseLength = cellSize * 0.6;
      const pulsePosition = cell.progress * cellSize;
      
      if (pulsePosition <= cellSize) {
        // Calculate pulse start and end
        let pulseStartX, pulseStartY, pulseEndX, pulseEndY;
        const pulseStart = Math.max(0, pulsePosition - pulseLength);
        const pulseEnd = Math.min(cellSize, pulsePosition);
        
        switch (cell.direction) {
          case 0: // right
            pulseStartX = startX + pulseStart;
            pulseStartY = startY;
            pulseEndX = startX + pulseEnd;
            pulseEndY = startY;
            break;
          case 1: // down
            pulseStartX = startX;
            pulseStartY = startY + pulseStart;
            pulseEndX = startX;
            pulseEndY = startY + pulseEnd;
            break;
          case 2: // left
            pulseStartX = startX - pulseStart;
            pulseStartY = startY;
            pulseEndX = startX - pulseEnd;
            pulseEndY = startY;
            break;
          case 3: // up
            pulseStartX = startX;
            pulseStartY = startY - pulseStart;
            pulseEndX = startX;
            pulseEndY = startY - pulseEnd;
            break;
        }
        
        // Create gradient
        const gradient = ctx.createLinearGradient(pulseStartX, pulseStartY, pulseEndX, pulseEndY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(pulseStartX, pulseStartY);
        ctx.lineTo(pulseEndX, pulseEndY);
        ctx.stroke();
      } else {
        // Remove cell when pulse completed
        activeCells.splice(i, 1);
        
        // Random chance to activate a new cell
        if (Math.random() < 0.7) {
          activateRandomCell();
        }
      }
    }
    
    // Random chance to activate a new cell
    if (Math.random() < 0.05) {
      activateRandomCell();
    }
    
    animationId = requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // Return control object
  return {
    stop: () => {
      active = false;
      cancelAnimationFrame(animationId);
    },
    
    resize: (newWidth, newHeight) => {
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Recalculate grid
      const newColumns = Math.ceil(newWidth / cellSize);
      const newRows = Math.ceil(newHeight / cellSize);
      
      // Update active cells to fit in new grid
      for (let i = activeCells.length - 1; i >= 0; i--) {
        if (activeCells[i].col >= newColumns || activeCells[i].row >= newRows) {
          activeCells.splice(i, 1);
        }
      }
      
      // Add new cells if needed
      const newMaxActive = Math.floor((newRows * newColumns) * 0.2);
      while (activeCells.length < newMaxActive / 3) {
        activateRandomCell();
      }
    }
  };
};

export default {
  createDataStream,
  createDataGrid
};
