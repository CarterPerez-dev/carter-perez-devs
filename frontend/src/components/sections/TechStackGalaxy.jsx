// frontend/src/components/sections/TechStackGalaxy.jsx
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './TechStackGalaxy.module.css';
// Import React icons for categories
import { 
  ShieldCheck, 
  Code, 
  Database, 
  Cloud, 
  Gear, 
  Globe 
} from 'phosphor-react';

// Skill categories with React icons
const SKILL_CATEGORIES = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    iconComponent: ShieldCheck,
    color: '#ff3d3d'
  },
  {
    id: 'frontend',
    name: 'Frontend',
    iconComponent: Code,
    color: '#00fff5'
  },
  {
    id: 'backend',
    name: 'Backend',
    iconComponent: Cloud,
    color: '#4d4dff'
  },
  {
    id: 'devops',
    name: 'DevOps',
    iconComponent: Gear,
    color: '#00ff9f'
  },
  {
    id: 'databases',
    name: 'Databases',
    iconComponent: Database,
    color: '#d22aff'
  },
  {
    id: 'networking',
    name: 'Networking',
    iconComponent: Globe,
    color: '#ffcc00'
  }
];

// Skills data
const SKILLS = [
  // Cybersecurity
  { name: 'Penetration Testing', category: 'cybersecurity', level: 90 },
  { name: 'Vulnerability Assessment', category: 'cybersecurity', level: 85 },
  { name: 'Security Monitoring', category: 'cybersecurity', level: 80 },
  { name: 'Incident Response', category: 'cybersecurity', level: 75 },
  { name: 'Compliance (ISO, NIST)', category: 'cybersecurity', level: 70 },
  { name: 'Risk Management', category: 'cybersecurity', level: 85 },
  
  // Frontend
  { name: 'React', category: 'frontend', level: 90 },
  { name: 'JavaScript/ES6+', category: 'frontend', level: 85 },
  { name: 'HTML5/CSS3', category: 'frontend', level: 95 },
  { name: 'TypeScript', category: 'frontend', level: 75 },
  { name: 'Responsive Design', category: 'frontend', level: 90 },
  { name: 'Three.js', category: 'frontend', level: 65 },
  
  // Backend
  { name: 'Python', category: 'backend', level: 95 },
  { name: 'Flask', category: 'backend', level: 85 },
  { name: 'Node.js', category: 'backend', level: 80 },
  { name: 'Express', category: 'backend', level: 75 },
  { name: 'RESTful APIs', category: 'backend', level: 90 },
  { name: 'GraphQL', category: 'backend', level: 60 },
  
  // DevOps
  { name: 'Docker', category: 'devops', level: 90 },
  { name: 'Kubernetes', category: 'devops', level: 65 },
  { name: 'CI/CD Pipelines', category: 'devops', level: 75 },
  { name: 'AWS Services', category: 'devops', level: 80 },
  { name: 'Terraform', category: 'devops', level: 60 },
  { name: 'Linux Administration', category: 'devops', level: 85 },
  
  // Databases
  { name: 'MongoDB', category: 'databases', level: 85 },
  { name: 'PostgreSQL', category: 'databases', level: 80 },
  { name: 'MySQL', category: 'databases', level: 75 },
  { name: 'Redis', category: 'databases', level: 70 },
  { name: 'Database Design', category: 'databases', level: 80 },
  { name: 'Data Modeling', category: 'databases', level: 75 },
  
  // Networking
  { name: 'TCP/IP', category: 'networking', level: 90 },
  { name: 'Firewalls', category: 'networking', level: 85 },
  { name: 'VPNs', category: 'networking', level: 80 },
  { name: 'Network Security', category: 'networking', level: 90 },
  { name: 'DNS', category: 'networking', level: 75 },
  { name: 'Load Balancing', category: 'networking', level: 70 }
];

// Helper function to ensure values are finite numbers
const ensureFinite = (value, fallback = 0) => {
  return Number.isFinite(value) ? value : fallback;
};

const TechStackGalaxy = ({ fullPage = false }) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const galaxyContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('cybersecurity');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [skillDetails, setSkillDetails] = useState(null);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Filter skills based on active category
  useEffect(() => {
    setFilteredSkills(SKILLS.filter(skill => skill.category === activeCategory));
  }, [activeCategory]);
  
  // Handle mouse movement for parallax effect - REDUCED SENSITIVITY
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!galaxyContainerRef.current) return;
      
      const rect = galaxyContainerRef.current.getBoundingClientRect();
      
      // Reduce sensitivity by factor of 3
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2 * 0.3,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2 * 0.3
      });
    };
    
    const galaxyContainer = galaxyContainerRef.current;
    
    if (galaxyContainer) {
      galaxyContainer.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (galaxyContainer) {
        galaxyContainer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // 3D Galaxy Animation - ENHANCED VERSION
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();
    
    // Galaxy parameters
    const stars = [];
    const nebulae = []; // New: Background nebulae
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create background nebulae
    const createNebulae = () => {
      const nebulaCount = 5; // Number of nebulae
      
      for (let i = 0; i < nebulaCount; i++) {
        const radius = 50 + Math.random() * 150;
        const distance = Math.random() * (Math.min(canvas.width, canvas.height) / 3);
        const angle = Math.random() * Math.PI * 2;
        
        // Position nebula
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Get color from a category
        const categoryIndex = Math.floor(Math.random() * SKILL_CATEGORIES.length);
        const color = SKILL_CATEGORIES[categoryIndex].color;
        
        nebulae.push({
          x,
          y,
          radius,
          color,
          opacity: 0.03 + Math.random() * 0.05,
          angle,
          speed: 0.00005, // Very slow rotation
          pulseSpeed: 0.0005 + Math.random() * 0.001,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };
    
    // Create stars with enhanced properties
    const createStars = () => {
      const baseStarCount = Math.min(Math.floor(canvas.width * canvas.height / 3000), 200);
      const starCount = baseStarCount * 1.5; // Increased star count by 50%
      
      for (let i = 0; i < starCount; i++) {
        // More variety in star sizes
        const radius = 0.5 + Math.pow(Math.random(), 2) * 2.5;
        
        // Distribute stars more realistically (more density near center)
        const distanceFactor = Math.pow(Math.random(), 1.5); // Concentrate more stars toward center
        const distance = distanceFactor * (Math.min(canvas.width, canvas.height) / 2.5) + 10;
        const angle = Math.random() * Math.PI * 2;
        
        // SIGNIFICANTLY REDUCED SPEED (by 75%)
        const speed = (0.2 + Math.random() * 0.8) * 0.00025;
        
        // Color based on category with more variation
        const categoryIndex = Math.floor(Math.random() * SKILL_CATEGORIES.length);
        const category = SKILL_CATEGORIES[categoryIndex];
        const baseColor = category.color;
        
        // Create slight color variations
        const color = adjustColor(baseColor, -20 + Math.random() * 40);
        
        stars.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius,
          distance,
          angle,
          speed,
          color,
          opacity: 0.4 + Math.random() * 0.6, // Brighter stars
          category: category.id,
          pulseSpeed: 0.002 + Math.random() * 0.003, // For pulsing effect
          pulsePhase: Math.random() * Math.PI * 2,
          tail: Math.random() > 0.8, // Some stars have tails
          tailLength: 5 + Math.random() * 15,
          tailWidth: 0.5 + Math.random() * 1
        });
      }
    };
    
    // Helper function to adjust color brightness
    const adjustColor = (hexColor, percent) => {
      // Convert hex to RGB
      let r = parseInt(hexColor.substr(1, 2), 16);
      let g = parseInt(hexColor.substr(3, 2), 16);
      let b = parseInt(hexColor.substr(5, 2), 16);
      
      // Adjust brightness
      r = Math.max(0, Math.min(255, r + percent));
      g = Math.max(0, Math.min(255, g + percent));
      b = Math.max(0, Math.min(255, b + percent));
      
      // Convert back to hex
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };
    
    // Create occasional shooting star
    const createShootingStar = () => {
      if (Math.random() > 0.99) { // Low probability for rarity
        const startAngle = Math.random() * Math.PI * 2;
        const endAngle = startAngle + (Math.random() * Math.PI / 4 - Math.PI / 8);
        
        const startDistance = Math.min(canvas.width, canvas.height) / 4;
        const endDistance = Math.min(canvas.width, canvas.height) / 2;
        
        const categoryIndex = Math.floor(Math.random() * SKILL_CATEGORIES.length);
        const color = SKILL_CATEGORIES[categoryIndex].color;
        
        return {
          startX: centerX + Math.cos(startAngle) * startDistance,
          startY: centerY + Math.sin(startAngle) * startDistance,
          endX: centerX + Math.cos(endAngle) * endDistance,
          endY: centerY + Math.sin(endAngle) * endDistance,
          progress: 0,
          speed: 0.02 + Math.random() * 0.03,
          color,
          width: 1 + Math.random() * 2,
          length: 20 + Math.random() * 30
        };
      }
      return null;
    };
    
    // Render galaxy with enhanced visuals
    const renderGalaxy = (timestamp) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create deep space background
      const spaceGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.min(canvas.width, canvas.height)
      );
      
      if (theme === 'dark') {
        spaceGradient.addColorStop(0, 'rgba(5, 15, 30, 0.9)');
        spaceGradient.addColorStop(0.5, 'rgba(2, 8, 20, 0.8)');
        spaceGradient.addColorStop(1, 'rgba(0, 0, 5, 0.7)');
      } else {
        spaceGradient.addColorStop(0, 'rgba(220, 230, 255, 0.9)');
        spaceGradient.addColorStop(0.5, 'rgba(200, 210, 240, 0.8)');
        spaceGradient.addColorStop(1, 'rgba(180, 190, 220, 0.7)');
      }
      
      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebulae
      for (const nebula of nebulae) {
        // Update nebula angle very slowly
        nebula.angle += nebula.speed;
        
        // Apply pulsing effect
        nebula.pulsePhase += nebula.pulseSpeed;
        const pulseFactor = 0.8 + 0.2 * Math.sin(nebula.pulsePhase);
        
        // Apply parallax effect (very subtle)
        const parallaxX = mousePosition.x * (nebula.radius * 0.02);
        const parallaxY = mousePosition.y * (nebula.radius * 0.02);
        
        // Ensure coordinates are finite numbers
        const x = ensureFinite(centerX + Math.cos(nebula.angle) * nebula.distance + parallaxX, centerX);
        const y = ensureFinite(centerY + Math.sin(nebula.angle) * nebula.distance + parallaxY, centerY);
        
        // Ensure radius is a finite positive number
        const nebulaRadius = ensureFinite(nebula.radius * pulseFactor, 10);
        
        // Create nebula gradient - FIX: Ensure all parameters are finite numbers
        try {
          const nebulaGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, nebulaRadius
          );
          
          nebulaGradient.addColorStop(0, `${nebula.color}40`); // Core
          nebulaGradient.addColorStop(0.5, `${nebula.color}20`); // Middle
          nebulaGradient.addColorStop(1, 'transparent'); // Edge
          
          ctx.fillStyle = nebulaGradient;
          ctx.beginPath();
          ctx.arc(x, y, nebulaRadius, 0, Math.PI * 2);
          ctx.fill();
        } catch (error) {
          console.warn('Skipping invalid nebula gradient', error);
        }
      }
      
      // Draw galaxy spiral arms (subtle background pattern)
      const armCount = 3;
      const armLength = Math.min(canvas.width, canvas.height) / 3;
      const armWidth = 50;
      const armTightness = 0.3;
      
      for (let arm = 0; arm < armCount; arm++) {
        const armAngle = (arm / armCount) * Math.PI * 2;
        
        // Draw spiral arm
        for (let t = 0; t < 1; t += 0.01) {
          const spiralAngle = armAngle + t * Math.PI * 5; // Spiral rotation
          const distance = t * armLength; // Increase distance as we go out
          
          const x = ensureFinite(centerX + Math.cos(spiralAngle) * distance, centerX);
          const y = ensureFinite(centerY + Math.sin(spiralAngle) * distance, centerY);
          
          // Fade out as we go further
          const opacity = 0.05 * (1 - t);
          
          // Get color based on position in arm
          const categoryIndex = Math.floor(arm % SKILL_CATEGORIES.length);
          const armColor = SKILL_CATEGORIES[categoryIndex].color;
          
          // Draw arm segment
          ctx.fillStyle = `${armColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(x, y, armWidth * (1 - t * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw galaxy center with enhanced glow
      const categoryColor = SKILL_CATEGORIES.find(c => c.id === activeCategory)?.color || '#00fff5';
      
      // Pulsing galaxy core
      const coreSize = ensureFinite(60 + Math.sin(timestamp * 0.001) * 10, 60);
      
      // Multi-layered core for more impressive effect
      for (let i = 0; i < 3; i++) {
        try {
          const layerSize = ensureFinite(coreSize * (1 - i * 0.2), 10);
          
          const centerGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, layerSize
          );
          
          centerGradient.addColorStop(0, `${categoryColor}${90 - i * 20}`);
          centerGradient.addColorStop(0.5, `${categoryColor}${40 - i * 10}`);
          centerGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = centerGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, layerSize, 0, Math.PI * 2);
          ctx.fill();
        } catch (error) {
          console.warn('Skipping invalid center gradient', error);
        }
      }
      
      // Animate center rays
      const rayCount = 8;
      const rayLength = ensureFinite(100 + Math.sin(timestamp * 0.0005) * 20, 100);
      
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i / rayCount) * Math.PI * 2 + timestamp * 0.0003;
        
        const startX = centerX + Math.cos(rayAngle) * coreSize * 0.8;
        const startY = centerY + Math.sin(rayAngle) * coreSize * 0.8;
        
        const endX = centerX + Math.cos(rayAngle) * rayLength;
        const endY = centerY + Math.sin(rayAngle) * rayLength;
        
        // Create ray gradient
        try {
          const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY);
          rayGradient.addColorStop(0, `${categoryColor}70`);
          rayGradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = rayGradient;
          ctx.lineWidth = ensureFinite(5 + Math.sin(timestamp * 0.002 + i) * 2, 5);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        } catch (error) {
          console.warn('Skipping invalid ray gradient', error);
        }
      }
      
      // Check for shooting star creation
      const shootingStar = createShootingStar();
      if (shootingStar) {
        // Draw shooting star
        const dx = shootingStar.endX - shootingStar.startX;
        const dy = shootingStar.endY - shootingStar.startY;
        const angle = Math.atan2(dy, dx);
        
        const headX = shootingStar.startX + dx * shootingStar.progress;
        const headY = shootingStar.startY + dy * shootingStar.progress;
        
        // Draw tail
        try {
          const tailStartX = ensureFinite(headX, centerX);
          const tailStartY = ensureFinite(headY, centerY);
          const tailEndX = ensureFinite(headX - Math.cos(angle) * shootingStar.length, centerX);
          const tailEndY = ensureFinite(headY - Math.sin(angle) * shootingStar.length, centerY);
          
          const tailGradient = ctx.createLinearGradient(
            tailStartX, tailStartY,
            tailEndX, tailEndY
          );
          
          tailGradient.addColorStop(0, `${shootingStar.color}ff`);
          tailGradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = tailGradient;
          ctx.lineWidth = shootingStar.width;
          ctx.beginPath();
          ctx.moveTo(tailStartX, tailStartY);
          ctx.lineTo(tailEndX, tailEndY);
          ctx.stroke();
          
          // Draw head
          ctx.fillStyle = `${shootingStar.color}ff`;
          ctx.beginPath();
          ctx.arc(headX, headY, shootingStar.width * 2, 0, Math.PI * 2);
          ctx.fill();
        } catch (error) {
          console.warn('Skipping invalid shooting star', error);
        }
        
        // Update progress
        shootingStar.progress += shootingStar.speed;
      }
      
      // Update and draw stars with enhanced effects
      for (const star of stars) {
        // Update angle - always rotating
        star.angle += star.speed;
        
        // Pulsing effect
        star.pulsePhase += star.pulseSpeed;
        const pulseFactor = 0.7 + 0.3 * Math.sin(star.pulsePhase);
        
        // Calculate position with reduced parallax effect
        const parallaxX = mousePosition.x * (star.distance * 0.02); // Reduced from 0.05
        const parallaxY = mousePosition.y * (star.distance * 0.02); // Reduced from 0.05
        
        // Ensure coordinates are finite
        star.x = ensureFinite(centerX + Math.cos(star.angle) * star.distance + parallaxX, centerX);
        star.y = ensureFinite(centerY + Math.sin(star.angle) * star.distance + parallaxY, centerY);
        
        // Draw star with higher opacity for active category
        ctx.globalAlpha = star.category === activeCategory ? star.opacity * 1.5 : star.opacity * 0.5;
        
        // Draw star tails (for some stars)
        if (star.tail) {
          const tailAngle = star.angle - Math.PI; // Opposite to movement direction
          
          try {
            const tailStartX = ensureFinite(star.x, centerX);
            const tailStartY = ensureFinite(star.y, centerY);
            const tailEndX = ensureFinite(star.x + Math.cos(tailAngle) * star.tailLength, centerX);
            const tailEndY = ensureFinite(star.y + Math.sin(tailAngle) * star.tailLength, centerY);
            
            const tailGradient = ctx.createLinearGradient(
              tailStartX, tailStartY,
              tailEndX, tailEndY
            );
            
            tailGradient.addColorStop(0, star.color);
            tailGradient.addColorStop(1, 'transparent');
            
            ctx.strokeStyle = tailGradient;
            ctx.lineWidth = ensureFinite(star.tailWidth * pulseFactor, 1);
            ctx.beginPath();
            ctx.moveTo(tailStartX, tailStartY);
            ctx.lineTo(tailEndX, tailEndY);
            ctx.stroke();
          } catch (error) {
            console.warn('Skipping invalid star tail', error);
          }
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, ensureFinite(star.radius * pulseFactor, 1), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Draw glow with pulsing effect
        try {
          const glowSize = ensureFinite(star.radius * (5 + pulseFactor * 3), 5);
          
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowSize
          );
          
          glow.addColorStop(0, `${star.color}80`);
          glow.addColorStop(1, 'transparent');
          
          ctx.globalAlpha = (star.category === activeCategory ? 0.5 : 0.2) * pulseFactor;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        } catch (error) {
          console.warn('Skipping invalid star glow', error);
        }
        
        ctx.globalAlpha = 1;
      }
      
      // Draw connection lines for active category
      ctx.strokeStyle = categoryColor;
      ctx.lineWidth = 1;
      
      const activeStars = stars.filter(s => s.category === activeCategory);
      
      for (let i = 0; i < activeStars.length; i++) {
        for (let j = i + 1; j < activeStars.length; j++) {
          const star1 = activeStars[i];
          const star2 = activeStars[j];
          
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Increased connection distance for more connections
          if (distance < 120) {
            try {
              // Create connection gradient for more visual appeal
              const connectionGradient = ctx.createLinearGradient(
                star1.x, star1.y, star2.x, star2.y
              );
              
              connectionGradient.addColorStop(0, `${categoryColor}50`);
              connectionGradient.addColorStop(0.5, `${categoryColor}30`);
              connectionGradient.addColorStop(1, `${categoryColor}50`);
              
              ctx.strokeStyle = connectionGradient;
              
              // Randomize opacity based on distance and time for shimmer effect
              const opacity = (1 - distance / 120) * 0.7 * (0.7 + 0.3 * Math.sin(timestamp * 0.001 + i * j));
              ctx.globalAlpha = opacity;
              
              ctx.beginPath();
              ctx.moveTo(star1.x, star1.y);
              ctx.lineTo(star2.x, star2.y);
              ctx.stroke();
            } catch (error) {
              console.warn('Skipping invalid connection gradient', error);
            }
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };
    
    // Initialize and start animation
    createNebulae();
    createStars();
    
    let animationId;
    const animate = (timestamp) => {
      renderGalaxy(timestamp);
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, activeCategory, mousePosition]);
  
  // Show skill details
  const handleSkillHover = (skill) => {
    setSkillDetails(skill);
  };
  
  const handleSkillLeave = () => {
    setSkillDetails(null);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <section 
      className={`${styles.techStackSection} ${fullPage ? styles.fullPage : ''}`} 
      id="tech-stack"
    >
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Tech Stack
          </motion.h2>
        )}
        
        {fullPage && (
          <motion.h1 
            className={styles.pageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Technology Matrix
          </motion.h1>
        )}
        
        <div className={styles.techGalaxyContainer} ref={galaxyContainerRef}>
          <canvas 
            ref={canvasRef} 
            className={styles.techGalaxyCanvas}
            aria-hidden="true"
          ></canvas>
          
          <motion.div 
            className={styles.categorySelector}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {SKILL_CATEGORIES.map((category) => {
              // Dynamically create the icon component
              const IconComponent = category.iconComponent;
              
              return (
                <motion.button 
                  key={category.id}
                  className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  variants={itemVariants}
                  style={{
                    '--category-color': category.color
                  }}
                >
                  <span className={styles.categoryIcon}>
                    <IconComponent size={28} color={activeCategory === category.id ? "#FFFFFF" : category.color} />
                  </span>
                  <span className={styles.categoryName}>{category.name}</span>
                </motion.button>
              );
            })}
            
            {/* Rotation toggle button removed as requested */}
          </motion.div>
          
          <motion.div 
            className={styles.skillsDisplay}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div 
                key={index}
                className={styles.skillItem}
                variants={itemVariants}
                onMouseEnter={() => handleSkillHover(skill)}
                onMouseLeave={handleSkillLeave}
              >
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillLevelContainer}>
                  <div 
                    className={styles.skillLevelBar} 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: SKILL_CATEGORIES.find(c => c.id === skill.category)?.color
                    }}
                  ></div>
                </div>
                <div className={styles.skillLevelText}>{skill.level}%</div>
              </motion.div>
            ))}
          </motion.div>
          
          {skillDetails && (
            <div 
              className={styles.skillDetails}
              style={{
                '--detail-color': SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.color
              }}
            >
              <div className={styles.skillDetailsHeader}>
                <div className={styles.skillDetailsName}>{skillDetails.name}</div>
                <div className={styles.skillDetailsCategory}>
                  {SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.name}
                </div>
              </div>
              
              <div className={styles.skillDetailsLevel}>
                <div className={styles.skillDetailsLevelLabel}>Proficiency</div>
                <div className={styles.skillDetailsLevelBarContainer}>
                  <div 
                    className={styles.skillDetailsLevelBar} 
                    style={{ width: `${skillDetails.level}%` }}
                  ></div>
                </div>
                <div className={styles.skillDetailsLevelText}>{skillDetails.level}%</div>
              </div>
              
              <div className={styles.skillDetailsDescription}>
                {getSkillDescription(skillDetails.name)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper function to get skill descriptions
function getSkillDescription(skillName) {
  const descriptions = {
    // Cybersecurity
    'Penetration Testing': 'Simulating cyber attacks to identify security vulnerabilities in systems, networks, and applications. Includes both manual and automated testing techniques.',
    'Vulnerability Assessment': 'Systematic review of security weaknesses in information systems. Evaluates if the system is susceptible to known vulnerabilities and assigns severity levels.',
    'Security Monitoring': 'Continuous observation of systems and networks to detect security incidents and suspicious activities in real-time. Includes log analysis and SIEM implementation.',
    'Incident Response': 'Methodology for handling security breaches, including preparation, identification, containment, eradication, recovery, and lessons learned.',
    'Compliance (ISO, NIST)': 'Knowledge of regulatory frameworks, standards, and requirements. Implementation of controls to ensure adherence to ISO 27001, NIST, and other frameworks.',
    'Risk Management': 'Identification, assessment, and prioritization of risks followed by coordinated application of resources to minimize, monitor, and control the impact of unfortunate events.',
    
    // Frontend
    'React': 'Building dynamic and responsive user interfaces with React.js, including state management, hooks, and component lifecycle. Experience with Redux and context API.',
    'JavaScript/ES6+': 'Modern JavaScript development utilizing ES6+ features like arrow functions, destructuring, promises, async/await, and modules.',
    'HTML5/CSS3': 'Creating semantic markup and responsive designs using the latest HTML5 elements and CSS3 features including flexbox, grid, and animations.',
    'TypeScript': 'Implementing strongly typed JavaScript development for improved code quality, better documentation, and enhanced IDE support.',
    'Responsive Design': 'Building websites that provide optimal viewing experience across a wide range of devices from desktop to mobile phones.',
    'Three.js': 'Creating 3D graphics and animations for web browsers using WebGL through the Three.js library.',
    
    // Backend
    'Python': 'Developing robust backend services, data processing pipelines, and automation scripts using Python and its extensive ecosystem.',
    'Flask': 'Building lightweight web applications and APIs using Flask, including RESTful endpoints, authentication, and database integration.',
    'Node.js': 'Creating scalable server-side applications with JavaScript runtime, including event-driven architecture and asynchronous programming.',
    'Express': 'Implementing web applications and APIs with Express.js framework, including middleware, routing, and template engines.',
    'RESTful APIs': 'Designing and developing stateless APIs following REST principles for communication between client and server applications.',
    'GraphQL': 'Implementing flexible query language for APIs, allowing clients to request exactly what they need and making it easier to evolve APIs over time.',
    
    // DevOps
    'Docker': 'Containerizing applications to ensure consistency across different development and production environments, including multi-container applications.',
    'Kubernetes': 'Orchestrating containerized applications for automated deployment, scaling, and management in cluster environments.',
    'CI/CD Pipelines': 'Implementing continuous integration and continuous deployment pipelines to automate testing and deployment processes.',
    'AWS Services': 'Leveraging cloud services like EC2, S3, Lambda, and more for scalable and reliable application infrastructure.',
    'Terraform': 'Using infrastructure as code to provision and manage cloud resources across multiple providers.',
    'Linux Administration': 'Managing and troubleshooting Linux systems, including user management, permissions, services, and performance optimization.',
    
    // Databases
    'MongoDB': 'Working with document-oriented NoSQL databases for flexible and scalable data storage and retrieval.',
    'PostgreSQL': 'Implementing relational database solutions with advanced features like JSON storage, full-text search, and complex queries.',
    'MySQL': 'Managing relational databases for structured data storage, including optimization, backup, and recovery procedures.',
    'Redis': 'Using in-memory data structure store for caching, message brokering, and other high-performance data operations.',
    'Database Design': 'Creating efficient database schemas, normalizing data, and optimizing performance through proper indexing and query design.',
    'Data Modeling': 'Conceptualizing and creating database structures that reflect business requirements while maintaining data integrity.',
    
    // Networking
    'TCP/IP': 'Understanding and implementing the foundational protocols that govern internet communications.',
    'Firewalls': 'Configuring and managing network security systems that monitor and control incoming and outgoing traffic.',
    'VPNs': 'Setting up secure network connections that extend private networks across public networks to enable secure data transmission.',
    'Network Security': 'Implementing measures to protect network infrastructure and data from unauthorized access, misuse, and modification.',
    'DNS': 'Managing Domain Name System services that translate domain names to IP addresses and vice versa.',
    'Load Balancing': 'Distributing network traffic across multiple servers to ensure no single server is overwhelmed, improving reliability and performance.'
  };
  
  return descriptions[skillName] || 'A specialized technology skill in the selected category.';
}

TechStackGalaxy.propTypes = {
  fullPage: PropTypes.bool
};

export default TechStackGalaxy;
