import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Skill categories with icons represented as text for simplicity
const SKILL_CATEGORIES = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔒',
    color: '#ff3d3d'
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '🖥️',
    color: '#00fff5'
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    color: '#4d4dff'
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: '🔄',
    color: '#00ff9f'
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: '💾',
    color: '#d22aff'
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
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

const TechStackGalaxy = ({ fullPage = false }) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const galaxyContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('cybersecurity');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
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
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!galaxyContainerRef.current) return;
      
      const rect = galaxyContainerRef.current.getBoundingClientRect();
      
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
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
  
  // 3D Galaxy Animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();
    
    // Galaxy parameters
    const stars = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create stars
    const createStars = () => {
      const starCount = Math.min(Math.floor(canvas.width * canvas.height / 3000), 200);
      
      for (let i = 0; i < starCount; i++) {
        const radius = Math.random() * 1.5 + 0.5;
        const distance = Math.random() * (Math.min(canvas.width, canvas.height) / 3) + 50;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.2 + Math.random() * 0.8) * 0.001;
        
        // Color based on category
        const categoryIndex = Math.floor(Math.random() * SKILL_CATEGORIES.length);
        const category = SKILL_CATEGORIES[categoryIndex];
        
        stars.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius,
          distance,
          angle,
          speed,
          color: category.color,
          opacity: 0.3 + Math.random() * 0.7,
          category: category.id
        });
      }
    };
    
    // Render galaxy
    const renderGalaxy = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply galaxy background
      const galaxyGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.min(canvas.width, canvas.height) / 2
      );
      
      if (theme === 'dark') {
        galaxyGradient.addColorStop(0, 'rgba(0, 20, 40, 0.3)');
        galaxyGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        galaxyGradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
        galaxyGradient.addColorStop(1, 'rgba(245, 245, 245, 0)');
      }
      
      ctx.fillStyle = galaxyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw galaxy center glow
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 80
      );
      
      const categoryColor = SKILL_CATEGORIES.find(c => c.id === activeCategory)?.color || '#00fff5';
      
      centerGradient.addColorStop(0, `${categoryColor}40`);
      centerGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();
      
      // Update and draw stars
      for (const star of stars) {
        if (isRotating) {
          star.angle += star.speed;
        }
        
        // Calculate position with parallax effect
        const parallaxX = mousePosition.x * (star.distance * 0.05);
        const parallaxY = mousePosition.y * (star.distance * 0.05);
        
        star.x = centerX + Math.cos(star.angle) * star.distance + parallaxX;
        star.y = centerY + Math.sin(star.angle) * star.distance + parallaxY;
        
        // Draw star with higher opacity for active category
        ctx.globalAlpha = star.category === activeCategory ? star.opacity * 1.5 : star.opacity * 0.5;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Draw glow
        const glowSize = star.radius * 5;
        const glow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        
        glow.addColorStop(0, `${star.color}80`);
        glow.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = star.category === activeCategory ? 0.4 : 0.2;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
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
          
          if (distance < 100) {
            ctx.globalAlpha = (1 - distance / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };
    
    // Initialize and start animation
    createStars();
    
    let animationId;
    const animate = () => {
      renderGalaxy();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, activeCategory, isRotating, mousePosition]);
  
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
    <section className={`tech-stack-section ${fullPage ? 'full-page' : ''}`} id="tech-stack">
      <div className="container">
        {!fullPage && (
          <motion.h2 
            className="section-title"
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
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Technology Matrix
          </motion.h1>
        )}
        
        <div className="tech-galaxy-container" ref={galaxyContainerRef}>
          <canvas 
            ref={canvasRef} 
            className="tech-galaxy-canvas"
            aria-hidden="true"
          ></canvas>
          
          <motion.div 
            className="category-selector"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {SKILL_CATEGORIES.map((category) => (
              <motion.button 
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                variants={itemVariants}
                style={{
                  '--category-color': category.color
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </motion.button>
            ))}
            
            <motion.button 
              className="rotation-toggle"
              onClick={() => setIsRotating(!isRotating)}
              variants={itemVariants}
              aria-label={isRotating ? 'Pause rotation' : 'Resume rotation'}
              title={isRotating ? 'Pause rotation' : 'Resume rotation'}
            >
              {isRotating ? '⏸' : '▶️'}
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="skills-display"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div 
                key={index}
                className="skill-item"
                variants={itemVariants}
                onMouseEnter={() => handleSkillHover(skill)}
                onMouseLeave={handleSkillLeave}
              >
                <div className="skill-name">{skill.name}</div>
                <div className="skill-level-container">
                  <div 
                    className="skill-level-bar" 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: SKILL_CATEGORIES.find(c => c.id === skill.category)?.color
                    }}
                  ></div>
                </div>
                <div className="skill-level-text">{skill.level}%</div>
              </motion.div>
            ))}
          </motion.div>
          
          {skillDetails && (
            <div 
              className="skill-details"
              style={{
                '--detail-color': SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.color
              }}
            >
              <div className="skill-details-header">
                <div className="skill-details-name">{skillDetails.name}</div>
                <div className="skill-details-category">
                  {SKILL_CATEGORIES.find(c => c.id === skillDetails.category)?.name}
                </div>
              </div>
              
              <div className="skill-details-level">
                <div className="skill-details-level-label">Proficiency</div>
                <div className="skill-details-level-bar-container">
                  <div 
                    className="skill-details-level-bar" 
                    style={{ width: `${skillDetails.level}%` }}
                  ></div>
                </div>
                <div className="skill-details-level-text">{skillDetails.level}%</div>
              </div>
              
              <div className="skill-details-description">
                {getSkillDescription(skillDetails.name)}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .tech-stack-section {
          position: relative;
          padding: var(--space-xxl) 0;
          min-height: ${fullPage ? '100vh' : 'auto'};
        }
        
        .tech-stack-section.full-page {
          padding-top: calc(var(--header-height) + var(--space-xl));
        }
        
        .section-title,
        .page-title {
          text-align: center;
          margin-bottom: var(--space-xl);
          color: var(--accent-cyan);
          position: relative;
          display: inline-block;
          width: 100%;
        }
        
        .page-title {
          font-size: 3rem;
        }
        
        .section-title::after,
        .page-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            transparent
          );
        }
        
        .tech-galaxy-container {
          position: relative;
          width: 100%;
          height: 600px;
          margin-bottom: var(--space-xl);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background-color: rgba(10, 10, 10, 0.5);
          border: 1px solid var(--border-primary);
        }
        
        .tech-galaxy-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .category-selector {
          position: absolute;
          top: var(--space-md);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--space-sm);
          z-index: 1;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 90%;
          padding: var(--space-sm);
          background-color: rgba(10, 10, 10, 0.7);
          border-radius: var(--border-radius-md);
          backdrop-filter: blur(5px);
        }
        
        .category-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-sm);
          background-color: rgba(20, 20, 20, 0.6);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          transition: all var(--transition-normal);
          min-width: 80px;
          cursor: none;
        }
        
        .category-button:hover {
          transform: translateY(-3px);
          border-color: var(--category-color);
          box-shadow: 0 0 10px rgba(var(--category-color), 0.3);
        }
        
        .category-button.active {
          border-color: var(--category-color);
          background-color: rgba(var(--category-color), 0.2);
          color: #fff;
          box-shadow: 0 0 15px rgba(var(--category-color), 0.3);
        }
        
        .category-icon {
          font-size: 1.5rem;
          margin-bottom: var(--space-xs);
        }
        
        .category-name {
          font-size: 0.8rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .rotation-toggle {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          width: 36px;
          height: 36px;
          background-color: rgba(20, 20, 20, 0.6);
          border: 1px solid var(--border-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all var(--transition-normal);
          cursor: none;
        }
        
        .rotation-toggle:hover {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 255, 245, 0.3);
        }
        
        .skills-display {
          position: absolute;
          bottom: var(--space-md);
          left: var(--space-md);
          right: var(--space-md);
          max-height: 300px;
          overflow-y: auto;
          background-color: rgba(10, 10, 10, 0.8);
          border-radius: var(--border-radius-md);
          padding: var(--space-md);
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-md);
          backdrop-filter: blur(5px);
        }
        
        .skills-display::-webkit-scrollbar {
          width: 6px;
        }
        
        .skills-display::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .skills-display::-webkit-scrollbar-thumb {
          background: var(--accent-cyan);
          border-radius: 3px;
        }
        
        .skill-item {
          background-color: rgba(20, 20, 20, 0.6);
          border-radius: var(--border-radius-sm);
          padding: var(--space-sm);
          transition: all var(--transition-normal);
        }
        
        .skill-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .skill-name {
          color: var(--text-primary);
          font-size: 0.9rem;
          margin-bottom: var(--space-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .skill-level-container {
          width: 100%;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: var(--space-xs);
        }
        
        .skill-level-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease-out;
        }
        
        .skill-level-text {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-align: right;
          font-family: var(--font-mono);
        }
        
        .skill-details {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          background-color: rgba(10, 10, 10, 0.9);
          border-radius: var(--border-radius-md);
          border: 1px solid var(--detail-color);
          padding: var(--space-md);
          z-index: 2;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(var(--detail-color), 0.3);
          backdrop-filter: blur(10px);
        }
        
        .skill-details::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          border-top: 2px solid var(--detail-color);
          border-left: 2px solid var(--detail-color);
        }
        
        .skill-details::after {
          content: '';
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 40px;
          height: 40px;
          border-bottom: 2px solid var(--detail-color);
          border-right: 2px solid var(--detail-color);
        }
        
        .skill-details-header {
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .skill-details-name {
          color: var(--detail-color);
          font-size: 1.2rem;
          margin-bottom: var(--space-xs);
        }
        
        .skill-details-category {
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }
        
        .skill-details-level {
          margin-bottom: var(--space-md);
        }
        
        .skill-details-level-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: var(--space-xs);
        }
        
        .skill-details-level-bar-container {
          width: 100%;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: var(--space-xs);
        }
        
        .skill-details-level-bar {
          height: 100%;
          background-color: var(--detail-color);
          border-radius: 5px;
        }
        
        .skill-details-level-text {
          color: var(--text-primary);
          font-size: 0.9rem;
          text-align: right;
          font-family: var(--font-mono);
        }
        
        .skill-details-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        /* Light theme styles */
        .light-theme .tech-galaxy-container {
          background-color: rgba(245, 245, 245, 0.5);
        }
        
        .light-theme .category-selector,
        .light-theme .skills-display {
          background-color: rgba(245, 245, 245, 0.8);
        }
        
        .light-theme .category-button,
        .light-theme .skill-item,
        .light-theme .rotation-toggle {
          background-color: rgba(220, 220, 220, 0.6);
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .light-theme .skill-details {
          background-color: rgba(245, 245, 245, 0.9);
        }
        
        .light-theme .skill-level-container,
        .light-theme .skill-details-level-bar-container {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        /* Media queries */
        @media (max-width: 768px) {
          .tech-galaxy-container {
            height: 700px;
          }
          
          .category-selector {
            max-width: 100%;
            padding: var(--space-xs);
            top: var(--space-sm);
          }
          
          .category-button {
            min-width: 60px;
            padding: var(--space-xs);
          }
          
          .category-icon {
            font-size: 1.2rem;
          }
          
          .category-name {
            font-size: 0.7rem;
          }
          
          .skills-display {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: var(--space-sm);
            bottom: var(--space-sm);
            left: var(--space-sm);
            right: var(--space-sm);
            padding: var(--space-sm);
          }
          
          .skill-details {
            width: 280px;
          }
          
          .page-title {
            font-size: 2.2rem;
          }
        }
        
        @media (max-width: 480px) {
          .tech-galaxy-container {
            height: 600px;
          }
          
          .category-selector {
            gap: var(--space-xs);
          }
          
          .category-button {
            min-width: 50px;
          }
          
          .skills-display {
            grid-template-columns: 1fr;
            max-height: 250px;
          }
          
          .skill-details {
            width: 90%;
            max-width: 280px;
          }
        }
      `}</style>
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

export default TechStackGalaxy;
